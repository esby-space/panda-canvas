import Panda from '../panda/panda.js';
Panda.init({ container: document.querySelector('#container') });
// a red bouncing ball
// rendering and keyboard input
const ball = {
    x: 200,
    y: 200,
    velocity: Panda.math.Vector(10, 0),
};
function update() {
    // simulate gravity
    ball.velocity.y += 1;
    // collision and bounce
    if (ball.y > Panda.height - 50) {
        ball.y = Panda.height - 50;
        ball.velocity.y *= -0.8;
    }
    if (ball.y < 50) {
        ball.y = 50;
        ball.velocity.y *= -0.8;
    }
    if (ball.x > Panda.width - 50) {
        ball.x = Panda.width - 50;
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
Panda.keyboard.keyDown(' ', () => {
    ball.velocity.magnitude += 50;
});
function draw() {
    Panda.draw.clear();
    Panda.draw.circle(ball.x, ball.y, 50, { color: 'red' });
}
Panda.run(update, draw);
