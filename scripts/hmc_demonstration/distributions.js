
function takeSumDiff(x) {
    return [(x[0] + x[1]) / Math.sqrt(2.), (x[0] - x[1]) / Math.sqrt(2.)];
}

class GaussianDistribution{
    constructor(mean=[0.0, 0.0], sum_std=0.6, diff_std=0.6){
        this.mean = mean;
        this.sum_std = sum_std;
        this.diff_std = diff_std;
        this.sum_var = sum_std * sum_std;
        this.diff_var = diff_std * diff_std;
    }
    shift(x){return VectorUtils.add_with_coeffs(x, this.mean, 1., -1.)}
    energy(x){
        let [x1, x2] = this.shift(x);
        // (x1 + x2)^2 / (4 * sum_std^2) + (x1 - x2)^2 / (4 * diff_std^2)  
        return Math.pow(x1 + x2, 2) / (4. * this.sum_var) + Math.pow(x1 - x2, 2) / (4. * this.diff_var) ;
    }
    gradient(x){
        let [x1, x2] = this.shift(x);
        return [
            (x1 + x2) / 2. / this.sum_var + (x1 - x2) / 2. / this.diff_var,
            (x1 + x2) / 2. / this.sum_var - (x1 - x2) / 2. / this.diff_var
        ];
    }
    init_sampler(){this.rand = new RandomGenerator(42);}
    sample(T){
        let noise = [
            this.rand.random_normal(0, 1) * this.sum_std * Math.sqrt(T),
            this.rand.random_normal(0, 1) * this.diff_std * Math.sqrt(T)
        ];
        return VectorUtils.add(this.mean, takeSumDiff(noise));
    }
}

// fair 50/50 mixture
class MixtureDistribution{
    constructor(component1, component2){
        this.c1 = component1;
        this.c2 = component2;
    }
    init_sampler(){
        this.rand = new RandomGenerator(42);
        this.c1.init_sampler();
        this.c2.init_sampler();
    }
    energy(x) {
        let p1 = Math.exp(-this.c1.energy(x));
        let p2 = Math.exp(-this.c2.energy(x));
        return - Math.log(p1 + p2) + 0.1;
    }
    gradient(x) {
        let p1 = Math.exp(-this.c1.energy(x));
        let p2 = Math.exp(-this.c2.energy(x));
        return VectorUtils.add_with_coeffs(this.c1.gradient(x), this.c2.gradient(x), p1 / (p1 + p2), p2 / (p1 + p2));
    }
    sample(T) {
        // no implementation 
        return;
    }
}

class GaussianMixture1dSampler{
    constructor(mixture, T, n_samples=1000) {
        this.seed = new RandomGenerator(42);
        let seed = this.seed;
        this.T = T;
        let _range = 2.;
        this.y_values = [];
        this.y_energies = [];
        let step = 0.001;
        for(let y=-_range; y < _range; y += step){
            this.y_values.push(y);
            this.y_energies.push(mixture.energy([y / Math.sqrt(2), y / Math.sqrt(2)]));
        }
        let min_energy = Math.min.apply(null, this.y_energies);
        this.y_cum_probabilities = [];
        let cumulated_prob = 0.;
        for(let i=0; i < this.y_energies.length; i++) {
            this.y_energies[i] -= min_energy;
            cumulated_prob += Math.exp( - this.y_energies[i] / T);
            this.y_cum_probabilities[i] = cumulated_prob; 
        } 
        let Z = this.y_cum_probabilities[this.y_cum_probabilities.length - 1];
        for(let i=0; i < this.y_energies.length; i++) {
            this.y_cum_probabilities[i] /= Z; 
        } 
        let random_uniform = [];
        for(let i=0; i < n_samples; i++) {
            random_uniform.push(seed.random());
        }
        random_uniform.sort();
        let result = [];
        let cum_prob = 0.;
        let current_bin = 0;
        for(let i=0; i < n_samples; i++) {
            let uniform = random_uniform[i];
            while(this.y_cum_probabilities[current_bin] < uniform ) {
                current_bin ++;
            }
            result.push(this.y_values[current_bin] + (0.5 - seed.random()) * step);
        } 
        this.result = result;
    }

    sample() {
        return this.result[this.seed.random_int(0, this.result.length)];
    }
}

class GaussianMixtureDistribution extends MixtureDistribution {
    constructor(mean, std){
        // try this for a bit more interesting picture
        // super(new GaussianDistribution([-mean, -mean], std * 1.2, std), new GaussianDistribution([mean, mean], std, std));
        super(new GaussianDistribution([-mean, -mean], std, std), new GaussianDistribution([mean, mean], std, std));

        this.mean = mean;
        this.std = std;        
        this.sampler = new GaussianMixture1dSampler(this, 1.);
    }
    sample(T) {
        // (x1 - x2) / sqrt(2) 
        let y_diff = this.rand.random_normal(0, Math.sqrt(2) * this.std * Math.sqrt(T));
        // (x1 + x2) / sqrt(2) 
        if(T != this.sampler.T) {
            this.sampler = new GaussianMixture1dSampler(this, T);
        }
        let y_sum = this.sampler.sample();
        return  [(y_diff + y_sum) / Math.sqrt(2), (y_sum - y_diff) / Math.sqrt(2)];
         
    }
}

class MexicanHatDistribution {
    constructor(mean=0.4, sigma=0.4) {
        this.mean = mean;
        this.sigma = sigma;
    }
    init_sampler(){
        this.rand = new RandomGenerator(42);
    }

    energy(x) {
        let r2 = VectorUtils.norm_squared(x);
        return Math.pow(r2 - this.mean, 2) / 2 / this.sigma / this.sigma + 0.04;
    }
    gradient(x) {
        let r2 = VectorUtils.norm_squared(x);
        let r = Math.sqrt(r2);
        let unary = VectorUtils.multiply(x, 1. / r);
        let deriv_over_r = 2 * (r2 - this.mean) * r / this.sigma / this.sigma;
        return VectorUtils.multiply(unary, deriv_over_r);
    }
    
    sample(T) {
        let x = [this.rand.random_normal(0, 1), this.rand.random_normal(0, 1)];
        let r = Math.sqrt(VectorUtils.norm_squared(x));
        let unary = VectorUtils.multiply(x, 1. / r);
        let new_r = false;
        // rejection sampling of r^2
        while(new_r == false) {
            let proposed_sq = this.rand.random_normal(this.mean, this.sigma * Math.sqrt(T));
            if(proposed_sq >= 0) {
                new_r = Math.sqrt(proposed_sq);
            }
        }
        return VectorUtils.multiply(unary, new_r);
    }
}



class SnakeDistribution {
    constructor(alpha=0.6, beta=5.5, gamma=0.8, delta=0.4) {
        this.alpha = alpha;
        this.beta = beta;
        this.gamma = gamma;
        this.delta = delta;
    }
    init_sampler(){
        this.rand = new RandomGenerator(42);
    }

    energy(x) {
        let [x1, x2] = x;
        let x_sum = (x1 + x2) / Math.sqrt(2);
        let x_diff = (x1 - x2) / Math.sqrt(2);
        let z1 = x_sum / this.gamma;
        let z2 = (x_diff - Math.sin(this.beta * z1) * this.delta) / this.alpha;
        return VectorUtils.norm_squared([z1, z2]) * 0.5; 
    }
    gradient(x) {
        let [x1, x2] = x;
        let x_sum = (x1 + x2) / Math.sqrt(2);
        let dx_sum = [1 / Math.sqrt(2), 1 / Math.sqrt(2)];
        let x_diff = (x1 - x2) / Math.sqrt(2);
        let dx_diff = [1 / Math.sqrt(2), -1 / Math.sqrt(2)];
        let z1 = x_sum / this.gamma;
        let dz1 = VectorUtils.multiply(dx_sum, 1. / this.gamma);
        let z2 = (x_diff - Math.sin(this.beta * z1) * this.delta) / this.alpha;
        // let dz2  = (dx_diff - Math.cos(this.beta * z1) * this.beta * this.delta * dz1) / this.alpha; 
        // let dz2_part2 =  VectorUtils.multiply(dz1, - Math.cos(this.beta * z1) * this.beta * this.delta);
        let dz2 = VectorUtils.add_with_coeffs(dx_diff, dz1, 1 / this.alpha, - Math.cos(this.beta * z1) * this.beta * this.delta / this.alpha)
        return VectorUtils.add_with_coeffs(dz1, dz2, z1, z2);
    }
    
    sample(T) {
        let z1 = this.rand.random_normal(0, 1) * Math.sqrt(T);
        let z2 = this.rand.random_normal(0, 1) * Math.sqrt(T);
        let x_sum = z1 * this.gamma; 
        // (x1 - x2) / sqrt(2)
        let x_diff = this.delta * Math.sin(this.beta * z1) + this.alpha * z2; 
        return [(x_sum + x_diff) / Math.sqrt(2), (x_sum - x_diff) / Math.sqrt(2)];
    }
}



class DoubleHoleDistribution {
    constructor(alpha=0.3, beta=4., gamma=0.8, delta=0.5) {
        this.alpha = alpha;
        this.beta = beta;
        this.gamma = gamma;
        this.delta = delta;
    }
    init_sampler(){
        this.rand = new RandomGenerator(42);
    }

    energy(x) {
        let [x1, x2] = x;
        let x_sum = (x1 + x2) / Math.sqrt(2);
        let x_diff = (x1 - x2) / Math.sqrt(2);
        let z1 = x_sum / this.gamma;
        let z2 = (x_diff - Math.tanh(this.beta * z1) * this.delta) / this.alpha;
        return VectorUtils.norm_squared([z1, z2]) * 0.5; 
    }
    gradient(x) {
        let [x1, x2] = x;
        let x_sum = (x1 + x2) / Math.sqrt(2);
        let dx_sum = [1 / Math.sqrt(2), 1 / Math.sqrt(2)];
        let x_diff = (x1 - x2) / Math.sqrt(2);
        let dx_diff = [1 / Math.sqrt(2), -1 / Math.sqrt(2)];
        let z1 = x_sum / this.gamma;
        let dz1 = VectorUtils.multiply(dx_sum, 1. / this.gamma);
        let z2 = (x_diff - Math.tanh(this.beta * z1) * this.delta) / this.alpha;

        let dz2 = VectorUtils.add_with_coeffs(dx_diff, dz1, 1 / this.alpha, (Math.pow( Math.tanh(this.beta * z1), 2) - 1.) * this.beta * this.delta / this.alpha);
        return VectorUtils.add_with_coeffs(dz1, dz2, z1, z2);
    }
    
    sample(T) {
        let z1 = this.rand.random_normal(0, 1) * Math.sqrt(T);
        let z2 = this.rand.random_normal(0, 1) * Math.sqrt(T);
        let x_sum = z1 * this.gamma; 
        // (x1 - x2) / sqrt(2)
        let x_diff = this.delta * Math.tanh(this.beta * z1) + this.alpha * z2; 
        return [(x_sum + x_diff) / Math.sqrt(2), (x_sum - x_diff) / Math.sqrt(2)];
    }
}

