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
            alert("保存成功");
        });
    },
};
