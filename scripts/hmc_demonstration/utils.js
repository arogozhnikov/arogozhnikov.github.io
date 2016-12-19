class RandomGenerator {
    constructor(seed) {
        this.m_w = seed || 123456789;
        this.m_z = 987654321;
        this.mask = 0xffffffff;
    }

    random() {
        this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
        this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
        let result = ((this.m_z << 16) + this.m_w) & this.mask;
        result /= 4294967296;
        return result + 0.5;
    }

    random_float(a, b) {
        // generate random floating point number uniformly between a and b
        return this.random() * (b - a) + a;
    }

    random_int(a, b) {
        // generate random integer uniformly between a and b (b excluded)
        return Math.floor(this.random_float(a, b - 0.00001));
    }

    random_normal(mean, sigma) {
        let std_normal = 0.;
        for (let i = 0; i < 8; i++) std_normal += this.random();
        std_normal = (std_normal - 4.) / Math.sqrt(8 / 12);
        return mean + std_normal * sigma;
    }
}


