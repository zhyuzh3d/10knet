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
        var fns = ctx.$xglobal.fns;

        fns.showFullMask();
        fns.visualClick($(ctx.$xcoms['App_mainView'].$el).find('#barTempBtn'), true);
        await fns.sleep(1500);
        fns.visualClick($(ctx.$xcoms['PageTemplates'].$el).find('#resume'), true);
        await fns.sleep(1500);
        fns.visualClick($(ctx.$xcoms['PageTemplates'].$el).find('#loadBtn'), true);
        await fns.sleep(1500);
        fns.visualClick($('.el-message-box__wrapper').find('button:contains("确定")'), true);
        await fns.sleep(1500);
        fns.showFullMask(false);
    },
    renameWxm: async function () {
        var ctx = this;
        var fns = ctx.$xglobal.fns;
        var editor = ctx.$xcoms['bodyCoder'].editor;

        //避免被用户修改过，重载模版
        await ctx.$data.Ee.loadTemplate(ctx.$xglobal.conf.pageTemplates.resume, true);

        //激活编辑器，显示遮罩
        fns.visualClick($(ctx.$xcoms['bodyCoder'].$el), true);
        fns.showFullMask();
        await fns.sleep(500);

        //动画搜索和替换
        for (var i = 0; i < 10; i++) {
            var cursor = editor.getSearchCursor(/王晓明/g);
            var donext = cursor.findNext();
            if (!donext) return;

            editor.setCursor(cursor.from());
            await fns.sleep(500);
            editor.setSelection(cursor.from(), cursor.to());
            await fns.sleep(500);
            editor.setCursor(cursor.from());

            await ctx.$xcoms['bodyCoder'].typeWriterDel(3);
            await ctx.$xcoms['bodyCoder'].typeWriter('孙悟空');
        };

        //结束，移除遮罩
        await fns.sleep(500);
        fns.showFullMask(false);
    },
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {};

//-------functions--------








//
