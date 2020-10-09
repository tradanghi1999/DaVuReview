export async function arrayDoingAsync(array, actionAsync, arrItem2ActionParamConverter) {
    let promises = [];
    array.forEach(item =>
        promises.push(
            actionAsync(
                arrItem2ActionParamConverter(item)
            )))
    let resultArr = await Promise.all(promises);
    return resultArr;
}