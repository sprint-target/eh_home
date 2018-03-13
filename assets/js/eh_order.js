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

/**
 * 时间戳转时间
 */
function getLocalTime(nS) {
    ns= new Date(parseInt(nS));
    return formatDate(ns);
}
/**
 * 格式化Date类型
 */
function formatDate(now) {
    var year=now.getYear();
    var month=now.getMonth()+1;
    var date=now.getDate();
    var hour=now.getHours();
    var minute=now.getMinutes();
    var second=now.getSeconds();
    return "20"+(year-100)+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
}

// 用prototype对Number进行扩展 //参数：保留几位小数，货币符号，千位分隔符，小数分隔符
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || "";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

$.ajax({
    type: "GET",
    url: serverURL+"/order/order",
    async:true,//异步请求
    data:{"token":localStorage.getItem("eh_token"),
            "productName":""
    },
    dataType:"json",
    success: function(data){
        if(data.errorCode=="200") {
            $.each(data.list,function (index,o) {
                o.createTime=getLocalTime(o.createTime);

                var state;
                var continuePlay="";
                var quxiaoOrder="";
                if(o.orderState==0)
                {
                    state="未支付";
                    continuePlay=" <div style=\"width:6%; float: right; height: 90%;color: #fff;\"><a href=\"#\" style=\"text-decoration:underline ;color: #333E48;\">继续支付</a></div>"
                }

                if(o.orderState==1){
                    state="已支付";
                    quxiaoOrder=" <div style=\"width:6%; float: right; height: 90%;\"><a href=\"#\" style=\"text-decoration:underline ;color: #333E48;\">取消订单</a></div>"
                }
                if(o.orderState==2){
                    state="交易完成";
                }
                if(o.orderState==3){
                    state="交易关闭";
                }


                $(".order-tbody").append("<div class=\"order-list\" style=\"margin-bottom: 20px\">\n" +
                    "                                    <div class=\"order_code\">\n" +
                    "                                        <div style=\"width:20%; float: left; height: 90%;color: #fff;\" id=\"orderCode\">\n" +
                    "                                            &nbsp;&nbsp;&nbsp;订单号: "+o.orderCode+"\n" +
                    "                                        </div>\n" +
                    "                                            <div style=\"width:10%; float: left; height: 90%; color: #fff;\">\n" +
                    "                                            卖家: <a href=\"#\" style=\"text-decoration:underline ;color: #fff;\">\n" +o.sellUser.userName+
                    "                                                \n" +
                    "                                            </a>\n" +
                    "                                        </div>\n" +
                    "\n" +
                    "                                        <div style=\"width:10%; float: left; height: 90%;margin-left: 10%;color: #fff;\">\n" +
                    "                                            "+state+"\n" +
                    "                                        </a>\n" +
                    "                                        </div>\n" +
                    "\n" +
                        continuePlay+
                    "\n" +
                        quxiaoOrder+
                    "\n" +
                    "                                        <div style=\"width:6%; float: right; height: 90%;color: #fff;\">\n" +
                    "                                            <a href=\"#\" title='继续支付' style=\"text-decoration:underline ;color:#FFFFFF;\">\n" +
                    "                                                删除订单\n" +
                    "                                            </a>\n" +
                    "                                        </div>\n" +
                    "\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"order_body\">\n" +
                    "                                        <div class=\"order_img\">\n" +
                    "                                            <img src=\"assets/images/products/6.jpg\"  width=\"80px\" height=\"100%\">\n" +
                    "                                        </div>\n" +
                    "                                        <div class=\"order_name\">\n" +
                    "                                            <p title='"+o.product.productName+"' style=\" width:235px;vertical-align: middle; display:table-cell; line-height:17px; text-align: center;word-wrap: break-word;word-break: break-all; \">" +o.product.productName+ "</p>\n"+
                    "                                        </div>\n" +
                    "\n" +
                    "                                        <div class=\"order_message\" style=\"width: 10%;\">\n" +
                    "                                            <p style=\" vertical-align: middle; display:table-cell; line-height:17px;color: #ea1b25;font-weight: bold;\">\n" +
                    "                                                "+o.orderPrice.formatMoney(2,'￥','','.')+"\n" +
                    "                                            </p>\n" +
                    "                                        </div>\n" +
                    "\n" +
                    "                                        <div class=\"order_message\" style=\"width: 10%;\">\n" +
                    "                                            <p style=\" vertical-align: middle; display:table-cell; line-height:17px;\">\n" +
                    "                                               "+o.number+"\n" +
                    "                                            </p>\n" +
                    "                                        </div>\n" +
                    "\n" +
                    "                                        <div class=\"order_message\" style=\"width: 20%;color: #999;\">\n" +
                    "                                            <p style=\"line-height:17px;width: 235px;word-wrap: break-word;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical; -webkit-line-clamp:3;margin: 24px 0px; text-align: left;\" title='"+o.message+"'>" +
                    "                                                "+o.message+"\n" +
                    "                                            </p>\n" +
                    "                                        </div>\n" +
                    "\n" +
                    "                                        <div class=\"order_message\" style=\"width: 20%;\">\n" +
                    "                                            <p style=\" vertical-align: middle; display:table-cell; line-height:17px;\">\n" +
                    "                                                "+ o.createTime+"\n" +
                    "                                            </p>\n" +
                    "                                        </div>\n" +
                    "                                    </div>\n" +
                    "\n" +
                    "                                </div>");
                //append-结束
            })
            


        }
        if(data.errorCode!="200") {

            layer.msg(data.message);
        }
        if (data.errorCode == "501"){
            localStorage.removeItem("eh_token");
        }
    }
});