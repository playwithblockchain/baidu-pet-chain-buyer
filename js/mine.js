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
					petArray[i] = pet.petId;
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

		var petIds = "";
		for (var i = 0; i < petList.length; i++) {
			if ($(petList[i]).find("input[type='checkbox']").prop('checked')) {
				var pet = $.parseJSON($(petList[i]).attr("data"));
				if (pet.amount == 0) {
					petIds += $.parseJSON($(petList[i]).attr("data")).petId + ",";
				}
			}
		}

		if (petIds.length > 0) {
			petIds = petIds.substr(0, petIds.length - 1);

			$("#petIdsForSale").val(petIds);

			$('#saleModal').modal('show');
		} else {
			Alert.Error("请选择你想上架的狗狗！！", 2);
		}
	});

	$("#sale").click(function () {
		$(".amountError").html("");

		var petIds = $("#petIdsForSale").val();
		var amount = $("#amount").val();

		if (amount == '' || amount == 'undefined' || parseFloat(amount) <= 0) {
			$(".amountError").html("金额必需大于等于0！！");
			$("#amount").focus();
			return false;
		}

		Center.batchSale(petIds, amount);

		$('#saleModal').modal('hide');
	});

	$("tbody").on("click", ".saleBtn", function(e) {
		e.stopPropagation();

		var pet = $.parseJSON($(this).parent().parent().attr("data"));

		if ($(this).attr("value") == "上架") {
			$("#petIdsForSale").val(pet.petId);

			$('#saleModal').modal('show');
		} else {
			Center.cancel(pet.petId);
		}
	});

	$("tbody").on("click", ".detailBtn", function(e) {
		e.stopPropagation();

		var pet = $.parseJSON($(this).parent().parent().attr("data"));

		Center.getPetById(pet.petId, "petDetail");

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