//全局变量定义（必须引用此文件）---------------------------------------------------------------------------------
var serverURL="http://localhost:8080";
var likeBox;
$(function () {
    //加载登录信息
    getheaderMessage();
    //加载分类信息
    productTypeInit();
    getBlock_one();
    //导航栏下拉
    $('#xl').mouseover(function () {
        $('.menu-item-xiala').css('display','block');
    });
    $('#xl').mouseout(function () {
        $('.menu-item-xiala').css('display','none');
    });





});

// 动态加载分类js
$(document).on('click',".mid-link",function(){
    var indexThis=$(".mid-link").index(this);
    $(".mid-link").each(function(ii,vv){
        //ii 指第几个元素的序列号。
        //vv 指遍历得到的元素。
        $(this).removeClass();
        $(this).addClass("nav-link mid-link");
    });
    $(this).addClass("active");
    // alert($(".mid-link").length == $(".midBox").length);
    // alert($(".midBox").eq(0).text());
    $(".midBox").each(function () {
        $(this).removeClass("midBoxShow showBox");
        $(this).addClass("hideBox");
    });
    $(".midBox").eq(indexThis).removeClass("hideBox");
    $(".midBox").eq(indexThis).addClass("showBox");

});

    //获取网页头部 user登录信息
    function getheaderMessage() {
    $.ajax({
        type: "GET",
        url: serverURL+"/user/getLoginMessage",
        async:false,//同步请求
        data:{"token":localStorage.getItem("eh_token")},
        dataType:"json",
        success: function(data){
            if(data.errorCode=="500") {
                localStorage.removeItem("eh_token");
            }
            if(data.errorCode=="200") {

                var item=data.item;
                $('.reg').remove();
                $('#welcomeMessage').html(item.trueName+',欢迎来到二货校园商城');
                $('#myAccount').attr('href','javascript:void(0);');
                $('#myAccount').html("<i class=\"ec ec-user\"></i>我的账户");
                $('#myAccount').append(
                '<ul class="menu-item-xiala">'+
                    '<li><a href="javascript:void(0);" id="info" >'+'个人信息'+'</a></li>'+
                '<li><a href="javascript:void(0);" onclick="adminExit()" >'+'退出'+'</a></li>'+
                '</ul>'
                );
            }
            if (data.errorCode == "501"){
                localStorage.removeItem("eh_token");
            }
        }
    });
}


    //判断是否登录
    function loginWhere() {

        if (localStorage.getItem("eh_token").length == 0 || localStorage.getItem("eh_token") == null){
            return false;
        }
        $.ajax({
            type: "GET",
            url: serverURL+"/user/getLoginMessage",
            data:{"token":localStorage.getItem("eh_token")},
            dataType:"json",
            success: function(data){
                if(data.errorCode=="500") {
                    localStorage.removeItem("eh_token");
                }
                if(data.errorCode=="200") {
                 window.location.href='index.html';
                }
                if (data.errorCode == "501"){
                    localStorage.removeItem("eh_token");
                }
            }
        });
        return false;

    }

    //注销登录
    function adminExit() {
        localStorage.removeItem("eh_token");
        window.location.href="index.html";
    }

//加载分类信息 fun
    function  productTypeInit() {
        $.ajax({
            type: "GET",
            url: serverURL+"/admin/productRank",
            data:{rank:0,superId:0},
            dataType:"json",
            success: function(data){
                if(data.errorCode=="500") {
                    layer.msg(data.message);
                }
                if(data.errorCode=="200") {
                    // alert(data.list[0].productTypeRank ==1);
                    var rank_1=new Array();
                    var rank_2_JsonObj={},product_catJsonObj={};//json对象
                    rank_2_JsonObj.proObj=[],product_catJsonObj.proObj=[];//定义proObj 键
                    $.each(data.list, function(index, p) {
                        //第一次遍历 取出一级类 并存到rank_1数组
                        if (p.productTypeRank ==1){
                           rank_1.push(p.productTypeName);
                           var obj={"id":p.id,"productTypeName":p.productTypeName,"productTypeCode":p.productTypeCode};
                           product_catJsonObj.proObj.push(obj);
                           //第二次遍历，取出与一级类对应的二级类 并存到rank_2_JsonObj对象下的proObj数组中
                           $.each(data.list,function (idx,x) {
                               if (x.superType == p.productTypeCode){
                                   var jsonObj= {"superTypeName":p.productTypeName,"superTypeCode":p.productTypeCode,"id":x.id , "productTypeName":x.productTypeName,"productTypeCode":x.productTypeCode,"superType":x.superType};
                                   rank_2_JsonObj.proObj.push(jsonObj);//插入json对象中
                               }
                           });
                        }

                    });

                    //加载搜索框右侧下拉分类信息
                    for (var q=0;q<product_catJsonObj.proObj.length;q++){
                        $("#product_cat").append(
                            "<option class=\"level-0\" value=\""+product_catJsonObj.proObj[q].id+"\">"+product_catJsonObj.proObj[q].productTypeName+"</option>"
                        );
                    }

                    // var jsonStr = JSON.stringify(product_catJsonObj);
                    // alert(jsonStr);
                    //遍历一级类 显示到前台html上
                    for (var i=0;i<rank_1.length;i++){
                        var alinkText,floatDivBox,floatDivBox_1=null,floatDivBox_2=null,floatDivBox_3=null,strlink_1="",strlink_2="",strlink_3="";
                        //3个if 都用来判断一级类的个数能否使用一行3个分类来显示完毕 如不能   则进行相应的a链接删除
                        if (rank_1[i+2] == null && rank_1[i+1] != null){
                            alinkText=  "\t\t\t\t<a href=\"login_1.html\" target=\"_blank\" title=\""+rank_1[i]+"\">"+rank_1[i]+"</a>\n" +
                                "\t\t\t\t\t/\n" +
                                "\t\t\t\t<a href=\"login_2.html\" target=\"_blank\" title=\""+rank_1[i+1]+"\">"+rank_1[i+1]+"</a>\n";

                            //遍历json对象中的2级分类 并显示到前台html中
                            for(var x=0;x<rank_2_JsonObj.proObj.length;x++){
                                // 判断当前一级分类名称是否与json对象中数组下的superTypeName一致  如一致则说明该二级分类属于当前一级分类  下面如同~~
                                if (rank_1[i] == rank_2_JsonObj.proObj[x].superTypeName){
                                    strlink_1+="\t\t\t\t\t\t<a href=\"\" target=\"_blank\" title=\""+rank_2_JsonObj.proObj[x].productTypeName+"\">"+rank_2_JsonObj.proObj[x].productTypeName+"</a>\n";
                                    floatDivBox_1="\t\t\t\t<div class=\"list-float-1\">\n" +
                                        "\t\t\t\t\t<h5>"+rank_1[i]+"</h5>\n" +
                                        "\t\t\t\t\t<p>\n" +
                                        strlink_1+
                                        "\t\t\t\t\t</p>\n" +
                                        "\t\t\t\t</div>\n" ;
                                }

                                if (rank_1[i+1] == rank_2_JsonObj.proObj[x].superTypeName){
                                    strlink_2+="\t\t\t\t\t\t<a href=\"\" target=\"_blank\" title=\""+rank_2_JsonObj.proObj[x].productTypeName+"\">"+rank_2_JsonObj.proObj[x].productTypeName+"</a>\n";
                                    floatDivBox_2="\t\t\t\t<div class=\"list-float-1\">\n" +
                                        "\t\t\t\t\t<h5>"+rank_1[i+1]+"</h5>\n" +
                                        "\t\t\t\t\t<p>\n" +
                                        strlink_2+
                                        "\t\t\t\t\t</p>\n" +
                                        "\t\t\t\t</div>\n" ;
                                }
                                    // floatDivBox_3=null;
                            }

                        }else if(rank_1[i+1] == null) {
                            alinkText=  "\t\t\t\t<a href=\"login_1.html\" target=\"_blank\" title=\""+rank_1[i]+"\">"+rank_1[i]+"</a>\n";

                            for(var x=0;x<rank_2_JsonObj.proObj.length;x++){
                                if (rank_1[i] == rank_2_JsonObj.proObj[x].superTypeName){
                                    strlink_1+="\t\t\t\t\t\t<a href=\"\" target=\"_blank\" title=\""+rank_2_JsonObj.proObj[x].productTypeName+"\">"+rank_2_JsonObj.proObj[x].productTypeName+"</a>\n";
                                    floatDivBox_1="\t\t\t\t<div class=\"list-float-1\">\n" +
                                        "\t\t\t\t\t<h5>"+rank_1[i]+"</h5>\n" +
                                        "\t\t\t\t\t<p>\n" +
                                        strlink_1+
                                        "\t\t\t\t\t</p>\n" +
                                        "\t\t\t\t</div>\n" ;
                                }
                                // floatDivBox_2=null;
                                // floatDivBox_3=null;
                            }

                        }else {
                            alinkText=  "\t\t\t\t<a href=\"login_1.html\" target=\"_blank\" title=\""+rank_1[i]+"\">"+rank_1[i]+"</a>\n" +
                                "\t\t\t\t\t/\n" +
                                "\t\t\t\t<a href=\"login_2.html\" target=\"_blank\" title=\""+rank_1[i+1]+"\">"+rank_1[i+1]+"</a>\n"+
                                "\t\t\t\t\t/\n" +
                                "\t\t\t\t<a href=\"login_2.html\" target=\"_blank\" title=\""+rank_1[i+2]+"\">"+rank_1[i+2]+"</a>\n";

                            for(var x=0;x<rank_2_JsonObj.proObj.length;x++){
                                if (rank_1[i] == rank_2_JsonObj.proObj[x].superTypeName){
                                    strlink_1+="\t\t\t\t\t\t<a href=\"\" target=\"_blank\" title=\""+rank_2_JsonObj.proObj[x].productTypeName+"\">"+rank_2_JsonObj.proObj[x].productTypeName+"</a>\n";
                                    floatDivBox_1="\t\t\t\t<div class=\"list-float-1\">\n" +
                                        "\t\t\t\t\t<h5>"+rank_1[i]+"</h5>\n" +
                                        "\t\t\t\t\t<p>\n" +
                                        strlink_1+
                                        "\t\t\t\t\t</p>\n" +
                                        "\t\t\t\t</div>\n" ;
                                }

                                if (rank_1[i+1] == rank_2_JsonObj.proObj[x].superTypeName){
                                    strlink_2+="\t\t\t\t\t\t<a href=\"\" target=\"_blank\" title=\""+rank_2_JsonObj.proObj[x].productTypeName+"\">"+rank_2_JsonObj.proObj[x].productTypeName+"</a>\n";
                                    floatDivBox_2="\t\t\t\t<div class=\"list-float-1\">\n" +
                                        "\t\t\t\t\t<h5>"+rank_1[i+1]+"</h5>\n" +
                                        "\t\t\t\t\t<p>\n" +
                                        strlink_2+
                                        "\t\t\t\t\t</p>\n" +
                                        "\t\t\t\t</div>\n" ;
                                }

                                if (rank_1[i+2] == rank_2_JsonObj.proObj[x].superTypeName){
                                    strlink_3+="\t\t\t\t\t\t<a href=\"\" target=\"_blank\" title=\""+rank_2_JsonObj.proObj[x].productTypeName+"\">"+rank_2_JsonObj.proObj[x].productTypeName+"</a>\n";
                                    floatDivBox_3="\t\t\t\t<div class=\"list-float-1\">\n" +
                                        "\t\t\t\t\t<h5>"+rank_1[i+2]+"</h5>\n" +
                                        "\t\t\t\t\t<p>\n" +
                                        strlink_3+
                                        "\t\t\t\t\t</p>\n" +
                                        "\t\t\t\t</div>\n" ;
                                }
                            }
                        }

                        //判断 二级分类下的容器是否为空 如为空则说明该一级分类下没有二级分类
                        if (floatDivBox_3 != null && floatDivBox_2 != null && floatDivBox_1 != null){
                            floatDivBox=floatDivBox_1+floatDivBox_2+floatDivBox_3;
                        }else  if (floatDivBox_1 != null && floatDivBox_2 != null && floatDivBox_3 == null){
                            floatDivBox=floatDivBox_1+floatDivBox_2;
                        }else if(floatDivBox_1 != null && floatDivBox_2 == null && floatDivBox_3 == null){
                            floatDivBox=floatDivBox_1;
                        }else if(floatDivBox_1 != null && floatDivBox_2 == null && floatDivBox_3 != null){
                            floatDivBox=floatDivBox_1+floatDivBox_3;
                        }else if(floatDivBox_1 == null && floatDivBox_2 != null && floatDivBox_3 == null){
                            floatDivBox=floatDivBox_2;
                        }else  if(floatDivBox_1 == null && floatDivBox_2 != null && floatDivBox_3 != null){
                            floatDivBox=floatDivBox_2+floatDivBox_3;
                        }else if(floatDivBox_1 == null && floatDivBox_2 == null && floatDivBox_3 != null){
                            floatDivBox=floatDivBox_3;
                        }else {
                            floatDivBox="";
                        }

                        $('#productRank').append(
                            "<li class=\"nav-list\">\n" +
                            "\t\t\t<p>\n" +
                            alinkText+
                            "\t\t\t</p>\n" +
                            "\n" +
                            "\t\t\t<div class=\"list-float\" >\n" +
                            floatDivBox+
                            "\t\t\t</div>\n" +
                            "\n" +
                            "\t\t</li>\n"
                        );

                        i=i+2;
                    }


                    //加载首页下部分类信息
                    for (var it=0;it<rank_1.length;it++){

                        if (it == 0){
                            $("#productTypeClass").append("<li class=\"nav-item\"><a class=\"active nav-link mid-link\" href=\"javascript:void(0);\">"+rank_1[it]+"</a></li>");
                        }else {
                            $("#productTypeClass").append("<li class=\"nav-item\"><a class=\"nav-link mid-link\" href=\"javascript:void(0);\">"+rank_1[it]+"</a></li>");
                        }

                        if (it == 10){
                            break;
                        }
                    }

                }

            }
        });
    }

    //加载最新出售模块
    function getBlock_one() {
        $.ajax({
            type:"GET",
            url:serverURL+"/eh/getBlock_one",
            dataType:"json",
            success:function (data) {
                if (data.errorCode == "200"){
                    var list=data.list;
                    var newText;
                    if (list[0].degree == 9){
                        newText=list[0].degree+" 成新";
                    }else {
                        newText=list[0].degree+" 新";
                    }
                    $("#Block_one").append(
                        "<div class=\"deals-block col-lg-4\">\n" +
                        "\t\t<section class=\"section-onsale-product\">\n" +
                        "\t\t\t<header>\n" +
                        "\t\t\t\t<h2 class=\"h1\">最新出售</h2>\n" +
                        "\t\t\t\t<!--<div class=\"savings\">-->\n" +
                        "\n" +
                        "\t\t\t\t\t<!--<span class=\"savings-text\" id=\"savings-text\">-->\n" +
                        "\t\t\t\t\t\t<!--<i class=\"ec ec-user\"></i>-->\n" +
                        "\t\t\t\t\t\t<!--wuruibao-->\n" +
                        "\t\t\t\t\t\t<!--&lt;!&ndash;<span class=\"amount\">20.00</span>&ndash;&gt;-->\n" +
                        "\t\t\t\t\t<!--</span>-->\n" +
                        "\t\t\t\t<!--</div>-->\n" +
                        "\t\t\t</header>\n" +
                        "\n" +
                        "\t\t\t<div class=\"onsale-products\">\n" +
                        "\t\t\t\t<div class=\"onsale-product\">\n" +
                        "\t\t\t\t\t<a href=\"single-product.html?pid="+list[0].id+"&target=index&pageType=newSell\">\n" +
                        "\t\t\t\t\t\t<div class=\"product-thumbnail\">\n" +
                        "\t\t\t\t\t\t\t<img class=\"wp-post-image\" data-echo=\"assets/images/onsale-product.jpg\" src=\"assets/images/blank.gif\" alt=\"\"></div>\n" +
                        "\n" +
                        "\t\t\t\t\t\t\t<h3>"+list[0].productName+"</h3>\n" +
                        "\t\t\t\t\t</a>\n" +
                        "\n" +
                        "\t\t\t\t\t<span class=\"price\">\n" +
                        "\t\t\t\t\t\t<span class=\"electro-price\">\n" +
                        "\t\t\t\t\t\t\t<ins><span class=\"amount\">￥"+list[0].productPrice+".00</span></ins>\n" +
                        "\n" +
                        "\t\t\t\t\t\t</span>\n" +
                        "\t\t\t\t\t</span>\n" +
                        "\n" +
                        "\t\t\t\t\t<div class=\"deal-progress\">\n" +
                        "\t\t\t\t\t\t<div class=\"deal-stock\">\n" +
                        "\t\t\t\t\t\t\t<span class=\"stock-sold\">库存: <strong>"+list[0].productNumber+"</strong></span>\n" +
                        "\t\t\t\t\t\t\t<span class=\"stock-available\">新旧程度: <strong>"+newText+"</strong></span>\n" +
                        "\t\t\t\t\t\t</div>\n" +
                        "\n" +
                        "\t\t\t\t\t\t<div class=\"progress\">\n" +
                        "\t\t\t\t\t\t\t<span class=\"progress-bar\" style=\"width:100%\">100</span>\n" +
                        "\t\t\t\t\t\t</div>\n" +
                        "\t\t\t\t\t</div>\n" +
                        "\n" +
                        "\t\t\t\t\t<div class=\"deal-countdown-timer\">\n" +
                        "\t\t\t\t\t\t<div class=\"marketing-text text-xs-center\">稍早前的出售:</div>\n" +
                        "\t\t\t\t\t\t<div style=\"text-align: center; overflow:hidden;\">\n" +
                        "\t\t\t\t\t\t\t<p><a href=\"single-product.html?pid="+list[1].id+"&target=index&pageType=newSell\" title=\""+list[1].productName+"\">"+list[1].productName+"</a></p>\n" +
                        "\t\t\t\t\t\t\t<p><a href=\"single-product.html?pid="+list[2].id+"&target=index&pageType=newSell\" title=\""+list[2].productName+"\">"+list[2].productName+"</a></p>\n" +
                        "\t\t\t\t\t\t\t<p><a href=\"single-product.html?pid="+list[3].id+"&target=index&pageType=newSell\" title=\""+list[3].productName+"\">"+list[3].productName+"</a></p>\n" +
                        "\t\t\t\t\t\t</div>\n" +
                        "\n" +
                        "\t\t\t\t\t\t\n" +
                        "\t\t\t\t\t\t\n" +
                        "\t\t\t\t\t</div>\n" +
                        "\t\t\t\t</div>\n" +
                        "\t\t\t</div>\n" +
                        "\t\t</section>\n" +
                        "\t</div>\n"
                    );
                    var likeBox="",newLeaveBox="",topSeeNumberBox="",firstClass="product first",midClass="product",lastClass="product last";

                    //猜你喜欢模块数据加载
                    for(var li=4;li<10;li++){
                        var boxClass="";
                        if (li == 4 || li == 7) boxClass=firstClass;
                        if (li == 5 || li == 8) boxClass=midClass;
                        if (li == 6 || li == 9) boxClass=lastClass;
                        likeBox+="<li class=\""+boxClass+"\">\n" +
                            "\t\t\t\t<div class=\"product-outer\">\n" +
                            "    <div class=\"product-inner\">\n" +
                            "        <span class=\"loop-product-categories\"><a href=\"product-category.html\" rel=\"tag\">"+list[li].productType.productTypeName+"</a></span>\n" +
                            "        <a href=\"single-product.html?pid="+list[li].id+"&target=index&pageType=guessLike\">\n" +
                            "            <h3>"+list[li].productName+"</h3>\n" +
                            "            <div class=\"product-thumbnail\">\n" +
                            "                <img src=\"assets/images/blank.gif\" data-echo=\"assets/images/products/1.jpg\" class=\"img-responsive\" alt=\"\">\n" +
                            "            </div>\n" +
                            "        </a>\n" +
                            "\n" +
                            "        <div class=\"price-add-to-cart\">\n" +
                            "            <span class=\"price\">\n" +
                            "                <span class=\"electro-price\">\n" +
                            "                    <ins><span class=\"amount\"> ￥"+list[li].productPrice+".00</span></ins>\n" +
                            "                                        <span class=\"amount\"> </span>\n" +
                            "                </span>\n" +
                            "            </span>\n" +
                            "            <a rel=\"nofollow\" href=\"single-product.html\" title=\"添加到购物车\" class=\"button add_to_cart_button\">添加到购物车</a>\n" +
                            "        </div><!-- /.price-add-to-cart -->\n" +
                            "\n" +
                            "        <div class=\"hover-area\">\n" +
                            "            <div class=\"action-buttons\">\n" +
                            "\n" +
                            "                <a href=\"#\" rel=\"nofollow\" class=\"add_to_wishlist\" title=\"收藏\">收藏</a>\n" +
                            "\n" +
                            "                <a href=\"compare.html\" class=\"add-to-compare-link\" title=\"比较\">比较</a>\n" +
                            "            </div>\n" +
                            "        </div>\n" +
                            "    </div><!-- /.product-inner -->\n" +
                            "</div><!-- /.product-outer -->\n" +
                            "\t\t\t</li><!-- /.products -->";
                    }

                    //全新闲置模块数据加载
                    for (var lea=10;lea<16;lea++){
                        var boxClass="";
                        if (lea == 10 || lea == 13) boxClass=firstClass;
                        if (lea == 11 || lea == 14) boxClass=midClass;
                        if (lea == 12 || lea == 15) boxClass=lastClass;
                        newLeaveBox+="<li class=\""+boxClass+"\">\n" +
                        "\t\t\t\t\t\t\t\t<div class=\"product-outer\">\n" +
                        "\t\t\t\t\t\t\t\t\t<div class=\"product-inner\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t<span class=\"loop-product-categories\"><a href=\"product-category.html\" rel=\"tag\">"+list[lea].productType.productTypeName+"</a></span>\n" +
                        "\t\t\t\t\t\t\t\t\t\t<a href=\"single-product.html?pid="+list[lea].id+"&target=index&pageType=newLeave\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t<h3>"+list[lea].productName+"</h3>\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t<div class=\"product-thumbnail\">\n" +
                        "\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t<img data-echo=\"assets/images/products/4.jpg\" src=\"assets/images/blank.gif\" alt=\"\">\n" +
                        "\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                        "\t\t\t\t\t\t\t\t\t\t</a>\n" +
                        "\n" +
                        "\t\t\t\t\t\t\t\t\t\t<div class=\"price-add-to-cart\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t<span class=\"price\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"electro-price\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t<ins><span class=\"amount\">￥"+list[lea].productPrice+".00</span></ins>\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t</span>\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t</span>\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t<a rel=\"nofollow\" href=\"single-product.html\" class=\"button add_to_cart_button\">添加到购物车</a>\n" +
                        "\t\t\t\t\t\t\t\t\t\t</div><!-- /.price-add-to-cart -->\n" +
                        "\n" +
                        "\t\t\t\t\t\t\t\t\t\t<div class=\"hover-area\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t<div class=\"action-buttons\">\n" +
                        "\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#\" rel=\"nofollow\" class=\"add_to_wishlist\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t收藏</a>\n" +
                        "\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t<a href=\"#\" class=\"add-to-compare-link\">比较</a>\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
                        "\t\t\t\t\t\t\t\t\t\t</div><!-- /.product-inner -->\n" +
                        "\t\t\t\t\t\t\t\t\t</div><!-- /.product-outer -->\n" +
                        "\t\t\t\t\t\t\t\t</li>";
                    }

                    //最热商品模块数据加载
                    for (var topi=16;topi<22;topi++) {
                        var boxClass = "";
                        if (topi == 16 || topi == 19) boxClass = firstClass;
                        if (topi == 17 || topi == 20) boxClass = midClass;
                        if (topi == 18 || topi == 21) boxClass = lastClass;
                        topSeeNumberBox+="<li class=\""+boxClass+"\">\n" +
                            "\t\t\t\t<div class=\"product-outer\">\n" +
                            "\t\t\t\t\t<div class=\"product-inner\">\n" +
                            "\t\t\t\t\t\t<span class=\"loop-product-categories\"><a href=\"product-category.html\" rel=\"tag\">"+list[topi].productType.productTypeName+"</a></span>\n" +
                            "\t\t\t\t\t\t<a href=\"single-product.html?pid="+list[topi].id+"&target=index&pageType=hotProduct\">\n" +
                            "\t\t\t\t\t\t\t<h3>"+list[topi].productName+"</h3>\n" +
                            "\t\t\t\t\t\t\t<div class=\"product-thumbnail\">\n" +
                            "\t\t\t\t\t\t\t\t<img src=\"assets/images/blank.gif\" data-echo=\"assets/images/products/1.jpg\" class=\"img-responsive\" alt=\"\">\n" +
                            "\t\t\t\t\t\t\t</div>\n" +
                            "\t\t\t\t\t\t</a>\n" +
                            "\n" +
                            "\t\t\t\t\t\t<div class=\"price-add-to-cart\">\n" +
                            "            <span class=\"price\">\n" +
                            "                <span class=\"electro-price\">\n" +
                            "                    <ins><span class=\"amount\"> ￥"+list[topi].productPrice+".00</span></ins>\n" +
                            "                                        <span class=\"amount\"> </span>\n" +
                            "                </span>\n" +
                            "            </span>\n" +
                            "\t\t\t\t\t\t\t<a rel=\"nofollow\" href=\"single-product.html\" title=\"添加到购物车\" class=\"button add_to_cart_button\">添加到购物车</a>\n" +
                            "\t\t\t\t\t\t</div><!-- /.price-add-to-cart -->\n" +
                            "\n" +
                            "\t\t\t\t\t\t<div class=\"hover-area\">\n" +
                            "\t\t\t\t\t\t\t<div class=\"action-buttons\">\n" +
                            "\n" +
                            "\t\t\t\t\t\t\t\t<a href=\"#\" rel=\"nofollow\" class=\"add_to_wishlist\" title=\"收藏\">收藏</a>\n" +
                            "\n" +
                            "\t\t\t\t\t\t\t\t<a href=\"compare.html\" class=\"add-to-compare-link\" title=\"比较\">比较</a>\n" +
                            "\t\t\t\t\t\t\t</div>\n" +
                            "\t\t\t\t\t\t</div>\n" +
                            "\t\t\t\t\t</div><!-- /.product-inner -->\n" +
                            "\t\t\t\t</div><!-- /.product-outer -->\n" +
                            "\t\t\t</li><!-- /.products -->";
                    }

                    $("#Block_one").append(
                        "<div class=\"tabs-block col-lg-8\">\n" +
                        "\t\t<div class=\"products-carousel-tabs\">\n" +
                        "\t\t\t<ul class=\"nav nav-inline\">\n" +
                        "\t\t\t\t<li class=\"nav-item\"><a class=\"nav-link active\" href=\"#tab-products-1\" data-toggle=\"tab\">猜你喜欢</a></li>\n" +
                        "\t\t\t\t<li class=\"nav-item\"><a class=\"nav-link\" href=\"#tab-products-2\" data-toggle=\"tab\">全新闲置</a></li>\n" +
                        "\t\t\t\t<li class=\"nav-item\"><a class=\"nav-link\" href=\"#tab-products-3\" data-toggle=\"tab\">最热商品</a></li>\n" +
                        "\t\t\t</ul>\n" +
                        "\n" +
                        "\t\t\t<div class=\"tab-content\" id=\"tab-content\">\n" +
                        "\t\t\t\t<div class=\"tab-pane active\" id=\"tab-products-1\" role=\"tabpanel\">\n" +
                        "\t\t\t\t\t<div class=\"woocommerce columns-3\">\n" +
                        "\n" +
                        "\t\t<ul class=\"products columns-3\">\n" +
                            likeBox+
                        "\t\t\t\t\t</ul>\n" +
                        "\t\t\t\t\t</div>\n" +
                        "\t\t\t\t</div>\n" +
                        "\t<!-- 全新闲置 --->\n" +
                        "\t\t\t\t<div class=\"tab-pane\" id=\"tab-products-2\" role=\"tabpanel\">\n" +
                        "\t\t\t\t\t<div class=\"woocommerce columns-3\">\n" +
                        "\t\t\t\t\t\t\t\t\t\t\t\t<ul class=\"products columns-3\">\n" +
                        newLeaveBox+
                        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</ul>\n" +
                        "\t\t\t\t\t</div>\n" +
                        "\t\t\t\t</div>\n" +
                        "\n" +
                        "\t\t\t\t<!--=====================================全新闲置结束 最热商品开始========== -->\n" +
                        "\t\t\t\t<div class=\"tab-pane\" id=\"tab-products-3\" role=\"tabpanel\">\n" +
                        "\t\t\t\t\t<div class=\"woocommerce columns-3\">\n" +
                        "\t\t\t\n" +
                        "\t\t<ul class=\"products columns-3\">\n" +
                        topSeeNumberBox+
                        "\t\t</ul>\n" +
                        "\n" +
                        "\t\t\t\t\t</div>\n" +
                        "\t\t\t\t</div>\n" +
                        "\t\t\t</div>\n" +
                        "\t\t</div>\n" +
                        "\t</div>"
                    );
                }
            }
        });
    }
