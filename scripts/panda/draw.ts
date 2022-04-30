export class Sprite {
    constructor(
        public image: HTMLImageElement,
        public hFrame = 1,
        public vFrame = 1,
        public frame = 0
    ) {}

    private animation: string | null = null;
    animate(frames: number[], fps: number) {
        if (this.animation != frames.toString()) this.stopAnimation();
        if (this.animation) return;
        this.animation = frames.toString();

        const delay = 1000 / fps;
        let then = Date.now();

        let currentFrame = 0;
        const animate = () => {
            const now = Date.now();
            const elapsed = now - then;

            if (elapsed > delay) {
                then = now - (elapsed % delay);
                this.frame = frames[currentFrame];
                currentFrame++;
                if (currentFrame > frames.length - 1) currentFrame = 0;
            }
            this.rafID = window.requestAnimationFrame(animate);
        };
        animate();
    }

    private rafID: number | null = null;
    stopAnimation() {
        if (this.rafID) window.cancelAnimationFrame(this.rafID);
        this.animation = null;
    }
}

const draw = {
    canvas: undefined as HTMLCanvasElement | undefined,
    context: undefined as CanvasRenderingContext2D | undefined,

    /** Makes and sizes the canvas and context. (You probably want `panda.init()`) */
    init(options?: {
        container?: HTMLElement;
        pixelated?: boolean;
        retina?: boolean;
    }) {
        const container = options?.container ?? document.body;
        this.canvas = document.createElement('canvas');
        container.append(this.canvas);

        const context = this.canvas.getContext('2d')!;
        if (!context) throw new Error('error loading in the context x_x');
        this.context = context;

        let width = container.clientWidth;
        let height = container.clientHeight;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';

        if (options?.retina) {
            width *= window.devicePixelRatio;
            height *= window.devicePixelRatio;
        }

        this.canvas.width = width;
        this.canvas.height = height;

        draw.backgroundColor = 'black';
        draw.drawColor = 'white';

        if (options?.pixelated) {
            this.canvas.style.imageRendering = 'pixelated';
            this.context.imageSmoothingEnabled = false;
        }

        return { canvas: this.canvas, context: this.context };
    },

    /** The default drawing color panda will use. */
    set drawColor(color: RGB | color) {
        if (typeof color != 'object') color = colors[color];
        this.context!.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.context!.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    },

    /** The background color panda will use. */
    set backgroundColor(color: RGB | color) {
        if (typeof color == 'string') color = colors[color];
        this.canvas!.style.background = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    },

    // SHAPES //
    /** Renders any path for the context. (You probably want `panda.draw.line()`) */
    render(options?: { color?: RGB | color; mode?: 'fill' | 'line' }) {
        this.context!.save();
        if (options?.color) draw.drawColor = options?.color;
        if (options?.mode == 'line') this.context!.stroke();
        else this.context!.fill();
        this.context!.restore();
    },

    /** Draws a straight line betwen two points. */
    line(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: { color?: RGB | color }
    ) {
        this.context!.beginPath();
        this.context!.moveTo(x1, y1);
        this.context!.lineTo(x2, y2);
        this.context!.closePath();
        draw.render(options);
    },

    /** Draws a perfect circle, just define the center and the radius! */
    circle(
        x: number,
        y: number,
        radius: number,
        options?: { color?: RGB | color; mode?: 'fill' | 'line' }
    ) {
        this.context!.beginPath();
        this.context!.arc(x, y, radius, 0, Math.PI * 2);
        this.context!.closePath();
        draw.render(options);
    },

    /** Draws a rectangle, just give a point, width, and the height! */
    rectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        options?: {
            color?: RGB | color;
            mode?: 'fill' | 'line';
            center?: boolean;
        }
    ) {
        this.context!.beginPath();
        this.context!.rect(
            (options?.center ? -width / 2 : 0) + x,
            (options?.center ? -height / 2 : 0) + y,
            width,
            height
        );
        this.context!.closePath();
        draw.render(options);
    },

    /** Draws a square, just give a point and one of the side lengths! */
    square(
        x: number,
        y: number,
        length: number,
        options?: {
            color?: RGB | color;
            mode?: 'fill' | 'line';
            center?: boolean;
        }
    ) {
        this.context!.beginPath();
        this.context!.rect(
            (options?.center ? -length / 2 : 0) + x,
            (options?.center ? -length / 2 : 0) + y,
            length,
            length
        );
        this.context!.closePath();
        draw.render(options);
    },

    /** Draws a polygon given the coordinates of all the points in the shape. */
    polygon(
        points: [x: number, y: number][],
        options?: { color?: RGB | color; mode?: 'fill' | 'line' }
    ) {
        this.context!.beginPath();
        this.context!.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            this.context!.lineTo(points[i][0], points[i][1]);
        }
        this.context!.closePath();
        draw.render(options);
    },

    /** Render basic text to the screen. */
    text(
        text: string,
        x: number,
        y: number,
        options?: { color?: RGB | color }
    ) {
        this.context!.fillText(text, x, y);
        // TODO: implement styles
    },

    /** Clear the screen of all drawings. */
    clear() {
        this.context!.resetTransform();
        this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    },

    // SPRITES //
    Sprite,
    /** Draws a sprite to the screen. */
    sprite(
        sprite: Sprite,
        x: number,
        y: number,
        options?: { width?: number; height?: number; center?: boolean }
    ) {
        const width = options?.width ?? sprite.image.width;
        const height = options?.height ?? sprite.image.height;

        const sw = sprite.image.width / sprite.hFrame;
        const sh = sprite.image.height / sprite.vFrame;
        const sx = (sprite.frame % sprite.hFrame) * sw;
        const sy = Math.floor(sprite.frame / sprite.hFrame) * sh;

        this.context!.drawImage(
            sprite.image,
            sx,
            sy,
            sw,
            sh,
            (options?.center ? -width / 2 : 0) + x,
            (options?.center ? -height / 2 : 0) + y,
            width,
            height
        );
    },

    /** Animates a sprite with the specified frames and frame rate. */
    animate(sprite: Sprite, frames: number[], fps: number) {
        sprite.animate(frames, fps);
    },

    stopAnimation(sprite: Sprite) {
        sprite.stopAnimation();
    },
};

// COLORS //
export const colors = {
    black: [0, 0, 0] as RGB,
    darkBlue: [29, 43, 83] as RGB,
    darkPurple: [126, 37, 83] as RGB,
    darkGreen: [0, 135, 81] as RGB,
    brown: [171, 82, 54] as RGB,
    darkGrey: [95, 87, 79] as RGB,
    grey: [194, 195, 199] as RGB,
    white: [255, 241, 232] as RGB,
    red: [255, 0, 77] as RGB,
    orange: [255, 163, 0] as RGB,
    yellow: [255, 236, 39] as RGB,
    green: [0, 228, 54] as RGB,
    blue: [41, 173, 255] as RGB,
    purple: [131, 118, 156] as RGB,
    pink: [255, 119, 168] as RGB,
    peach: [255, 204, 170] as RGB,
};
type RGB = [r: number, g: number, b: number];
type color = keyof typeof colors;

export default draw;
