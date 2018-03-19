$(function() {
	$("table").find("input[type='checkbox']").first().click(function() {
		var isChecked = $(this).prop('checked'); 
		
		var trList = $(this).parents('table').children("tbody").children("tr");
		for (var i = 0; i < trList.length; i++) {
			$(trList[i]).find("input[type='checkbox']").prop('checked', isChecked);
		}
	});

	var lastColor = "";
	$("tbody").on("click", "tr", function() {
		var checkbox = $(this).find("input[type='checkbox']");
		$(checkbox).prop("checked", !checkbox.prop("checked"));
	}).on("mouseover", "tr", function() {
		lastColor = $(this).find("td").css("background-color");
		$(this).find("td").css("background-color", "#eee111");
	}).on("mouseout", "tr", function() {
		$(this).find("td").css("background-color", lastColor);
	});

	$("tbody").on("click", "input[type='checkbox']", function(e){
		e.stopPropagation();   
	});
});