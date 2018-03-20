/*
 * @author sgsp088088
 */
var Center = {
    ApiUrl: {
        Get: 'https://pet-chain.baidu.com/data/user/get',
        PetList: 'https://pet-chain.baidu.com/data/user/pet/list',
        OrderList: 'https://pet-chain.baidu.com/data/user/order/list',
        CancelSalePet : 'https://pet-chain.baidu.com/data/market/unsalePet',
        SalePet : 'https://pet-chain.baidu.com/data/market/salePet',
        GetPetById: 'https://pet-chain.baidu.com/data/pet/queryPetById'
    },

    getPetById : function(petId, modalId) {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.GetPetById,
            contentType : 'application/json',
            data: JSON.stringify({
                "appId":1,
                "nounce":null,
                "petId" : petId,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                if (res.errorNo != "00") {
                    Alert.Error("获取狗狗信息失败！！", 2);
                    return false;
                }

                var petInfo = res.data;

                var detail = '\
                    <div style="width:100%; background-color:' + petInfo.bgColor + '";>\
                        <img src="' + petInfo.petUrl + '" style="width: 29.314rem; height: 7.9855rem;"/>\
                    </div>\
                    <div style="width:100%; ">\
                        <label>所有者：</label><label>' + petInfo.userName + '</label>\
                    </div>\
                    <div>\
                        <label><h4>属性</h4></label>\
                    </div>\
                    <div>\
                        <ul class="ulList">\
                    ';
                for (var i = 0; i < petInfo.attributes.length; i++) {
                    detail += '<li class="liList">' + petInfo.attributes[i].name + '：' + petInfo.attributes[i].value;
                    if (petInfo.attributes[i].rareDegree == '稀有') {
                        detail += '<font style="margin: 10px; color: #F76707;">稀有</font></li>';
                    } else {
                        detail += '<font style="display: none;"></font></li>';
                    }
                }

                detail += '</ul></div>';

                $('#' + modalId).find('.modal-body').html(detail);
            }
        });
    },

    getMemberInfo: function() {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.Get,
            contentType : 'application/json',
            data: JSON.stringify({
                "appId":1,
                "nounce":null,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                $("#centerTitle").html("用户昵称：" + res.data.userName + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账户余额：" + res.data.amount + " 微积分");
            }
        });
    },

    getMyPetList: function(pageNo) {
        var pageSize = 20;

        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.PetList,
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
                    
                    var degree = degreeConfig[pet.rareDegree];
                    
                    th += '<tr data=' + JSON.stringify(pet) + '>\
                        <td> <input type="checkbox" />' + ((pageNo - 1) * pageSize + i + 1) + '</td>\
                        <td><img style="width:40px" src="' + pet.petUrl + '"/></td>\
                        <td>第' + pet.generation + '代</td>\
                        <td><font color="' + degree.color + '">' + degree.desc + '</font></td>\
                        <td><font color="">' + pet.amount + '</font></td>\
                        <td><input class="saleBtn" type="button" value="' + (parseFloat(pet.amount) > 0 ? "下架" : "上架") + '"/><input class="detailBtn" type="button" value="查看"/></td>\
                    </tr>';
                }

                if (pageNo == 1) {
                    $("#petsList tbody").html("");
                }

                $("#petsList tbody").append(th);

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
                        Center.getMyPetList(pageNo);
                    }, 1000);
                }
            }
        });
    },

    getMyPetOrderList: function(pageNo) {
        var pageSize = 10;

        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.OrderList,
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
                var petsOrderList = res.data.dataList || [];

                var th = '';
                for (var i = 0; i <= petsOrderList.length - 1; i++) {
                    var pet = petsOrderList[i];
                    
                    var degree = degreeConfig[pet.rareDegree];
                    
                    th += '<tr data=' + JSON.stringify(pet) + '>\
                        <td> ' + ((pageNo - 1) * pageSize + i + 1) + '</td>\
                        <td><img style="width:40px" src="' + pet.petUrl + '"/></td>\
                        <td>' + pet.transDate + '</td>\
                        <td><font color="' + (pet.status == 1 ? "red" : "") + '">' + (pet.status == 1 ? "+" : "") + (pet.amount * (pet.status == 1 ? 1 : -1)) + '</font></td>\
                        <td><input class="detailBtn" type="button" value="查看"/></td>\
                    </tr>';
                }

                /*
                if (pageNo == 1) {
                    $("#petsOrderList tbody").html("");
                }
                */

                $("#petsOrderList tbody").html("").append(th);

                /*
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
                        Center.getMyPetOrderList(pageNo);
                    }, 1000);
                }
                */
            }
        });
    },

    cancel : function(petId) {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.CancelSalePet,
            contentType : 'application/json',
            data: JSON.stringify({
                "appId":1,
                "nounce":null,
                "petId":petId,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                if (res.errorNo == "00") {
                    Alert.Success("狗狗下架成功！", 2);
                } else {
                    Alert.Error(res.errorMsg, 2);
                }
            }
        });
    },

    cancelAll : function(petIdArray) {
        for (var i = 0; i < petIdArray.length; i++) {
            var petId = petIdArray[i];

            Center.cancel(petId);
        }
    },

    sale : function(petId, amount) {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.SalePet,
            contentType : 'application/json',
            data: JSON.stringify({
                "amount": amount,
                "appId":1,
                "nounce":null,
                "petId":petId,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                if (res.errorNo == "00") {
                    Alert.Success("狗狗上架成功！", 2);
                } else {
                    Alert.Error(res.errorMsg, 2);
                }
            }
        });
    },

    batchSale : function(petIds, amount) {
        var petIdArray = petIds.split(",");
        
        for(var i = 0; i < petIdArray.length; i++) {
            var petId = petIdArray[i];

            Center.sale(petId, amount);
        }
    }
};
