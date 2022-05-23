import camera from './camera.js';
let canvas;
let context;
const draw = {
    /** Makes and sizes the canvas and context. (You probably want `panda.init()`) */
    init(options) {
        const container = options?.container ?? document.body;
        canvas = document.createElement('canvas');
        container.append(canvas);
        const possibleContext = canvas.getContext('2d');
        if (!possibleContext)
            throw new Error('error loading in the context x_x');
        context = possibleContext;
        const width = options?.width ?? container.clientWidth;
        const height = options?.height ?? container.clientHeight;
        draw.resize(width, height, container);
        draw.backgroundColor = 'black';
        draw.color = 'white';
        if (options?.pixelated) {
            canvas.style.imageRendering = 'pixelated';
            context.imageSmoothingEnabled = false;
        }
        return { canvas, context };
    },
    resize(width, height, container) {
        canvas.style.width = (container?.clientWidth ?? width) + 'px';
        canvas.style.height = (container?.clientHeight ?? height) + 'px';
        canvas.width = width;
        canvas.height = height;
    },
    /** The default drawing color panda will use. */
    set color(color) {
        if (typeof color != 'object')
            color = colors[color];
        context.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        context.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    },
    /** The background color panda will use. */
    set backgroundColor(color) {
        if (typeof color == 'string')
            color = colors[color];
        canvas.style.background = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    },
    // SHAPES //
    /** Renders any path for the context. (You probably want `panda.draw.line()`) */
    render({ color, mode = 'fill', pattern } = {}) {
        context.save();
        if (color)
            draw.color = color;
        if (pattern) {
            const style = context.createPattern(pattern.image, 'repeat');
            if (!style)
                throw new Error(`error loading in the pattern x_x`);
            const scaleX = pattern.width ? pattern.width / pattern.image.width : 1;
            const scaleY = pattern.height ? pattern.height / pattern.image.height : 1;
            context.scale(scaleX, scaleY);
            context.fillStyle = style;
        }
        if (mode == 'line')
            context.stroke();
        else if (mode == 'fill')
            context.fill();
        context.restore();
        context.resetTransform();
    },
    translate(x, y, { position = 1 } = {}) {
        if (position == 'scene')
            position = 1;
        else if (position == 'view')
            position = 0;
        context.translate(Math.round(x + position * camera.offsetX), Math.round(y + position * camera.offsetY));
    },
    /** Draws a straight line betwen two points. */
    line(x1, y1, x2, y2, { color, position } = {}) {
        draw.translate(x1, y1, { position });
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(x2 - x1, y2 - y1);
        context.closePath();
        draw.render({ color });
    },
    /** Draws a perfect circle, just define the center and the radius! */
    circle(x, y, radius, { color, mode, position, pattern } = {}) {
        draw.translate(x, y, { position });
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.closePath();
        draw.render({ color, mode, pattern });
    },
    /** Draws a rectangle, just give a point, width, and the height! */
    rectangle(x, y, width, height, { color, mode, center = true, position, pattern } = {}) {
        draw.translate(x, y, { position });
        context.beginPath();
        context.rect(center ? -width / 2 : 0, center ? -height / 2 : 0, width, height);
        context.closePath();
        draw.render({ color, mode, pattern });
    },
    /** Draws a square, just give a point and one of the side lengths! */
    square(x, y, length, { color, mode, center = true, position, pattern } = {}) {
        draw.translate(x, y, { position });
        context.beginPath();
        context.rect(center ? -length / 2 : 0, center ? -length / 2 : 0, length, length);
        context.closePath();
        draw.render({ color, mode, pattern });
    },
    /** Draws a polygon given the coordinates of all the points in the shape. TODO: Might not work anymore */
    polygon(points, { color, mode, position, pattern } = {}) {
        draw.translate(points[0][0], points[0][1], { position });
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            context.lineTo(points[i][0], points[i][1]);
        }
        context.closePath();
        draw.render({ color, mode, pattern });
    },
    /** Render basic text to the screen. */
    text(text, x, y, { color, position, center = true, font } = {}) {
        context.save();
        draw.translate(x, y, { position });
        if (color)
            draw.color = color;
        if (font)
            context.font = font;
        context.textAlign = center ? 'center' : 'start';
        context.textBaseline = center ? 'middle' : 'alphabetic';
        context.fillText(text, 0, 0);
        context.restore();
    },
    /** Define a custom shape with Canvas2D! Automatically begins and ends path, position, and color. */
    custom(x, y, callback, { color, mode, position, pattern } = {}) {
        draw.translate(x, y, { position });
        context.beginPath();
        callback(context);
        context.closePath();
        draw.render({ color, mode, pattern });
    },
    /** Clear the screen of all drawings. */
    clear(opacity) {
        if (opacity) {
            const prevStyle = context.fillStyle;
            context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = prevStyle;
        }
        else
            context.clearRect(0, 0, canvas.width, canvas.height);
    },
    // SPRITES //
    /** Draws a sprite to the screen. */
    image(image, x, y, { width, height, center = true, position = 'scene', sx = 0, sy = 0, sw, sh, } = {}) {
        width = width ?? image.width;
        height = height ?? image.height;
        sw = sw ?? width;
        sh = sh ?? height;
        draw.translate(x, y, { position });
        context.drawImage(image, sx, sy, sw, sh, center ? -width / 2 : 0, center ? -height / 2 : 0, width, height);
        context.resetTransform();
    },
};
// COLORS //
const colors = {
    black: [0, 0, 0],
    darkBlue: [29, 43, 83],
    darkPurple: [126, 37, 83],
    darkGreen: [0, 135, 81],
    brown: [171, 82, 54],
    darkGrey: [95, 87, 79],
    grey: [194, 195, 199],
    white: [255, 241, 232],
    red: [255, 0, 77],
    orange: [255, 163, 0],
    yellow: [255, 236, 39],
    green: [0, 228, 54],
    blue: [41, 173, 255],
    purple: [131, 118, 156],
    pink: [255, 119, 168],
    peach: [255, 204, 170],
};
export default draw;
