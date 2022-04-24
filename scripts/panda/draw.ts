let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;

/** Create a new Canvas2D and context */
function init(options?: {
    container?: HTMLElement;
    pixelated?: boolean;
    retina?: boolean;
}) {
    const container = options?.container || document.body;
    canvas = document.createElement('canvas');
    container.append(canvas);
    context = canvas.getContext('2d')!;

    let width = container.clientWidth;
    let height = container.clientHeight;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    if (options?.retina) {
        width *= window.devicePixelRatio;
        height *= window.devicePixelRatio;
    }

    canvas.width = width;
    canvas.height = height;

    setBackgroundColor('black');
    setColor('white');

    if (options?.pixelated) {
        canvas.style.imageRendering = 'pixelated';
        context.imageSmoothingEnabled = false;
        // black magic that i copied from stack overflow >_>
        context.filter =
            'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)';
    }

    return canvas;
}

function setColor(color: RGB | color) {
    if (typeof color == 'string') color = colors[color];
    context.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    context.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function setBackgroundColor(color: RGB | color) {
    if (typeof color == 'string') color = colors[color];
    canvas.style.background = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

// RENDERING THINGS //
function draw(options?: { color?: RGB | color; mode?: 'fill' | 'line' }) {
    context.save();
    if (options?.color) setColor(options?.color);
    if (options?.mode == 'line') context.stroke();
    else context.fill();
    context.restore();
}

function line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options?: { color?: RGB | color }
) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    draw(options);
}

function circle(
    x: number,
    y: number,
    radius: number,
    options?: { color?: RGB | color; mode?: 'fill' | 'line' }
) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    draw(options);
}

function rectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    options?: { color?: RGB | color; mode?: 'fill' | 'line' }
) {
    context.beginPath();
    context.rect(x, y, width, height);
    context.closePath();
    draw(options);
}

function square(
    x: number,
    y: number,
    length: number,
    options?: { color?: RGB | color; mode?: 'fill' | 'line' }
) {
    context.beginPath();
    context.rect(x, y, length, length);
    context.closePath();
    draw(options);
}

function polygon(
    points: [x: number, y: number][],
    options?: { color?: RGB | color; mode?: 'fill' | 'line' }
) {
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    draw(options);
}

function text(
    text: string,
    x: number,
    y: number,
    options?: { color?: RGB | color; mode?: 'fill' | 'line' }
) {
    context.fillText(text, x, y);
}

function clear() {
    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// IMAGES //
async function loadImage(src: string) {
    const image = new Image();
    image.src = src;
    await image.decode().catch(() => {
        throw new Error(`couldn't load image ${src} x_x`);
    });
    return image;
}

function image(
    image: HTMLImageElement,
    x: number,
    y: number,
    options?: { width?: number; height?: number }
) {
    if (options?.width && options?.height) {
        context.drawImage(image, x, y, options.width, options.height);
    } else {
        context.drawImage(image, x, y);
    }
}

// COLORS //
type RGB = [r: number, g: number, b: number];
type color =
    | 'black'
    | 'darkBlue'
    | 'darkPurple'
    | 'darkGreen'
    | 'brown'
    | 'darkGrey'
    | 'grey'
    | 'white'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'peach';

const colors: { [color: string]: RGB } = {
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

export default {
    init,
    line,
    circle,
    rectangle,
    square,
    polygon,
    text,
    clear,
    loadImage,
    image,

    setColor,
    setBackgroundColor,
};
