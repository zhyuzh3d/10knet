/**
 * 最初默认启动的教程
 */

import Vue from 'vue';
import $ from 'jquery';

import {
    Button,
    Col,
    Row,
    Message,
    Notification,
}
from 'element-ui';

Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
const message = Message;
Vue.prototype.$message = message;
const notify = Notification
Vue.prototype.$notify = notify;

let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

com.props = {
    xid: {
        type: String,
        default: 'TutorStart'
    },
};

//所有数据写在这里
com.data = function data() {
    var ctx = this;
    return {
        Ee: ctx.$xcoms['App_mainView'],
        stage: 0,
    };
};

//所有直接使用的方法写在这里
com.methods = {
    setStage: function setStage(n) {
        var ctx = this;
        ctx.$xset(ctx.xid, {
            stage: n,
        });
    },
    showUpload: async function showUpload() {
        var ctx = this;
        var fns = ctx.$xglobal.fns;
        fns.visualClick($(ctx.$xcoms['App_mainView'].$el).find('#barPicBtn'), false);
    },
    replacePicUrl: async function replacePicUrl() {
        var ctx = this;
        var fns = ctx.$xglobal.fns;
        var editor = ctx.$xcoms['bodyCoder'].editor;

        //激活编辑器，显示遮罩
        fns.showFullMask(false);
        fns.visualClick($(ctx.$xcoms['bodyCoder'].$el), true);
        fns.showFullMask();
        await fns.sleep(500);

        //搜索id="myPhoto" src=，替换src
        var codeErr = false;
        var cursorFrom = editor.getSearchCursor(/id\s*=\s*"myPhoto"\s*src\s*=\s*"/g);
        if (cursorFrom.findNext()) {
            var cursorTo = editor.getSearchCursor(/"/g, cursorFrom.to());
            if (cursorTo.findNext()) {
                await fns.sleep(500);
                var cto = cursorTo.to();
                cto.ch -= 1;
                ctx.$message('选择img标记src引号内的链接');
                await fns.sleep(2000);
                editor.setSelection(cursorFrom.to(), cto);
                await fns.sleep(2000);
                ctx.$message('按DEL键删除');
                await fns.sleep(2000);
                await editor.doc.replaceSelection('');
                editor.setCursor(cursorFrom.to());
                await fns.sleep(2000);
                ctx.$message('Ctrl+V粘贴刚才复制的链接');
                await fns.sleep(1000);
                await editor.doc.replaceSelection('http://app.10knet.com/HkDFBmnOg/yy.png');
                ctx.$xcoms['bodyCoder'].keyUp('a');
            } else {
                codeErr = true;
            };
        } else {
            codeErr = true;
        };

        //代码异常，重载模版然后再执行
        if (codeErr) {
            ctx.$notify({
                title: '代码出现异常，自动为您重新载入模版'
            });
            await ctx.$data.Ee.loadTemplate(ctx.$xglobal.conf.pageTemplates.resume, true);
            await fns.sleep(3000);
            ctx.replacePicUrl();
        } else {
            //结束，移除遮罩
            await fns.sleep(2000);
            fns.showFullMask(false);
        };
    },
    loadResume: async function () {
        var ctx = this;
        var fns = ctx.$xglobal.fns;

        fns.showFullMask();
        await fns.sleep(1000);
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
        fns.showFullMask(false);
        fns.visualClick($(ctx.$xcoms['bodyCoder'].$el), true);
        fns.showFullMask();
        await fns.sleep(500);

        //动画搜索和替换
        var nameArr = ['孙悟空', '刘德华', '李雷', '韩梅梅', '赵丽颖', '周杰伦', '杨幂'];
        var name = nameArr[Math.floor(Math.random() * nameArr.length)];
        var donext = true;
        for (var i = 0; donext; i++) {
            var cursor = editor.getSearchCursor(/王晓明/g);
            var has = cursor.findNext();
            if (!has) {
                donext = false;
                break;
            };

            editor.setCursor(cursor.from());
            await fns.sleep(500);
            editor.setSelection(cursor.from(), cursor.to());
            await fns.sleep(500);
            editor.setCursor(cursor.from());

            await ctx.$xcoms['bodyCoder'].typeWriterDel(3);
            await ctx.$xcoms['bodyCoder'].typeWriter(name);
            editor.setCursor(cursor.from());
        };

        //结束，移除遮罩
        await fns.sleep(500);
        fns.showFullMask(false);
    },
    showShare: async function showShare() {
        var ctx = this;
        var fns = ctx.$xglobal.fns;
        await fns.sleep(500);
        fns.visualClick($(ctx.$xcoms['App_mainView'].$el).find('#barShareBtn'), false);
    },
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {};

//-------functions--------








//
