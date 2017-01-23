/*路由功能，同时提供API类
 */
'use strict';

const _zrouter = {
    koaMiddleWare: koaMiddleWare,
    apis: {},
    addApi: addApi,
};

module.exports = _zrouter;


//------------------functions---------------
/**
 * Api类定义
 * @param {string} path request请求路径，如/api/getMyInfo
 * @param {object} obj  对象{validator,method(ctx),[validate(ctx)]}
 */
class Api {
    constructor(path, obj = {}) {
        this.path = path;
        this.validator = obj.validator; //{key:regx|fn(ipt,ctx)}
        this.method = obj.method; //fn(ctx)
        this.validate = obj.validate || apiValidate; //fn(ctx)
    };
};

/**
 * 添加一个api对象
 * @param {string} path request请求路径，如/api/getMyInfo
 * @param {object} obj  对象{validator,method(ctx),[validate(ctx)]}
 */
function addApi(path, obj = {}) {
    _zrouter.apis[path] = new Api(path, obj);
};


/**
 * 每个实例默认的认证方法，使用validator每个key的表达式进行验证，遇到非法即抛出异常；
 * 支持url参数和body参数，验证通过后记入xdata
 */
async function apiValidate(ctx) {
    var api = this;

    if (!api.validator) return; //无须数据验证的情况

    for (var key in api.validator) {
        var inputValue = ctx.query[key] || ctx.request.body[key];
        var vali = api.validator[key];


        var legal = true;

        if (vali.constructor == RegExp) {
            legal = vali.test(inputValue);
        } else {
            legal = await vali(inputValue, ctx); //验证函数需要返回真假值
        };

        if (!legal) {
            throw Error().zbind(_msg.Errs.routerReqDataFormatErr, `:${key}`);
            break;
        } else {
            ctx.xdata[key] = inputValue;
        }
    };
};


/**
 * 中间件，为koa2使用，路由分发到_zrouter.apis;初始化xdata
 */
async function koaMiddleWare(ctx, next) {
    try {
        if (!ctx.xdata) ctx.xdata = {};

        var path = ctx.path;
        var api = _zrouter.apis[path];
        if (!api) throw Error().zbind(_msg.Errs.RouterPathNotFound, `:${path}`);

        await api.validate(ctx); //验证数据

        if (api.method) { //业务处理
            await api.method(ctx);
        } else {
            throw Error().zbind(_msg.Errs.routerMethodNotFound, `:${path}`);
        };
    } catch (err) {
        //捕获异常，输出到控制台,只返回信息部分，
        _zloger.err(`_zrouter:koaMdWr: ${err.stack.toString().substr(0, 256)}`);
        ctx.body = new _msg.Msg(err.zmini(), ctx);
    };

    await next();
};


//---------------samples--------------
/**
 * 仅供测试的test接口范例
 */
_zrouter.addApi('/test', {
    method: async function (ctx) { //处理业务流程，必须否则出异常
        ctx.body = 'OK!';
    },

    validator: {
        uid: /^(undefined|\d{1,3})$/, //正则表达式验证，可选undefined
        name: function (ipt, ctx) { //函数验证必须返回真假，须返回真假值
            return ipt == 'admin';
        }
    },

    validate2: function (ctx) { //同名覆盖默认validate，须手工处理异常
        _zloger.info('_zrouter:api:test,validate.');
        if (ctx.query.uid == 3) throw Error('用户ID格式非法');
    },
})
