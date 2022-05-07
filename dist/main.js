import panda from './panda/panda.js';
panda.init();
// main script goes here
function update(dt) {
    // called every frame to update game elements
    // dt is the time between frames
}
function draw() {
    panda.draw.clear();
    // called to draw the frame
    // you can use panda.context to get the Canvas 2D context
}
panda.run(update, draw);