import Vue from 'vue';
import $ from 'jquery';

import {
    Dialog,
    Button,
    Input,
    Card,
    Notification,
}
from 'element-ui'
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Input);
Vue.use(Card);
const notify = Notification
Vue.prototype.$notify = notify;

let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

com.props = {
    conf: Object, //{show}
};

//所有数据写在这里
com.data = function data() {
    var ctx = this;
    return {
        templates: ctx.$xglobal.conf.pageTemplates,
        inputUrl: '',
    };
};

com.watch = {
    'conf.show': {
        handler: function (val, oldval) {
            var ctx = this;
            //使关闭窗口的钩子生效
            if (val) {
                ctx.conf.ipt = false;
                ctx.$set(ctx.$data, 'templates', ctx.$xglobal.conf.pageTemplates);
            };

            if (!val && ctx.conf.onHide) {
                //如果用户手工输入了地址，那么清理template信息
                if (ctx.$data.inputUrl != ctx.conf.template.url) {
                    ctx.conf.template = {
                        url: ctx.$data.inputUrl,
                        name: 'untitled',
                        desc: 'none',
                    };
                };

                ctx.conf.onHide(ctx);
            };
        },
        deep: true
    },
}


//所有直接使用的方法写在这里
com.methods = {
    closeDialog: closeDialog,
    iframeLoad: iframeLoad,
    seleletTemp: seleletTemp,
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {
    var ctx = this;
    if (!ctx.conf.template) {
        ctx.conf.template = {};
    };
};

//-------所有函数写在下面--------
function closeDialog() {
    var ctx = this;
    if (!ctx.conf.template || !ctx.conf.template.url) {
        ctx.$notify.error({
            title: `您还没选择模版`,
            message: '点击任意模版即可选择',
        });
        return;
    };

    ctx.conf.ipt = true;
    ctx.$set(ctx.conf, 'show', false);
};


/**
 * 点击卡片选择模版
 * @param {object}   temp temp{name,url,desc}
 * @param {object} ctx ctx
 */
function seleletTemp(temp) {
    var ctx = this;
    ctx.$set(ctx.conf, 'template', temp);
    ctx.$set(ctx.$data, 'inputUrl', temp.url);
};


/**
 * iframe预览窗口载入后自动缩放，适配宽度
 * @param {object}   evt evt
 * @param {object} ctx ctx
 */
function iframeLoad(evt) {
    var ctx = this;
    var jo = $(evt.target);
    jo.hide();
    var inwid = jo.width();
    var outwid = jo.parent().width();
    var rate = outwid / inwid;
    jo.css('transform', `scale(${rate},${rate})`);
    jo.show();
};




//
