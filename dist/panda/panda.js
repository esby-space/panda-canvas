import load from './load.js';
import keyboard from './keyboard.js';
import mouse from './mouse.js';
import camera from './camera.js';
import draw from './draw.js';
let rafID = null;
const panda = {
    load,
    keyboard,
    mouse,
    camera,
    draw,
    width: 0,
    height: 0,
    frame: 0,
    context: null,
    /** Makes canvas and system variables. Run before calling `panda.run`! */
    init(options) {
        const { canvas, context } = draw.init(options);
        panda.context = context;
        panda.width = canvas.width;
        panda.height = canvas.height;
        camera.init(canvas.width, canvas.height);
    },
    /** Boolean value indicating whether the animation is paused or not. */
    paused: true,
    /** The main game loop! `update(dt)` and `draw()` run every frame. `load()` runs before the loop.  */
    async run(update, draw, load) {
        if (load)
            await load();
        if (!panda.context)
            throw new Error('please initialize panda using panda.init() x_x');
        let last = 0;
        let dt = 0;
        const loop = (time) => {
            dt = (time - last) / 1000;
            last = time;
            update(dt);
            draw();
            panda.frame++;
            if (!this.paused) {
                rafID = window.requestAnimationFrame(loop);
            }
        };
        this.paused = false;
        loop(0);
    },
    /** Stops the animation. (If you only want to pause, try `panda.paused = true`) */
    stop() {
        if (!rafID)
            throw new Error(`can't stop an animation that hasn't begun yet x_x`);
        window.cancelAnimationFrame(rafID);
        this.paused = true;
    },
};
export default panda;
