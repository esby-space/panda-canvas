export default class Sprite {
    image;
    hFrame;
    vFrame;
    frame;
    constructor(image, hFrame = 1, vFrame = 1, frame = 0) {
        this.image = image;
        this.hFrame = hFrame;
        this.vFrame = vFrame;
        this.frame = frame;
    }
    animation = null;
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
    rafID = null;
    stopAnimation() {
        if (this.rafID)
            window.cancelAnimationFrame(this.rafID);
        this.animation = null;
    }
}
