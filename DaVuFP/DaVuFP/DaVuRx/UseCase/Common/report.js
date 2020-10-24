import * as cache from '../../UtilAsFramework/cache.js'
import * as jQuery from '../../Framework/jquery.min.js'

export function renderReportedProcess() {
    let percent = cache.getCache("completePercent");
    $(".loadingPercentorIndicator").width = percent;

    if (percent == 1)
        $(".loadingPercentor").hide();
    else
        renderReportedProcess();
}