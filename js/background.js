/*
 * @author t@tabalt.net
 */

function run() {
    chrome.tabs.executeScript(null, {file: "js/jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "js/utils.js"});
    chrome.tabs.executeScript(null, {file: "js/options.js"});
    chrome.tabs.executeScript(null, {file: "js/app.js"});
}

// chrome.browserAction.onClicked.addListener(function(){ 
//     run();
// });

