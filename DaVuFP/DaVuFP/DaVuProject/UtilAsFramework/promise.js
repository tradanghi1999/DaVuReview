export async function arrayDoingAsync(array, actionAsync, arrItem2ActionParamConverter) {
    let promises = [];

    if (arrItem2ActionParamConverter != null)
        array.forEach(item =>
            promises.push(
                actionAsync(
                    arrItem2ActionParamConverter(item)
                )))
    else
        array.forEach(item =>
            promises.push(
                actionAsync(
                    item
                )))

    let resultArr = await Promise.all(promises);
    return resultArr;
}