/*jsonp中间件,位于流程结尾处
 */
'use strict';

const alogger = async function (ctx, next) {
    const start = new Date();
    const stm = $moment(start).format('YYYY/MM/DD hh:mm:ss');
    console.log(`[ ${stm} ] ${ctx.method} : ${ctx.url}`);
    await next();
    const ms = new Date() - start;
    console.log(`-> ${ms}ms`);
};

module.exports = alogger;
