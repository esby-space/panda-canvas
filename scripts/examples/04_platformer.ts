import Panda from '../panda/panda.js';
Panda.init({ pixelated: true, container: document.querySelector('#container') as HTMLElement });

// panda player and platforms!
// collision detection and handling

const bricks = await Panda.sprite('./scripts/examples/sprites/bricks.png');
const player = {
    x: Panda.width / 2,
    y: Panda.height - 50,
    velocity: Panda.math.Vector(0, 0),
    sprite: await Panda.sprite('./scripts/examples/sprites/panda.png', {
        hFrame: 3,
        vFrame: 4,
    }),
    prev: { x: 0, y: 0 },
};

class Platform {
    constructor(public x: number, public y: number) {}
}
let platforms: Platform[] = [];
for (let i = 0; i < 10; i++) {
    platforms = [
        ...platforms,
        new Platform(Math.random() * Panda.width, Math.random() * Panda.height),
    ];
}

function update(dt: number) {
    // input
    const inputVector = Panda.math.Vector(0, 0);
    inputVector.x = Panda.keyboard.axis('a', 'd');
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
    if (player.y > Panda.height - 75) {
        player.velocity.y = 0;
        player.y = Panda.height - 75;
        numJumps = 0;
    }

    // platform collision detection
    for (const platform of platforms) {
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
    if (player.velocity.x > 0) player.sprite.animate([0, 1, 2, 1], 10);
    else if (player.velocity.x < 0) player.sprite.animate([3, 4, 5, 4], 10);
    else if (player.velocity.y > 0) player.sprite.animate([6, 7, 8, 7], 10);
    else if (player.velocity.y < 0) player.sprite.animate([9, 10, 11, 10], 10);
    else player.sprite.stopAnimation();
}

Panda.keyboard.keyDown(' ', jump);

let numJumps = 0;
function jump() {
    numJumps++;
    if (numJumps <= 2) player.velocity.y = -40;
}

function draw() {
    Panda.draw.clear();
    Panda.draw.rectangle(0, 0, Panda.width, Panda.height, {
        pattern: { image: bricks.image, width: 100, height: 100 },
        center: false,
    });

    for (const platform of platforms) {
        Panda.draw.rectangle(platform.x, platform.y, 150, 20, { color: 'black' });
    }

    player.sprite.draw(player.x, player.y, {
        width: 150,
        height: 150,
        center: true,
    });
}

Panda.run(update, draw);
