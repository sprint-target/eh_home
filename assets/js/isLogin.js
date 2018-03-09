
window.onload = function(){
    loginWhere();
}
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