/*
 * @author t@tabalt.net
 */

chrome.browserAction.onClicked.addListener(function(){ 
    chrome.tabs.executeScript(null, {file: "js/jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "js/app.js"});
});
