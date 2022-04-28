const mouse = {
    x: 0,
    y: 0,
    isPressed: false,

    /** Fires a callback when the mouse is clicked. */
    click(callback: (event: MouseEvent) => void) {
        document.addEventListener('click', callback);
    },
};

document.addEventListener('mousedown', () => (mouse.isPressed = true));
document.addEventListener('mouseup', () => (mouse.isPressed = false));
document.addEventListener('mousemove', (event) => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
});

export default mouse;
