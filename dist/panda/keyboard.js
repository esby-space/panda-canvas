const keyboard = {
    /** Object showing which keys are pressed down. Recommended to use `panda.keyboard.getKey(btn)` instead. */
    keys: {},
    /** Returns whether the given key is pressed down or not. */
    getKey(key) {
        return !!this.keys[key];
    },
    /** Returns a 1 if `positiveKey` is pressed, and -1 if `negativeKey` is pressed */
    getAxis(negativeKey, positiveKey) {
        return +keyboard.getKey(positiveKey) - +keyboard.getKey(negativeKey);
    },
    /** Fires a callback when a desired key is pressed. Do not call inside `update()`! */
    keyDown(key, callback) {
        document.body.addEventListener('keydown', (event) => {
            if (event.key == key)
                callback(event);
        });
    },
};
document.body.addEventListener('keydown', (event) => (keyboard.keys[event.key] = true));
document.body.addEventListener('keyup', (event) => (keyboard.keys[event.key] = false));
export default keyboard;
