const camera = {
    /** When initialized, the default value of `camera.x` is `panda.width / 2` */
    x: 0,

    /** When initialized, the default value of `camera.y` is `panda.height / 2` */
    y: 0,
    width: 0,
    height: 0,

    /** Needed to use `camera.offsetX / Y`. You probably want `panda.init()` instead. */
    init(width: number, height: number, x?: number, y?: number): void {
        this.width = width;
        this.height = height;
        this.x = x ?? width / 2;
        this.y = y ?? height / 2;
    },

    /** If you have an absolute `x`, but you need to draw it, `x + camera.offsetX` will get you a the x value relative to the camera. This is built into the `panda.draw` methods.  */
    get offsetX() {
        return this.width / 2 - this.x;
    },

    /** If you have an absolute `y`, but you need to draw it, `y + camera.offsetY` will get you a the y value relative to the camera. This is built into the `panda.draw` methods.  */
    get offsetY() {
        return this.height / 2 - this.y;
    },

    /** Smoothly moves the camera to where you need to go! Make sure to put this inside your `update()` function. */
    move(x: number, y: number, speed = 1) {
        this.x = (1 - speed) * this.x + speed * x;
        this.y = (1 - speed) * this.y + speed * y;
    },
};

export default camera;
