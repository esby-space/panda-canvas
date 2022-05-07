import panda from '../panda/panda.js';
import Vector from '../lib/vector.js';
panda.init();
// a red bouncing ball
// rendering and keyboard input
const ball = {
    x: 200,
    y: 200,
    velocity: new Vector(10, 0),
};
function update() {
    // simulate gravity
    ball.velocity.y += 1;
    // collision and bounce
    if (ball.y > panda.height - 50) {
        ball.y = panda.height - 50;
        ball.velocity.y *= -0.8;
    }
    if (ball.y < 50) {
        ball.y = 50;
        ball.velocity.y *= -0.8;
    }
    if (ball.x > panda.width - 50) {
        ball.x = panda.width - 50;
        ball.velocity.x *= -0.8;
    }
    if (ball.x < 50) {
        ball.x = 50;
        ball.velocity.x *= -0.8;
    }
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;
}
// give the ball a "kick" when space is pushed
panda.keyboard.keyDown(' ', () => {
    ball.velocity.magnitude += 50;
});
function draw() {
    panda.draw.clear();
    panda.draw.circle(ball.x, ball.y, 50, { color: 'red' });
}
panda.run(update, draw);
