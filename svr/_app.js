/*服务端程序的真正起始文件
 */
'use strict';

const _app = global._app = new $Koa();

//创建其他全局变量
const _txts = global._txts = require('./base_modules/_txts.js')
const _zrouter = global._zrouter = require('./base_modules/_zrouter.js')
const _zloger = global._zloger = require('./base_modules/_zloger.js')


//全部api的容器对象
_app.apis = {};

//控制台日志输出
_app.use(_zloger.koaMiddleWare);

//解析body数据
_app.use(require('koa-body')());

//路由分发到_app.apis对象
_app.use(_zrouter.koaMiddleWare);



_app.listen(8000);
console.info(`==========${$moment().format('YYYY-MM-DD hh:mm:ss')}==========`);



//--------------------------------------
