/// copied from utilities/TokenInfoUtils.js

class EndlessWaysTokenInfoUtils {

    // collapse the seed string to a single 32 bit integer using XOR
    static collapseTo32Bit(seedString = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef') {
        var seedNumber = 0;
        for (var i=0; i<8; i++) {
            var part = seedString.substring(i*8, (i+1)*8);
            seedNumber ^= parseInt(part, 16);
        }
        return seedNumber;
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

/// the code of your artwork is below

function setup() {
    // square aspect ratio
    const size = min(windowWidth, windowHeight);
    createCanvas(size, size);
    // HSB colour mode
    colorMode(HSB, 360, 255, 255, 1);
    rectMode(CENTER);
}

function draw() {
    // make 8 feature floats 0..1 from the Endless Ways token seed
    const features = EndlessWaysTokenInfoUtils.getFeatures(endlessWaysTokenInfo.seed, 8);

    // set a colour based on feature floats 0-2
    const hue = features[0]*360;
    const saturation = features[1]*256;
    const brightness = features[2]*256;
    background(hue, saturation, brightness);

    // set fill/stroke based on feature float 3
    if (features[3] > 0.5) {
        fill(255);
        noStroke();
    } else {
        stroke(255);
        noFill();
    }
    // draw a rectangle based on feature floats 4-7
    const x = width*features[4];
    const y = height*features[5];
    const w = width*0.5*features[6];
    const h = height*0.5*features[7];
    rect(x, y, w, h);
}

function keyPressed() {
    // this should be disabled/removed for release on Endless Ways
    if (keyCode === 32) {
        endlessWaysTestHelper.makeNewTokenInfo();
    }
}