//加载分类信息
productTypeInit();
getBlock_one();


$(document).on('click','.cartRemove',function () {
   var pid=$(this).siblings('.pid').val();
   delCratProduct(parseInt(pid),$(this));
});

$(document).on('click','.cartLink',function () {
    //略缩购物车
    getCart();
});