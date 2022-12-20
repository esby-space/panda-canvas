import { Panda, Mathy } from "../panda/panda.js";
Panda.init({ pixelated: true, container: document.querySelector("#container") as HTMLElement });

// Globals
const WORLD_WIDTH = 10000;

// bai!
const bai = {
    x: Panda.width / 2,
    y: Panda.height / 2,
    width: 100,
    height: 200,
    velocity: new Mathy.Vector(0, 0),
    sprite: await Panda.sprite("./scripts/examples/sprites/bai.png", {
        hFrame: 8,
        vFrame: 2,
    }),
};

const trees = {
    xs: [] as number[],
    sprite: await Panda.sprite("./scripts/examples/sprites/tree.png"),
};
for (let i = 0; i < 20; i++) {
    trees.xs = [...trees.xs, Math.random() * WORLD_WIDTH - WORLD_WIDTH / 2];
}

function update(dt: number) {
    // input
    const inputVector = new Mathy.Vector(0, 0);
    inputVector.x = Panda.keyboard.axis("a", "d");
    inputVector.magnitude = 12;
    bai.velocity = bai.velocity.moveToward(inputVector, dt * 100);

    // gravity
    bai.velocity.y += 200 * dt;

    // update velocity
    bai.x += bai.velocity.x;
    bai.y += bai.velocity.y;

    // floor collision
    if (bai.y > Panda.height - bai.height / 2 - 100) {
        bai.velocity.y = 0;
        bai.y = Panda.height - bai.height / 2 - 100;
        numJumps = 0;
    }

    // animation
    // someone please tell me there's a better way to do animation
    if (bai.velocity.x > 0) bai.sprite.animate([0, 1, 2, 3, 4, 5, 6, 7], 10);
    else if (bai.velocity.x < 0) bai.sprite.animate([8, 9, 10, 11, 12, 13, 14, 15], 10);
    else bai.sprite.stopAnimation();

    // update camera
    Panda.camera.x = bai.x;
}

let numJumps = 0;
function jump() {
    numJumps++;
    if (numJumps <= 2) bai.velocity.y = -50;
}

function draw() {
    Panda.draw.clear();
    Panda.draw.square(100, 100, 200, { color: "yellow" });
    Panda.draw.rectangle(-WORLD_WIDTH / 2, Panda.height - 100, WORLD_WIDTH, 100, {
        color: "darkGreen",
        center: false,
    });

    for (const x of trees.xs) {
        trees.sprite.draw(x, Panda.height - 200, {
            width: 200,
            height: 200,
        });
    }

    bai.sprite.draw(bai.x, bai.y, {
        width: bai.height, // sprite boxes are square: width = height
        height: bai.height,
        center: true,
    });
}

function main() {
    Panda.draw.backgroundColor = "blue";
    Panda.run(update, draw);

    Panda.keyboard.keyDown(" ", jump);
}

main();
