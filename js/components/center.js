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
        BreedPet : 'https://pet-chain.baidu.com/data/market/breed/shelf',
        CancelBreedPet : 'https://pet-chain.baidu.com/data/market/breed/offShelf',
        GetPetById: 'https://pet-chain.baidu.com/data/pet/queryPetById'
    },

    getPetById : function(petId, selector) {
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
                var degree = Configurator.getDegreeConf()[petInfo.rareDegree];

                var detail = '\
                    <div style="width:100%; background-color:' + petInfo.bgColor + '";>\
                        <img src="' + petInfo.petUrl + '" style="width: 29.314rem; height: 7.9855rem;"/>\
                        <div style="position: relative; top: -1px; display: inline-block;">\
                            <i style="display: inline-block; height: 1.1rem; padding: 0 .1691rem; color: #fff; -webkit-border-radius: .0725rem; border-radius: .2725rem;\
                                        font-size: .2899rem; margin-right: 2px; -webkit-box-sizing: border-box; box-sizing: border-box; line-height: 1.1rem;background:#F76707;width: 2.5rem;\
                                        text-align: center;">' + petInfo.rareDegree + '</i>\
                            <i style="display: inline-block; height: 1.1rem; padding: 0 .1691rem; color: #fff; -webkit-border-radius: .0725rem; border-radius: .2725rem;\
                                        font-size: .2899rem; margin-right: 2px; -webkit-box-sizing: border-box; box-sizing: border-box; line-height: 1.1rem;background:#F76707;width: 2.5rem;\
                                        text-align: center;">第' + petInfo.generation + '代</i>\
                        </div>\
                    </div>\
                    <div style="width:100%; ">\
                        <label>所有者：</label><label><font style="margin: 10px; color: #F76707;">' + petInfo.userName + '</font></label>\
                        <label>休息时间：</label><label><font style="margin: 10px; color: #F76707;">' + petInfo.coolingInterval + '</font></label>\
                        <label>可否繁育：</label><label><font style="margin: 10px; color: #F76707;">' + (petInfo.isCooling ? "正在休息" : "可以繁育") + '</font></label>\
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

                $(selector).html(detail);
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
            pet["rowNum"] = i;

                    var degree = degreeConfig[pet.rareDegree];

                    th += '<tr data=' + JSON.stringify(pet) + '>\
                        <td> <input type="checkbox" />' + ((pageNo - 1) * pageSize + i + 1) + '</td>\
                        <td><img style="width:40px" src="' + pet.petUrl + '"/></td>\
                        <td>第' + pet.generation + '代</td>\
                        <td><font color="' + degree.color + '">' + degree.desc + '</font></td>\
                        <td><font color="">' + pet.amount + '</font></td>\
                        <td><input class="saleBtn" type="button" value="' + (parseFloat(pet.amount) > 0 && pet.shelfStatus == 1 ? "下架" : "上架") + '" '+ (pet.shelfStatus == 2 || pet.lockStatus == 1 ? "disabled" : "") +'/><input class="breedBtn" type="button" value="'+ (pet.shelfStatus !=2 ? pet.coolingInterval != "0分钟" ? "休息中" : "繁育" : "取消繁育")  +'" '+ ((parseFloat(pet.amount) > 0 && pet.shelfStatus == 1) || pet.lockStatus == 1 || pet.coolingInterval != "0分钟" ? "disabled" : "") +'/><input class="detailBtn" type="button" value="查看"/></td>\
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
                        <td><font color="' + (pet.status == 1 || pet.status == 3 ? "red" : "") + '">' + (pet.status == 1 || pet.status == 3 ? "+" : "") + (pet.amount * (pet.status == 1 || pet.status == 3 ? 1 : -1)) + '</font></td>\
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

    cancel : function(pet) {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.CancelSalePet,
            contentType : 'application/json',
            data: JSON.stringify({
                "appId":1,
                "nounce":null,
                "petId":pet.petId,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                if (res.errorNo == "00") {
                    Alert.Success("狗狗下架成功！", 2);

            pet.amount = 0;
            Center.updateMinePetList(pet);
                } else {
                    Alert.Error(res.errorMsg, 2);
                }
            }
        });
    },

    cancelAll : function(petArray) {
        for (var i = 0; i < petArray.length; i++) {
            var pet = petArray[i];
        if (pet) {
            Center.cancel(pet);
            }
        }
    },

    sale : function(pet, amount) {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.SalePet,
            contentType : 'application/json',
            data: JSON.stringify({
                "amount": amount,
                "appId":1,
                "nounce":null,
                "petId":pet.petId,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                if (res.errorNo == "00") {
                    Alert.Success("狗狗上架成功！", 2);

            pet.amount = amount;
            Center.updateMinePetList(pet);
                } else {
                    Alert.Error(res.errorMsg, 2);
                }
            }
        });
    },

    batchSale : function(petArray, amount) {
        for(var i = 0; i < petArray.length; i++) {
            var pet = petArray[i];
            if (pet) {
                Center.sale(pet, amount);
            }
        }
    },

    breed : function(pet, amount) {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.BreedPet,
            contentType : 'application/json',
            data: JSON.stringify({
                "amount": amount,
                "appId":1,
                "nounce":null,
                "petId":pet.petId,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                if (res.errorNo == "00") {
                    Alert.Success("狗狗繁育上架成功！", 2);
                    pet.amount = amount;
                    Center.updateMinePetList(pet);
                } else {
                    Alert.Error(res.errorMsg, 2);
                }
            }
        });
    },
    batchBreed : function(petArray, amount) {
        for(var i = 0; i < petArray.length; i++) {
            var pet = petArray[i];
            if (pet) {
                Center.breed(pet, amount);
            }
        }
    },
    cancelBreed : function(pet) {
        $.ajax({
            type: 'POST',
            url: Center.ApiUrl.CancelBreedPet,
            contentType : 'application/json',
            data: JSON.stringify({
                "appId":1,
                "nounce":null,
                "petId":pet.petId,
                "requestId": new Date().getTime(),
                "timeStamp":null,
                "token":null,
                "tpl":""
            }),
            success:function(res){
                if (res.errorNo == "00") {
                    Alert.Success("狗狗繁育下架成功！", 2);
                    pet.amount = 0;
                    Center.updateMinePetList(pet);
                } else {
                    Alert.Error(res.errorMsg, 2);
                }
            }
        });
    },

    updateMinePetList : function(pet) {
        var trList = $("#petsList").children("tbody").children("tr");

    var index = parseInt(pet.rowNum);

    // 更新行的JSON数据
    $(trList[index]).attr("data", JSON.stringify(pet));

    // 设置 checkbox未选中
    $(trList[index]).find("input[type='checkbox']").prop('checked', false);

    // 设置各列的值（目前只有金额）
    $($(trList[index]).find("td")[4]).html(pet.amount);

    // 按钮文字更新
    $(trList[index]).find(".saleBtn").attr("value", pet.amount > 0 ? "下架" : "上架");
    }
};
