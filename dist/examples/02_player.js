import { Panda, Mathy } from "../panda/panda.js";
Panda.init({ pixelated: true, container: document.querySelector("#container") });
// panda player!
// sprite rendering, keyboard input
const player = {
    x: Panda.width / 2,
    y: Panda.height / 2,
    velocity: new Mathy.Vector(0, 0),
    sprite: await Panda.sprite("./scripts/examples/sprites/panda.png", {
        hFrame: 3,
        vFrame: 4,
    }),
};
function update(dt) {
    // get keyboard input
    const inputVector = new Mathy.Vector(0, 0);
    inputVector.x = Panda.keyboard.axis("a", "d");
    inputVector.y = Panda.keyboard.axis("w", "s");
    inputVector.magnitude = 15; // speed of the panda
    // update the velocity to the input, use dt for consistent movement
    player.velocity = player.velocity.moveToward(inputVector, dt * 90);
    player.x += player.velocity.x;
    player.y += player.velocity.y;
    // change the direction of the panda and animate
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
function draw() {
    Panda.draw.clear();
    player.sprite.draw(player.x, player.y, {
        width: 150,
        height: 150,
        center: true,
    });
}
Panda.draw.backgroundColor = "darkPurple";
Panda.run(update, draw);
