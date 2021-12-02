// Whether we're running inside the testing-room, or live on the Endless Ways website, there is
// a global object called endlessWaysTokenInfo that looks like this:
//
// const endlessWaysTokenInfo = {
//    artworkId: 0,
//    mintNumber: this.nextMintNumber.toString(),
//    seed: getRandomSeed(this)
// }
//
// To simulate this when developing and testing your code, include EndlessWaysTestHelper.js in 
// a <script> node in your index.html <head> (see index.html in this folder). This will 
// automatically make an endlessWaysTokenInfo object for you, and an endlessWaysTestHelper 
// object that manages the endlessWaysTokenInfo and can also do a couple of other handy things. 

//////////////////////////////////
// Your artwork code starts here
//////////////////////////////////

function setup() {
    // square aspect ratio
    const size = min(windowWidth, windowHeight);
    createCanvas(size, size);
    // HSB colour mode
    colorMode(HSB, 360, 255, 255, 1);
    rectMode(CENTER);
}

function draw() {
    // make 8 numbers 0..1 from the Endless Ways token seed
    const numbers = makeNumbersFromEndlessWaysTokenSeed(8);

    // set a colour based on numbers 0-2
    const hue = numbers[0]*360;
    const saturation = numbers[1]*256;
    const brightness = numbers[2]*256;
    background(hue, saturation, brightness);

    // set fill/stroke based on number 3
    if (numbers[3] > 0.5) {
        fill(255);
        noStroke();
    } else {
        stroke(255);
        noFill();
    }

    // draw a rectangle based on numbers 4-7
    const x = width*numbers[4];
    const y = height*numbers[5];
    const w = width*0.5*numbers[6];
    const h = height*0.5*numbers[7];
    rect(x, y, w, h);

    // display token info (if we're inside the testing room)
    if (typeof(endlessWaysTestHelper) !== "undefined") {
        stroke(255);
        endlessWaysTestHelper.drawTokenInfo();
    }
}

function keyPressed() {
    // press space to move to the next mint (if we're inside the testing room)
    if (keyCode === 32) {
        if (typeof(endlessWaysTestHelper) !== "undefined") {
            endlessWaysTestHelper.makeNewTokenInfo();
        }
    }
}


//////////////////////////////////
// The following is to help deal with the endlessWaysTokenInfo object, and has been copied from
// https://github.com/Endless-Ways/artist-tools/blob/main/utilities/EndlessWaysSeedUtils.js
//////////////////////////////////

// Get a fixed number of numbers between 0 and 1 (>=0 and <1) directly from the current 
// Endless Ways token seed. This works by slicing seed into roughly equal-sized chunks and 
// interpreting each of them as a float between 0 and 1. 
//
// howMany specifies how many numbers you want - it must be >=5 and <=64. The more numbers 
// you ask for, the less variation you will get. It's best not to ask for more than 24 
// numbers.
function makeNumbersFromEndlessWaysTokenSeed(howMany) {
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
