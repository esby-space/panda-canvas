import Panda from '../panda/panda.js';
Panda.init({
    pixelated: true,
    container: document.querySelector('#container'),
});
const TILE_SIZE = 96;
const Grid = {
    sprite: await Panda.Sprite('./scripts/examples/sprites/3Dgrass.png'),
    toAbsolute(x, y) {
        return {
            x: (x - y) / 2,
            y: (x / 2 + y / 2) / 2,
        };
    },
    toIsometric(x, y) {
        return {
            x: (x / 2 + y) * 2,
            y: (-x / 2 + y) * 2,
        };
    },
    draw(width, height, dx = 0, dy = 0) {
        for (let y = dy * TILE_SIZE; y < (width + dy) * TILE_SIZE; y += TILE_SIZE) {
            for (let x = dx * TILE_SIZE; x < (height + dx) * TILE_SIZE; x += TILE_SIZE) {
                const position = this.toAbsolute(x, y);
                Grid.sprite.draw(position.x, position.y, {
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                });
            }
        }
    },
};
const Player = {
    sprite: await Panda.Sprite('./scripts/examples/sprites/panda.png', { hFrame: 3, vFrame: 4 }),
    x: 14,
    y: -1,
    velocity: Panda.math.Vector(0, 0),
    z: 0,
    zVelocity: 0,
    get absolute() {
        const position = Grid.toAbsolute(this.x, this.y);
        return {
            x: position.x * TILE_SIZE,
            y: position.y * TILE_SIZE + this.z,
        };
    },
    events() {
        Panda.keyboard.keyDown(' ', () => {
            this.zVelocity = -15;
        });
    },
    update(dt) {
        const inputVector = Panda.math.Vector(0, 0);
        inputVector.x = Panda.keyboard.axis('a', 'd');
        inputVector.y = Panda.keyboard.axis('w', 's');
        inputVector.magnitude = 1 / 5; // speed of the panda
        // update the velocity to the input, use dt for consistent movement
        this.velocity = this.velocity.moveToward(inputVector, dt * 2);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.zVelocity += 50 * dt;
        this.z += this.zVelocity;
        if (this.z > 0) {
            this.z = 0;
            this.zVelocity = 0;
        }
    },
    draw() {
        this.sprite.draw(this.absolute.x, this.absolute.y - 72, {
            width: TILE_SIZE,
            height: TILE_SIZE,
        });
    },
};
const Game = {
    update(dt) {
        Player.update(dt);
        Panda.camera.move(Player.absolute.x, Player.absolute.y, 0.2);
    },
    draw() {
        Panda.draw.clear();
        Grid.draw(10, 10, 14, -1);
        Player.draw();
    },
    main() {
        Panda.draw.backgroundColor = 'darkBlue';
        Panda.run(this.update, this.draw);
        Player.events();
    },
};
Game.main();
