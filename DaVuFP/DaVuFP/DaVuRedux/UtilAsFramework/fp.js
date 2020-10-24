export function loopWithTimes(action, times) {
    for (let i = 0; i < times; i++) {
        action();
    }
}


