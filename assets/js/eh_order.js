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
                    "                                            &nbsp;&nbsp;&nbsp;订单号:"+o.orderCode+"\n" +
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
                    "                                            <a href=\"#\" style=\"text-decoration:underline ;color: #333E48;\">\n" +
                    "                                                继续支付\n" +
                    "                                            </a>\n" +
                    "                                        </div>\n" +
                    "\n" +
                    "                                    </div>\n" +
                    "                                    <div class=\"order_body\">\n" +
                    "                                        <div class=\"order_img\">\n" +
                    "                                            <img src=\"assets/images/products/6.jpg\"  width=\"80px\" height=\"100%\">\n" +
                    "                                        </div>\n" +
                    "                                        <div class=\"order_name\">\n" +
                    "                                            <p style=\" vertical-align: middle; display:table-cell; line-height:17px; text-align: center; \">\n" +
                    "                                               "+o.product.productName+"\n" +
                    "                                            </p>\n" +
                    "\n" +
                    "                                        </div>\n" +
                    "\n" +
                    "                                        <div class=\"order_message\" style=\"width: 10%;\">\n" +
                    "                                            <p style=\" vertical-align: middle; display:table-cell; line-height:17px;color: #D7C10E;\">\n" +
                    "                                                "+o.orderPrice+"\n" +
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
                    "                                            <p style=\" vertical-align: middle; display:table-cell; line-height:17px;\">\n" +
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