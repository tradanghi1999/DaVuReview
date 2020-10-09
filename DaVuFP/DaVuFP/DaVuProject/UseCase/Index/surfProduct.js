
import * as jQuery from '../../Framework/jquery.min.js'
import * as ram from '../../UtilAsFramework/ram.js'
import * as prom from '../../UtilAsFramework/promise.js'
import * as aJax from '../../DataAPI/ajax.js'
import * as utils from '../../UtilAsFramework/utils.js'
import * as pipeln from '../../UtilAsFramework/pipeln.js'
import * as beautify from '../../UtilAsFramework/beautify.js'

let rootPage = 'https://davuflower.github.io/';
let imageRoot = rootPage + 'data';


//get raw data

let getProductAjax = aJax.ajaxCall(rootPage + 'data/data_sanpham.json');
let getGiftCategoryAjax = aJax.ajaxCall(rootPage + 'data/data_quatangkem.json');
let getCategoryAjax = aJax.ajaxCall(rootPage + 'data/data_homepage.json');
let getBannerAjax = aJax.ajaxCall("Data/banner.json");

attachSurfProduct();

//
export function attachSurfProduct() {
    let catPipe = getCategoryAjax;
    let productPipe = getProductAjax
    let giftPipe = getGiftCategoryAjax

    let imagePipe =
        pipeln.combineAsync(
            productPipe
                .then(loadProductToRamAsync),
            giftPipe.then(loadGiftToRamAsync)
        )

    productPipe =
        pipeln.combinePipeAsync(
            renderAllItemInProductAsync,
            productPipe,
            imagePipe);

    giftPipe =
        pipeln.combinePipeAsync(
            renderAllItemInGiftAsync,
            giftPipe,
            imagePipe);

    let itemPipe = pipeln.combineAsync(productPipe, giftPipe);
    let gridPipe = pipeln.combinePipeAsync(
        renderDataAsync,
        itemPipe,
        catPipe)

    gridPipe.then(
        (grids) => {
            pipeln.endPipe(grids,
                () => {
                    $(".preload").removeClass("preload");
                },
                (grids) => {
                    grids.forEach(
                        grd => $('.body').append(grd))
                    prom.arrayDoingAsync(
                        grids,
                        async (grd) =>
                            beautify.beautifyAsync(
                                grd,
                                'gridContent',
                                'item',
                                '<div class="bufferItem"></div>'
                            )

                    )
                }
                    
            )
        })
}



//load raw data to ram

async function loadImgsToRamAsync(imgRaws, imgRaw2ParamConverter) {
    return await prom.arrayDoingAsync(
        imgRaws,
        ram.loadImgAsync,
        imgRaw2ParamConverter
    )
}

async function loadBannersToRamAsync(banners) {
    return await loadImgsToRamAsync(
        banners,
        (bn) => rootPage + bn.link
    )
}

async function loadProductToRamAsync(products) {
    return await loadImgsToRamAsync(
        products,
        (pd) => imageRoot + pd.imgLink
    )
}


async function loadGiftToRamAsync(gifts) {
    return await loadImgsToRamAsync(
        gifts,
        (gf) => imageRoot + gf.imgLink
    )
}

// render data in ram
// render level 1
async function renderItemAsync(item, imgs){
    let [img, itemProto] = await
        Promise.all([
            utils.getImgAsync(item.imgLink, imgs),
            getItemProtoAsync()
        ]);

    itemProto.find(".itemId").text(item.id);
    itemProto.find(".itemName").text(item.title);
    itemProto.find(".itemPrice").text(item.price);

    itemProto.find(".itemImg").text(null);
    itemProto.find(".itemImg").append(img);

    return (itemProto);
}
async function renderProductAsync(product, imgs) {
    return await renderItemAsync(product, imgs);
}

async function renderGiftAsync(gift, imgs) {
    return await renderItemAsync(gift, imgs);
}
// render level 2
async function renderAllItemInProductAsync(products, imgs) {
    return await prom.arrayDoingAsync(
        products,
        async (pd) => {
            return await renderProductAsync(pd, imgs)
        },
        null
    )
}

async function renderAllItemInGiftAsync(gifts, imgs) {
    return await prom.arrayDoingAsync(
        gifts,
        async (gf) => {
            return await renderGiftAsync(gf, imgs)
        },
        null
    )
}
// render level 3
async function renderCategoryWithRenderDataAsync(items, category) {
    let catProto = await getCategoryProto()
    let catTile = catProto.find(".gridTitle")
    let catContent = catProto.find('.gridContent')

    catTile.text(category.title);

    let itemRendereds = await prom.arrayDoingAsync(
        category.items,
        async (x) => {
            return await getItemOnId(x, items)
        },
        null
    )
    catContent.text(null);
    itemRendereds.forEach(x => catContent.append(x))

    return catProto;
}
// render level 4
async function renderDataAsync(items, categories) {
    return await prom.arrayDoingAsync(
        categories,
        async (cate) => {
            return await renderCategoryWithRenderDataAsync(items, cate)
        },
        null
    )   
}

//find
async function getItemDataAsync(id, products, gifts) {

    await products.forEach(x => {
        if (x.id == id)
            return (Object.assign({}, x));
    })

    await gifts.forEach(x => {
        if (x.id == id)
            return (Object.assign({}, x));
    })
}

function getItemOnId(mId, items) {
    return new Promise(
        resolve => {
            items.forEach(x => {

                if (x.find(".itemId").text() == mId) {
                    var itemClone = x.clone();
                    resolve(itemClone);
                }

            });
        })

}

// state function
async function getCategoryProto() {
    return await ram.getProto("#cateProto")
}

async function getItemProtoAsync() {
    return await ram.getProto("#itemProto")
}





