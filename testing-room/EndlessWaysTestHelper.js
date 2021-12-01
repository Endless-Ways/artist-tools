class EndlessWaysTestHelper {
    
    artworkId;
    mintNumber = 0;
    
    randomSeed = 177;
    
    constructor(artworkId = 0, helperSeed = 177) {
        this.artworkId = artworkId;
        this.randomSeed = helperSeed;
    }
    
    // call to make a new token
    makeNewTokenInfo() {
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
        
        this.mintNumber = this.mintNumber + 1;
        const newTokenInfo = {
            artworkId: 0,
            mintNumber: this.mintNumber.toString(),
            seed: getRandomSeed(this)
        }
        endlessWaysTokenInfo = newTokenInfo;
        console.log("new token info:", endlessWaysTokenInfo);
    }
}

const endlessWaysTestHelper1 = new EndlessWaysTestHelper();

var endlessWaysTokenInfo = {
    artworkId: 0,
    mintNumber: "0",
    seed: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
}
endlessWaysTestHelper1.makeNewTokenInfo();

// to generate new token info, call:
// endlessWaysTestHarness.makeNewTokenInfo();
