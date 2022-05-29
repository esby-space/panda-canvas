import SimplexNoise from './lib/simplex-noise.js';
export class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    set magnitude(magnitude) {
        const vector = this.normalize().multiply(magnitude);
        this.x = vector.x;
        this.y = vector.y;
    }
    add(vector) {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        return new Vector(x, y);
    }
    subtract(vector) {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
        return new Vector(x, y);
    }
    multiply(scalar) {
        const x = this.x * scalar;
        const y = this.y * scalar;
        return new Vector(x, y);
    }
    divide(scalar) {
        const x = this.x / scalar;
        const y = this.y / scalar;
        return new Vector(x, y);
    }
    normalize() {
        const magnitude = this.magnitude;
        if (magnitude == 0)
            return new Vector(0, 0);
        const x = this.x / magnitude;
        const y = this.y / magnitude;
        return new Vector(x, y);
    }
    moveToward(target, delta) {
        const direction = target.subtract(this);
        direction.magnitude > delta && (direction.magnitude = delta);
        return this.add(direction);
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
}
export class Complex {
    r;
    i;
    constructor(real, imaginary) {
        this.r = real;
        this.i = imaginary;
    }
    get magnitude() {
        return Math.sqrt(this.r ** 2 + this.i ** 2);
    }
    add(complex) {
        const r = this.r + complex.r;
        const i = this.i + complex.i;
        return new Complex(r, i);
    }
    subtract(complex) {
        const r = this.r - complex.r;
        const i = this.i - complex.i;
        return new Complex(r, i);
    }
    multiply(complex) {
        const r = this.r * complex.r - this.i * complex.i;
        const i = this.r * complex.i + this.i * complex.r;
        return new Complex(r, i);
    }
    power(exponent) {
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
const math = {
    Vector(x, y) {
        return new Vector(x, y);
    },
    Complex(r, i) {
        return new Complex(r, i);
    },
    /** Deterministic simplex noise generator suitable for 2D, 3D and 4D spaces. Made by Jonas Wanger: <https://github.com/jwagner/simplex-noise.js> */
    noise(seed = Math.random()) {
        return new SimplexNoise(seed);
    },
};
export default math;
