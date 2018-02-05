chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if(request.cmd == 'save_config') {
		saveConfigData(request.data);
		sendResponse({status:1});
	} else if(request.cmd == 'get_config') {
		var data = getConfigData();
		sendResponse({data:data});
	}
});

// 保存配置
function saveConfigData(data) {
	var string = JSON.stringify(data);
	localStorage.setItem("baidu_pet_chain_config", string);
}

// 获取配置
function getConfigData() {
	var string = JSON.stringify(data);
	var string = localStorage.getItem("baidu_pet_chain_config");
	if(string == null || string == "") {
		return '';
	}
	var data = JSON.parse(string)
	return data;
}
