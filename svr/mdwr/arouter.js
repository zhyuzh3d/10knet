/*简单的路由中间件
 *只是把/api/cmd请求分发到_app.apis[cmd].handler
 */
'use strict';

const arouter = async function (ctx, next) {
    try {
        var urlArr = ctx.path.split('/'); //['','api','cmd']
        if (urlArr.length < 3) throw Error(`${_txts.err.routerPathFormatErr}:${ctx.path}`);

        switch (urlArr[1]) {
            case 'api':
                if (!_app.apis[urlArr[2]]) throw Error(`${_txts.err.routerPathNotFound}:${ctx.path}`);
                await _app.apis[urlArr[2]].method(ctx, next); //方法中的异常会被下面自动捕获
                break;
            default:
                break;
        };
    } catch (err) {
        //捕获异常，只返回信息部分，输出到控制台
        console.error(err);
        ctx.body = err.message;
    };
    await next();
};

module.exports = arouter;


//----------------------------------------

_app.apis.test = {
    method: async function (ctx, next) {
        throw Error('api处理异常');
        ctx.body = 'Get it,test';
    }
};
