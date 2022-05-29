import keyboard from './keyboard.js';
import mouse from './mouse.js';
import camera from './camera.js';
import draw from './draw.js';
import * as Shapes from './shapes.js';
import math, * as Math from './math.js';

let rafID: number;

const Panda = {
    // UTILIIES //
    keyboard,
    mouse,
    camera,
    draw,
    math,

    // MAIN //
    width: 0,
    height: 0,
    frame: 0,
    context: null as CanvasRenderingContext2D | null,

    /** Makes canvas and system variables. Run before calling `panda.run`! */
    init(options?: {
        container?: HTMLElement;
        pixelated?: boolean;
        width?: number;
        height?: number;
    }): void {
        if (options?.container) {
            for (let i = 0; i < options.container.children.length; i++) {
                options.container.children[i].remove();
            }
        }

        if (options?.width && options?.height && options?.container)
            options.container.style.aspectRatio = `${options.width / options.height}`;
        const { canvas, context } = draw.init(options);
        Panda.context = context;

        Panda.width = canvas.width;
        Panda.height = canvas.height;
        camera.init(canvas.width, canvas.height);
    },

    /** Boolean value indicating whether the animation is paused or not. */
    paused: true,

    /** The main game loop! `update(dt)` and `draw()` run every frame. `load()` runs before the loop.  */
    async run(
        update: (dt: number) => void,
        draw: () => void,
        load?: () => Promise<void>
    ): Promise<void> {
        if (load) await load();
        if (!Panda.context) throw new Error('please initialize panda using panda.init() x_x');
        if (rafID) this.stop();

        let last = 0;
        let dt = 0;

        const loop = (time: number) => {
            dt = (time - last) / 1000;
            last = time;

            update(dt);
            draw();

            Panda.frame++;
            if (!this.paused) {
                rafID = window.requestAnimationFrame(loop);
            }
        };

        this.paused = false;
        loop(0);
    },

    /** Stops the game. (If you only want to pause, try `panda.paused = true`) */
    stop(): void {
        if (!rafID) throw new Error(`can't stop an animation that hasn't begun yet x_x`);
        window.cancelAnimationFrame(rafID);
        this.paused = true;
    },

    // CLASS WRAPPERS //
    Line(x1: number, y1: number, x2: number, y2: number) {
        return new Shapes.Line(x1, y1, x2, y2);
    },

    Circle(x: number, y: number, radius: number) {
        return new Shapes.Circle(x, y, radius);
    },

    Rectangle(x: number, y: number, width: number, height: number) {
        return new Shapes.Rectangle(x, y, width, height);
    },

    Square(x: number, y: number, length: number) {
        return new Shapes.Rectangle(x, y, length, length);
    },

    Polygon(points: [x: number, y: number][]) {
        return new Shapes.Polygon(points);
    },

    async Sprite(
        src: string,
        options?: { hFrame?: number; vFrame?: number; frame?: number }
    ): Promise<Shapes.Sprite> {
        const image = new Image();
        image.src = src;
        await image.decode().catch(() => {
            throw new Error(`couldn't load image ${src} x_x`);
        });
        return new Shapes.Sprite(image, options?.hFrame, options?.vFrame, options?.frame);
    },

    Sound(src: string, { volume }: { volume?: number } = {}): HTMLAudioElement {
        const audio = new Audio();
        audio.src = src;
        audio.volume = volume ?? 1;
        audio.preload = 'auto';
        return audio;
    },
};

export default Panda;
export { Shapes, Math };
