import panda from '../panda/panda.js';
import Vector from '../lib/vector.js';
import type { Sprite } from '../panda/draw.js';
panda.init({ pixelated: true });

// panda player!
// sprite rendering, keyboard input

const player = {
    x: panda.width / 2,
    y: panda.height / 2,
    velocity: new Vector(0, 0),
    sprite: undefined as Sprite | undefined,
};

// load the sprite, hFrame and vFrame describe how many tiles are in the image
async function load() {
    player.sprite = await panda.draw.loadSprite(
        './scripts/examples/sprites/panda.png',
        { hFrame: 3, vFrame: 4 }
    );
}

function update(dt: number) {
    // get keyboard input
    const inputVector = new Vector(0, 0);
    inputVector.x = panda.keyboard.getAxis('a', 'd');
    inputVector.y = panda.keyboard.getAxis('w', 's');
    inputVector.magnitude = 15; // speed of the panda

    // update the velocity to the input, use dt for consistent movement
    player.velocity = player.velocity.moveToward(inputVector, dt * 90);
    player.x += player.velocity.x;
    player.y += player.velocity.y;

    // change the direction of the panda and animate
    if (player.velocity.x > 0) player.sprite!.animate([0, 1, 2, 1], 10);
    else if (player.velocity.x < 0) player.sprite!.animate([3, 4, 5, 4], 10);
    else if (player.velocity.y > 0) player.sprite!.animate([6, 7, 8, 7], 10);
    else if (player.velocity.y < 0) player.sprite!.animate([9, 10, 11, 10], 10);
    else player.sprite!.stopAnimation();
}

function draw() {
    panda.draw.clear();
    panda.draw.sprite(player.sprite!, player.x, player.y, {
        width: 150,
        height: 150,
        center: true,
    });
}

panda.draw.backgroundColor = 'darkPurple';
panda.run(update, draw, load);
