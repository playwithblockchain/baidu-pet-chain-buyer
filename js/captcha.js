/*
 * @author t@tabalt.net
 */

$(function(){
    Buyer.InitLogCaptcha();

    Buyer.DisplayLogCaptcha();

    setInterval(function(){
        Configurator.clearLogCaptcha();
    }, 100);

    setInterval(function(){
        Buyer.DisplayLogCaptcha();
    }, 100);
});