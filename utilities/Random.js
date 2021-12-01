// 16 bit precision pseudo-random number generator
class Random {
    constructor(seed = 0) {
        this.seed = seed;
    }

    // get a random int between a and b inclusive
    random_i(a, b) {
        return Math.floor(this.random_f(Math.floor(a), Math.floor(b)+0.9999999));
    }
    // get a random float between 0 and 1 inclusive
    random_01() {
        this.seed ^= this.seed << 13;
        this.seed ^= this.seed >> 17;
        this.seed ^= this.seed << 5;
        return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 65536) / 65535;
    }

    // get a random float between a and b inclusive
    random_f(a, b) {
        const r = this.random_01();
        const range = b-a;
        return a + r*range;
    }

    // get a random float with a squared distribution (a is more likely, b is less likely)
    random_f_sq(a, b) {
        const r = this.random_01();
        const range = b-a;
        return a + r*r*range;
    }
}
