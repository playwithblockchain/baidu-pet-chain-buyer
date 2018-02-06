/*
 * @author t@tabalt.net
 */

var Buyer = {
    ApiUrl: {
        QueryPetsOnSale: 'https://pet-chain.baidu.com/data/market/queryPetsOnSale',
        TxnCreate: 'https://pet-chain.baidu.com/data/txn/create',
    },
    
    DegreeConf: Configurator.getDegreeConf(),

    BuyDog: function(item) {
        $.ajax({
            type: 'POST',
            url: Buyer.ApiUrl.TxnCreate,
            contentType : 'application/json',
            data: JSON.stringify({
                "petId":item.petId,
                "requestId": new Date().getTime(),
                "amount": item.amount,
                "appId":1,
                "tpl":""
            }),
            success:function(res2){
                console.log("尝试购买：ID["+item.id + "],级别[" + item.rareDegree + "],价格[" + item.amount + ']')
                console.log("命中策略：等级["+degree.desc + "],最高价格[" + degree.buyAmount + ']')
                if (res2.errorNo == 0) {
                    console.log("抢到啦！！！！！")
                } else {
                    console.log("没抢到：错误码[" + res2.errorNo + '],错误信息[' + res2.errorMsg + ']')
                }
            }
        });
    },
    ShowPetsOnSale: function(pets) {
        var th = '';
        $.each(pets, function(index, item) {
            th += '<tr>\
                    <td>' + index + '</td>\
                    <td>' + item.id + '</td>\
                    <td>' + item.petId + '</td>\
                    <td>' + item.birthType + '</td>\
                    <td>' + item.amount + '</td>\
                </tr>';

            var degree = Buyer.DegreeConf[item.rareDegree] || {};
            var buyAmount = degree.buyAmount || 5;
            if (parseFloat(item.amount) <= parseFloat(buyAmount)) {
                Buyer.BuyDog(item)
            }
        });

        $("#petsOnSale tbody").html("").append(th);
        //$(th).replaceTo($("#petsOnSale"));
    },
    start: function(){
        $.ajax({
            type: 'POST',
            url: Buyer.ApiUrl.QueryPetsOnSale,
            contentType : 'application/json',
            data: JSON.stringify({
                "pageNo":1,
                "pageSize":20,
                "querySortType":"AMOUNT_ASC",
                "petIds":[],
                "lastAmount":null,
                "lastRareDegree":null,
                "requestId": new Date().getTime(),
                "appId":1,
                "tpl":""
            }),
            success:function(res){
                var petsOnSale = res.data.petsOnSale || [];
                Buyer.ShowPetsOnSale(petsOnSale);
            }
        });
    }
};