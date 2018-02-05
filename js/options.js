var options = {
    defaultDegreeConf: [{
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
    }],
    getDegreeConf : function() {
        return utils.getStorage("degreeConf", true) || options.defaultDegreeConf;
    },
    displayDegreeConf : function() {
        var degreeConf = options.getDegreeConf();
        var th = '';
        $.each(degreeConf,function(k, v) {
            th += '<tr class="confItem">\
                    <td><span>' + v.desc + '</span> <input type="text" name="id" value="' + k + '" class="hide" /></td>\
                    <td><input type="text" name="buyAmount" value="' + v.buyAmount + '" class="editBox input-large" /></td>\
                </tr>';
        });
        $(th).appendTo($("#degreeConf"));
    },
    saveDegreeConf : function() {
        $("#saveDegreeConf").click(function(){
            var degreeConf = options.getDegreeConf();
            var confItems = $("#degreeConf .confItem");
            for (var i = confItems.length - 1; i >= 0; i--) {
                var item = confItems[i];

                var id = $(item).find("input[name=id]").val();
                var buyAmount = $(item).find("input[name=buyAmount]").val();

                degreeConf[id].buyAmount = buyAmount;
            }

            //utils.setStorage("degreeConf", degreeConf);
            //alert("保存成功");
			saveConfig(degreeConf)
        });
    },
};

/*加载配置*/
function getConfig(){
	chrome.extension.sendMessage({cmd:"get_config"}, function (response) {
		var data = response.data;
		console.log(data);
	});
}

/*保存配置*/
function saveConfig(data){
	chrome.extension.sendMessage({cmd:"save_config",data:data}, function (response) {
		if(response.status == 1) {
			alert('保存成功');
		}
	});
}

$(function(){
	getConfig();
    options.displayDegreeConf(); 
    options.saveDegreeConf(); 
});