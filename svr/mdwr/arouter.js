/*简单的路由中间件
 *把/api/cmd请求分发到_app.apis[cmd]，用validate做验证，用method处理业务逻辑
 */
'use strict';







const arouter = async function (ctx, next) {
    try {
        if (!ctx.xdata) ctx.xdata = {}; //穿越处理流程的数据

        var urlArr = ctx.path.split('/'); //['','api','cmd']
        if (urlArr.length < 3) throw Error(`${_txts.err.routerPathFormatErr}:${ctx.path}`);


        switch (urlArr[1]) {
            case 'api':
                var apiObj = _app.apis[urlArr[2]]
                if (!apiObj) throw Error(`${_txts.err.routerPathNotFound}:${ctx.path}`);

                //对提交参数进行验证，可选
                if (apiObj.validator) {
                    if (apiObj.validator.constructor == Function) {
                        await apiObj.validator(ctx, next); //函数模式，由函数自行抛出异常或忽略
                    } else if (apiObj.validator.constructor == Object) {
                        //对象模式，验证对象的每个属性(支持函数和正则表达式)
                        for (var key in apiObj.validator) {
                            //从url、body获取字段放入xdata
                            ctx.xdata[key] = ctx.query[key] || ctx.request.body[key];

                            //对字段格式进行验证
                            var vali = apiObj.validator[key];
                            var pass = true;

                            if (vali.constructor == Function) {
                                pass = await vali(ctx, next); //返回真假，然后await next
                            } else if (vali.constructor == RegExp) {
                                pass = vali.test(ctx.xdata[key]); //使用正则可选/^(undefined|\d{1})$/
                            } else {
                                pass = false;
                            };

                            if (!pass) {
                                throw Error(`${_txts.err.routerBodyFormatErr}:${ctx.path}:${key}`);
                                break;
                            };
                        };
                    };
                };

                //执行路由方法,必须
                if (apiObj.method) {
                    await _app.apis[urlArr[2]].method(ctx, next); //方法中的异常会被下面自动捕获
                } else {
                    throw Error(`${_txts.err.routerMethodNotFound}:${ctx.path}`)
                };
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

async function apiValidate(ctx, next) {

};


/*接口测试test,基础apiObj格式参考这里
 */
_app.apis.test = {
    validator: {
        uid: /^(undefined|\d{1,3})$/,
        name: async function (ctx, next) {
            return ctx.xdata.name == 'haha';
            await next();
        },
    },
    method: async function (ctx, next) {
        //throw Error('api处理异常');
        ctx.body = 'Get it,test';
    },
};
