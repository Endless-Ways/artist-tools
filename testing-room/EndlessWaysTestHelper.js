
// Helper that generates different endlessWaysTokenInfo objects. Use this to simulate the 
// effects of different token seeds on your artwork. 
// 
// As long as the value of helperRandomSeed is the same, it will always generate the same 
// sequence of endlessWaysTokenInfo objects. This is useful when you're developing your artwork
// to see how changes you make to the code might effect different mints.
class EndlessWaysTestHelper {
    
    artworkId;
    nextMintNumber = 1;    
    randomSeed = 177;
    
    constructor(artworkId = 0, helperRandomSeed = 177) {
        this.artworkId = artworkId;
        this.randomSeed = helperRandomSeed;
    }
    
    // Call this to set a new endlessWaysTokenInfo object.
    makeNewTokenInfo() {
        // private random methods, just for token seed generation.
        const getRandomSeed = (helper) => {
            const getNextRandom = (helper) => {
                helper.randomSeed ^= helper.randomSeed << 13;
                helper.randomSeed ^= helper.randomSeed >> 17;
                helper.randomSeed ^= helper.randomSeed << 5;
                
                return ((helper.randomSeed < 0 ? ~helper.randomSeed + 1 : helper.randomSeed) % 65536) / 65535;
            }
            
            let hexDigits = "0123456789abcdef";
            var seed = '';
            for (let i = 0; i < 64; i++) {
                const digitIndex = Math.floor(getNextRandom(helper)*15.9999999)
                seed += hexDigits[digitIndex];
            }
            return seed;
        }
        
        const newTokenInfo = {
            artworkId: 0,
            mintNumber: this.nextMintNumber.toString(),
            seed: getRandomSeed(this)
        }
        this.nextMintNumber = this.nextMintNumber + 1;
        // set the global endlessWaysTokenInfo object
        endlessWaysTokenInfo = newTokenInfo;
        console.log("endless ways testing room made new token info:", endlessWaysTokenInfo);
    }

    // draw the endlessWaysTokenInfo
    drawMintInfo() {
        push();
        colorMode(RGB, 255, 255, 255, 1);
        rectMode(CORNER);
        noStroke();
        fill(0, 0, 0, 0.25);
        rect(5, 5, 468, 53);
        fill(255);
        text('artworkId: ' + endlessWaysTokenInfo.artworkId, 10, 20);
        text('mintNumber: ' + endlessWaysTokenInfo.mintNumber, 10, 35);
        text('seed: ' + endlessWaysTokenInfo.seed, 10, 50);
        pop();
    }
    
}

// Global helper instance. 
var endlessWaysTestHelper = new EndlessWaysTestHelper();
// You could overwrite this in your own code with a different artworkId and seed, if you want:
//   endlessWaysTestHelper = new EndlessWaysTestHelper(/* artworkId */ 47, /* helperRandomSeed */ 100);

// Global token info - simulates running live on Endless Ways.
var endlessWaysTokenInfo;

// Make the initial token
endlessWaysTestHelper.makeNewTokenInfo();

// To simulate multiple mints, you can generate new token info at any time by calling:
//   endlessWaysTestHelper.makeNewTokenInfo();
// You could do this from a keypress, for example.
