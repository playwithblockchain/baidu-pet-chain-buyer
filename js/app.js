/*
 * @author t@tabalt.net
 */

var apiQueryPetsOnSale = 'https://pet-chain.baidu.com/data/market/queryPetsOnSale';
var apiTxnCreate = 'https://pet-chain.baidu.com/data/txn/create';
// 请求超时时间
var timeInfo = {
    queryTimeOut: 5000,
    attempInterval: 1500,
};
var requesetInfo = {
    successBuy: 0,
    errorBuy: 0,
    totalAttempButTime: 0
}

function getBaiduDogs(success)
{
    // 等级配置
    var degreeConf = options.getDegreeConf();
    $.ajax({
        type: 'POST',
        url: apiQueryPetsOnSale,
        contentType : 'application/json',
        data: JSON.stringify({
            "pageNo":1,
            "pageSize":20,
            "querySortType":"AMOUNT_ASC",
            "petIds":[],
            "lastAmount":null,
            "lastRareDegree":null,
            "requestId" : 1517730660382,
            "appId":1,
            "tpl":""
        }),
        success:function(res){
            var petsOnSale = res.data.petsOnSale || [];
            console.clear();
            console.table(res.data.petsOnSale);
            if (typeof success === "function") {
                success(res);
            }
            $.each(petsOnSale, function(index, item){
                var degree = degreeConf[item.rareDegree] || {desc: '未知', buyAmount: 5};
                var buyAmount = degree.buyAmount || 5;
                requesetInfo.totalAttempButTime += 1;
                if (item.amount <= buyAmount) {
                    $.ajax({
                        type: 'POST',
                        url: apiTxnCreate,
                        contentType : 'application/json',
                        data: JSON.stringify({
                            "petId":item.petId,
                            "requestId" : 1517730660382,
                            "appId":1,
                            "tpl":""
                        }),
                        success:function(res2){
                            console.log("尝试购买：ID["+item.id + "],级别[" + item.rareDegree + "],价格[" + item.amount + ']')
                            console.log("命中策略：等级["+degree.desc + "],最高价格[" + degree.buyAmount + ']')
                            if (res2.errorNo == 0) {
                                requesetInfo.buy += 1;
                                console.log("抢到啦！！！！！")
                            } else {
                                requesetInfo.errorBuy += 1;
                                console.log("没抢到：错误码[" + res2.errorNo + '],错误信息[' + res2.errorMsg + ']')
                            }
                        },
                        error: function() {
                            requesetInfo.errorBuy += 1;
                        }
                    });
                }
            });
        }
    });
}
function optimizeRequest() {
    console.log("当前刷狗信息统计: " + "成功:[" + requesetInfo.successBuy + "]次, " + "失败:[" + requesetInfo.errorBuy +  "]次");
    console.log("总尝试次数: " + requesetInfo.totalAttempButTime);
    // 超时处理
    var timer = setTimeout(function() {
        optimizeRequest();
    }, timeInfo.queryTimeOut);
    setTimeout(function() {
        getBaiduDogs(function() {
            clearTimeout(timer);
            optimizeRequest();
        });
    }, timeInfo.attempInterval);
}

console.log("start get dogs....\n")
optimizeRequest();