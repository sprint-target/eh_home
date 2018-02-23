//全局变量定义（必须引用此文件）---------------------------------------------------------------------------------
var serverURL="http://localhost:8080";


$(function () {
    //加载登录信息
    getheaderMessage();

    //导航栏下拉
    $('#xl').mouseover(function () {
        $('.menu-item-xiala').css('display','block');
    });
    $('#xl').mouseout(function () {
        $('.menu-item-xiala').css('display','none');
    });



    //产品分类初始化

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

function adminExit() {
    localStorage.removeItem("eh_token");
    window.location.href="index.html";
}

    function  productTypeInit() {
        $.ajax({
            type: "GET",
            url: serverURL+"/admin/productRank",
            data:{rank:"",superId:""},
            dataType:"json",
            success: function(data){
                if(data.errorCode=="500") {
                    layer.msg(data.message);
                }
                if(data.errorCode=="200") {
                    // alert(data.list[0].productTypeRank ==1);
                    $.each(data.list, function(index, p) {
                        if (p.productTypeRank ==1){
                            $('#productRank').append(
                            "<li class=\"yamm-tfw menu-item menu-item-has-children animate-dropdown dropdown\">\n" +
                                "\t\t\t<a title=\""+p.productTypeName+"\" data-hover=\"dropdown\" href=\"login.html\" data-toggle=\"dropdown\" class=\"dropdown-toggle\" aria-haspopup=\"true\" target='_blank'>"+p.productTypeName+"</a>\n" +
                                "\t\t\t<ul role=\"menu\" class=\" dropdown-menu\" style=\"min-height: 55.75px; visibility: visible; display: block; width: 540px; opacity: 1;\">\n" +
                                "\t<li class=\"menu-item animate-dropdown menu-item-object-static_block\">\n" +
                                "\t\t<div class=\"yamm-content\">\n" +
                                "\t\t\t<div class=\"row bg-yamm-content bg-yamm-content-bottom bg-yamm-content-right\">\n" +
                                "\t\t\t\t<div class=\"col-sm-12\">\n" +
                                "\t\t\t\t\t<div class=\"vc_column-inner \">\n" +
                                "\t\t\t\t\t\t<div class=\"wpb_wrapper\">\n" +
                                "\t\t\t\t\t\t\t<div class=\"wpb_single_image wpb_content_element vc_align_left\">\n" +
                                "\t\t\t\t\t\t\t\t<figure class=\"wpb_wrapper vc_figure\">\n" +
                                "\t\t\t\t\t\t\t\t\t<div class=\"vc_single_image-wrapper vc_box_border_grey\">\n" +
                                "\n" +
                                "\t\t\t\t\t\t\t\t\t\t<img src=\"assets/images/megamenu-2.png\" class=\"vc_single_image-img attachment-full\" alt=\"\">\n" +
                                "\t\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t\t</figure>\n" +
                                "\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t</div>\n" +
                                "\t\t\t\t</div>\n" +
                                "\t\t\t</div>\n" +
                                "\t\t\t<div class=\"row\">\n" +
                                "\t\t\t\t<div class=\"col-sm-6\">\n" +
                                "\t\t\t\t\t<div class=\"vc_column-inner \">\n" +
                                "\t\t\t\t\t\t<div class=\"wpb_wrapper\">\n" +
                                "\t\t\t\t\t\t\t<div class=\"wpb_text_column wpb_content_element \">\n" +
                                "\t\t\t\t\t\t\t\t<div class=\"wpb_wrapper\">\n" +
                                "\t\t\t\t\t\t\t\t\t<ul>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li class=\"nav-title\">Computers &amp; Accessories</li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">All Computers &amp; Accessories</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Laptops, Desktops &amp; Monitors</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Pen Drives, Hard Drives &amp; Memory Cards</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Printers &amp; Ink</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Networking &amp; Internet Devices</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Computer Accessories</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Software</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li class=\"nav-divider\"></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\"><span class=\"nav-text\">All Electronics</span><span class=\"nav-subtext\">Discover more products</span></a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t</ul>\n" +
                                "\n" +
                                "\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t</div>\n" +
                                "\t\t\t\t</div>\n" +
                                "\t\t\t\t<div class=\"col-sm-6\">\n" +
                                "\t\t\t\t\t<div class=\"vc_column-inner \">\n" +
                                "\t\t\t\t\t\t<div class=\"wpb_wrapper\">\n" +
                                "\t\t\t\t\t\t\t<div class=\"wpb_text_column wpb_content_element \">\n" +
                                "\t\t\t\t\t\t\t\t<div class=\"wpb_wrapper\">\n" +
                                "\t\t\t\t\t\t\t\t\t<ul>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li class=\"nav-title\">Office &amp; Stationery</li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">All Office &amp; Stationery</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t\t<li><a href=\"#\">Pens &amp; Writing</a></li>\n" +
                                "\t\t\t\t\t\t\t\t\t</ul>\n" +
                                "\n" +
                                "\t\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t\t</div>\n" +
                                "\t\t\t\t\t</div>\n" +
                                "\t\t\t\t</div>\n" +
                                "\t\t\t</div>\n" +
                                "\t\t</div>\n" +
                                "\t</li>\n" +
                                "</ul>\n" +
                                "\t\t</li>\n"
                            );
                        }

                    });
                    // $('#productRank').append(
                    //
                    // );
                }

            }
        });
    }
