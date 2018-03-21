/*
 * @author t@tabalt.net
 */

$(function(){
    Configurator.displayDegreeConf(); 
    Configurator.saveDegreeConf(); 

    $("input[name='color']").on("keyup", function() {
        $(this).css("color", $(this).val());
    });
});