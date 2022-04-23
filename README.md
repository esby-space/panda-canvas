# Panda Canvas

Panda Canvas tries to make Canvas 2D less scary. (Still a work in progress.)

## Start
```bash
git clone --depth 1 https://github.com/esby-space/panda-canvas.git
cd panda-canvas
npx tsc
```
Then open `index.html` in a browser, and edit `scripts/main.ts`

## But why?

So you're going about your day just fine, and decide that you really want a red ball in your life! You reach for your trusty friend / enemy, Canvas 2D:

```javascript
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

context.beginPath();
context.arc(200, 200, 50, 0, Math.PI * 2);
context.closePath();
context.fillStyle = "red";
context.fill();
```
And we got a red circle! I think we deserve a nap too after writing so much code. Using Panda, this becomes:

```javascript
import panda from './panda/panda.js';

panda.draw.init();
panda.draw.circle(200, 200, 50, { color: 'red' });
```

## Examples
1. Ball and gravity
```javascript
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
```