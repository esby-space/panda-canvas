import panda from './panda/panda.js';

const ball = {
    x: 200,
    y: 200,
    velocity: new panda.Vector(0, 0),
};

function update() {
    ball.velocity.y += 1;
    ball.x += ball.velocity.x;
    ball.y += ball.velocity.y;
}

function draw() {
    panda.draw.circle(ball.x, ball.y, 50, { color: 'red' });
}

panda.draw.init();
panda.run(update, draw);
