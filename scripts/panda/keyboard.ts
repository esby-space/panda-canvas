const keys: { [key: string]: boolean } = {};
document.body.addEventListener('keydown', (event) => (keys[event.key] = true));
document.body.addEventListener('keyup', (event) => (keys[event.key] = false));

const keyboard = {
    getKey: (key: string) => {
        return keys[key] ? true : false;
    },

    getAxis: (key1: string, key2: string) => {
        return +keyboard.getKey(key2) - +keyboard.getKey(key1);
    },

    keyDown: (key: string, callback: (event: KeyboardEvent) => void) => {
        document.body.addEventListener('keydown', (event) => {
            if (event.key == key) callback(event);
        });
    },
};

export default keyboard;
