import * as jQuery from '../Framework/jquery.min.js'

export function getFileNameFrom(path) {
    path = path.substring(path.lastIndexOf("/") + 1);
    return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}

export function getWithSpecify(mId, items, classNameWithDot) {
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