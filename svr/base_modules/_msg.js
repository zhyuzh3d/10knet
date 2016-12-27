/*通用的返回的信息格式，提供msg类
 */

class Err {
    constructor(tip, id = -1) {
        this.id = id;
        this.tip = tip;
    };
};

class Msg {
    constructor(err = {}, ctx, data) {
        this.err = {
            tip: (err.info && err.info.tip) || err.tip || err.message || '未知错误',
            id: (err.info && err.info.id) || err.id || -1,
        };

        this.res = {
            data: data,
            id: ctx ? (ctx.query.id || ctx.request.body.id) : 0,
            time: new Date().getTime(),
        };
    }
};

const _msg = {
    Msg: Msg,
    Errs: {
        RouterPathNotFound: new Err('找不到您所请求的API路径', 101),
        routerPathFormatErr: new Err('您请求的API路径格式错误', 102),
        routerMethodNotFound: new Err('找不到您所请求的API方法', 103),
        routerReqDataFormatErr: new Err('您提交的数据格式错误', 104),
    }
};

//导出模块
module.exports = _msg;


//---------------classes-----------------------




//--------------扩展Error------------------------
Error.prototype.zbind = function (err, str) {
    if (err.constructor != Err) return this;
    if (str) err.tip += str;
    this.message = err.tip || this.message;
    this.info = err;
    return this;
};

Error.prototype.zmini = function () {
    return {
        id: this.info ? (this.info.id || -1) : -1,
        tip: this.info ? this.info.tip : this.message,
    };
};
