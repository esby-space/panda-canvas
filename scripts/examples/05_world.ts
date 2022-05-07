import panda, { Sprite } from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init({ pixelated: true, container: document.querySelector('#container') as HTMLElement });

// Globals
const WORLD_WIDTH = 10000;

// bai!
const bai = {
    x: panda.width / 2,
    y: panda.height / 2,
    width: 100,
    height: 200,
    velocity: new Vector(0, 0),
    sprite: null as Sprite | null,
};

const trees = {
    xs: [] as number[],
    sprite: null as Sprite | null,
};

async function load() {
    // load in sprites
    trees.sprite = await panda.load.sprite('./scripts/examples/sprites/tree.png');
    bai.sprite = await panda.load.sprite('./scripts/examples/sprites/bai.png', {
        hFrame: 8,
        vFrame: 2,
    });

    for (let i = 0; i < 20; i++) {
        trees.xs = [...trees.xs, Math.random() * WORLD_WIDTH - WORLD_WIDTH / 2];
    }
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
    if (bai.y > panda.height - bai.height / 2 - 100) {
        bai.velocity.y = 0;
        bai.y = panda.height - bai.height / 2 - 100;
        numJumps = 0;
    }

    // animation
    // someone please tell me there's a better way to do animation
    if (bai.velocity.x > 0) panda.draw.animate(bai.sprite!, [0, 1, 2, 3, 4, 5, 6, 7], 10);
    else if (bai.velocity.x < 0)
        panda.draw.animate(bai.sprite!, [8, 9, 10, 11, 12, 13, 14, 15], 10);
    else panda.draw.stopAnimation(bai.sprite!);

    // update camera
    panda.camera.x = bai.x;
}

let numJumps = 0;
function jump() {
    numJumps++;
    if (numJumps <= 2) bai.velocity.y = -50;
}

function draw() {
    panda.draw.clear();
    panda.draw.square(100, 100, 200, { color: 'yellow' });
    panda.draw.rectangle(-WORLD_WIDTH / 2, panda.height - 100, WORLD_WIDTH, 100, {
        color: 'darkGreen',
        center: false,
    });

    for (let x of trees.xs) {
        panda.draw.sprite(trees.sprite!, x, panda.height - 200, {
            width: 200,
            height: 200,
        });
    }

    panda.draw.sprite(bai.sprite!, bai.x, bai.y, {
        width: bai.height, // sprite boxes are square: width = height
        height: bai.height,
        center: true,
    });
}

function main() {
    panda.draw.backgroundColor = 'blue';
    panda.run(update, draw, load);

    panda.keyboard.keyDown(' ', jump);
}

main();
