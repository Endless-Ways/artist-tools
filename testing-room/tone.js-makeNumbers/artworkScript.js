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

// use CDN:
import * as Tone from 'https://cdn.skypack.dev/tone@14.7.77';

//attach a click listener to a play button
document.querySelector('button')?.addEventListener('click', async () => {
    await Tone.start()
    console.log('audio is ready')
})

// make the synth
const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
        partials: [0, 2, 3, 4],
    }
}).toDestination();

// global notes array - this is so we can call triggerRelease on the synth later
var notes = [];

// generate an array of note names from the Endless Ways token seed and play them on the synth
function initDrone() {
    const numbers = makeNumbersFromEndlessWaysTokenSeed(8);
    function makeDrone() {
        const ionian = [ 0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24 ];
        const lydian = [ 0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19, 21, 23, 24 ];
        const aeolian = [ 0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 29, 20, 22, 24 ];
        const modes = [ ionian, lydian, aeolian ];
        const baseNote = 30 + Math.floor(numbers[0]*30);
        const mode = modes[Math.floor(numbers[1] * 2.99999)];
        const length = 1 + Math.floor(numbers[2] * 4.99999);
        var noteNames = [];
        for (var i=0; i<length; i++) {
            const whichNoteIndex = Math.floor(numbers[3+i] * 14.99999);
            const noteNumber = baseNote + mode[whichNoteIndex];
            noteNames.push(Tone.Frequency(noteNumber, "midi").toNote());
        }
        return noteNames;
    }

    notes = makeDrone();

    const messageDiv = document.getElementById( 'message' );
    messageDiv.innerText = "notes: " + notes.join(", "); 

    synth.triggerAttack(notes);
}

// do it
initDrone();

// catch key events (for testing)
document.addEventListener( 'keydown', onDocumentKeyDown, false);
function onDocumentKeyDown( event ) {
    var keyCode = event.which;

    // press space to move to the next mint
    if (keyCode === 32) {
        // only run this if we're inside the testing room
        if (typeof(endlessWaysTestHelper) !== 'undefined') {
            endlessWaysTestHelper.makeNewTokenInfo();
            synth.triggerRelease(notes);
            initDrone();
        }
    }
}



//////////////////////////////////
// The following is to help deal with the endlessWaysTokenInfo object, and has been copied from
// https://github.com/Endless-Ways/artist-tools/blob/main/utilities/EndlessWaysUtilities.js
//////////////////////////////////

// Get an array of numbers between 0 and 1 (>=0 and <1) directly from the current 
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
        const number = rawNumber/rawRange;
        numbers.push(number);
    }
    return numbers;
}

