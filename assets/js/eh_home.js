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

});

//获取网页头部 Admin登录信息
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
