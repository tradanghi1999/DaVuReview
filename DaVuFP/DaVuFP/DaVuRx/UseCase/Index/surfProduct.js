import * as jQuery from '../../Framework/jquery.min.js'
import * as ram from '../../UtilAsFramework/ram.js'
import * as prom from '../../UtilAsFramework/promise.js'
import * as aJax from '../../DataAPI/ajax.js'
import * as utils from '../../UtilAsFramework/utils.js'
import * as pipeln from '../../UtilAsFramework/pipeln.js'
import * as beautify from '../../UtilAsFramework/beautify.js'
import * as cache from '../../UtilAsFramework/cache.js'

let rootPage = 'https://davuflower.github.io/';
let imageRoot = rootPage + 'data';


//get raw data

let getProductAjax = aJax.ajaxCall(rootPage + 'data/data_sanpham.json');
let getGiftCategoryAjax = aJax.ajaxCall(rootPage + 'data/data_quatangkem.json');
let getCategoryAjax = aJax.ajaxCall(rootPage + 'data/data_homepage.json');


//attachSurfProduct();

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



    let confirmLoaded = async (grids) => {
        $(".preload").removeClass("preload");
        return grids;
    }
    let appendGridToHTML = async (grids) => {
        grids.forEach(
            grd => $('.body').append(grd))
        return grids;
    }

    let beautifyRender = async (grids) => {
        return await prom.arrayDoingAsync(
            grids,
            (grd) => beautify.beautifyAsync(
                grd,
                'gridContent',
                'item',
                '<div class="bufferItem"></div>'
            ),
            null
        )
    }

    let cacheMemory = async (grids) => {
        await cache.setCache("grids", grids);
        return grids;
    }

    let removeProto = async (grids) => {
        $("#cateProto").hide();
        return grids;
    }
    

    //gridPipe.then(
    //    (grids) => {
    //        pipeln.endPipe(grids,
    //            confirmLoaded,
    //            appendGridToHTML,
    //            beautifyRender,
    //            cacheMemory,
    //            removeProto
    //        )
    //    })

    gridPipe
        .then(confirmLoaded)
        .then(appendGridToHTML)
        .then(cacheMemory)
        .then(removeProto)
        //.then(beautifyRender)

    window.onresize = async function () {
        $(".preload").removeClass("preload");
        $(".bufferItem").remove();

        let grids =  cache.getCache("grids")
        await prom.arrayDoingAsync(
            grids,
            (grd) => beautify.beautifyAsync(
                grd,
                'gridContent',
                'item',
                '<div class="bufferItem"></div>'
            ),
            null
        )

    }

    return gridPipe;
}

//
export function attachSurfCategory() {
    addClickToCategories();
}

async function addClickToCategories() {
    let grids;
    while ((grids = cache.getCache("grids")) == null) {
        await utils.sleep(200);
    }

    prom.arrayDoingAsync(
        grids,
        async (grid) =>
        {
            let title = grid.find(".gridTitle").text()
            let gridTitle = grid.find(".gridTitle");
            return await addClickToCategory(gridTitle, title)
        },
        null
    )

}

let categoryRootLink = "category.html?title=" 
async function addClickToCategory(gridTitle, title) {

    gridTitle.on("click", function () {
        let url = categoryRootLink + title;
        goToUrl(url);
    })

    return gridTitle;
}

function goToUrl(hrefL) {
    location.href = (hrefL);
}


//load raw data to ram

async function loadImgsToRamAsync(imgRaws, imgRaw2ParamConverter) {
    return await prom.arrayDoingAsync(
        imgRaws,
        ram.loadImgAsync,
        imgRaw2ParamConverter
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

//Rx

import {
    
    Observable,
    from, of, fromEvent,
    combineLatest, concat, forkJoin, zip
} from 'https://dev.jspm.io/rxjs@6/_esm2015';
import * as operators from 'https://dev.jspm.io/rxjs@6/_esm2015/operators';
import { ajax } from 'https://dev.jspm.io/rxjs@6/_esm2015/ajax';

export function attachSurfProductRx() {
    let catPipe = getCategoryAjax;
    let productPipe = getProductAjax
    let giftPipe = getGiftCategoryAjax

    //Rx

    let product$ = from(productPipe)
        

    let gift$ = from(giftPipe)
        

    let image$ = forkJoin(
        product$.pipe(
            operators.flatMap(loadProductToRamAsync)
        ),
        gift$.pipe(
            operators.flatMap(loadGiftToRamAsync)
        ))
        .pipe(
            operators.map(([productImgs, giftImgs]) =>
                [...productImgs, ...giftImgs]),
            
    )
        

    let item$ = image$.pipe(
        operators.withLatestFrom(product$, gift$),
        //operators.withLatestFrom(gift$),
        operators.flatMap(async ([imgs, products, gifts]) => {
                
            

            let rdrProducts = await 
                renderAllItemInProductAsync(products, imgs) //,
            let rdrGifts = await renderAllItemInGiftAsync(gifts, imgs)
            

            let rdrItems = [...rdrProducts, ...rdrGifts];
            return rdrItems
        })
    )
        //.subscribe(console.log)
    


    //let imagePipe =
    //    pipeln.combineAsync(
    //        productPipe
    //            .then(loadProductToRamAsync),
    //        giftPipe.then(loadGiftToRamAsync)
    //    )

    //productPipe =
    //    pipeln.combinePipeAsync(
    //        renderAllItemInProductAsync,
    //        productPipe,
    //        imagePipe);

    //giftPipe =
    //    pipeln.combinePipeAsync(
    //        renderAllItemInGiftAsync,
    //        giftPipe,
    //        imagePipe);

    //let itemPipe = pipeln.combineAsync(productPipe, giftPipe);
    //let gridPipe = pipeln.combinePipeAsync(
    //    renderDataAsync,
    //    itemPipe,
    //    catPipe)

    let confirmLoaded = async (grids) => {
        $(".preload").removeClass("preload");
        return grids;
    }
    let appendGridToHTML = async (grids) => {
        grids.forEach(
            grd => $('.body').append(grd))
        return grids;
    }

    let beautifyRender = async (grids) => {
        return await prom.arrayDoingAsync(
            grids,
            (grd) => beautify.beautifyAsync(
                grd,
                'gridContent',
                'item',
                '<div class="bufferItem"></div>'
            ),
            null
        )
    }

    let cacheMemory = async (grids) => {
        await cache.setCache("grids", grids);
        return grids;
    }

    let removeProto = async (grids) => {
        $("#cateProto").hide();
        return grids;
    }


    //let grid$ = from(gridPipe)
    //    .pipe(
    //        operators.map(grids =>
    //            grids.map(attachSurfGroupRx)
    //        )
    //    )

    let cat$ = from(catPipe)
    let grid$ = item$.pipe(
        operators.withLatestFrom(cat$),
        operators.flatMap(async ([items, cats]) => {
                let grids = await renderDataAsync(items, cats)
                return grids
        }),
        operators.map(grids =>
                grids.map(attachSurfGroupRx)
            )
    )
    

    
        

    
            

    grid$.subscribe(async grids => {
        //await console.log(grids)

        await confirmLoaded(grids)
        await appendGridToHTML(grids)
        //await cacheMemory(grids)
        await beautifyRender(grids)
        await removeProto(grids)
        await attachSurfProductDetailToAll()
    })



    
    //fromEvent(window,'resize')
    //.pipe(
    //    operators.withLatestFrom(grid$)
    //)
    //.subscribe(async ([docClick, grids]) => {
    //    $(".preload").removeClass("preload");
    //    $(".bufferItem").remove();

    //    //let grids = cache.getCache("grids")
    //    await prom.arrayDoingAsync(
    //        grids,
    //        (grd) => beautify.beautifyAsync(
    //            grd,
    //            'gridContent',
    //            'item',
    //            '<div class="bufferItem"></div>'
    //        ),
    //        null
    //    )
    //})        
}



function attachSurfGroupRx(grid) {
    let gridTitle = grid.find(".gridTitle");
    let title = gridTitle.text();
    gridTitle.on("click", function () {
        goToUrl(categoryRootLink + title)
    })
    return grid;
}

let productRootLink = "product.html?id="
function attachSurfProductDetail(item) {
    let itemId = $(item).find(".itemId").text();
    let itemName = $(item).find(".itemName");
    itemName.on("click", function () {
        goToUrl(productRootLink + encodeURIComponent(itemId));
    })
}

async function attachSurfProductDetailToAll() {

    let items = $(".item").toArray()
    .filter(
        item => {
            let itemId = $(item).find(".itemId").text();
            return itemId.includes("#")
        }
    )

    items.forEach(item => attachSurfProductDetail(item));
}


















