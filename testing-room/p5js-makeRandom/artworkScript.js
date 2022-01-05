// Whether we're running inside the testing-room, or live on the Endless Ways website, there is
// a global object called endlessWaysTokenInfo that looks like this:
//
// const endlessWaysTokenInfo = {
//    artworkId: 100, // the artwork id on Endless Ways
//    mintNumber: 1, // the mint number, 1-based
//    seed: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" // random seed, 256 bits / 64 hex characters
// }
//
// To simulate this when developing and testing your code, include EndlessWaysTestHelper.js in 
// a <script> node in your index.html <head> (see index.html in this folder). This will 
// automatically make an endlessWaysTokenInfo object for you, and an endlessWaysTestHelper 
// object that manages the endlessWaysTokenInfo and can also do a couple of other handy things. 

//////////////////////////////////
// Your artwork code starts here
//////////////////////////////////

var safeRandom;
var positions;
var velocities;
var size;

function setup() {
    // square aspect ratio
    size = min(windowWidth, windowHeight);
    createCanvas(size, size);
    // HSB colour mode
    colorMode(HSB, 360, 255, 255, 1);
    // make a cross-browser-safe Random object
    safeRandom = makeRandomFromSeed();

    // setup positions
    positions = [];
    velocities = [];
    const count = safeRandom.random_i(3, 6);
    for (var i=0; i<count; i++) {
        positions.push(createVector(safeRandom.random_f(0, size), safeRandom.random_f(0, size)));
        velocities.push(createVector(0,0));
    }
    console.log(positions);
    
    // low frame rate so we can see things happening
    background(0);
    frameRate(60);
}

function draw() {
    noFill();
    stroke(255);
    const kMaxCircleSize = size*0.005;
    const kMaxVelocityChange = size*0.0001;
    for (var i=0; i<positions.length; i++) {
        // move
        positions[i].add(velocities[i]);
        // draw
        ellipse(positions[i].x, positions[i].y, safeRandom.random_f_sq(0, kMaxCircleSize));
        // change speed a little bit
        const velocityChange = createVector(safeRandom.random_f(-kMaxVelocityChange,kMaxVelocityChange), 
                                            safeRandom.random_f(-kMaxVelocityChange,kMaxVelocityChange));
        velocities[i].add(velocityChange);        
    }

    // display mint info (if we're inside the testing room)
    if (typeof(endlessWaysTestHelper) !== 'undefined') {
        stroke(255);
        endlessWaysTestHelper.drawTokenInfo();
    }
}

function keyPressed() {
    // press space to move to the next mint
    if (keyCode === 32) {
        // only run this if we're inside the testing room
        if (typeof(endlessWaysTestHelper) !== 'undefined') {
            endlessWaysTestHelper.makeNewTokenInfo();
            setup();
        }
    }
}


//////////////////////////////////
// The following is to help deal with the endlessWaysTokenInfo object, and has been copied from
// https://github.com/Endless-Ways/artist-tools/blob/main/utilities/EndlessWaysUtilities.js
//////////////////////////////////


// Get a Random object that will give you an endless, predictable sequence of numbers based
// on the current Endless Ways token seed.
function makeRandomFromSeed() {
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
// Use by calling makeRandomFromSeed(), or provide your own (number) seed.
//
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
