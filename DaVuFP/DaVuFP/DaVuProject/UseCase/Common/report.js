import * as cache from '../../UtilAsFramework/cache.js'
import * as jQuery from '../../Framework/jquery.min.js'
import * as utils from '../../UtilAsFramework/utils.js'

export async function renderReportedProcess() {
    let percent = cache.getCache("completePercent") * 100 + "%";
    $(".loadingPercentorIndicator").width(percent);
    //console.log(percent);
    

    if (percent != "100%") {
        await utils.sleep(500)
        await renderReportedProcess();
    }
    else {
        renderCompleted()
    }
        
        
        
}

export function renderCompleted() {
    $(".loadingPercentor").hide();
}