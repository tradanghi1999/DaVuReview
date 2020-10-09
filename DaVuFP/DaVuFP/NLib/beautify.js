
import * as jQuery from './jquery.min.js'
export function countItemOnRowAbstract(parentTag, childTag) {

    var gridContents = document.getElementsByClassName(parentTag);
    var gridContent;
    if (gridContents.length > 1)
        gridContent = gridContents[1];
    else
        gridContent = gridContent[0];
    var item = gridContent.getElementsByClassName(childTag)[0];
    var itemRect = item.getBoundingClientRect();
    var gridContentRect = gridContent.getBoundingClientRect();

    var numberOfItemOnRow = (Math.floor(gridContentRect.width / itemRect.width));


    var spaceBetweenItems = (gridContentRect.width - numberOfItemOnRow * itemRect.width) / (numberOfItemOnRow - 1);
    var spaceRate = spaceBetweenItems / gridContentRect.width;

    return numberOfItemOnRow;
}

export async function beautifyAsyncAbstract(mGrid, parentTag, childTag, htmlString) {

    var itemsLength = mGrid.find(parentTag).children().length;
    var onRow = countItemOnRowAbstract(parentTag, childTag);

    var bufferLength = onRow - itemsLength % onRow;
    if (bufferLength == onRow) bufferLength = 0;

    for (var i = 0; i < bufferLength; i++) {

        mGrid.find(parentTag).append($(htmlString));
    }
    return (mGrid.find(parentTag));

}

function beautifySyncAbstract(mGrid, parentTag, childTag, htmlString) {
    var itemsLength = $(mGrid).find(parentTag).children().length;
    var onRow = countItemOnRowAbstract(parentTag, childTag);

    var bufferLength = onRow - itemsLength % onRow;
    if (bufferLength == onRow) bufferLength = 0;
    for (var i = 0; i < bufferLength; i++) {

        $(mGrid).find(parentTag).append($(htmlString));
    }
}