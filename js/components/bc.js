/*
 * @author t@tabalt.net
 */

var BreedCenter = {
    TryToBuyChain: {},
    TryedBuyMap: {},
    Buying: false,

    ApiUrl: {
        BreedCenterList: 'https://pet-chain.baidu.com/data/market/breed/pets',
        MyBreedPetList : 'https://pet-chain.baidu.com/data/breed/petList'
    },

    breedCenterList: function(pageNo) {
        $.ajax({
            type: 'POST',
            url: BreedCenter.ApiUrl.BreedCenterList,
            contentType : 'application/json',
            dataType : "json",
            data: JSON.stringify({
                "pageNo":pageNo,
                "pageSize":10,
                "querySortType":"CREATETIME_DESC",
                "petIds":[],
                "lastAmount":null,
                "lastRareDegree":null,
                "requestId": new Date().getTime(),
                "appId":1,
                "filterCondition" : "{}",
                "lastAmount" : "",
                "lastRareDegree" : "",
                "type" : null,
                "token" : null,
                "nounce" : null,
                "timeStamp" : null,
                "tpl":""
            }),
            success:function(res){
                var petsOnSale = res.data.pets4Breed || [];

                var th = '';
                for (var i = 0; i <= petsOnSale.length - 1; i++) {
                    var pet = petsOnSale[i];
                    var degree = Configurator.getDegreeConf()[pet.rareDegree] || {desc:'未知',buyAmount:'5.00'};

                    th += '<tr data=' + JSON.stringify(pet) + '>\
                        <td>' + i + '</td>\
                        <td>' + pet.id + '</td>\
                        <td>第' + pet.generation + '代</td>\
                        <td><font color="' + degree.color + '">' + degree.desc + '</font></td>\
                        <td>' + pet.incubateTime + '</td>\
                        <td>' + pet.amount + '</font></td>\
                        <td><input name="taPetDetailBtn" type="button" value="选TA"/></td>\
                    </tr>';
                }

                $("#breedCenterTable tbody").html("").append(th);
            }
        });
    },
    
    myBreedPetList: function(pageNo) {
        var pageSize = 20;

        $.ajax({
            type: 'POST',
            url: BreedCenter.ApiUrl.MyBreedPetList,
            contentType : 'application/json',
            data: JSON.stringify({
                "appId":1,
                "nounce":null,
                "pageNo":pageNo,
                "pageSize":pageSize,
                "pageTotal":-1,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                var degreeConfig = Configurator.getDegreeConf();

                // 填充狗狗到列表
                var petsList = res.data.dataList || [];

                var th = '';
                for (var i = 0; i <= petsList.length - 1; i++) {
                    var pet = petsList[i];
		            pet["rowNum"] = i;
                    
                    var degree = degreeConfig[pet.rareDegree];
                    
                    th += '<tr data=' + JSON.stringify(pet) + '>\
                        <td>' + ((pageNo - 1) * pageSize + i + 1) + '</td>\
                        <td><img style="width:40px" src="' + pet.petUrl + '"/></td>\
                        <td>第' + pet.generation + '代</td>\
                        <td><font color="' + degree.color + '">' + degree.desc + '</font></td>\
                        <td><font color="">' + pet.amount + '</font></td>\
                        <td><input name="myPetDetailBtn" type="button" value="选TA"/></td>\
                    </tr>';
                }

                if (pageNo == 1) {
                    $("#myBreedCenterTable tbody").html("");
                }

                $("#myBreedCenterTable tbody").append(th);

                // 获取狗狗总数，判断是否需要翻页
                var dogCount = res.data.totalCount;
                var pageCount = 0;

                if (dogCount <= pageSize) {
                    pageCount = 1; // 只有一页
                } else {
                    pageCount = dogCount % pageSize > 0 ? parseInt(dogCount / pageSize) + 1 : parseInt(dogCount / pageSize);
                }

                pageNo += 1;

                if (pageNo <= pageCount) {
                    setTimeout(function(){
                        BreedCenter.myBreedPetList(pageNo);
                    }, 1000);
                }
            }
        });
    }
};
