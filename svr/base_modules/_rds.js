/*连接redis服务器
提供redis相关的基础功能函数
*/

var _rds = {
    cli: $redis.createClient(6379, 'localhost', {}),
};

//全部key列表,所有映射map_开头,所有临时tmp_开头,所有对象直接写
_rds.k = {
    mobileRegCode: function (mobile) { //向用户发送的手机注册验证码,string
        return 'mobileRegCode' + mobile;
    },
    mobileRstCode: function (mobile) { //向用户发送的手机注册验证码,string
        return 'mobileRstCode-' + mobile;
    },
    captchaCode: function (key) { //验证码的键，存储正确答案，string
        return 'captchaCode-' + key;
    },
};



//导出模块
module.exports = _rds;
