import Vector from './vector.js';
import draw from './draw.js';
import keyboard from './keyboard.js';

const panda = {
    draw,
    keyboard,
    Vector,

    run: (update: (dt: number) => void, draw: () => void) => {
        let last = 0;
        let dt = 0;

        const loop = (time: number) => {
            dt = (time - last) / 1000;
            last = time;

            panda.draw.clear();
            update(dt);
            draw();

            window.requestAnimationFrame(loop);
        };
        loop(0);
    },
};

export default panda;
