/*服务端程序的真正起始文件,导出_app对象
 */
'use strict';

const _app = global._app = new $koa();
module.exports = _app;

//统一引入其他模块
const _xconf = global._xconf = require('../xconf/secret/_xconf.js');
const _conf = global._conf = require('./base_modules/_conf.js');
const _msg = global._msg = require('./base_modules/_msg.js');
const _zfns = global._zfns = require('./base_modules/_zfns.js');

const _zloger = global._zloger = require('./base_modules/_zloger.js');
const _zprms = global._zprms = require('./base_modules/_zprms.js');
const _zreq = global._zreq = require('./base_modules/_zreq.js');
const _zrouter = global._zrouter = require('./base_modules/_zrouter.js');

const _qn = global._qn = require('./app_modules/_qn.js');
const _github = global._github = require('./app_modules/_github.js');

(async function () {
    //全部api的容器对象
    _app.apis = {};

    //控制台日志输出
    _app.use(_zloger.koaMiddleWare);

    //解析body数据
    _app.use($koaBody());

    //路由分发到_app.apis对象
    _app.use(_zrouter.koaMiddleWare);

    //启动服务器，打印分割线
    _app.listen(8000);
})();




//--------------------------------------
