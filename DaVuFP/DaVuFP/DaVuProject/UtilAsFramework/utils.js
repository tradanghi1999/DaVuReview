import * as jQuery from '../Framework/jquery.min.js'

function getFileNameFrom(path) {
    path = path.substring(path.lastIndexOf("/") + 1);
    return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}

function getWithSpecify(mId, items, classNameWithDot) {
    return new Promise(
        resolve => {
            items.forEach(x => {

                if (x.find(classNameWithDot).text() == mId) {
                    var itemClone = x.clone();
                    resolve(itemClone);
                }

            });
        })
}

export function findInArrs(prediciate, ...arrs) {

}

export async function getImgAsync(link, imgs) {
    return new Promise(
        resolve => {
            imgs.forEach(x => {
                if (x.currentSrc.includes(
                    getFileNameFrom(link)
                )) {
                    resolve(x);
                }
            });


        });
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getAsync(fn, ...params) {
    while (fn.apply(params) == null) {
        await sleep(200);
    }
    return fn.apply(params);
}

export function forEachIn(itms) {
    if (Array.isArray(itms))
        return itms;
    let arr = [];
    for (let i = 0; i < itms.length; i++) {
        arr.push(itms[i]);
    }
    return arr;

}

