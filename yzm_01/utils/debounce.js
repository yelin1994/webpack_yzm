export function debounce(fn, delay) {
    let time = new Date().getTime();
    let timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...arguments);
        }, delay)
    }
}