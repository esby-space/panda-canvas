import panda, { Sprite } from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init({ pixelated: true });

const player = {
    x: panda.width / 2,
    y: panda.height - 50,
    velocity: new Vector(0, 0),
    sprite: undefined as Sprite | undefined,
};

async function load() {
    player.sprite = await panda.load.sprite(
        './scripts/examples/sprites/panda.png',
        { hFrame: 3, vFrame: 4 }
    );
}

function update(dt: number) {
    const inputVector = new Vector(0, 0);
    inputVector.x = panda.keyboard.getAxis('a', 'd');
    inputVector.magnitude = 15;

    player.velocity = player.velocity.moveToward(inputVector, dt * 90);
    player.velocity.y += 200 * dt;
    player.x += player.velocity.x;
    player.y += player.velocity.y;

    if (player.y > panda.height - 50) {
        player.velocity.y = 0;
        player.y = panda.height - 50;
        numJumps = 0;
    }
}

let numJumps = 0;
function jump() {
    numJumps++;
    if (numJumps <= 2) player.velocity.y -= 50;
}

panda.keyboard.keyDown(' ', () => jump());

function draw() {
    panda.draw.clear();
    panda.draw.sprite(player.sprite!, player.x, player.y, {
        width: 100,
        height: 100,
        center: true,
    });
}

panda.draw.backgroundColor = 'darkPurple';
panda.run(update, draw, load);
