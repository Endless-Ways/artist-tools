// Get a fixed number of numbers between 0 and 1 (>=0 and <1) directly from the current 
// Endless Ways token seed. This works by slicing seed into roughly equal-sized chunks and 
// interpreting each of them as a float between 0 and 1. 
//
// howMany specifies how many numbers you want - it must be >=5 and <=64. The more numbers 
// you ask for, the less variation you will get. It's best not to ask for more than 24 
// numbers.
function makeNumbersFromSeed(howMany) {
    if (howMany < 5) {
        // parseInt is unsafe for numbers that are 52 bits or larger
        throw new Error("Count " + howMany + " is too small - must be >= 5");
    }
    if (howMany > 64) {
        throw new Error("Count " + howMany + " is too big - must be <= 64");
    }
    const seedString = endlessWaysTokenInfo.seed;
    var numbers = [];
    const step = 64/howMany;
    for (var i=0; i<howMany; i++) {
        const thisStart = Math.floor(i*step);
        const nextStart = Math.floor((i+1)*step);
        const part = seedString.substring(thisStart, nextStart);
        // convert part to a float 0..1
        const rawNumber = parseInt(part, 16);
        const rawRange = Math.pow(16, part.length);
        const number = rawNumber/(rawRange-1);
        numbers.push(number);
    }
    return numbers;
}


// Get a Random object that will give you an endless, predictable sequence of numbers based
// on the current Endless Ways token seed.
function makeRandomFromEndlessWaysTokenSeed() {
    const seedString = endlessWaysTokenInfo.seed;
    // collapse the seed string to a single 32 bit number using XOR
    var seedNumber = 0;
    for (var i=0; i<8; i++) {
        var part = seedString.substring(i*8, (i+1)*8);
        seedNumber ^= parseInt(part, 16);
    }
    
    return new Random(seedNumber);
}

// 16 bit precision pseudo-random number generator. Safe for cross-browser use.
// 
// Preferred over p5.js built-in random, or any other random that might potentially fall back
// to calling the browser's own implementation - these might make your artwork look different 
// on different web browsers, which is probably not what you want to happen.
// 
// Use by calling makeRandomFromSeed(), or provide your own random seed.
class Random {
    constructor(seed = 0) {
        this.seed = seed;
    }

    // get a random int between a and b (>=a and <b)
    random_i(a, b) {
        return Math.floor(this.random_f(Math.floor(a), Math.floor(b)));
    }
    // get a random float between 0 and 1 (>=0 and <1)
    random_01() {
        this.seed ^= this.seed << 13;
        this.seed ^= this.seed >> 17;
        this.seed ^= this.seed << 5;
        return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 65536) / 65536;
    }

    // get a random float between a and b (>=a and <b)
    random_f(a, b) {
        const r = this.random_01();
        const range = b-a;
        return a + r*range;
    }

    // get a random float between a and b (>=a and <b) using a squared probability 
    // distribution - i.e., most numbers will be closer to a, but some will be closer 
    // to b. 
    // (a can be a bigger number than b if you want to flip the distribution)
    random_f_sq(a, b) {
        const r = this.random_01();
        const range = b-a;
        return a + r*r*range;
    }
}

