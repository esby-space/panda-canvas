import Panda, { Shapes } from './panda/panda.js';
Panda.init({
    pixelated: true,
    width: 450,
    height: 300,
    container: document.querySelector('#container') as HTMLElement,
});

// global constants
const GRAVITY = 40;
const TILE_SIZE = 16; // pixels per tile
const CHUNK_SIZE = 8; // tiles per chunk

// game objects and assets
const Bai = {
    SPEED: 3,
    ACCELERATION: 20,
    JUMP: 10,

    rectangle: Panda.rectangle(150, 100, 16, 32),
    velocity: Panda.math.Vector(0, 0),
    sprite: await Panda.sprite('./scripts/examples/sprites/bai.png', {
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
    dirt: await Panda.sprite('./scripts/examples/sprites/dirt.png'),
    grass: await Panda.sprite('./scripts/examples/sprites/grass.png'),
    jumpSound: Panda.sound('./scripts/examples/sounds/jump.wav', { volume: 0.5 }),
    background: [
        [0, Panda.rectangle(0, 80, Panda.width, Panda.height)],
        [0.25, Panda.rectangle(120, 10, 70, 400)],
        [0.25, Panda.rectangle(280, 30, 40, 400)],
        [0.5, Panda.rectangle(30, 40, 40, 400)],
        [0.5, Panda.rectangle(130, 90, 100, 400)],
        [0.5, Panda.rectangle(300, 80, 120, 400)],
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

                // terrain generation code!
                const noise = Math.floor(this.noise.noise2D(tx / 20, 0) * 4) + 7;
                let type = 'air'; // air
                if (ty == noise) type = 'grass'; // grass
                if (ty > noise) type = 'dirt'; // dirt

                chunk.push([type, [tx * TILE_SIZE, ty * TILE_SIZE]]);
            }
        }
        this.chunks[`${x}, ${y}`] = chunk;
    },

    // iterate over all the visible chunks, saves the computer from rendering too many tiles
    iterateChunks(callback: (chunk: chunk) => void, target: { x: number; y: number }) {
        for (
            let cy = Math.floor((target.y - Panda.height / 2) / CHUNK_SIZE / TILE_SIZE);
            cy < Math.ceil((target.y + Panda.height / 2) / CHUNK_SIZE / TILE_SIZE);
            cy++
        ) {
            for (
                let cx = Math.floor((target.x - Panda.width / 2) / CHUNK_SIZE / TILE_SIZE);
                cx < Math.ceil((target.x + Panda.width / 2) / CHUNK_SIZE / TILE_SIZE);
                cx++
            ) {
                const position = `${cx}, ${cy}`;
                if (!this.chunks[position]) this.makeChunk(cx, cy);
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
                if (type == 'dirt' || type == 'grass')
                    collisionTiles.push(Panda.rectangle(x, y, TILE_SIZE, TILE_SIZE));
            }
        }, Bai.rectangle);

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
        }, Panda.camera);

        Bai.draw();
    },

    main() {
        Panda.keyboard.keyDown(' ', () => Bai.jump());
        Panda.camera.move(Bai.rectangle.x, Bai.rectangle.y);
        Panda.draw.backgroundColor = 'blue';
        Panda.run(this.update, this.draw);
    },
};

Game.main();
