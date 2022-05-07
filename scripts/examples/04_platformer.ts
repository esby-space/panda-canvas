import panda, { Sprite } from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init({ pixelated: true });

let bricks: Sprite;
// panda player!
const player = {
    x: panda.width / 2,
    y: panda.height - 50,
    velocity: new Vector(0, 0),
    sprite: undefined as Sprite | undefined,
    prev: { x: 0, y: 0 },
};

class Platform {
    constructor(public x: number, public y: number) {}
}
let platforms: Platform[] = [];

async function load() {
    // load in sprites
    player.sprite = await panda.load.sprite('./scripts/examples/sprites/panda.png', {
        hFrame: 3,
        vFrame: 4,
    });
    bricks = await panda.load.sprite('./scripts/examples/sprites/bricks.png');

    for (let i = 0; i < 10; i++) {
        platforms = [
            ...platforms,
            new Platform(Math.random() * panda.width, Math.random() * panda.height),
        ];
    }
}

function update(dt: number) {
    // input
    const inputVector = new Vector(0, 0);
    inputVector.x = panda.keyboard.getAxis('a', 'd');
    inputVector.magnitude = 20;
    player.velocity = player.velocity.moveToward(inputVector, dt * 100);

    // gravity
    player.velocity.y += 200 * dt;

    // update velocity
    player.prev.x = player.x;
    player.prev.y = player.y;
    player.x += player.velocity.x;
    player.y += player.velocity.y;

    // floor collision
    if (player.y > panda.height - 75) {
        player.velocity.y = 0;
        player.y = panda.height - 75;
        numJumps = 0;
    }

    // platform collision detection
    for (let platform of platforms) {
        if (
            player.x + 75 > platform.x &&
            player.x + 75 < platform.x + 150 &&
            player.y + 75 > platform.y &&
            player.prev.y + 75 < platform.y &&
            player.velocity.y >= 0
        ) {
            player.velocity.y = 0;
            player.y = platform.y - 75 - 0.01;
            numJumps = 0;
        }
    }

    // animation
    if (player.velocity.x > 0) player.sprite!.animate([0, 1, 2, 1], 10);
    else if (player.velocity.x < 0) player.sprite!.animate([3, 4, 5, 4], 10);
    else if (player.velocity.y > 0) player.sprite!.animate([6, 7, 8, 7], 10);
    else if (player.velocity.y < 0) player.sprite!.animate([9, 10, 11, 10], 10);
    else player.sprite!.stopAnimation();
}

panda.keyboard.keyDown(' ', jump);

let numJumps = 0;
function jump() {
    numJumps++;
    if (numJumps <= 2) player.velocity.y = -40;
}

function draw() {
    panda.draw.clear();
    panda.draw.rectangle(0, 0, panda.width, panda.height, {
        pattern: { sprite: bricks, width: 100, height: 100 },
        center: false,
    });

    for (let platform of platforms) {
        panda.draw.rectangle(platform.x, platform.y, 150, 20, { color: 'black' });
    }

    panda.draw.sprite(player.sprite!, player.x, player.y, {
        width: 150,
        height: 150,
        center: true,
    });
}

panda.run(update, draw, load);
