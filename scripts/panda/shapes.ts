import draw, { DrawOptions } from './draw.js';

export class Line {
    constructor(public x1: number, public y1: number, public x2: number, public y2: number) { }

    draw({ color, position }: DrawOptions = {}) {
        draw.line(this.x1, this.y1, this.x2, this.y2, { color, position });
    }
}

export class Circle {
    constructor(public x: number, public y: number, public radius: number) { }

    draw({ color, mode, position, pattern }: DrawOptions = {}) {
        draw.circle(this.x, this.y, this.radius, { color, mode, position, pattern });
    }

    collides(object: Circle): boolean {
        return (
            Math.sqrt((this.x - object.x) ** 2 + (this.y - object.y) ** 2) <
            this.radius + object.radius
        );
    }

    get top(): number { return this.y - this.radius }
    set top(top: number) { this.y = top + this.radius }
    get bottom(): number { return this.y + this.radius }
    set bottom(bottom: number) { this.y = bottom - this.radius }
    get left(): number { return this.x - this.radius }
    set left(left: number) { this.x = left + this.radius }
    get right(): number { return this.x + this.radius }
    set right(right: number) { this.x = right - this.radius }
}

export class Rectangle {
    constructor(public x: number, public y: number, public width: number, public height: number) { }

    draw({ color, mode, center = true, position, pattern }: DrawOptions = {}): void {
        draw.rectangle(this.x, this.y, this.width, this.height, {
            color,
            mode,
            center,
            position,
            pattern,
        });
    }

    collides(object: Rectangle): boolean {
        return (
            Math.abs(this.x - object.x) < this.width / 2 + object.width / 2 &&
            Math.abs(this.y - object.y) < this.height / 2 + object.height / 2
        );
    }

    get top(): number { return this.y - this.height / 2 }
    set top(top: number) { this.y = top + this.height / 2 }
    get bottom(): number { return this.y + this.height / 2 }
    set bottom(bottom: number) { this.y = bottom - this.height / 2 }
    get left(): number { return this.x - this.width / 2 }
    set left(left: number) { this.x = left + this.width / 2 }
    get right(): number { return this.x + this.width / 2 }
    set right(right: number) { this.x = right - this.width / 2 }
}

export class Polygon {
    constructor(public points: [x: number, y: number][]) { }

    draw({ color, mode, position, pattern }: DrawOptions = {}) {
        draw.polygon(this.points, { color, mode, position, pattern });
    }
}

export class Sprite {
    constructor(
        public image: HTMLImageElement,
        public hFrame = 1,
        public vFrame = 1,
        public frame = 0,
        private animation: string | null = null,
        private rafID: number | null = null
    ) { }

    draw(
        x: number,
        y: number,
        {
            width,
            height,
            center,
            position,
            flip,
        }: { width?: number; height?: number; center?: boolean; position?: 'scene' | 'view'; flip?: boolean } = {}
    ): void {
        const sw = this.image.width / this.hFrame;
        const sh = this.image.height / this.vFrame;
        const sx = (this.frame % this.hFrame) * sw;
        const sy = Math.floor(this.frame / this.hFrame) * sh;

        draw.image(this.image, x, y, { sx, sy, sw, sh, width, height, center, position, flip });
    }

    animate(frames: number[], fps: number): void {
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

    stopAnimation(): void {
        if (this.rafID) window.cancelAnimationFrame(this.rafID);
        this.animation = null;
    }


    spriteFrom(frame: number): Sprite {
        return new Sprite(this.image, this.hFrame, this.vFrame, frame);
    }
}
