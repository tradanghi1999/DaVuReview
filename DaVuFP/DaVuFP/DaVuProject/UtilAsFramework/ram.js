import * as jQuery from '../Framework/jquery.min.js'

function loadImgAsync(murl) {
    return new Promise(resolve => {
        var img = document.createElement("img");
        img.onload = function () {
            resolve(img);
        }
        img.src = murl;
    });
}

async function getProto(eId) {
    let clone = $(eId).clone();
    clone.removeAttr('id');
    return (clone);
}