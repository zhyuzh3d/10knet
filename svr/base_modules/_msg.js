/*通用的返回的信息格式，提供msg类
 */

//---------------classes-----------------------
/**
 * 基本的Err信息类
 * {tip:'xxx',id:-1}
 */
class Err {
    constructor(tip, id = -1) {
        this.id = id;
        this.tip = tip;
    };
};

/**
 * 基本的Msg信息类
 * {err:{tip:'xxx',id:-1},res:{data:xxx,id:0,time:xxx}}
 * 其中id从ctx中的request中提取得到，默认为0
 */
class Msg {
    constructor(err, ctx, data) {
        if (err) {
            this.err = {
                tip: (err.info && err.info.tip) || err.tip || err.message || '未知错误',
                id: (err.info && err.info.id) || err.id || -1,
            };
        } else {
            this.err = undefined;
        };

        this.res = {
            data: data,
            id: ctx ? (ctx.query.id || ctx.request.body.id) : 0,
            time: new Date().getTime(),
        };
    }
};

//--------------------导出模块------------------------
const _msg = {
    Msg: Msg,
    Errs: {
        RouterPathNotFound: new Err('找不到您所请求的API路径', 101),
        RouterPathFormatErr: new Err('您请求的API路径格式错误', 102),
        RouterMethodNotFound: new Err('找不到您所请求的API方法', 103),
        RouterReqDataFormatErr: new Err('您提交的数据格式错误', 104),

        SmsSendCodeErr: new Err('服务器发送短信失败，请重试', 201),

        AccRegCodeHasSend: new Err('注册验证码已经发送，请不要重复发送，稍后再试', 302),
        AccMobileHasUsed: new Err('手机号码已经被注册，请更换其他号码再试', 303),
        AccRegCodeNotMatch: new Err('注册短信验证码不匹配，请重试', 304),
        AccNotExist: new Err('用户不存在', 305),
        AccPwNotMatch: new Err('密码错误或账号不存在', 306),
        AccRstCodeHasSend: new Err('重置验证码已经发送，请不要重复发送，稍后再试', 307),
        AccRstCodeNotMatch: new Err('重置短信验证码不匹配，请重试', 308),
        AccNameHasUsed: new Err('用户名已经被使用', 309),

        PageNameUsed: new Err('页面名称已经被使用，请更换后重试', 401),
        PageNoPower: new Err('您无权对页面进行操作', 402),
        PageNoExist: new Err('您请求的页面不存在', 403),
        PageFileNoExist: new Err('您请求页面还没有创建文件', 404),
    },
};

module.exports = _msg;


//--------------扩展Error类的方法------------------------
/**
 * 绑定Err对象到Error.info格式{tip:'xxx',id:-1}
 * @param   {object}   err 信息对象应包含tip和id两个字段
 * @param   {string} str 附加到message和info.tip的额外字符串
 * @returns {object} 被绑定的Error对象
 */
Error.prototype.zbind = function (err = {}, str) {
    var tip = err.tip || this.message || '未知错误';
    if (str) tip += str;
    this.message = tip;
    this.info = {
        tip: tip,
        id: err.id || -1,
    };
    return this;
};

/**
 * 获取Error/Err对象绑定的info对象
 * @returns {object} {tip:'xxx',id:-1}
 */
Error.prototype.zmini = function () {
    return {
        id: this.info ? (this.info.id || -1) : -1,
        tip: this.info ? this.info.tip : this.message,
    };
};
