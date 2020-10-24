import * as surfProduct from './surfProduct.js'
import * as surfBanner from './surfBanners.js'
import * as common from '../Common/all.js'
import * as cache from '../../UtilAsFramework/cache.js'
import * as jQuery from '../../Framework/jquery.min.js'
import * as utils from '../../UtilAsFramework/utils.js'

loadAllUseCase();
export async function loadAllUseCase() {

    cache.setCache("completePercent", 0.1);

    let productSurf = surfProduct.attachSurfProduct();
    let bannerSurf = surfBanner.attachSurfBanner();
    let categorySurf = surfProduct.attachSurfCategory();
    let commonUseCase = doUseCaseAsync(common.loadAllCommonUseCase);



    productSurf.then(async (grids) => {
        increasePercent(0.5)
        surfProduct.attachClickProductsName()
    })
    bannerSurf.then(async (banners) => increasePercent(0.3))
    categorySurf.then(async (cate) => increasePercent(0.1))
    //bannerSurf.then(increasePercent(0.3))
    


    async function increasePercent(percentToIncrease) {
        let percent = cache.getCache("completePercent")
        percent = percent + percentToIncrease
        cache.setCache("completePercent", percent)
    }


}

async function doUseCaseAsync(fn) {
    fn();
}