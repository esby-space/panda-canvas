import draw from './draw.js';
export class Line {
    x1;
    y1;
    x2;
    y2;
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw({ color, position } = {}) {
        draw.line(this.x1, this.y1, this.x2, this.y2, { color, position });
    }
}
export class Circle {
    x;
    y;
    radius;
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    draw({ color, mode, position, pattern } = {}) {
        draw.circle(this.x, this.y, this.radius, { color, mode, position, pattern });
    }
    collides(object) {
        return (Math.sqrt((this.x - object.x) ** 2 + (this.y - object.y) ** 2) <
            this.radius + object.radius);
    }
    get top() { return this.y - this.radius; }
    set top(top) { this.y = top + this.radius; }
    get bottom() { return this.y + this.radius; }
    set bottom(bottom) { this.y = bottom - this.radius; }
    get left() { return this.x - this.radius; }
    set left(left) { this.x = left + this.radius; }
    get right() { return this.x + this.radius; }
    set right(right) { this.x = right - this.radius; }
}
export class Rectangle {
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw({ color, mode, center = true, position, pattern } = {}) {
        draw.rectangle(this.x, this.y, this.width, this.height, {
            color,
            mode,
            center,
            position,
            pattern,
        });
    }
    collides(object) {
        return (Math.abs(this.x - object.x) < this.width / 2 + object.width / 2 &&
            Math.abs(this.y - object.y) < this.height / 2 + object.height / 2);
    }
    get top() { return this.y - this.height / 2; }
    set top(top) { this.y = top + this.height / 2; }
    get bottom() { return this.y + this.height / 2; }
    set bottom(bottom) { this.y = bottom - this.height / 2; }
    get left() { return this.x - this.width / 2; }
    set left(left) { this.x = left + this.width / 2; }
    get right() { return this.x + this.width / 2; }
    set right(right) { this.x = right - this.width / 2; }
}
export class Polygon {
    points;
    constructor(points) {
        this.points = points;
    }
    draw({ color, mode, position, pattern } = {}) {
        draw.polygon(this.points, { color, mode, position, pattern });
    }
}
export class Sprite {
    image;
    hFrame;
    vFrame;
    frame;
    animation;
    rafID;
    constructor(image, hFrame = 1, vFrame = 1, frame = 0, animation = null, rafID = null) {
        this.image = image;
        this.hFrame = hFrame;
        this.vFrame = vFrame;
        this.frame = frame;
        this.animation = animation;
        this.rafID = rafID;
    }
    draw(x, y, { width, height, center, position, } = {}) {
        const sw = this.image.width / this.hFrame;
        const sh = this.image.height / this.vFrame;
        const sx = (this.frame % this.hFrame) * sw;
        const sy = Math.floor(this.frame / this.hFrame) * sh;
        draw.image(this.image, x, y, { sx, sy, sw, sh, width, height, center, position });
    }
    animate(frames, fps) {
        if (this.animation != frames.toString())
            this.stopAnimation();
        if (this.animation)
            return;
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
                if (currentFrame > frames.length - 1)
                    currentFrame = 0;
            }
            this.rafID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    stopAnimation() {
        if (this.rafID)
            window.cancelAnimationFrame(this.rafID);
        this.animation = null;
    }
}
