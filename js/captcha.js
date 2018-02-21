/*
 * @author t@tabalt.net
 */

$(function(){
    Buyer.InitLogCaptcha();

    Buyer.DisplayLogCaptcha();

    $("#clearlogCaptcha").click(function(){
        Configurator.clearLogCaptcha();
        window.location.href=window.location.href;
    });
});