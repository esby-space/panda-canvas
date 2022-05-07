import Sprite from './sprite.js';
const load = {
    /** Loads a sprite so it can be used later. */
    async sprite(src, options) {
        const image = new Image();
        image.src = src;
        await image.decode().catch(() => {
            throw new Error(`couldn't load image ${src} x_x`);
        });
        return new Sprite(image, options?.hFrame, options?.vFrame, options?.frame);
    },
};
export default load;
