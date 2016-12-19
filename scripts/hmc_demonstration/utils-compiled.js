"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RandomGenerator = function () {
    function RandomGenerator(seed) {
        _classCallCheck(this, RandomGenerator);

        this.m_w = seed || 123456789;
        this.m_z = 987654321;
        this.mask = 0xffffffff;
    }

    _createClass(RandomGenerator, [{
        key: "random",
        value: function random() {
            this.m_z = 36969 * (this.m_z & 65535) + (this.m_z >> 16) & this.mask;
            this.m_w = 18000 * (this.m_w & 65535) + (this.m_w >> 16) & this.mask;
            var result = (this.m_z << 16) + this.m_w & this.mask;
            result /= 4294967296;
            return result + 0.5;
        }
    }, {
        key: "random_float",
        value: function random_float(a, b) {
            // generate random floating point number uniformly between a and b
            return this.random() * (b - a) + a;
        }
    }, {
        key: "random_int",
        value: function random_int(a, b) {
            // generate random integer uniformly between a and b (b excluded)
            return Math.floor(this.random_float(a, b - 0.00001));
        }
    }, {
        key: "random_normal",
        value: function random_normal(mean, sigma) {
            var std_normal = 0.;
            for (var i = 0; i < 8; i++) {
                std_normal += this.random();
            }std_normal = (std_normal - 4.) / Math.sqrt(8 / 12);
            return mean + std_normal * sigma;
        }
    }]);

    return RandomGenerator;
}();

//# sourceMappingURL=utils-compiled.js.map