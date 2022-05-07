import panda from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init({ pixelated: true });
// a simulation of planets orbiting a star
// basic physics and sprite rendering
class Planet {
    x;
    y;
    mass;
    velocity;
    sprite;
    constructor(x, y, mass, velocity = new Vector(0, 0), sprite = undefined) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.velocity = velocity;
        this.sprite = sprite;
    }
}
// the bodies we're trying to simulate
const Sun = new Planet(panda.width / 2, panda.height / 2, 20000);
const Earth = new Planet(Sun.x, Sun.y - 350, 100, new Vector(7, 0));
const Mars = new Planet(Sun.x, Sun.y + 400, 100, new Vector(-7, 0));
const objects = [Sun, Earth, Mars];
// load in the sprites
async function load() {
    Earth.sprite = await panda.load.sprite('./scripts/examples/sprites/earth.png');
    Mars.sprite = await panda.load.sprite('./scripts/examples/sprites/mars.png');
    Sun.sprite = await panda.load.sprite('./scripts/examples/sprites/sun.png');
}
// main update function
function update() {
    updateVelocity();
    updatePosition();
    panda.camera.x = currentBody.x;
    panda.camera.y = currentBody.y;
}
// apply the force of gravity from all object on all other objects
function updateVelocity() {
    for (let [i, obj1] of objects.entries()) {
        for (let [j, obj2] of objects.entries()) {
            if (obj1 == obj2 || i < j)
                continue;
            const radius = Math.sqrt((obj2.x - obj1.x) ** 2 + (obj2.y - obj1.y) ** 2);
            const gravity = new Vector(obj2.x - obj1.x, obj2.y - obj1.y);
            gravity.magnitude = calculateGravity(obj1.mass, obj2.mass, radius);
            obj1.velocity = obj1.velocity.add(gravity.divide(obj1.mass));
            obj2.velocity = obj2.velocity.add(gravity.divide(-obj2.mass));
        }
    }
}
// use velocity to update position
function updatePosition() {
    for (let obj of objects) {
        obj.x += obj.velocity.x;
        obj.y += obj.velocity.y;
    }
}
// inverse square law of gravitational pull
function calculateGravity(mass1, mass2, radius) {
    return (1 * (mass1 * mass2)) / radius ** 2;
}
// change camera when space is pushed
let currentTrack = 0;
let currentBody = Sun;
panda.keyboard.keyDown(' ', () => {
    currentTrack++;
    if (currentTrack >= objects.length)
        currentTrack = 0;
    currentBody = objects[currentTrack];
});
// draw circles with radius relative to the mass
function draw() {
    panda.draw.clear();
    for (let object of objects) {
        panda.draw.sprite(object.sprite, object.x, object.y, {
            width: Math.cbrt(object.mass) * 8,
            height: Math.cbrt(object.mass) * 8,
            center: true,
        });
    }
}
panda.run(update, draw, load);