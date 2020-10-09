import * as jQuery from '../ExternalJQLib/jquery.min.js'
import * as aJax from '../NLib/ajax.js'

function hideOBJ() {
    $(".them").hide();
}

window.onload = function () {
    hideOBJ();
    let myAjax = aJax.memoizeAjaxCall("https://jsonplaceholder.typicode.com/todos/1");
    myAjax.then(() => {

        let laterAjax = aJax.memoizeAjaxCall("https://jsonplaceholder.typicode.com/todos/1");
        laterAjax.then(console.log);
    });
}
