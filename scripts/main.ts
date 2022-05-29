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
    JUMP: 10,

    rectangle: Panda.Rectangle(150, 100, 16, 32),
    velocity: Panda.math.Vector(0, 0),
    sprite: await Panda.Sprite('./scripts/examples/sprites/bai.png', {
        vFrame: 2,
        hFrame: 8,
    }),

    numJumps: 0,
    jump() {
        if (this.numJumps < 2) {
            this.velocity.y = -this.JUMP;
            this.numJumps++;
            Assets.jumpSound.play();
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
const Assets = {
    dirt: await Panda.Sprite('./scripts/examples/sprites/dirt.png'),
    grass: await Panda.Sprite('./scripts/examples/sprites/grass.png'),
    jumpSound: Panda.Sound('./scripts/examples/sounds/jump.wav', { volume: 0.5 }),
    background: [
        [0, Panda.Rectangle(0, 80, Panda.width, Panda.height)],
        [0.25, Panda.Rectangle(120, 10, 70, 400)],
        [0.25, Panda.Rectangle(280, 30, 40, 400)],
        [0.5, Panda.Rectangle(30, 40, 40, 400)],
        [0.5, Panda.Rectangle(130, 90, 100, 400)],
        [0.5, Panda.Rectangle(300, 80, 120, 400)],
    ] as [parallax: number, rectangle: Shapes.Rectangle][],
};

// game map
type chunk = [type: string, position: [x: number, y: number]][];
const Map = {
    chunks: {} as { [position: string]: chunk },
    noise: Panda.math.noise(),

    makeChunk(x: number, y: number) {
        const chunk: chunk = [];
        for (let sx = 0; sx < CHUNK_SIZE; sx++) {
            for (let sy = 0; sy < CHUNK_SIZE; sy++) {
                const tx = x * CHUNK_SIZE + sx;
                const ty = y * CHUNK_SIZE + sy;

                const noise = Math.floor(this.noise.noise2D(tx / 20, 0) * 4) + 7;
                let type = 'air'; // air
                if (ty == noise) type = 'grass'; // grass
                if (ty > noise) type = 'dirt'; // dirt

                chunk.push([type, [tx * TILE_SIZE, ty * TILE_SIZE]]);
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

// main game!
const Game = {
    update(dt: number) {
        const input = Panda.math.Vector(0, 0);
        input.x = Panda.keyboard.axis('a', 'd');
        input.magnitude = Bai.SPEED;

        Bai.velocity = Bai.velocity.moveToward(input, dt * Bai.ACCELERATION);
        Bai.velocity.y += GRAVITY * dt;

        const collisionTiles: Shapes.Rectangle[] = [];
        Map.iterateChunks((chunk) => {
            for (const [type, [x, y]] of chunk) {
                if (type == 'dirt' || type == 'grass') {
                    collisionTiles.push(Panda.Rectangle(x, y, TILE_SIZE, TILE_SIZE));
                }
            }
        });

        Bai.move(collisionTiles);
        Bai.animate();
        Panda.camera.move(Bai.rectangle.x, Bai.rectangle.y, 0.1);
    },

    draw() {
        Panda.draw.clear();

        for (const [parallax, rectangle] of Assets.background) {
            rectangle.draw({
                position: parallax,
                color:
                    parallax < 0.5 ? (parallax == 0 ? [7, 80, 75] : [9, 91, 85]) : [14, 222, 150],
                center: false,
            });
        }

        Map.iterateChunks((chunk) => {
            for (const [type, [x, y]] of chunk) {
                if (type == 'dirt') Assets.dirt.draw(x, y);
                else if (type == 'grass') Assets.grass.draw(x, y);
            }
        });

        Bai.draw();
    },

    main() {
        Panda.keyboard.keyDown(' ', () => Bai.jump());
        Panda.draw.backgroundColor = 'blue';
        Panda.run(this.update, this.draw);
    },
};

Game.main();
