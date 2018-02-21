/*
 * @author t@tabalt.net
 */

$(function(){
    setInterval(function(){
        Buyer.ShowPetsOnSale();
    }, 2000);

    Buyer.InitBuyModal();

    setInterval(function(){
        Buyer.TryBuyPets();
    }, 100);
});