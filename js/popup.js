$(function(){
    $("#startBuyer").click(function(){
        var bg = chrome.extension.getBackgroundPage();
        bg.run && bg.run();
    });
});