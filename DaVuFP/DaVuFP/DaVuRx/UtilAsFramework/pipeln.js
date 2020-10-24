import * as fastMemoize from '../Framework/Fast-Memoize/index.js'

export async function combinePipeAsync(pipeFn, ...asPipes) {

    let pipeResults = await Promise.all(asPipes);
    let result = await pipeFn.apply(null, pipeResults);
    return result;
}

export async function combineAsync(...asFns) {

    let rs = await Promise.all(asFns);
    let comBn = [];
    rs.forEach(r => {
        r.forEach(tItem => comBn.push(tItem));
    })
    return comBn;

}


export async function memoizeResultAsync(asyncFn) {
    let m = fastMemoize.memoize(asyncFn);
    let result = await m;
    return result;
}

export async function endPipe(asyncRes, ...actions) {
    for (let i = 0; i < actions.length; i++) {
        await actions[i](asyncRes);
    }
}
