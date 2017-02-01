/*sms短信发送功能
 */
var _sms = {
    sendCode,
};



//-------------------functions--------------------
/**
 * 向指定手机号码发送6位数字验证码
 * @param   {string}   mobile 目标手机号码
 * @param   {string}   type   模版名称，_conf.Sms.Template中设定,这里不区分大小写
 * @returns {string}   发送的代码Code
 */
async function sendCode(mobile, type) {
    var ts = Math.round(new Date().getTime() / 1000);
    var id = ts + Math.random().toString().substr(2, 6);
    var code = String(Math.random()).substr(2, 6);

    var url = '/v5/tlssmssvr/sendsms?';
    url += `sdkappid=${_conf.Sms.AppId}&random=${id}`;

    var sig = $sha256(`appkey=${_conf.Sms.AppKey}&random=${id}&time=${ts}&mobile=${mobile}`);

    var data = {
        tel: {
            nationcode: '86',
            mobile: mobile,
        },
        tpl_id: _conf.Sms.Templates[type.toUpperCase()],
        params: [code, _conf.Sms.ExpMin],
        time: ts,
        ext: id,
        extend: '',
        sig: sig,
    };


    var options = {
        hostname: 'yun.tim.qq.com',
        port: 443,
        path: url,
        method: 'POST'
    };

    var res = await _zreq(options, data, 'https:');
    res = JSON.safeParse(res);
    if (res.result != 0) throw Error(`sendMobileCode Error:${res.errmsg}`);

    return code;
};







//导出模块
module.exports = _sms;
