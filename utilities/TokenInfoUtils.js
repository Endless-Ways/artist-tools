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
            if (feature < 0 || feature > 1) {
                throw new Error("bad feature: " + part + " -> " + rawFeature + " -> " + feature + " (range " + rawRange + ")");
            }
            features.push(feature);
        }
        return features;
    }
}
