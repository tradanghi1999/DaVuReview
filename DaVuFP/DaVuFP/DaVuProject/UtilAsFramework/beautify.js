
import * as jQuery from '../Framework/jquery.min.js'
import * as fp from './fp.js'
export async function countItemOnRow(parentTag, childTag) {

    let gridContents = document.getElementsByClassName(parentTag);
    let gridContent;
    if (gridContents.length > 1)
        gridContent = gridContents[1];
    else
        gridContent = gridContent[0];
    let item = gridContent.getElementsByClassName(childTag)[0];
    let itemRect = item.getBoundingClientRect();
    let gridContentRect = gridContent.getBoundingClientRect();

    let numberOfItemOnRow = (Math.floor(gridContentRect.width / itemRect.width));

    let spaceBetweenItems = (gridContentRect.width - numberOfItemOnRow * itemRect.width) / (numberOfItemOnRow - 1);
    let spaceRate = spaceBetweenItems / gridContentRect.width;

    return numberOfItemOnRow;
}

export async function beautifyAsync(mGrid, parentTag, childTag, htmlString) {

    let parentTagInJquery = "." + parentTag;
    let mGridContent = mGrid
        .find(parentTagInJquery); 

    

    let itemsLength = mGridContent
        .children().length;

    
    let bufferLength = await getBufferLength(
        await countItemOnRow(
            parentTag, childTag),
        itemsLength);

    fp.loopWithTimes(
        () => mGridContent.append($(htmlString)),
        bufferLength
    )
}

async function getBufferLength(onRow, itemsLength) {
    let bufferLength = onRow - itemsLength % onRow;
    if (bufferLength == onRow) bufferLength = 0;
    return bufferLength;
}

export function beautifySync(mGrid, parentTag, childTag, htmlString) {

    var itemsLength = mGrid.children(parentTag).children().length;
    var onRow = countItemOnRow(parentTag, childTag);

    var bufferLength = onRow - itemsLength % onRow;
    if (bufferLength == onRow) bufferLength = 0;
    for (var i = 0; i < bufferLength; i++) {

        $(mGrid).find(parentTag).append($(htmlString));
    }
}