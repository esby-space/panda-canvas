export default class Sprite {
    constructor(
        public image: HTMLImageElement,
        public hFrame = 1,
        public vFrame = 1,
        public frame = 0
    ) {}

    private animation: string | null = null;
    animate(frames: number[], fps: number) {
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

    private rafID: number | null = null;
    stopAnimation() {
        if (this.rafID) window.cancelAnimationFrame(this.rafID);
        this.animation = null;
    }
}
