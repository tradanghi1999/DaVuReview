//cache
var caches = {};
function getCache(key) {
    if (typeof caches == "undefined")
        caches = {};
    return caches[key];
}
function setCache(key, value) {
    if (typeof caches == "undefined")
        caches = {};
    caches[key] = value;
}