import panda, { Sprite } from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init({
    width: 256,
    height: 256,
    pixelated: true,
    container: document.querySelector('#container') as HTMLElement,
});

const bai = {
    x: panda.width / 2,
    y: panda.height / 2,
    height: 48,
    velocity: new Vector(0, 0),
    sprite: null as Sprite | null,
};

async function load(): Promise<void> {
    bai.sprite = await panda.load.sprite('./scripts/examples/sprites/bai.png', {
        hFrame: 8,
        vFrame: 2,
    });
    console.log(bai.sprite);
}

function update(dt: number): void {
    // input
    const inputVector = new Vector(0, 0);
    inputVector.x = panda.keyboard.getAxis('a', 'd');
    inputVector.magnitude = 5;
    bai.velocity = bai.velocity.moveToward(inputVector, dt * 50);

    // gravity
    bai.velocity.y += 90 * dt;

    // update velocity
    bai.x += bai.velocity.x;
    bai.y += bai.velocity.y;

    // floor collision
    if (bai.y > panda.height - bai.height / 2 - 10) {
        bai.velocity.y = 0;
        bai.y = panda.height - bai.height / 2 - 10;
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
    if (numJumps <= 2) bai.velocity.y = -18;
}

function draw(): void {
    panda.draw.clear();
    panda.draw.square(10, 10, 10, { color: 'yellow' });
    panda.draw.sprite(bai.sprite!, bai.x, bai.y, {
        width: bai.height, // sprite boxes are square: width = height
        height: bai.height,
    });
}

function main() {
    panda.draw.backgroundColor = 'purple';
    panda.run(update, draw, load);
    panda.keyboard.keyDown(' ', jump);
}

main();
