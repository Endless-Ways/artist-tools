# Artist tools for Endless Ways

## `testing-room`

A series of samples that you can use to learn how to develop an Endless Ways p5.js project. 

Each subfolder contains an `index.html` and an example `artworkScript.js`, which are setup to simulate minting the artwork in `artworkScript.js` on Endless Ways. The file `EndlessWaysTestHelper.js` sets up the testing room environment and simulates the minting process.

To use:
1. Download this repository as a ZIP file or clone it using git.
2. Launch [Visual Studio Code](https://code.visualstudio.com), go to the `File` menu -> `Open Folder...` and open the `artist-tools` folder you just downloaded.
3. If you haven't already, go the Extensions panel in Visual Studio Code and install the Live Server extension by Ritwick Day (use the Search Extensions in Marketplace search box at the top to find it, then click the Install button).
4. Click the "Go Live" button on the bottom edge of the Visual Studio Code window - you'll find it somewhere near the bottom right hand corner. 
5. On the browser window that opens up, first click the `testing-room` link that appears, then `p5js-makeNumbers` to open up the simplest example project.

The window you should now be looking at is running an example p5.js script. Take a look at the code in the `testing-room/p5js-makeNumbers` folder back in Visual Studio Code to see what's going on. There's an `index.html` file that loads the p5.js library from CDN, and `p5js-makeNumbers.js` that contains the p5.js script being run. The `index.html` file also loads `EndlessWaysTestHelper.js` from the `testing-room` folder - this is the code that simulates generating an Endless Ways token seed, and also lets you simulate minting your artwork multiple times.

Whenever you save changes to any of the files in the `p5js-makeNumbers` folder (or in fact, any other file or folder inside `testing-room`) while the browser window is open, it will automatically reload. You can make your own copy of the `p5js-makeNumbers` folder and use it to develop and test your own artwork. 

## `utilities/EndlessWaysUtilities.js`

This file contains some helpful code you can copy and paste into your own project scripts.

### `Random`

A class for generating 16 bit precision pseudo-random numbers, that is safe for cross-browser use.

Preferred over p5.js built-in random, or any other random that might potentially fall back to calling the browser's own implementation of `random()` - these might make your artwork look different on different web browsers, which is probably not what you want to happen.

Use by calling `makeRandomFromSeed()`, or provide your own seed number.

### `getRandom()`

Returns a Random object that will give you an endless, predictable sequence of numbers based on the current Endless Ways token seed.

### `makeNumbersFromSeed(howMany)`

Returns an array of numbers between 0 and 1 (>=0 and <1) directly from the current Endless Ways token seed. This works by slicing seed into roughly equal-sized chunks and interpreting each of them as a float between 0 and 1. 

`howMany` specifies how many numbers you want. It must be >=5 and <=64. Asking for more numbers means slicing the token seed into smaller and smaller chunks - so, the more numbers you ask for, the less variation you will get in the numbers you're given. It's best not to ask for more than 24 numbers.

