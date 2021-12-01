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


class EndlessWaysSeedUtils {

    // get a Random object that will give you a predictable sequence of numbers based on the token seed
    static getRandom(seedString = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef') {
        // collapse the seed string to a single 32 bit number using XOR
        var seedNumber = 0;
        for (var i=0; i<8; i++) {
            var part = seedString.substring(i*8, (i+1)*8);
            seedNumber ^= parseInt(part, 16);
        }
        
        return new Random(seedNumber);
    }

    static getFeatures(seedString = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', count) {
        if (count < 5) {
            // parseInt is unsafe for numbers 52bit or larger
            throw new Error("Count " + count + " is too small - must be >= 5");
        }
        if (count > 64) {
            throw new Error("Count " + count + " is too big - must be <= 32");
        }
        var features = [];
        const step = 64/count;
        for (var i=0; i<count; i++) {
            const thisStart = Math.floor(i*step);
            const nextStart = Math.floor((i+1)*step);
            const part = seedString.substring(thisStart, nextStart);
            // convert part to a float 0..1
            const rawFeature = parseInt(part, 16);
            const rawRange = Math.pow(16, part.length);
            const feature = rawFeature/(rawRange-1);
            features.push(feature);
        }
        return features;
    }
}