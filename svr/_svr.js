/*后端服务程序入口,初始化babel，支持ES7
 */
'use strict';

//所有通用库，包含node_modules和my_modules
const $babel = global.$babel = require("babel-core/register");
const $polyFill = global.$polyFill = require("babel-polyfill");
const $Koa = global.$Koa = require('koa');
const $_ = global.$_ = require('lodash');
const $moment = global.$moment = require('moment');


//服务程序真正的入口
require("./_app.js");
