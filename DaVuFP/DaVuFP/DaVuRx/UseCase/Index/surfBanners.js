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



// Rx
import {
    Observable,
    from, of, fromEvent,
    combineLatest
} from 'https://dev.jspm.io/rxjs@6/_esm2015';
import * as operators from 'https://dev.jspm.io/rxjs@6/_esm2015/operators'; 
import {ajax} from 'https://dev.jspm.io/rxjs@6/_esm2015/ajax';
export function attachSurfBannerRx() {
    let banner$ = loadBannerToRamRx();
    banner$.subscribe(bannerImgs => {
        let setDefaultBanner = (bannerImgs) => {
        $("#bannerWrapper").append(bannerImgs[0])
            cache.setCache("curBanner", 0)
        }

        let setIndicator = (num) => {
            $(".bannerIndicator").empty()
            for (let i = 0; i < num; i++) {
                $(".bannerIndicator").append("<div></div>")
            }

            $(".bannerIndicator").children().addClass("bannerIndicatorItem")
            let currentIndicator = $(".bannerIndicator").children()[0];
            currentIndicator.classList.remove('bannerIndicator')
            currentIndicator.classList.add("bannerIndicatorItemChosen")
        }

        setDefaultBanner(bannerImgs);
        setIndicator(bannerImgs.length);
    })

    let nextBannerNav$ = fromEvent($(".bannerNavigator").last(), 'click')
        .pipe(
            operators.withLatestFrom(banner$)
        )
        .subscribe(async ([navClick, bannerImgs]) => {
            let curBannerNo = cache.getCache("curBanner");
            curBannerNo = await viewNextBanner(bannerImgs, curBannerNo)
            cache.setCache("curBanner", curBannerNo);
        })

    let preBannerNav$ = fromEvent($(".bannerNavigator").first(), 'click')
        .pipe(
            operators.withLatestFrom(banner$)
        )
        .subscribe(async ([navClick, bannerImgs]) => {
            let curBannerNo = cache.getCache("curBanner");
            curBannerNo = await viewPrevBanner(bannerImgs, curBannerNo)
            cache.setCache("curBanner", curBannerNo);
        })


        

}

function loadImageRx(imgPath) {
    return Observable.create(function (obs) {
        let img = new Image()
        img.src = imgPath
        img.onload = function () {
            obs.onNext(img)
            obs.onCompleted()
        }
        img.onerror = function (err) {
            obs.onError(err)
        }
    })
}

function loadBannerToRamRx() {
    return from(getBannerAjax
        .then(loadBannersToRamAsync));
}

//https://rxviz.com/

