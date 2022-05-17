const keyboard = {
    /** Object showing which keys are pressed down. Recommended to use `panda.keyboard.getKey(btn)` instead. */
    keys: {} as { [key: string]: boolean },

    /** Returns whether the given key is pressed down or not. */
    key(key: string): boolean {
        return !!this.keys[key];
    },

    /** Returns a 1 if `positiveKey` is pressed, and -1 if `negativeKey` is pressed */
    axis(negativeKey: string, positiveKey: string): number {
        return +keyboard.key(positiveKey) - +keyboard.key(negativeKey);
    },

    /** Fires a callback when a desired key is pressed. Do not call inside `update()`! */
    keyDown(key: string, callback: (event: KeyboardEvent) => void): void {
        document.body.addEventListener('keydown', (event) => {
            if (event.key == key) callback(event);
        });
    },
};

document.body.addEventListener('keydown', (event) => (keyboard.keys[event.key] = true));
document.body.addEventListener('keyup', (event) => (keyboard.keys[event.key] = false));

export default keyboard;
