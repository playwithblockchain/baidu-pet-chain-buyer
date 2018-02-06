/*
 * @author t@tabalt.net
 */

chrome.browserAction.onClicked.addListener(function(){ 
     chrome.tabs.create({ url: 'index.html' });
});