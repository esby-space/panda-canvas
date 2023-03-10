import { Panda, Shapes, Mathy } from "../panda/panda.js";
Panda.init({
    pixelated: true,
    width: 300,
    height: 200,
    container: document.querySelector("#container") as HTMLElement,
});

// global constants
const TILE_SIZE = 16;
const GRAVITY = 60;

// game objects and assets
const bai = {
    SPEED: 3,
    ACCELERATION: 20,
    JUMP: 10,
    rectangle: new Shapes.Rectangle(150, 100, 16, 32),
    velocity: new Mathy.Vector(0, 0),

    sprite: await Panda.sprite("./scripts/examples/sprites/bai.png", {
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

const background: [parallax: number, rectangle: Shapes.Rectangle][] = [
    [0.25, new Shapes.Rectangle(120, 10, 70, 400)],
    [0.25, new Shapes.Rectangle(280, 30, 40, 400)],
    [0.5, new Shapes.Rectangle(30, 40, 40, 400)],
    [0.5, new Shapes.Rectangle(130, 90, 100, 400)],
    [0.5, new Shapes.Rectangle(300, 80, 120, 400)],
];

const mapString = `
00000000000000000000000000000000000000
00000000000000000000000000000000000000
00000000000000000000000000000000000000
00000000000000000000000000000000000000
00000002222200000000000000000000000000
00000000000000000000000000000000222200
22000000000000000220000002200002111122
11222222222222222110000221120001111111
11111111111111111110000111110000111100
11111111111111111110000011000000001000
11111111111111111110000010000000000000
11111111111111111110000010000000000000
11111111111111111110000000000000000000
`;

const map = mapString.split(/\n/).map((row) => row.split("").map((tile) => parseInt(tile)));

// sprites and sounds
const dirt = await Panda.sprite("./scripts/examples/sprites/dirt.png");
const grass = await Panda.sprite("./scripts/examples/sprites/grass.png");
const jumpSound = Panda.sound("./scripts/examples/sounds/jump.wav", { volume: 0.5 });

// game map
let collisionTiles: Shapes.Rectangle[] = [];
for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] == 1 || map[y][x] == 2) {
            collisionTiles = [
                ...collisionTiles,
                new Shapes.Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE),
            ];
        }
    }
}

const testCollisions = (rectangle: Shapes.Rectangle, tiles: Shapes.Rectangle[]) => {
    return tiles.filter((tile) => rectangle.collides(tile));
};

// main functions!
Panda.camera.y -= 50;
const update = (dt: number) => {
    const input = new Mathy.Vector(0, 0);
    input.x = Panda.keyboard.axis("a", "d");
    input.magnitude = bai.SPEED;
    bai.velocity = bai.velocity.moveToward(input, dt * bai.ACCELERATION);

    bai.velocity.y += GRAVITY * dt;
    move(bai.rectangle, bai.velocity, collisionTiles);

    if (bai.rectangle.y > 600) {
        // bai.rectangle.x = 150;
        bai.rectangle.y = 100;
    }

    bai.animate();
    Panda.camera.move(bai.rectangle.x, bai.rectangle.y, 0.2);
};

const move = (rectangle: Shapes.Rectangle, movement: Mathy.Vector, tiles: Shapes.Rectangle[]) => {
    rectangle.x += bai.velocity.x;
    let hitList = testCollisions(rectangle, tiles);
    for (const tile of hitList) {
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
    for (const tile of hitList) {
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
Panda.keyboard.keyDown(" ", () => {
    bai.jump();
});

const draw = () => {
    Panda.draw.clear();
    Panda.draw.rectangle(0, 80, Panda.width, Panda.height, {
        position: "view",
        color: [7, 80, 75],
        center: false,
    });

    for (const [parallax, rectangle] of background) {
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

Panda.draw.backgroundColor = "blue";
Panda.run(update, draw);
