# Panda

Panda tries to make Canvas 2D less scary. (Still a work in progress.)

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
context.fillStyle = 'red';
context.fill();
```
And we got a red circle! I think we deserve a nap too after writing so much code. Using Panda, this becomes:

```javascript
import panda from './panda/panda.js';

panda.init();
panda.draw.circle(200, 200, 50, { color: 'red' });
```

## Examples

1. Bouncing ball with gravity
2. Controllable player and basic animation
3. Gravity and orbits

(all the pixel was by me, which is why it is so bad)

## To do

- [ ] fix `panda.draw.text()`
- [ ] add more shapes to `panda.draw`
- [ ] add more rendering options to `panda.draw`
- [ ] add moveable camera
- [ ] add system methods
  - `pause()`
  - `play()`
  - `toggle()`

## Future

- audio and music support
- tilemap and background texture
- add transformations for images and drawings
