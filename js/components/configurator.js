/*
 * @author t@tabalt.net
 */

var Configurator = {
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
        return Utils.getStorage("degreeConf", true) || Configurator.defaultDegreeConf;
    },
    displayDegreeConf : function() {
		var degreeConf = Configurator.getDegreeConf();
        var th = '';
        $.each(degreeConf,function(k, v) {
            th += '<tr class="confItem">\
                    <td><span>' + v.desc + '</span> <input type="text" name="id" value="' + k + '" style="display:none;" /></td>\
                    <td><input type="text" name="buyAmount" value="' + v.buyAmount + '" class="editBox input-large" /></td>\
                </tr>';
        });
        $(th).appendTo($("#degreeConf"));
    },
    saveDegreeConf : function() {
        $("#saveDegreeConf").click(function(){
			var degreeConf = Configurator.getDegreeConf();
            var confItems = $("#degreeConf .confItem");
            for (var i = confItems.length - 1; i >= 0; i--) {
                var item = confItems[i];

                var id = $(item).find("input[name=id]").val();
                var buyAmount = $(item).find("input[name=buyAmount]").val();

                degreeConf[id].buyAmount = buyAmount;
            }
			
            Utils.setStorage("degreeConf", degreeConf);
            Alert.Success("保存成功！", 3);
        });
    },
    getLogCaptcha: function() {
        return Utils.getStorage("logCaptcha", true) || [];
    },
    clearLogCaptcha: function() {
        return Utils.setStorage("logCaptcha", []);
    },
    saveLogCaptcha: function(seed, code, src) {
        var captchas = Configurator.getLogCaptcha();
        captchas.push({
            Seed: seed,
            Code: code,
            Src: src,
            Time: Configurator.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"),

        });
        
        Utils.setStorage("logCaptcha", captchas);
        Alert.Success("保存成功！", 3);
    },
    consumeLogCaptcha: function(seed, code, src) {
        var captchas = Configurator.getLogCaptcha();
        captcha = captchas.shift();
        Utils.setStorage("logCaptcha", captchas);
        
        return captcha;
    },
    dateFormat: function(date, fmt) { 
        var o = { 
            "M+" : date.getMonth()+1,                 //月份 
            "d+" : date.getDate(),                    //日 
            "h+" : date.getHours(),                   //小时 
            "m+" : date.getMinutes(),                 //分 
            "s+" : date.getSeconds(),                 //秒 
            "q+" : Math.floor((date.getMonth()+3)/3), //季度 
            "S"  : date.getMilliseconds()             //毫秒 
        }; 
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt; 
    }
};
