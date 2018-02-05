$(function(){
    $("#startBuyer").click(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){  
		    chrome.tabs.sendMessage(tabs[0].id, {cmd:"run"}, function(response) {  
				console.log(response);
		    });
		});  
    });
});