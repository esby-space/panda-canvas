import camera from './camera.js';
import Sprite from './sprite.js';

type RGB = [r: number, g: number, b: number];
type color = keyof typeof colors;
type DrawOptions =
    | {
          color?: RGB | color;
          mode?: 'fill' | 'line';
          center?: boolean;
          position?: 'scene' | 'view';
          pattern?: { sprite: Sprite; width?: number; height?: number };
      }
    | undefined;

const draw = {
    canvas: null as HTMLCanvasElement | null,
    context: null as CanvasRenderingContext2D | null,

    /** Makes and sizes the canvas and context. (You probably want `panda.init()`) */
    init(options?: {
        container?: HTMLElement;
        pixelated?: boolean;
        width?: number;
        height?: number;
    }): {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    } {
        const container = options?.container ?? document.body;
        this.canvas = document.createElement('canvas');
        container.append(this.canvas);

        const context = this.canvas.getContext('2d')!;
        if (!context) throw new Error('error loading in the context x_x');
        this.context = context;

        let width = options?.width ?? container.clientWidth;
        let height = options?.height ?? container.clientHeight;
        draw.resize(width, height, container);

        draw.backgroundColor = 'black';
        draw.drawColor = 'white';

        if (options?.pixelated) {
            this.canvas.style.imageRendering = 'pixelated';
            this.context.imageSmoothingEnabled = false;
        }

        return { canvas: this.canvas, context: this.context };
    },

    resize(width: number, height: number, container?: HTMLElement): void {
        this.canvas!.style.width = (container?.clientWidth ?? width) + 'px';
        this.canvas!.style.height = (container?.clientHeight ?? height) + 'px';
        this.canvas!.width = width;
        this.canvas!.height = height;
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
    render({ color, mode = 'fill', pattern }: DrawOptions = {}): void {
        this.context!.save();

        if (color) draw.drawColor = color;
        if (pattern) {
            const style = this.context!.createPattern(pattern.sprite.image, 'repeat');
            if (!style) throw new Error(`error loading in the pattern x_x`);

            const scaleX = pattern.width ? pattern.width / pattern.sprite.image.width : 1;
            const scaleY = pattern.height ? pattern.height / pattern.sprite.image.height : 1;
            this.context!.scale(scaleX, scaleY);
            this.context!.fillStyle = style;
        }

        if (mode == 'line') this.context!.stroke();
        else if (mode == 'fill') this.context!.fill();

        this.context!.restore();
        this.context!.resetTransform();
    },

    translate(x: number, y: number, { position = 'scene' }: DrawOptions = {}): void {
        this.context!.translate(
            x + (position == 'scene' ? camera.offsetX : 0),
            y + (position == 'scene' ? camera.offsetY : 0)
        );
    },

    /** Draws a straight line betwen two points. */
    line(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        { color, position }: DrawOptions = {}
    ): void {
        draw.translate(x1, y1, { position });
        this.context!.beginPath();
        this.context!.moveTo(0, 0);
        this.context!.lineTo(x2 - x1, y2 - y1);
        this.context!.closePath();
        draw.render({ color });
    },

    /** Draws a perfect circle, just define the center and the radius! */
    circle(
        x: number,
        y: number,
        radius: number,
        { color, mode, position = 'scene', pattern }: DrawOptions = {}
    ): void {
        draw.translate(x, y, { position });
        this.context!.beginPath();
        this.context!.arc(0, 0, radius, 0, Math.PI * 2);
        this.context!.closePath();
        draw.render({ color, mode, pattern });
    },

    /** Draws a rectangle, just give a point, width, and the height! */
    rectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        { color, mode, center = true, position, pattern }: DrawOptions = {}
    ): void {
        draw.translate(x, y, { position });
        this.context!.beginPath();
        this.context!.rect(center ? -width / 2 : 0, center ? -height / 2 : 0, width, height);
        this.context!.closePath();
        draw.render({ color, mode, pattern });
    },

    /** Draws a square, just give a point and one of the side lengths! */
    square(
        x: number,
        y: number,
        length: number,
        { color, mode, center = true, position, pattern }: DrawOptions = {}
    ): void {
        draw.translate(x, y, { position });
        this.context!.beginPath();
        this.context!.rect(center ? -length / 2 : 0, center ? -length / 2 : 0, length, length);
        this.context!.closePath();
        draw.render({ color, mode, pattern });
    },

    /** Draws a polygon given the coordinates of all the points in the shape. TODO: Might not work anymore */
    polygon(
        points: [x: number, y: number][],
        { color, mode, position = 'scene', pattern }: DrawOptions = {}
    ): void {
        draw.translate(points[0][0], points[0][1], { position });
        this.context!.beginPath();
        this.context!.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            this.context!.lineTo(points[i][0], points[i][1]);
        }
        this.context!.closePath();
        draw.render({ color, mode, pattern });
    },

    /** Render basic text to the screen. */
    text(
        text: string,
        x: number,
        y: number,
        { color, position = 'scene' }: DrawOptions = {}
    ): void {
        // TODO: implement styles
        draw.translate(x, y, { position });
        this.context!.fillText(text, 0, 0);
        this.context!.resetTransform();
    },

    /** Clear the screen of all drawings. */
    clear(opacity?: number): void {
        if (opacity) {
            const prevStyle = this.context!.fillStyle;
            this.context!.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.context!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
            this.context!.fillStyle = prevStyle;
        } else this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    },

    // SPRITES //
    Sprite,
    /** Draws a sprite to the screen. */
    sprite(
        sprite: Sprite,
        x: number,
        y: number,
        {
            width,
            height,
            center = true,
            position = 'scene',
        }: {
            width?: number;
            height?: number;
            center?: boolean;
            position?: 'scene' | 'view';
        } = {}
    ): void {
        width = width ?? sprite.image.width;
        height = height ?? sprite.image.height;

        const sw = sprite.image.width / sprite.hFrame;
        const sh = sprite.image.height / sprite.vFrame;
        const sx = (sprite.frame % sprite.hFrame) * sw;
        const sy = Math.floor(sprite.frame / sprite.hFrame) * sh;

        draw.translate(x, y, { position });
        this.context!.drawImage(
            sprite.image,
            sx,
            sy,
            sw,
            sh,
            center ? -width / 2 : 0,
            center ? -height / 2 : 0,
            width,
            height
        );
        this.context!.resetTransform();
    },

    /** Animates a sprite with the specified frames and frame rate. */
    animate(sprite: Sprite, frames: number[], fps: number): void {
        sprite.animate(frames, fps);
    },

    stopAnimation(sprite: Sprite): void {
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

export default draw;
