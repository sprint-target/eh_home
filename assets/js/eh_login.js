$(function () {
    //是否登录判断，用户进入登录页面，如已存在登录信息(token存在并解析正确)，则直接挑转到index.html
    loginWhere();
    var localIp="116.9.184.156"; //存储IP
    var sliderStatus=false;//是否完成滑块验证
    var sliderObj=false;

       //使用API获取IP
    /* $.ajax({
                'url':'http://api.ip138.com/query/',//API
                'data':{            //默认自动添加callback参数
                    'ip':'', //为空即为当前iP地址
                    'oid':'14344',
                    'mid':'77277',
                    'token':'478ade2754dce83087eb5c066c5b6eff'  //不安全，请定期刷新token，建议进行文件压缩
                },
                'dataType':'jsonp',
                'success':function(json){
                    if (json.ret == "ok"){ //获取成功则取出IP
                        localIp=json.ip;
                        // getIPStatus(localIp);
                    }
                }
     });*/

     // 页面加载完毕并且成功获取ip后与服务器交互，判断是否需要滑块验证（此操作会耗费服务器资源）
     function getIPStatus(ipxx) {
         $.ajax({
             type: "GET",
             url: serverURL+"/user/getIPStatus",
             data:"localIp="+ipxx,
             dataType:"json",
             success: function(data){
                 if(data.errorCode=="200") {
                     $("#slider2").remove();
                     $("#slider-box").after("<div id=\"slider2\" class=\"slider\"  ></div>");
                     loadSlider();
                 }
             },
         });
     }

//登录按钮点击事件
    $('#loginBtn').click(function(){

        if ($("#username").val() == null || $("#username").val().length == 0){
            $('#username').siblings('label').find('.form-title').html("请输入用户名");
            return false;
        }
        if ($("#password").val() == null || $("#password").val().length == 0){
            $('#password').siblings('label').find('.form-title').html("请输入密码");
            return false;
        }
        if (localIp == null || localIp.length == 0){
            layer.msg("请检查您的网络情况...");
            return false;
        }

        if($("#slider2").length > 0)
        {
            // alert('对象存在');
            sliderObj=true;
        }
        else
        {
            // alert('对象不存在');
            sliderObj=false;
        }


        $.ajax({
            type: "POST",
            url: serverURL+"/user/login",
            data:$('#myform').serialize()+"&localIp="+localIp+"&sliderStatus="+sliderStatus+"&sliderObj="+sliderObj,
            dataType:"json",
            success: function(data){
                if(data.errorCode=="500") {
                    layer.msg(data.message);
                }
                if(data.errorCode=="200") {
                    localStorage.setItem("eh_token",data.item.token);
                    addCookieCartService();
                    window.location.href="index.html";

                }
                if (data.errorCode == "405"){
                    layer.msg(data.message);
                    $("#slider2").remove();
                    $("#slider-box").after("<div id=\"slider2\" class=\"slider\"  ></div>");
                    loadSlider();
                }
            },
            error:function(data) {
                layer.msg("服务器繁忙,请稍后再试");
                return false;
            },
        });
        return false;
    });


//判断是否登录
function loginWhere() {
    if ( localStorage.getItem("eh_token") == null){
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

    //初始化滑块
    function loadSlider() {
        $("#slider2").slider({
            width: 420, // width
            height: 40, // height
            sliderBg: "#888", // 滑块背景颜色
            color: "#fff", // 文字颜色
            fontSize: 14, // 文字大小
            bgColor: "#33CC00", // 背景颜色
            textMsg: "按住滑块，拖拽验证", // 提示文字
            successMsg: "验证通过", // 验证成功提示文字
            successColor: "#fff", // 滑块验证成功提示文字颜色
            // time: 4900, // 返回时间
            callback: function(result) { // 回调函数，true(成功),false(失败)
                if (result){
                    sliderStatus=true;
                    $(".ui-slider-btn").css({
                        'border-top-left-radius':'0px',
                        'border-bottom-left-radius':"0px"
                    });
                }else {
                    sliderStatus=false;
                }
            }
        });
    }

    $("#username").blur(function () {
        if ($("#username").val() == null || $("#username").val().length == 0){
            $('#username').siblings('label').find('.form-title').html("请输入用户名");
        }else {
            $('#username').siblings('label').find('.form-title').html("");
        }
    });

    $("#password").blur(function () {
        if ($("#password").val() == null || $("#password").val().length == 0){
            $('#password').siblings('label').find('.form-title').html("请输入密码");
        }else {
            $('#password').siblings('label').find('.form-title').html("");
        }
    });

    function  addCookieCartService() {
        var cartObj=[];
        var  cookieCart=getCookie("cart");
        if(cookieCart != null){
            cartObj=cookieCart;
        }else {
            cartObj=JSON.stringify(cartObj);
        }

        $.ajax({
            type: "post",
            url: serverURL+"/shoppingCart/addCookieShoppingCart",
            data:{"token":localStorage.getItem("eh_token"),"ds":cartObj},
            dataType:"json",
            success: function(data){
                if (data.errorCode == "200"){
                  delCookie("cart");
                }

            }
        });

    }


    function delCookie(name) {                   //删除一个cookie
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        // var cval=getCookie(name);
        var cval='';
            document.cookie= name + "="+cval+";expires="+exp.toUTCString();

    }

    //获取cookie
    function getCookie(c_name)
    {
        if (document.cookie.length>0)
        {
            c_start=document.cookie.indexOf(c_name + "=")
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1
                c_end=document.cookie.indexOf(";",c_start)
                if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            }
        }
        return null;
    }



});