import Panda, { Shapes } from './panda/panda.js';
Panda.init({
    pixelated: true,
    width: 300,
    height: 200,
    container: document.querySelector('#container') as HTMLElement,
});

// global constants
const GRAVITY = 40;
const TILE_SIZE = 16;
const CHUNK_SIZE = 8;

// game objects and assets
const Bai = {
    SPEED: 3,
    ACCELERATION: 20,
    JUMP: 15,

    rectangle: Panda.Rectangle(150, 100, 16, 32),
    velocity: Panda.math.Vector(0, 0),
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

    move(tiles: Shapes.Rectangle[]) {
        this.rectangle.x += Bai.velocity.x;
        let hitList = tiles.filter((tile) => this.rectangle.collides(tile));
        for (const tile of hitList) {
            if (this.velocity.x > 0) {
                this.rectangle.right = tile.left;
                this.velocity.x = 0;
            } else if (this.velocity.x < 0) {
                this.rectangle.left = tile.right;
                this.velocity.x = 0;
            }
        }

        this.rectangle.y += Bai.velocity.y;
        hitList = tiles.filter((tile) => this.rectangle.collides(tile));
        for (const tile of hitList) {
            if (this.velocity.y > 0) {
                this.rectangle.bottom = tile.top;
                this.velocity.y = 0;
                Bai.numJumps = 0;
            } else if (this.velocity.y < 0) {
                this.rectangle.top = tile.bottom;
                this.velocity.y = 0;
            }
        }
    },

    draw() {
        this.sprite.draw(Bai.rectangle.x, Bai.rectangle.y, {
            width: Bai.rectangle.height,
            height: Bai.rectangle.height,
        });
    },
};

// sprites and sounds
const dirt = await Panda.Sprite('./scripts/sprites/dirt.png');
const grass = await Panda.Sprite('./scripts/sprites/grass.png');
const jumpSound = Panda.Sound('./scripts/sounds/jump.wav', { volume: 0.5 });
const background: [parallax: number, rectangle: Shapes.Rectangle][] = [
    [0, Panda.Rectangle(0, 80, Panda.width, Panda.height)],
    [0.25, Panda.Rectangle(120, 10, 70, 400)],
    [0.25, Panda.Rectangle(280, 30, 40, 400)],
    [0.5, Panda.Rectangle(30, 40, 40, 400)],
    [0.5, Panda.Rectangle(130, 90, 100, 400)],
    [0.5, Panda.Rectangle(300, 80, 120, 400)],
];

// game ,map
type chunk = [type: number, position: [x: number, y: number]][];
const Map = {
    chunks: {} as { [position: string]: chunk },
    makeChunk(x: number, y: number) {
        let chunk: chunk = [];
        for (let sy = 0; sy < CHUNK_SIZE; sy++) {
            for (let sx = 0; sx < CHUNK_SIZE; sx++) {
                const tx = x * CHUNK_SIZE + sx;
                const ty = y * CHUNK_SIZE + sy;

                let type = 0; // air
                if (ty > 7) type = 1; // dirt
                if (ty == 7) type = 2; // grass

                chunk = [...chunk, [type, [tx * TILE_SIZE, ty * TILE_SIZE]]];
            }
        }
        this.chunks[`${x}, ${y}`] = chunk;
    },

    iterateChunks(callback: (chunk: chunk) => void) {
        for (let y = -2; y < Math.ceil(Panda.height / TILE_SIZE / CHUNK_SIZE); y++) {
            for (let x = -2; x < Math.ceil(Panda.width / TILE_SIZE / CHUNK_SIZE); x++) {
                const tx = Math.floor(Panda.camera.x / TILE_SIZE / CHUNK_SIZE) + x;
                const ty = Math.floor(Panda.camera.y / TILE_SIZE / CHUNK_SIZE) + y;
                const position = `${tx}, ${ty}`;

                if (!this.chunks[position]) this.makeChunk(tx, ty);
                callback(this.chunks[position]);
            }
        }
    },
};

// main functions!
const update = (dt: number) => {
    const input = Panda.math.Vector(0, 0);
    input.x = Panda.keyboard.axis('a', 'd');
    input.magnitude = Bai.SPEED;

    Bai.velocity = Bai.velocity.moveToward(input, dt * Bai.ACCELERATION);
    Bai.velocity.y += GRAVITY * dt;

    let collisionTiles: Shapes.Rectangle[] = [];
    Map.iterateChunks((chunk) => {
        for (const [type, [x, y]] of chunk) {
            if (type == 1 || type == 2)
                collisionTiles = [...collisionTiles, Panda.Rectangle(x, y, TILE_SIZE, TILE_SIZE)];
        }
    });

    Bai.move(collisionTiles);
    Bai.animate();
    Panda.camera.move(Bai.rectangle.x, Bai.rectangle.y, 0.1);
};

// jump!
Panda.keyboard.keyDown(' ', () => Bai.jump());

const draw = () => {
    Panda.draw.clear();

    for (const [parallax, rectangle] of background) {
        rectangle.draw({
            position: parallax,
            color: parallax < 0.5 ? (parallax == 0 ? [7, 80, 75] : [9, 91, 85]) : [14, 222, 150],
            center: false,
        });
    }

    Map.iterateChunks((chunk) => {
        for (const [type, [x, y]] of chunk) {
            if (type == 1) dirt.draw(x, y);
            else if (type == 2) grass.draw(x, y);
        }
    });

    Bai.draw();
};

Panda.draw.backgroundColor = 'blue';
Panda.run(update, draw);
