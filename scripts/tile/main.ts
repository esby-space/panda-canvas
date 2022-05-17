import Panda, { Rectangle, Vector } from '../panda/panda.js';
import { map, background } from './map.js';
Panda.init({
    pixelated: true,
    width: 300,
    height: 200,
    container: document.querySelector('#container') as HTMLElement,
});

// global constants
const TILE_SIZE = 16;
const GRAVITY = 60;
const CHUNK_SIZE = 8;

// game objects and assets
const bai = {
    SPEED: 3,
    ACCELERATION: 20,
    JUMP: 10,

    rectangle: Panda.Rectangle(150, 100, 16, 32),
    velocity: Panda.Vector(0, 0),
    sprite: await Panda.Sprite('./scripts/sprites/bai.png', {
        vFrame: 2,
        hFrame: 8,
    }),

    numJumps: 0,
    jump() {
        if (this.numJumps < 2) {
            this.velocity.y = -this.JUMP;
            this.numJumps++;
            jumpSound.play();
        }
    },

    animate() {
        if (this.velocity.x > 0) this.sprite.animate([0, 1, 2, 3, 4, 5, 6, 7], 10);
        else if (this.velocity.x < 0) this.sprite.animate([8, 9, 10, 11, 12, 13, 14, 15], 10);
        else this.sprite.stopAnimation();
    },
};

// sprites and sounds
const dirt = await Panda.Sprite('./scripts/sprites/dirt.png');
const grass = await Panda.Sprite('./scripts/sprites/grass.png');
const jumpSound = Panda.Sound('./scripts/sounds/jump.wav', { volume: 0.5 });

// game map
let collisionTiles: Rectangle[] = [];
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == 1 || map[y][x] == 2) {
            collisionTiles = [
                ...collisionTiles,
                Panda.Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE),
            ];
        }
    }
}

const testCollisions = (rectangle: Rectangle, tiles: Rectangle[]) => {
    return tiles.filter((tile) => rectangle.collides(tile));
};

// main functions!
Panda.camera.y -= 50;
const update = (dt: number) => {
    const input = Panda.Vector(0, 0);
    input.x = Panda.keyboard.axis('a', 'd');
    input.magnitude = bai.SPEED;

    bai.velocity = bai.velocity.moveToward(input, dt * bai.ACCELERATION);
    bai.velocity.y += GRAVITY * dt;

    move(bai.rectangle, bai.velocity, collisionTiles);
    if (bai.rectangle.y > 600) {
        // bai.rectangle.x = 150;
        bai.rectangle.y = 100;
    }

    bai.animate();
    Panda.camera.move(bai.rectangle.x, Panda.camera.y, 0.2);
};

const move = (rectangle: Rectangle, movement: Vector, tiles: Rectangle[]) => {
    rectangle.x += bai.velocity.x;
    let hitList = testCollisions(rectangle, tiles);
    for (let tile of hitList) {
        if (movement.x > 0) {
            rectangle.right = tile.left;
            movement.x = 0;
        } else if (movement.x < 0) {
            rectangle.left = tile.right;
            movement.x = 0;
        }
    }

    rectangle.y += bai.velocity.y;
    hitList = testCollisions(rectangle, tiles);
    for (let tile of hitList) {
        if (movement.y > 0) {
            rectangle.bottom = tile.top;
            movement.y = 0;
            bai.numJumps = 0;
        } else if (movement.y < 0) {
            rectangle.top = tile.bottom;
            movement.y = 0;
        }
    }
};

// jump!
Panda.keyboard.keyDown(' ', () => {
    bai.jump();
});

const draw = () => {
    Panda.draw.clear();
    Panda.draw.rectangle(0, 80, Panda.width, Panda.height, {
        position: 'view',
        color: [7, 80, 75],
        center: false,
    });

    for (let [parallax, rectangle] of background) {
        rectangle.draw({
            position: parallax,
            color: parallax < 0.5 ? [9, 91, 85] : [14, 222, 150],
            center: false,
        });
    }

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] == 1) dirt.draw(x * TILE_SIZE, y * TILE_SIZE);
            else if (map[y][x] == 2) grass.draw(x * TILE_SIZE, y * TILE_SIZE);
        }
    }

    bai.sprite.draw(bai.rectangle.x, bai.rectangle.y, {
        width: bai.rectangle.height,
        height: bai.rectangle.height,
    });
};

Panda.draw.backgroundColor = 'blue';
Panda.run(update, draw);
