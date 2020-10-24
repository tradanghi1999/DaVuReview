
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
let getBannerAjax = aJax.ajaxCall("Data/banner.json");

//attachSurfBanner()

export function attachSurfBanner() {
    

    let cacheBanners = async (bannerImgs) => {
        cache.setCache("banners", bannerImgs)
        return bannerImgs;
    }

    let setDefaultBanner = async (bannerImgs) => {
        $("#bannerWrapper").append(bannerImgs[0]);
        cache.setCache("curBanner", 0);
        return bannerImgs;
    }

    let setPreBannerClick = async (bannerImgs) => {
        $(".bannerNavigator").first().on("click", async function () {

            let curBannerNo = cache.getCache("curBanner");
            curBannerNo = await viewPrevBanner(bannerImgs, curBannerNo)
            cache.setCache("curBanner", curBannerNo);
        })
        return bannerImgs;
    }

    let setNextBannerClick = async (bannerImgs) => {
        $(".bannerNavigator").last().on("click", async function () {
            let curBannerNo = cache.getCache("curBanner");
            curBannerNo = await viewNextBanner(bannerImgs, curBannerNo)
            cache.setCache("curBanner", curBannerNo);
            
        })
        return bannerImgs;
    }
    let bannerPipe = getBannerAjax
        .then(loadBannersToRamAsync)
        .then(cacheBanners)
        .then(setDefaultBanner)
        .then(setPreBannerClick)
        .then(setNextBannerClick)

    return bannerPipe;
}



async function viewNextBanner(bannerImgs, curBannerNo) {
    $("#bannerWrapper").text(null);
    
    $(".bannerIndicator").children().removeClass();
    $(".bannerIndicator").children().addClass("bannerIndicatorItem")

    if (curBannerNo == bannerImgs.length - 1) {
        curBannerNo = 0;
    }
    else {
        curBannerNo++;
    }
    $("#bannerWrapper").append(bannerImgs[curBannerNo]);
    let currentIndicator = $(".bannerIndicator").children()[curBannerNo];
    currentIndicator.classList.add("bannerIndicatorItemChosen")

    return curBannerNo;
}

async function viewPrevBanner(bannerImgs, curBannerNo) {
    $("#bannerWrapper").text(null);
    $(".bannerIndicator").children().removeClass();
    $(".bannerIndicator").children().addClass("bannerIndicatorItem")

    if (curBannerNo == 0) {
        curBannerNo = bannerImgs.length - 1;
    }
    else {
        curBannerNo--;
    }
    $("#bannerWrapper").append(bannerImgs[curBannerNo]);

    let currentIndicator = $(".bannerIndicator").children()[curBannerNo];
    currentIndicator.classList.add("bannerIndicatorItemChosen")

    return curBannerNo;
}

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
