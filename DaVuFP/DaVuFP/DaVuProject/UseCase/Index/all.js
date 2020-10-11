import * as surfProduct from './surfProduct.js'
import * as surfBanner from './surfBanners.js'

loadAllUseCase();
export async function loadAllUseCase() {
    let productSurf = doUseCaseAsync(surfProduct.attachSurfProduct);
    let bannerSurf = doUseCaseAsync(surfBanner.attachSurfBanner);
    let categorySurf = doUseCaseAsync(surfProduct.attachSurfCategory);
}

async function doUseCaseAsync(fn) {
    fn();
}