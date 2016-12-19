"use strict";


class MCSampler {
    // both energy and position accept one argument - vector.
    // in the case of demonstration vector can have only one or two variables.
    constructor(distribution, x_start, y_start) {
        this.distribution = distribution;
        this.positions = [];
        this.positions.push([x_start, y_start]);
        this.T = 1;
        this.random = new RandomGenerator(42);
    }

    energy(x){return this.distribution.energy(x);}
    grad(x){return this.distribution.gradient(x);}

    set_temperature(T){
        this.T = T;
    }

    to_3d_point(position) {
        return [position[0], position[1], this.energy(position)];
    }

    // metropolis - hastings
    generate_mh(spread=0.1) {
        let position_old = this.positions[this.positions.length - 1];
        let position_new = [
            position_old[0] + this.random.random_normal(0, 1) * spread,
            position_old[1] + this.random.random_normal(0, 1) * spread
        ];
        let energy_old = this.energy(position_old);
        let energy_new = this.energy(position_new);
        let reject = this.random.random() > Math.exp((energy_old - energy_new) / this.T);
        let result;

        if(reject){
            result = clone(position_old);
        } else {
            result = clone(position_new);
        }
        this.positions.push(result);
        
        // return final position, candidate, and reject solution
        return [this.to_3d_point(result), this.to_3d_point(position_new), reject];
    }

    leapfrog_step(position, momentum, epsilon, iteration_alpha=1., mass=1.) {
        momentum = VectorUtils.multiply(momentum, Math.sqrt(iteration_alpha));
        position = VectorUtils.add_with_coeffs(position, momentum, 1., epsilon / 2. / mass);
        let gradient = this.grad(position);
        momentum = VectorUtils.add_with_coeffs(momentum, gradient, 1., - epsilon);
        position = VectorUtils.add_with_coeffs(position, momentum, 1., epsilon / 2. / mass);
        momentum = VectorUtils.multiply(momentum, Math.sqrt(iteration_alpha));
        return [position, momentum];
    }

    // hamiltonian monte-carlo
    // step_size = epsilon in Neal's paper
    // n_steps = L in Neal's paper
    // tempering_alpha - alpha from Neal's paper
    generate_hmc({suppress_reject=false, step_size=0.0513, n_steps=60, tempering_alpha=1.}={}) {
        let n_steps_ =  Math.max(1, this.random.random_normal(n_steps, Math.sqrt(n_steps)));
        let [x_old, y_old] = this.positions[this.positions.length - 1];
        let position = [x_old, y_old];
        let start_position = position;
        let momentum = [this.random.random_normal(0, 1) * Math.sqrt(this.T),
                        this.random.random_normal(0, 1) * Math.sqrt(this.T)];
        let energy_old = this.energy(position) + VectorUtils.norm_squared(momentum) / 2.;

        let trajectory = [[position, momentum]];

        for(let iteration=0; iteration < n_steps_; iteration++) {
            // alpha in the first half of trajectory, 1 / alpha in second, 1 in the middle
            let iteration_alpha = Math.pow(tempering_alpha, -Math.sign(2 * iteration + 1 - n_steps_) );
            // console.log('alpha', iteration, iteration_alpha);
            [position, momentum] = this.leapfrog_step(position, momentum, step_size, iteration_alpha);
            trajectory.push([position, momentum]);
        }

        let energy_new = this.energy(position) + VectorUtils.norm_squared(momentum) / 2.;

        let reject = this.random.random() > Math.exp((energy_old - energy_new) / this.T);
        if(suppress_reject) {
            reject = false;
        }
        let result;
        if(reject){
            result = start_position;
        } else {
            result = position;
        }
        this.positions.push(result);
        let trajectory_3d = trajectory.map((x) => this.to_3d_point(x[0]));

        // return final position, candidate, and reject solution
        return [this.to_3d_point(result), this.to_3d_point(position), reject, trajectory_3d];
    }

    get_3d_trajectory(){
        return this.positions.map((x) => this.to_3d_point(x));
    }
}

