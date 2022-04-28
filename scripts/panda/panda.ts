import draw from './draw.js';
import keyboard from './keyboard.js';
import mouse from './mouse.js';

let rafID: number | null = null;

const panda = {
    draw,
    keyboard,
    mouse,

    width: 0,
    height: 0,
    frame: 0,
    context: undefined as CanvasRenderingContext2D | undefined,

    /** Makes canvas and system variables. Run before calling `panda.run`! */
    init(options?: {
        container?: HTMLElement;
        pixelated?: boolean;
        retina?: boolean;
    }) {
        const { canvas, context } = draw.init(options);
        panda.width = canvas.width;
        panda.height = canvas.height;
        panda.context = context;
    },

    /** The main game loop! `update(dt)` and `draw()` run every frame. `load()` runs before the loop.  */
    paused: true,
    async run(
        update: (dt: number) => void,
        draw: () => void,
        load?: () => Promise<void>
    ) {
        if (load) await load();
        if (!panda.context)
            throw new Error('please initialize panda using panda.init() x_x');
        let last = 0;
        let dt = 0;

        const loop = (time: number) => {
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

    stop() {
        if (!rafID) return;
        window.cancelAnimationFrame(rafID);
        this.paused = true;
    },
};

export default panda;
