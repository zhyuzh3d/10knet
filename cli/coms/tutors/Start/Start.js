/**
 * 最初默认启动的教程
 */

import Vue from 'vue';
import $ from 'jquery';

import {
    Button,
}
from 'element-ui'
Vue.use(Button);

let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

com.props = {
    xid: String,
};

//所有数据写在这里
com.data = function data() {
    var ctx = this;
    return {
        Ee: ctx.$xcoms['App_mainView'],
    };
};

//所有直接使用的方法写在这里
com.methods = {
    loadResume: async function () {
        var ctx = this;
        var temp = ctx.$xglobal.conf.pageTemplates.resume;
        await ctx.Ee.loadTemplate(temp, true);
        return;
    },
    renameWxm: async function () {
        var ctx = this;
        var code = localStorage.getItem('preview-body');
        code = code.replace(/王晓明/g, '孙悟空');
        localStorage.setItem('preview-body', code);
        ctx.Ee.$set(ctx.Ee.$data.bodyData, 'code', code);
        ctx.Ee.refreshJsMenual();
    },
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {};

//-------functions--------








//
