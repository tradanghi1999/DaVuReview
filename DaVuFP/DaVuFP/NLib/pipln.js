
async function combinePipeAsync(pipeFn, ...asPipes) {

    let pipeResults = await Promise.all(asPipes);
    let result = await pipeFn.apply(null, pipeResults);
    return result;
}

async function combineAsync(...asFns) {

    let rs = await Promise.all(asFns);
    let comBn = [];
    rs.forEach(r => {
        r.forEach(tItem => comBn.push(tItem));
    })
    return comBn;

}