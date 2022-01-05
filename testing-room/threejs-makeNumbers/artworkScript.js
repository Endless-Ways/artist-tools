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

// adapted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_colors.html

// use CDN:
import * as THREE from 'https://cdn.skypack.dev/three@0.135'

// if you need extra imports from the three.js examples library, import them like this:
// import { TrackballControls } from 'https://cdn.skypack.dev/three@0.135/examples/jsm/controls/TrackballControls.js';

let container;

let camera, scene, renderer;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

    // provided for you
    container = document.getElementById( 'container' );

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera( 20, aspect, 1, 10000 );
    camera.position.z = 1800;

    // separate initScene() function, so we can call it repeatedly from 
    // onDocumentKeyDown to respond to user pressing space
    initScene();
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight, true );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove );
    document.addEventListener( 'keydown', onDocumentKeyDown, false);
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 1 );
    scene.add( light );

    // get 6 random numbers directly from the token seed
    let numbers = makeNumbersFromEndlessWaysTokenSeed(6);

    const maxRadius = 100;

    const radius = 50 + numbers[0]*maxRadius;

    const detail = 1 + Math.floor(numbers[1] * 4);
    const geometry1 = new THREE.IcosahedronGeometry( radius, detail );

    const vertexCount = geometry1.attributes.position.count;
    geometry1.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 ) );

    const geometry2 = geometry1.clone();
    const geometry3 = geometry1.clone();

    const color = new THREE.Color();
    const positions1 = geometry1.attributes.position;
    const positions2 = geometry2.attributes.position;
    const positions3 = geometry3.attributes.position;
    const colors1 = geometry1.attributes.color;
    const colors2 = geometry2.attributes.color;
    const colors3 = geometry3.attributes.color;

    const hue1 = numbers[2];
    const sat2 = numbers[3];
    const green3 = numbers[4];
    const colourOffsetMultiplier = numbers[5];
    for ( let i = 0; i < vertexCount; i ++ ) {

        const yPos1 = ( positions1.getY( i ) / radius + 1 );
        color.setHSL( (hue1 + colourOffsetMultiplier * yPos1) % 1, 1.0, 0.5 );
        colors1.setXYZ( i, color.r, color.g, color.b );

        const yPos2 = ( positions2.getY( i ) / radius + 1 );
        color.setHSL( 0, (sat2 + colourOffsetMultiplier * yPos2) % 1, 0.5 );
        colors2.setXYZ( i, color.r, color.g, color.b );

        const yPos3 = ( positions3.getY( i ) / radius + 1 );
        color.setRGB( 0, (green3 + colourOffsetMultiplier * yPos3) % 1, 0 );
        colors3.setXYZ( i, color.r, color.g, color.b );
    }

    const material = new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        flatShading: true,
        vertexColors: true,
        shininess: 0
    } );

    const wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );

    let mesh = new THREE.Mesh( geometry1, material );
    let wireframe = new THREE.Mesh( geometry1, wireframeMaterial );
    mesh.add( wireframe );
    mesh.position.x = - maxRadius*2;
    scene.add( mesh );

    mesh = new THREE.Mesh( geometry2, material );
    wireframe = new THREE.Mesh( geometry2, wireframeMaterial );
    mesh.add( wireframe );
    scene.add( mesh );

    mesh = new THREE.Mesh( geometry3, material );
    wireframe = new THREE.Mesh( geometry3, wireframeMaterial );
    mesh.add( wireframe );
    mesh.position.x = maxRadius*2;
    scene.add( mesh );
}

function onDocumentMouseMove( event ) {
    //mouseX = ( event.clientX - windowHalfX );
    //mouseY = ( event.clientY - windowHalfY );
}

function onDocumentKeyDown( event ) {
    var keyCode = event.which;

    // press space to move to the next mint
    if (keyCode === 32) {
        // only run this if we're inside the testing room
        if (typeof(endlessWaysTestHelper) !== 'undefined') {
            endlessWaysTestHelper.makeNewTokenInfo();
            initScene();
        }
    }
}

//

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
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
