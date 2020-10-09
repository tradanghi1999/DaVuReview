
import * as jQuery from '../../Framework/jquery.min.js'
import * as ram from '../../UtilAsFramework/ram.js'
import * as prom from '../../UtilAsFramework/promise.js'
import * as aJax from '../../DataAPI/ajax.js'

let rootPage = 'https://davuflower.github.io/';
let imageRoot = rootPage + 'data';


//get raw data

let getProductAjax = aJax.ajaxCall(rootPage + 'data/data_sanpham.json');
let getGiftCategoryAjax = aJax.ajaxCall(rootPage + 'data/data_quatangkem.json');
let getCategoryAjax = aJax.ajaxCall(rootPage + 'data/data_homepage.json');
let getBannerAjax = aJax.ajaxCall("banner.json");

let bannerPipe = getBannerAjax
    .then(loadBannersToRamAsync)
    .then(console.log)

//load raw data to ram

async function loadBannersToRamAsync(banners) {
    return await prom.arrayDoingAsync(
        banners,
        loadImgAsync,
        (bn) => rootPage + bn.link
    )
}

async function loadProductToRamAsync(products) {

    let productsLength = products.length;
    let imgPromises = [];
    for (let i = 0; i < productsLength; i++) {
        imgPromises.push(
            loadImgAsync(imageRoot + products[i].imgLink)
        )}

    let productImgs = await Promise.all(imgPromises);
    return productImgs;
}


async function loadGiftToRamAsync(gifts) {
    var giftLength = gifts.length;
    var giftPromises = [];
    for (var i = 0; i < giftLength; i++) {
        giftPromises.push(
            loadImgAsync(imageRoot + gifts[i].imgLink)
        )
    }

    let imgs = await Promise.all(giftPromises);
    return imgs;
}

// render data in ram
// render level 0
async function renderItemAsync(products, gifts, imgs, itemId) {
    let item = await getItemDataAsync(itemId, products, gifts);
    let [img, itemProto] = await
        Promise.all([
            getImgAsync(item.imgLink, imgs),
            getItemProtoAsync()
        ]);

    itemProto.find(".itemId").text(item.id);
    itemProto.find(".itemName").text(item.title);
    itemProto.find(".itemPrice").text(item.price);

    itemProto.find(".itemImg").text(null);
    let imgDiv = itemProto.find(".itemImg");
    imgDiv.append(img);
    return (itemProto);

}

// render level 1
async function renderProductAsync(product, imgs) {
    let [img, itemProto] = await
        Promise.all([
            getImgAsync(product.imgLink, imgs),
            getItemProtoAsync()
        ]);

    itemProto.find(".itemId").text(product.id);
    itemProto.find(".itemName").text(product.title);
    itemProto.find(".itemPrice").text(product.price);

    itemProto.find(".itemImg").text(null);
    itemProto.find(".itemImg").append(img);

    return (itemProto);
}

async function renderGiftAsync(gift, imgs) {

    let [img, itemProto] =
        await Promise.all([getImgAsync(gift.imgLink, imgs), getItemProtoAsync()]);

    itemProto.find(".itemId").text(gift.id);
    itemProto.find(".itemName").text(gift.title);
    itemProto.find(".itemPrice").text(gift.price);

    itemProto.find(".itemImg").text(null);
    itemProto.find(".itemImg").append(img);

    return (itemProto);

}

// render level 2
async function renderAllItemInProductAsync(products, imgs) {
    let productPromises = [];
    products.forEach(x =>
        productPromises.push(
            renderProductAsync(x, imgs)
        ))
    let productRenderedN = await Promise.all(productPromises);
    return productRenderedN;
}

async function renderAllItemInGiftAsync(gifts, imgs) {
    let giftPromises = [];
    gifts.forEach(
        x => giftPromises.push(renderGiftAsync(x, imgs)))
    return await Promise.all(giftPromises)
}
// render level 3
async function renderCategoryWithRenderDataAsync(items, category) {
    let catProto = await getCategoryProto()
    catProto.find(".gridTitle").text(category.title);
    catProto.find('.gridContent').text(null);

    let itemPromises = [];
    category.items.forEach(x => {
        itemPromises.push(getItemOnId(x, items));
    })

    let itemRenderN = await Promise.all(itemPromises);
    itemRenderN.forEach(x => {
        let gridContent = catProto.find('.gridContent');
        gridContent.append(x);
    })
    return catProto;
}
// render level 4
async function renderDataAsync(items, categories) {
    let categoryPromises = [];
    categories.forEach(
        x => categoryPromises.push(
            renderCategoryWithRenderDataAsync(items, x)
        ))

    let categoryRendereds = await Promise.all(categoryPromises);
    return categoryRendereds
}




