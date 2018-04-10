/*
 * @author sgsp088088
 */

$(function(){
    function init() {
        Center.getMemberInfo();
        Center.getMyPetList(1);
        Center.getMyPetOrderList(1);

        $("#orderListPageNo").val(1);
    }

    init();

    $("#refreshPetsList").click(function() {
        init();

        Alert.Success("刷新成功！", 2);
    });

    $("#batchCancel").click(function() {
        var petList = $("#petsList").children("tbody").children("tr");

        var petArray = new Array();
        for (var i = 0; i < petList.length; i++) {
            if ($(petList[i]).find("input[type='checkbox']").prop('checked')) {
                var pet = $.parseJSON($(petList[i]).attr("data"));

                if (parseFloat(pet.amount) > 0) {
                    petArray[i] = pet;
                }
            }
        }

        if (petArray.length <= 0) {
            Alert.Error("请选择你想下架的狗狗！！", 2);
        } else {
            Center.cancelAll(petArray);
        }
    });

    $("#batchSale").click(function () {
        var petList = $("#petsList").children("tbody").children("tr");

        var petArray = new Array();
        for (var i = 0; i < petList.length; i++) {
            if ($(petList[i]).find("input[type='checkbox']").prop('checked')) {
                var pet = $.parseJSON($(petList[i]).attr("data"));
                if (pet.amount == 0) {
                    petArray[i] = pet;
                }
            }
        }

        if (petArray.length > 0) {
            $("#petIdsForSale").val(JSON.stringify(petArray));

	    $("#amount").val("").focus();
            $('#saleModal').modal('show');
        } else {
            Alert.Error("请选择你想上架的狗狗！！", 2);
        }
    });

    $("#sale").click(function () {
        $(".amountError").html("");

        var petArray = $.parseJSON($("#petIdsForSale").val());
        var amount = $("#amount").val();

        if (amount == '' || amount == 'undefined' || parseFloat(amount) <= 0) {
            $(".amountError").html("金额必需大于等于0！！");
            $("#amount").focus();
            return false;
        }

        Center.batchSale(petArray, amount);

        $('#saleModal').modal('hide');
    });

    $("tbody").on("click", ".saleBtn", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));
        var petArray = new Array();
        petArray[0] = pet;

        if ($(this).attr("value") == "上架") {
            $("#petIdsForSale").val(JSON.stringify(petArray));

            $("#amount").val("").focus();
            $('#saleModal').modal('show');
        } else {
            Center.cancel(pet);
        }
    });





    $("#batchBreed").click(function () {
        var petList = $("#petsList").children("tbody").children("tr");

        var petArray = new Array();
        for (var i = 0; i < petList.length; i++) {
            if ($(petList[i]).find("input[type='checkbox']").prop('checked')) {
                var pet = $.parseJSON($(petList[i]).attr("data"));
                if (pet.amount == 0) {
                    petArray[i] = pet;
                }
            }
        }

        if (petArray.length > 0) {
            $("#petIdsForBreed").val(JSON.stringify(petArray));

            $("#breedAmount").val("").focus();
            $('#breedModal').modal('show');
        } else {
            Alert.Error("请选择你想繁育的狗狗！！", 2);
        }
    });
    $("#breed").click(function () {
        $(".amountError").html("");

        var petArray = $.parseJSON($("#petIdsForBreed").val());
        var amount = $("#breedAmount").val();

        if (amount == '' || amount == 'undefined' || parseFloat(amount) <= 0) {
            $(".breedAamountError").html("金额必需大于等于0！！");
            $("#breedAmount").focus();
            return false;
        }

        Center.batchBreed(petArray, amount);

        $('#breedModal').modal('hide');
    });
    $("tbody").on("click", ".breedBtn", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));
        var petArray = new Array();
        petArray[0] = pet;

        if ($(this).attr("value") == "繁育") {
            $("#petIdsForBreed").val(JSON.stringify(petArray));

            $("#breedAmount").val("").focus();
            $('#breedModal').modal('show');
        } else {
            Center.cancelBreed(pet);
        }
    });

    $("tbody").on("click", ".detailBtn", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));

        Center.getPetById(pet.petId, "#petDetail .modal-body");

        $('#petDetail').modal('show');
    });

    $("#prePage").click(function() {
        var pageNo = parseInt($("#orderListPageNo").val());

        if (pageNo == 1) {
            Alert.Error("当前已是第一页！！", 2);
        } else {
            pageNo = pageNo - 1;
            Center.getMyPetOrderList(pageNo);
            $("#orderListPageNo").val(pageNo)
        }
    });

    $("#nextPage").click(function() {
        var pageNo = parseInt($("#orderListPageNo").val());

        pageNo += 1;
        Center.getMyPetOrderList(pageNo);
        $("#orderListPageNo").val(pageNo)
    });
});