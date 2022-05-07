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
}
panda.run(update, draw);
