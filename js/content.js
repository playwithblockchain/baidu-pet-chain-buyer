// 接收popup.js的消息
chrome.extension.onMessage.addListener(
  	function(request, sender, sendResponse) {
    	if(request.cmd == "run") {
			run();
			sendResponse({status:1}); 
		}
});

function run(){
	var defaultDegreeConf = [{
	        desc: '普通',
	        buyAmount: 100,
	        saleAmount: 0,
	    },{
	        desc: '稀有',
	        buyAmount: 100,
	        saleAmount: 0,
	    },{
	        desc: '卓越',
	        buyAmount: 100,
	        saleAmount: 0,
	    },{
	        desc: '史诗',
	        buyAmount: 100,
	        saleAmount: 0,
	    },{
	        desc: '神话',
	        buyAmount: 100,
	        saleAmount: 0,
	    },{
	        desc: '传说',
	        buyAmount: 100,
	        saleAmount: 0,
	    }];
	
	chrome.extension.sendMessage({cmd:"get_config"}, function (response) {
		var degreeConf = response.data;
		if(degreeConf == '') {
			degreeConf = defaultDegreeConf;
		}
		console.log("start get dogs....\n")
		setInterval(function(){
			getBaiduDogs(degreeConf);
		}, 3000);

	}); 
	
}
