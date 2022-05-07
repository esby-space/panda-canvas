export default class Vector {
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
}