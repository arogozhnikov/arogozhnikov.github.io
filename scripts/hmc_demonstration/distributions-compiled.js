"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function takeSumDiff(x) {
    return [(x[0] + x[1]) / Math.sqrt(2.), (x[0] - x[1]) / Math.sqrt(2.)];
}

var GaussianDistribution = function () {
    function GaussianDistribution() {
        var mean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0.0, 0.0];
        var sum_std = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.6;
        var diff_std = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.6;

        _classCallCheck(this, GaussianDistribution);

        this.mean = mean;
        this.sum_std = sum_std;
        this.diff_std = diff_std;
        this.sum_var = sum_std * sum_std;
        this.diff_var = diff_std * diff_std;
    }

    _createClass(GaussianDistribution, [{
        key: "shift",
        value: function shift(x) {
            return VectorUtils.add_with_coeffs(x, this.mean, 1., -1.);
        }
    }, {
        key: "energy",
        value: function energy(x) {
            var _shift = this.shift(x),
                _shift2 = _slicedToArray(_shift, 2),
                x1 = _shift2[0],
                x2 = _shift2[1];
            // (x1 + x2)^2 / (4 * sum_std^2) + (x1 - x2)^2 / (4 * diff_std^2) 


            return Math.pow(x1 + x2, 2) / (4. * this.sum_var) + Math.pow(x1 - x2, 2) / (4. * this.diff_var);
        }
    }, {
        key: "gradient",
        value: function gradient(x) {
            var _shift3 = this.shift(x),
                _shift4 = _slicedToArray(_shift3, 2),
                x1 = _shift4[0],
                x2 = _shift4[1];

            return [(x1 + x2) / 2. / this.sum_var + (x1 - x2) / 2. / this.diff_var, (x1 + x2) / 2. / this.sum_var - (x1 - x2) / 2. / this.diff_var];
        }
    }, {
        key: "init_sampler",
        value: function init_sampler() {
            this.rand = new RandomGenerator(42);
        }
    }, {
        key: "sample",
        value: function sample(T) {
            var noise = [this.rand.random_normal(0, 1) * this.sum_std * Math.sqrt(T), this.rand.random_normal(0, 1) * this.diff_std * Math.sqrt(T)];
            return VectorUtils.add(this.mean, takeSumDiff(noise));
        }
    }]);

    return GaussianDistribution;
}();

// fair 50/50 mixture


var MixtureDistribution = function () {
    function MixtureDistribution(component1, component2) {
        _classCallCheck(this, MixtureDistribution);

        this.c1 = component1;
        this.c2 = component2;
    }

    _createClass(MixtureDistribution, [{
        key: "init_sampler",
        value: function init_sampler() {
            this.rand = new RandomGenerator(42);
            this.c1.init_sampler();
            this.c2.init_sampler();
        }
    }, {
        key: "energy",
        value: function energy(x) {
            var p1 = Math.exp(-this.c1.energy(x));
            var p2 = Math.exp(-this.c2.energy(x));
            return -Math.log(p1 + p2) + 0.1;
        }
    }, {
        key: "gradient",
        value: function gradient(x) {
            var p1 = Math.exp(-this.c1.energy(x));
            var p2 = Math.exp(-this.c2.energy(x));
            return VectorUtils.add_with_coeffs(this.c1.gradient(x), this.c2.gradient(x), p1 / (p1 + p2), p2 / (p1 + p2));
        }
    }, {
        key: "sample",
        value: function sample(T) {
            // no implementation
            return;
        }
    }]);

    return MixtureDistribution;
}();

var GaussianMixture1dSampler = function () {
    function GaussianMixture1dSampler(mixture, T) {
        var n_samples = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;

        _classCallCheck(this, GaussianMixture1dSampler);

        this.seed = new RandomGenerator(42);
        var seed = this.seed;
        this.T = T;
        var _range = 2.;
        this.y_values = [];
        this.y_energies = [];
        var step = 0.001;
        for (var y = -_range; y < _range; y += step) {
            this.y_values.push(y);
            this.y_energies.push(mixture.energy([y / Math.sqrt(2), y / Math.sqrt(2)]));
        }
        var min_energy = Math.min.apply(null, this.y_energies);
        this.y_cum_probabilities = [];
        var cumulated_prob = 0.;
        for (var i = 0; i < this.y_energies.length; i++) {
            this.y_energies[i] -= min_energy;
            cumulated_prob += Math.exp(-this.y_energies[i] / T);
            this.y_cum_probabilities[i] = cumulated_prob;
        }
        var Z = this.y_cum_probabilities[this.y_cum_probabilities.length - 1];
        for (var _i2 = 0; _i2 < this.y_energies.length; _i2++) {
            this.y_cum_probabilities[_i2] /= Z;
        }
        var random_uniform = [];
        for (var _i3 = 0; _i3 < n_samples; _i3++) {
            random_uniform.push(seed.random());
        }
        random_uniform.sort();
        var result = [];
        var cum_prob = 0.;
        var current_bin = 0;
        for (var _i4 = 0; _i4 < n_samples; _i4++) {
            var uniform = random_uniform[_i4];
            while (this.y_cum_probabilities[current_bin] < uniform) {
                current_bin++;
            }
            result.push(this.y_values[current_bin] + (0.5 - seed.random()) * step);
        }
        this.result = result;
    }

    _createClass(GaussianMixture1dSampler, [{
        key: "sample",
        value: function sample() {
            return this.result[this.seed.random_int(0, this.result.length)];
        }
    }]);

    return GaussianMixture1dSampler;
}();

var GaussianMixtureDistribution = function (_MixtureDistribution) {
    _inherits(GaussianMixtureDistribution, _MixtureDistribution);

    function GaussianMixtureDistribution(mean, std) {
        _classCallCheck(this, GaussianMixtureDistribution);

        var _this = _possibleConstructorReturn(this, (GaussianMixtureDistribution.__proto__ || Object.getPrototypeOf(GaussianMixtureDistribution)).call(this, new GaussianDistribution([-mean, -mean], std, std), new GaussianDistribution([mean, mean], std, std)));
        // try this for a bit more interesting picture
        // super(new GaussianDistribution([-mean, -mean], std * 1.2, std), new GaussianDistribution([mean, mean], std, std));


        _this.mean = mean;
        _this.std = std;
        _this.sampler = new GaussianMixture1dSampler(_this, 1.);
        return _this;
    }

    _createClass(GaussianMixtureDistribution, [{
        key: "sample",
        value: function sample(T) {
            // (x1 - x2) / sqrt(2)
            var y_diff = this.rand.random_normal(0, Math.sqrt(2) * this.std * Math.sqrt(T));
            // (x1 + x2) / sqrt(2)
            if (T != this.sampler.T) {
                this.sampler = new GaussianMixture1dSampler(this, T);
            }
            var y_sum = this.sampler.sample();
            return [(y_diff + y_sum) / Math.sqrt(2), (y_sum - y_diff) / Math.sqrt(2)];
        }
    }]);

    return GaussianMixtureDistribution;
}(MixtureDistribution);

var MexicanHatDistribution = function () {
    function MexicanHatDistribution() {
        var mean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.4;
        var sigma = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.4;

        _classCallCheck(this, MexicanHatDistribution);

        this.mean = mean;
        this.sigma = sigma;
    }

    _createClass(MexicanHatDistribution, [{
        key: "init_sampler",
        value: function init_sampler() {
            this.rand = new RandomGenerator(42);
        }
    }, {
        key: "energy",
        value: function energy(x) {
            var r2 = VectorUtils.norm_squared(x);
            return Math.pow(r2 - this.mean, 2) / 2 / this.sigma / this.sigma + 0.04;
        }
    }, {
        key: "gradient",
        value: function gradient(x) {
            var r2 = VectorUtils.norm_squared(x);
            var r = Math.sqrt(r2);
            var unary = VectorUtils.multiply(x, 1. / r);
            var deriv_over_r = 2 * (r2 - this.mean) * r / this.sigma / this.sigma;
            return VectorUtils.multiply(unary, deriv_over_r);
        }
    }, {
        key: "sample",
        value: function sample(T) {
            var x = [this.rand.random_normal(0, 1), this.rand.random_normal(0, 1)];
            var r = Math.sqrt(VectorUtils.norm_squared(x));
            var unary = VectorUtils.multiply(x, 1. / r);
            var new_r = false;
            // rejection sampling of r^2
            while (new_r == false) {
                var proposed_sq = this.rand.random_normal(this.mean, this.sigma * Math.sqrt(T));
                if (proposed_sq >= 0) {
                    new_r = Math.sqrt(proposed_sq);
                }
            }
            return VectorUtils.multiply(unary, new_r);
        }
    }]);

    return MexicanHatDistribution;
}();

var SnakeDistribution = function () {
    function SnakeDistribution() {
        var alpha = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.6;
        var beta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5.5;
        var gamma = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;
        var delta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.4;

        _classCallCheck(this, SnakeDistribution);

        this.alpha = alpha;
        this.beta = beta;
        this.gamma = gamma;
        this.delta = delta;
    }

    _createClass(SnakeDistribution, [{
        key: "init_sampler",
        value: function init_sampler() {
            this.rand = new RandomGenerator(42);
        }
    }, {
        key: "energy",
        value: function energy(x) {
            var _x11 = _slicedToArray(x, 2),
                x1 = _x11[0],
                x2 = _x11[1];

            var x_sum = (x1 + x2) / Math.sqrt(2);
            var x_diff = (x1 - x2) / Math.sqrt(2);
            var z1 = x_sum / this.gamma;
            var z2 = (x_diff - Math.sin(this.beta * z1) * this.delta) / this.alpha;
            return VectorUtils.norm_squared([z1, z2]) * 0.5;
        }
    }, {
        key: "gradient",
        value: function gradient(x) {
            var _x12 = _slicedToArray(x, 2),
                x1 = _x12[0],
                x2 = _x12[1];

            var x_sum = (x1 + x2) / Math.sqrt(2);
            var dx_sum = [1 / Math.sqrt(2), 1 / Math.sqrt(2)];
            var x_diff = (x1 - x2) / Math.sqrt(2);
            var dx_diff = [1 / Math.sqrt(2), -1 / Math.sqrt(2)];
            var z1 = x_sum / this.gamma;
            var dz1 = VectorUtils.multiply(dx_sum, 1. / this.gamma);
            var z2 = (x_diff - Math.sin(this.beta * z1) * this.delta) / this.alpha;
            // let dz2  = (dx_diff - Math.cos(this.beta * z1) * this.beta * this.delta * dz1) / this.alpha;
            // let dz2_part2 =  VectorUtils.multiply(dz1, - Math.cos(this.beta * z1) * this.beta * this.delta);
            var dz2 = VectorUtils.add_with_coeffs(dx_diff, dz1, 1 / this.alpha, -Math.cos(this.beta * z1) * this.beta * this.delta / this.alpha);
            return VectorUtils.add_with_coeffs(dz1, dz2, z1, z2);
        }
    }, {
        key: "sample",
        value: function sample(T) {
            var z1 = this.rand.random_normal(0, 1) * Math.sqrt(T);
            var z2 = this.rand.random_normal(0, 1) * Math.sqrt(T);
            var x_sum = z1 * this.gamma;
            // (x1 - x2) / sqrt(2)
            var x_diff = this.delta * Math.sin(this.beta * z1) + this.alpha * z2;
            return [(x_sum + x_diff) / Math.sqrt(2), (x_sum - x_diff) / Math.sqrt(2)];
        }
    }]);

    return SnakeDistribution;
}();

var DoubleHoleDistribution = function () {
    function DoubleHoleDistribution() {
        var alpha = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.3;
        var beta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4.;
        var gamma = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;
        var delta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.5;

        _classCallCheck(this, DoubleHoleDistribution);

        this.alpha = alpha;
        this.beta = beta;
        this.gamma = gamma;
        this.delta = delta;
    }

    _createClass(DoubleHoleDistribution, [{
        key: "init_sampler",
        value: function init_sampler() {
            this.rand = new RandomGenerator(42);
        }
    }, {
        key: "energy",
        value: function energy(x) {
            var _x17 = _slicedToArray(x, 2),
                x1 = _x17[0],
                x2 = _x17[1];

            var x_sum = (x1 + x2) / Math.sqrt(2);
            var x_diff = (x1 - x2) / Math.sqrt(2);
            var z1 = x_sum / this.gamma;
            var z2 = (x_diff - Math.tanh(this.beta * z1) * this.delta) / this.alpha;
            return VectorUtils.norm_squared([z1, z2]) * 0.5;
        }
    }, {
        key: "gradient",
        value: function gradient(x) {
            var _x18 = _slicedToArray(x, 2),
                x1 = _x18[0],
                x2 = _x18[1];

            var x_sum = (x1 + x2) / Math.sqrt(2);
            var dx_sum = [1 / Math.sqrt(2), 1 / Math.sqrt(2)];
            var x_diff = (x1 - x2) / Math.sqrt(2);
            var dx_diff = [1 / Math.sqrt(2), -1 / Math.sqrt(2)];
            var z1 = x_sum / this.gamma;
            var dz1 = VectorUtils.multiply(dx_sum, 1. / this.gamma);
            var z2 = (x_diff - Math.tanh(this.beta * z1) * this.delta) / this.alpha;

            var dz2 = VectorUtils.add_with_coeffs(dx_diff, dz1, 1 / this.alpha, (Math.pow(Math.tanh(this.beta * z1), 2) - 1.) * this.beta * this.delta / this.alpha);
            return VectorUtils.add_with_coeffs(dz1, dz2, z1, z2);
        }
    }, {
        key: "sample",
        value: function sample(T) {
            var z1 = this.rand.random_normal(0, 1) * Math.sqrt(T);
            var z2 = this.rand.random_normal(0, 1) * Math.sqrt(T);
            var x_sum = z1 * this.gamma;
            // (x1 - x2) / sqrt(2)
            var x_diff = this.delta * Math.tanh(this.beta * z1) + this.alpha * z2;
            return [(x_sum + x_diff) / Math.sqrt(2), (x_sum - x_diff) / Math.sqrt(2)];
        }
    }]);

    return DoubleHoleDistribution;
}();

//# sourceMappingURL=distributions-compiled.js.map