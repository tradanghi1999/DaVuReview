import * as report from './report.js'

export function loadAllCommonUseCase() {
    let reportProcess = doUseCaseAsync(report.renderReportedProcess)
}

async function doUseCaseAsync(fn) {
    fn();
}