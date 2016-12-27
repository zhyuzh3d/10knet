/*后端服务程序入口,初始化babel，支持ES7
 */
'use strict';

//ES6/ES7转译
const $babel = global.$babel = require("babel-core/register");
const $polyFill = global.$polyFill = require("babel-polyfill");

//导入全局插件
const $fs = global.$fs = require('fs');
const $path = global.$path = require('path');
const $Koa = global.$Koa = require('koa');
const $_ = global.$_ = require('lodash');
const $moment = global.$moment = require('moment');


//服务程序真正的入口
require("./_app.js");

