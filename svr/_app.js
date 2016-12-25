/*服务端程序的真正起始文件
 */
'use strict';

const _app = global._app = new $Koa();

//创建其他全局变量
const _txts = global._txts = require('./base_modules/_txts.js')
const _zrouter = global._zrouter = require('./base_modules/_zrouter.js')


//全部api的容器对象
_app.apis = {};

//控制台日志输出
_app.use(require('./mdwr/alogger.js'));

//路由分发到_app.apis对象
_app.use(_zrouter.mdwr);



_app.listen(8000);



//--------------------------------------
