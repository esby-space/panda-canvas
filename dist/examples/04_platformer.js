import panda from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init({ pixelated: true });
let bricks;
// panda player!
const player = {
    x: panda.width / 2,
    y: panda.height - 50,
    velocity: new Vector(0, 0),
    sprite: undefined,
};
async function load() {
    // load in sprites
    player.sprite = await panda.load.sprite('./scripts/examples/sprites/panda.png', {
        hFrame: 3,
        vFrame: 4,
    });
    bricks = await panda.load.sprite('./scripts/examples/sprites/bricks.png');
}
function update(dt) {
    // input
    const inputVector = new Vector(0, 0);
    inputVector.x = panda.keyboard.getAxis('a', 'd');
    inputVector.magnitude = 20;
    player.velocity = player.velocity.moveToward(inputVector, dt * 100);
    // gravity
    player.velocity.y += 200 * dt;
    // update velocity
    player.x += player.velocity.x;
    player.y += player.velocity.y;
    // floor collision
    if (player.y > panda.height - 50) {
        player.velocity.y = 0;
        player.y = panda.height - 50;
        numJumps = 0;
    }
    // TODO: platform collision???
    // animation
    if (player.velocity.x > 0)
        player.sprite.animate([0, 1, 2, 1], 10);
    else if (player.velocity.x < 0)
        player.sprite.animate([3, 4, 5, 4], 10);
    else if (player.velocity.y > 0)
        player.sprite.animate([6, 7, 8, 7], 10);
    else if (player.velocity.y < 0)
        player.sprite.animate([9, 10, 11, 10], 10);
    else
        player.sprite.stopAnimation();
}
panda.keyboard.keyDown(' ', jump);
let numJumps = 0;
function jump() {
    numJumps++;
    if (numJumps <= 2)
        player.velocity.y = -40;
}
function draw() {
    panda.draw.clear();
    panda.draw.rectangle(0, 0, panda.width, panda.height, {
        pattern: { sprite: bricks, width: 100, height: 100 },
        center: false,
    });
    panda.draw.sprite(player.sprite, player.x, player.y, {
        width: 100,
        height: 100,
        center: true,
    });
}
panda.run(update, draw, load);