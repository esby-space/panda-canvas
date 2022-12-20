import { Panda, Mathy } from "./panda/panda.js";
Panda.init({ pixelated: true, container: document.querySelector("#container") });
// a simulation of planets orbiting a star
// basic physics and sprite rendering
class Planet {
    x;
    y;
    mass;
    velocity;
    sprite;
    constructor(x, y, mass, velocity = new Mathy.Vector(0, 0), sprite = null) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.velocity = velocity;
        this.sprite = sprite;
    }
}
// the bodies we're trying to simulate
const Sun = new Planet(Panda.width / 2, Panda.height / 2, 20000);
const Earth = new Planet(Sun.x, Sun.y - 350, 100, new Mathy.Vector(7, 0));
const Mars = new Planet(Sun.x, Sun.y + 400, 100, new Mathy.Vector(-7, 0));
const objects = [Sun, Earth, Mars];
// load in the sprites
async function load() {
    Earth.sprite = await Panda.sprite("./scripts/examples/sprites/earth.png");
    Mars.sprite = await Panda.sprite("./scripts/examples/sprites/mars.png");
    Sun.sprite = await Panda.sprite("./scripts/examples/sprites/sun.png");
}
// main update function
function update() {
    updateVelocity();
    updatePosition();
    Panda.camera.move(currentBody.x, currentBody.y, 0.1);
}
// apply the force of gravity from all object on all other objects
function updateVelocity() {
    for (const [i, object1] of objects.entries()) {
        for (const [j, object2] of objects.entries()) {
            if (object1 == object2 || i < j)
                continue;
            const radius = Math.sqrt((object2.x - object1.x) ** 2 + (object2.y - object1.y) ** 2);
            const gravity = new Mathy.Vector(object2.x - object1.x, object2.y - object1.y);
            gravity.magnitude = calculateGravity(object1.mass, object2.mass, radius);
            object1.velocity = object1.velocity.add(gravity.divide(object1.mass));
            object2.velocity = object2.velocity.add(gravity.divide(-object2.mass));
        }
    }
}
// use velocity to update position
function updatePosition() {
    for (const object of objects) {
        object.x += object.velocity.x;
        object.y += object.velocity.y;
    }
}
// inverse square law of gravitational pull
function calculateGravity(mass1, mass2, radius) {
    return (1 * (mass1 * mass2)) / radius ** 2;
}
// change camera when space is pushed
let currentTrack = 0;
let currentBody = Sun;
Panda.keyboard.keyDown(" ", () => {
    currentTrack++;
    if (currentTrack >= objects.length)
        currentTrack = 0;
    currentBody = objects[currentTrack];
});
// draw circles with radius relative to the mass
function draw() {
    Panda.draw.clear();
    for (const object of objects) {
        object.sprite?.draw(object.x, object.y, {
            width: Math.cbrt(object.mass) * 8,
            height: Math.cbrt(object.mass) * 8,
            center: true,
        });
    }
}
Panda.run(update, draw, load);
