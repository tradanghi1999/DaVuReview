import * as surfProduct from './surfProduct.js'
import * as surfBanner from './surfBanners.js'

loadAllUseCase();
export async function loadAllUseCase() {
    let productSurf = surfProduct.attachSurfProduct();
    let bannerSurf = doUseCaseAsync(surfBanner.attachSurfBanner);
    let categorySurf = doUseCaseAsync(surfProduct.attachSurfCategory);

    productSurf.then(async () => {

        cache.setCache("completePercent", 0.5);
    })
}

async function doUseCaseAsync(fn) {
    fn();
}