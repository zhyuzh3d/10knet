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
        routerPathFormatErr: new Err('您请求的API路径格式错误', 102),
        routerMethodNotFound: new Err('找不到您所请求的API方法', 103),
        routerReqDataFormatErr: new Err('您提交的数据格式错误', 104),
    }
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
