import panda, { Sprite } from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init({ pixelated: true });

// bai!
const bai = {
    x: panda.width / 2,
    y: panda.height / 2,
    width: 100,
    height: 200,
    velocity: new Vector(0, 0),
    sprite: undefined as Sprite | undefined,
};

async function load() {
    // load in sprites
    bai.sprite = await panda.load.sprite('./scripts/examples/sprites/bai.png', {
        hFrame: 9,
        vFrame: 2,
    });
}

function update(dt: number) {
    // input
    const inputVector = new Vector(0, 0);
    inputVector.x = panda.keyboard.getAxis('a', 'd');
    inputVector.magnitude = 12;
    bai.velocity = bai.velocity.moveToward(inputVector, dt * 100);

    // gravity
    bai.velocity.y += 200 * dt;

    // update velocity
    bai.x += bai.velocity.x;
    bai.y += bai.velocity.y;

    // floor collision
    if (bai.y > panda.height - bai.height / 2) {
        bai.velocity.y = 0;
        bai.y = panda.height - bai.height / 2;
        numJumps = 0;
    }

    // animation
    // someone please tell me there's a better way to do animation
    if (bai.velocity.x > 0) bai.sprite!.animate([1, 2, 3, 4, 5, 6, 7, 8], 10);
    else if (bai.velocity.x < 0)
        bai.sprite!.animate([10, 11, 12, 13, 14, 15, 16, 17], 10);
    else bai.sprite!.stopAnimation();

    // update camera
    panda.camera.x = bai.x;
}

let numJumps = 0;
function jump() {
    numJumps++;
    if (numJumps <= 2) bai.velocity.y = -40;
}

panda.keyboard.keyDown(' ', jump);

function draw() {
    panda.draw.clear();
    panda.draw.square(0, 0, 50, { color: 'yellow' });
    panda.draw.sprite(bai.sprite!, bai.x, bai.y, {
        width: bai.height, // sprite boxes are square
        height: bai.height,
        center: true,
    });
}

panda.draw.backgroundColor = 'purple';
panda.run(update, draw, load);
