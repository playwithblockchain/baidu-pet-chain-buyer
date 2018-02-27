/*
 * @author t@tabalt.net
 */

var Buyer = {
    TryToBuyChain: {},
    TryedBuyMap: {},
    Buying: false,

    ApiUrl: {
        QueryPetsOnSale: 'https://pet-chain.baidu.com/data/market/queryPetsOnSale',
        TxnCreate: 'https://pet-chain.baidu.com/data/txn/create',
        CaptchaGen: 'https://pet-chain.baidu.com/data/captcha/gen',
    },
    
    DegreeConf: Configurator.getDegreeConf(),

    InitLogCaptcha: function() {
        Buyer.displayVerifyImage();
        $('#buyVerifyRefresh').click(function(){
            Buyer.displayVerifyImage();
        });

        $('#logCaptchaPanel form').submit(function(){
            Buyer.submitCaptcha();
            return false;
        });

        $('#buyVerifyCode').keyup(function(){
            var verifyCode = $(this).val();
            if (verifyCode.length == 4) {
                Buyer.submitCaptcha();
            }
        });
        $('#logCaptchaSubmit').click(function(){
            Buyer.submitCaptcha();
        });

        $('#buyVerifyCode').val('').focus();
    },

    DisplayLogCaptcha: function() {
        var captchas = Configurator.getLogCaptcha();
        var th = '';
        $.each(captchas,function(k, v) {
            th += '<tr>\
                    <td><img style="width:80px; height: 30px;" src="' + v.Src + '" ></td>\
                    <td><span>' + v.Seed + '</span></td>\
                    <td><span>' + v.Code + '</span></td>\
                    <td><span>' + v.Time + '</span></td>\
                </tr>';
        });
        $("#logCaptchaList tbody").html("").append(th);
    },

    submitCaptcha: function() {
        var verifySeed = $('#buyVerifySeed').val();
        var verifyCode = $('#buyVerifyCode').val();
        var verifyTime = $('#buyVerifyTime').val();
        if (verifyCode == '' || verifyCode.length != 4) {
            Alert.Error("请填写4位验证码！", 3);
            return
        }

        var verifySrc = $('#buyVerifyImage').attr('src');

        Configurator.saveLogCaptcha(verifySeed, verifyCode, verifySrc, verifyTime);

        Buyer.displayVerifyImage();
        $('#buyVerifyCode').val('').focus();
        Buyer.DisplayLogCaptcha();
    },

    InitBuyModal: function() {
        $('#buyModalCenter form').submit(function(){
            Buyer.submitBuy();
            return false;
        });

        $('#buyVerifyRefresh').click(function(){
            Buyer.displayVerifyImage();
        });
        
        $('#buyVerifyCode').keyup(function(){
            var verifyCode = $(this).val();
            if (verifyCode.length == 4) {
                Buyer.submitBuy();
            }
        });
        $('#buyModalSubmit').click(function(){
            Buyer.submitBuy();
        });

        Alert.Success("已开始后台扫描狗狗，有符合条件的狗狗会弹验证码输入框哦~", 5);
    },

    ShowPetsOnSale: function() {
        $.ajax({
            type: 'POST',
            url: Buyer.ApiUrl.QueryPetsOnSale,
            contentType : 'application/json',
            data: JSON.stringify({
                "pageNo":1,
                "pageSize":20,
                "querySortType":"CREATETIME_DESC",
                "petIds":[],
                "lastAmount":null,
                "lastRareDegree":null,
                "requestId": new Date().getTime(),
                "appId":1,
                "tpl":""
            }),
            success:function(res){
                var petsOnSale = res.data.petsOnSale || [];

                var th = '';
                for (var i = 0; i <= petsOnSale.length - 1; i++) {
                    var pet = petsOnSale[i];
                    var degree = Buyer.DegreeConf[pet.rareDegree] || {desc:'未知',buyAmount:'5.00'};

                    var needToBuyColor = '';
                    if (parseFloat(pet.amount) <= parseFloat(degree.buyAmount)) {
                        Buyer.TryToBuyChain[pet.id] = {
                            degree:degree,
                            pet:pet
                        };
                        needToBuyColor = 'red';
                    }

                    th += '<tr>\
                        <td>' + i + '</td>\
                        <td>' + pet.id + '</td>\
                        <td>' + pet.petId + '</td>\
                        <td>第' + pet.generation + '代</td>\
                        <td>' + degree.desc + '</td>\
                        <td><font color="' + needToBuyColor + '">' + pet.amount + '</font></td>\
                    </tr>';
                }

                $("#petsOnSale tbody").html("").append(th);
            }
        });
    },

    TryBuyPets:function() {
        if (Buyer.Buying) {
            return
        }

        var toBuy = null;
        for(var key in Buyer.TryToBuyChain){
            toBuy = Buyer.TryToBuyChain[key]
            delete Buyer.TryToBuyChain[key];
            break;
        }
        //var toBuy = Buyer.TryToBuyChain.pop() || undefined;
        if (toBuy == undefined || toBuy == null) {
            return
        }

        var tryed = Buyer.TryedBuyMap[toBuy.pet.id] || false;
        if (tryed) {
            return
        }

        if (Buyer.TryedBuyMap.length >= 100) {
            Buyer.TryedBuyMap = [];
        }
        Buyer.startBuyProcess();
        var captcha = Configurator.consumeLogCaptcha();
        Buyer.displayBuyModal(toBuy.degree, toBuy.pet, captcha);
        
        Buyer.TryedBuyMap[toBuy.pet.id] = true;
    },

    displayBuyModal: function(degree, pet, captcha) {
        var detail = '\
        <p>尝试购买：ID[<span>'+pet.id+'</span>],\
        级别[<span>'+pet.rareDegree+'</span>],\
        价格[<font color="red">'+pet.amount+'</font>]</p>\
        <p>命中策略：等级[<span>'+degree.desc+'</span>],\
        最高价格[<font color="green">'+degree.buyAmount+'</font>]</p>\
        ';
        $("#buyModalPetDetail").html(detail);
        $("#buyPetId").val(pet.petId);
        $("#buyValidCode").val(pet.validCode);
        $("#buyPetAmount").val(pet.amount);

        Buyer.displayVerifyImage(captcha);

        $('#buyModalCenter').on('shown.bs.modal', function () {
            $('#buyVerifyCode').focus();
        }).on('hidden.bs.modal', function () {
            Buyer.stopBuyProcess();
        });

        $('#buyModalCenter').modal('show');
    },

    displayVerifyImage: function(captcha) {
        var _display = function(seed, src, code, time) {
            $("#buyVerifySeed").val(seed);
            $('#buyVerifyImage').attr('src', src);
            $('#buyVerifyCode').val(code);
            $('#buyVerifyTime').val(time);
        }

        if (captcha != undefined) {
            _display(captcha.Seed, captcha.Src, captcha.Code)
            Buyer.submitBuy();
            setTimeout(function(){
                $('#buyModalCenter').modal('hide');
            }, 1*1000);
            return;
        }

        $.ajax({
            type: 'GET',
            url: Buyer.ApiUrl.CaptchaGen,
            contentType : 'application/json',
            data: {
                "requestId": new Date().getTime(),
                "appId":1,
                "tpl":""
            },
            success:function(res){
                var seed = res.data.seed;
                var src = 'data:image/jpeg;base64,'+res.data.img;
                var time = Configurator.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
                _display(seed, src, '', time);
            }
        });
    },

    startBuyProcess: function() {
        Buyer.Buying = true;
    },

    stopBuyProcess: function() {
        Buyer.Buying = false;
    },

    submitBuy: function () {
        var verifySeed = $('#buyVerifySeed').val();
        var verifyCode = $('#buyVerifyCode').val();
        if (verifyCode == '' || verifyCode.length != 4) {
            Alert.Error("请填写4位验证码！", 3);
            return
        }

        var petId = $('#buyPetId').val();
        var petAmount = $('#buyPetAmount').val();
        var validCode = $("#buyValidCode").val();

        $.ajax({
            type: 'POST',
            url: Buyer.ApiUrl.TxnCreate,
            contentType : 'application/json',
            data: JSON.stringify({
                "amount": petAmount,
                "appId": 1,
                "seed": verifySeed,
                "captcha": verifyCode,
                "petId": petId,
                "requestId": new Date().getTime(),
                "validCode": validCode,
                "tpl":"",
            }),
            success:function(res2){
                if (res2.errorNo == 0) {
                    Alert.Success("抢到啦！！！！！", 3);
                } else {
                    var msg = '没抢到：错误码[' + res2.errorNo + '],错误信息[' + res2.errorMsg + ']'
                    Alert.Error(msg, 3);
                    console.log(msg)
                    console.log('petId:' + petId + ',petAmount:' + petAmount + ',seed:' + verifySeed + ',captcha:' + verifyCode)
                }
                $('#buyModalCenter').modal('hide');
            },
            error:function(){
                Alert.Error("接口出错啦！", 3);
                $('#buyModalCenter').modal('hide');
            }
        });
    }
};
