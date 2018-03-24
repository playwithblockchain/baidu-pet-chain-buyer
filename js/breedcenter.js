/*
 * @author t@tabalt.net
 */
$(function(){
    BreedCenter.myBreedPetList(1);

    var autoRefreshTaskId = "";

    var pageNo = 1;

    $("#refreshType").attr("disabled", "disabled").click(function() {
        if ("手动刷新" == $(this).html()) {
            // 切换为手动刷新
            $(this).html("自动刷新"); // 按钮文字显示为自动刷新
            $("#refresh").html("刷新购买").attr("disabled", false);

            Alert.Success("切换为手动刷新，自动刷新停止！！", 2);

            clearInterval(autoRefreshTaskId);

            pageNo = 1;
        } else {
            $(this).html("手动刷新");
            $("#refresh").html("刷新购买").attr("disabled", true);

            Alert.Success("开始自动刷新！！", 2);

            initAutoTask();
        }
    });

    $("#refresh").attr("disabled", true).click(function() {
        $(this).html("刷新购买（" + pageNo + "页）");

        BreedCenter.breedCenterList(pageNo);

        pageNo ++;
    });

    $("#refreshMyBreedCenterList").click(function() {
        BreedCenter.myBreedPetList(1);

        Alert.Success("刷新成功！", 2);
    });

    $("tbody").on("click", "input[name='taPetDetailBtn']", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));

        Center.getPetById(pet.petId, "#taPetDetail");
    });

    $("tbody").on("click", "input[name='myPetDetailBtn']", function(e) {
        e.stopPropagation();

        var pet = $.parseJSON($(this).parent().parent().attr("data"));

        Center.getPetById(pet.petId, "#myPetDetail");
    });

    $("tbody").on("click", "input[name='choose']", function(e) {
        e.stopPropagation();
    });

    function initAutoTask() {
        if (autoRefreshTaskId != '' && autoRefreshTaskId != null && autoRefreshTaskId != 'undefined') {
	        clearInterval(autoRefreshTaskId);
	    }

        autoRefreshTaskId = setInterval(function(){
            BreedCenter.breedCenterList(1);
        }, 2000);

	    $("#refreshType").attr("disabled", false);
    }

    initAutoTask();
});