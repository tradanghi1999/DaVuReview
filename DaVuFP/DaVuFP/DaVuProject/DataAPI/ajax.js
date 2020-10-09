import * as jQuery from '../Framework/jquery.min.js'
import * as fastMemoize from '../Framework/Fast-Memoize/index.js'
export function ajaxCall(murl) {
    return $.ajax({
        type: 'GET',
        url: murl,
        dataType: 'json'
    });
}
export async function memoizeAjaxCall(murl) {
    let memoized = fastMemoize.memoize(ajaxCall);
    let json = await memoized(murl);
    return json;
}