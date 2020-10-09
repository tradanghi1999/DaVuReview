let caches = {};
export function getCache(key) {
    if (typeof caches == "undefined")
        caches = {};
    return caches[key];
}
export function setCache(key, value) {
    if (typeof caches == "undefined")
        caches = {};
    caches[key] = value;
}