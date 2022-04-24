import Vector from './vector.js';
import draw from './draw.js';
import keyboard from './keyboard.js';
import mouse from './mouse.js';

const panda = {
    Vector,
    draw,
    keyboard,
    mouse,

    width: 0,
    height: 0,
    frame: 0,

    init: (options?: {
        container?: HTMLElement;
        pixelated?: boolean;
        retina?: boolean;
    }) => {
        const canvas = draw.init(options);
        panda.width = canvas.width;
        panda.height = canvas.height;
    },

    run: (update: (dt: number) => void, draw: () => void) => {
        let last = 0;
        let dt = 0;

        const loop = (time: number) => {
            dt = (time - last) / 1000;
            last = time;

            panda.draw.clear();
            update(dt);
            draw();

            panda.frame++;
            window.requestAnimationFrame(loop);
        };
        loop(0);
    },
};

export default panda;
