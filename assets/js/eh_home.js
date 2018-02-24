//全局变量定义（必须引用此文件）---------------------------------------------------------------------------------
var serverURL="http://localhost:8080";


$(function () {
    //加载登录信息
    getheaderMessage();
    //加载分类信息
    productTypeInit();
    //导航栏下拉
    $('#xl').mouseover(function () {
        $('.menu-item-xiala').css('display','block');
    });
    $('#xl').mouseout(function () {
        $('.menu-item-xiala').css('display','none');
    });



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
            data:{rank:0,superId:0},
            dataType:"json",
            success: function(data){
                if(data.errorCode=="500") {
                    layer.msg(data.message);
                }
                if(data.errorCode=="200") {
                    // alert(data.list[0].productTypeRank ==1);
                    var rank_1=new Array();
                    var rank_2_JsonObj={};//json对象
                    rank_2_JsonObj.proObj=[];//定义proObj 键
                    $.each(data.list, function(index, p) {
                        //第一次遍历 取出一级类 并存到rank_1数组
                        if (p.productTypeRank ==1){
                           rank_1.push(p.productTypeName);
                           //第二次遍历，取出与一级类对应的二级类 并存到rank_2_JsonObj对象下的proObj数组中
                           $.each(data.list,function (idx,x) {
                               if (x.superType == p.productTypeCode){
                                   var jsonObj= {"superTypeName":p.productTypeName,"superTypeCode":p.productTypeCode,"id":x.id , "productTypeName":x.productTypeName,"productTypeCode":x.productTypeCode,"superType":x.superType};
                                   rank_2_JsonObj.proObj.push(jsonObj);//插入json对象中
                               }
                           });
                        }

                    });

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

                }

            }
        });
    }
