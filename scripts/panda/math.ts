import Noise from "./lib/simplex-noise.js";

export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    set magnitude(magnitude: number) {
        const vector = this.normalize().multiply(magnitude);
        this.x = vector.x;
        this.y = vector.y;
    }

    add(vector: Vector) {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        return new Vector(x, y);
    }

    subtract(vector: Vector) {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
        return new Vector(x, y);
    }

    multiply(scalar: number) {
        const x = this.x * scalar;
        const y = this.y * scalar;
        return new Vector(x, y);
    }

    divide(scalar: number) {
        const x = this.x / scalar;
        const y = this.y / scalar;
        return new Vector(x, y);
    }

    normalize() {
        const magnitude = this.magnitude;
        if (magnitude == 0) return new Vector(0, 0);
        const x = this.x / magnitude;
        const y = this.y / magnitude;
        return new Vector(x, y);
    }

    moveToward(target: Vector, delta: number) {
        const direction = target.subtract(this);
        direction.magnitude > delta && (direction.magnitude = delta);
        return this.add(direction);
    }

    dot(vector: Vector): number {
        return this.x * vector.x + this.y * vector.y;
    }
}

export class Complex {
    r: number;
    i: number;

    constructor(real: number, imaginary: number) {
        this.r = real;
        this.i = imaginary;
    }

    get magnitude() {
        return Math.sqrt(this.r ** 2 + this.i ** 2);
    }

    add(complex: Complex) {
        const r = this.r + complex.r;
        const i = this.i + complex.i;
        return new Complex(r, i);
    }

    subtract(complex: Complex) {
        const r = this.r - complex.r;
        const i = this.i - complex.i;
        return new Complex(r, i);
    }

    multiply(complex: Complex) {
        const r = this.r * complex.r - this.i * complex.i;
        const i = this.r * complex.i + this.i * complex.r;
        return new Complex(r, i);
    }

    power(exponent: number) {
        let out = new Complex(1, 0);
        for (let i = 0; i < exponent; i++) {
            out = out.multiply(this);
        }
        return out;
    }

    square() {
        const r = (this.r + this.i) * (this.r - this.i);
        const i = 2 * this.r * this.i;
        return new Complex(r, i);
    }
}

export { Noise };
