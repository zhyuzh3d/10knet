/*account账号相关功能
 */
var _acc = {};

//-------------------apis--------------------
/**
 * 用户注册之前获取手机验证码，以此确认对此手机号码所有权
 * 成功返回空
 */
_zrouter.addApi('/accGetPhoneRegCode', {
    validator: {
        mobile: _conf.regx.mobile,
    },
    method: async function (ctx) {
        var code = _sms.sendCode(mobile, 'reg');
        ctx.body = new _msg.Msg(null, ctx, null);
    },
});


//-------------------functions--------------------







//导出模块
module.exports = _acc;
