/*
 * @author t@tabalt.net
 */
$(function(){
    var autoRefreshTaskId = "";

    var pageNo = 1;

    // 购买窗口初使化
    Buyer.InitBuyModal();

    // 购买任务
    setInterval(function(){
        Buyer.TryBuyPets();
    }, 100);

    $("#refreshType").attr("disabled", "disabled").click(function() {
        if ("手动刷新" == $(this).html()) {
	    // 切换为手动刷新
	    $(this).html("自动刷新"); // 按钮文字显示为自动刷新
	    Alert.Success("切换为手动刷新，自动刷新停止！！", 2);

	    clearInterval(autoRefreshTaskId);

            pageNo = 1;
        } else {
            $(this).html("手动刷新");
            Alert.Success("开始自动刷新！！", 2);

            initAutoBuy();
        }
    });

    $("#refresh").click(function() {
        $(this).html("刷新购买（" + pageNo + "页）");

	Buyer.ShowPetsOnSale(pageNo);

        pageNo ++;
    });

    function initAutoBuy() {
        if (autoRefreshTaskId != '' && autoRefreshTaskId != null && autoRefreshTaskId != 'undefined') {
	    clearInterval(autoRefreshTaskId);
	}

	autoRefreshTaskId = setInterval(function(){
	    Buyer.ShowPetsOnSale(1);
	}, 2000);

	$("#refreshType").attr("disabled", false);
    }

    initAutoBuy();
});