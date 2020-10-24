import * as report from './report.js'

export function loadAllCommonUseCase() {
    let reportProcess = doUseCaseAsync(report.renderReportedProcess)
}

export function loadAllCompleted() {
    let complete = doUseCaseAsync(report.renderCompleted);
}

async function doUseCaseAsync(fn) {
    fn();
}