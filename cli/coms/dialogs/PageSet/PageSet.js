import Vue from 'vue';
import $ from 'jquery';

import {
    Dialog,
    Button,
}
from 'element-ui'
Vue.use(Dialog);
Vue.use(Button);


let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

//动态加载功能,附着$data._xsetConf,所有路由都由xrouter触发，不需要watch
var xsetConf = {};
xsetConf.coderView = {
    before: async function mainViewLoader(name, oldName) {
        var com = await System.import('../../blocks/Coder/Coder.html');
        Vue.component('coder', com);
    },
};

com.props = {
    conf: Object, //{show,pageName,file{name,url,key...}}
};

//所有数据写在这里
com.data = function data() {
    var headStr = this.$xglobal.conf.temp.headData;

    return {
        coderView: '',
        _xsetConf: xsetConf, //设置xset的钩子事件
        title: `页面头部<head>代码`,
        headData: {
            code: localStorage.getItem('preview-head') || headStr,
        },
        headCode: localStorage.getItem('preview-head') || headStr,
    };
};

com.watch = {
    'conf.show': {
        handler: function (val, oldval) {
            var ctx = this;
            if (val) {
                ctx.conf.ipt = false;
                var headStr = this.$xglobal.conf.temp.headData;
                var headData = localStorage.getItem('preview-head') || headStr;
                ctx.$set(ctx.$data.headData, 'code', headData);
                ctx.$set(ctx.$data, 'headCode', headData);
            };

            //使关闭窗口的钩子生效
            if (!val && ctx.conf.ipt == true && ctx.conf.onHide) {
                ctx.conf.onHide(ctx);
            }
        },
        deep: true
    },
}


//所有直接使用的方法写在这里
com.methods = {
    saveHeadData: saveHeadData,
    syncCode: function (code) {
        this.$data.headCode = code;
    },
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {
    var ctx = this;

    //载入编辑器
    ctx.$xset(ctx, {
        coderView: 'coder',
    });
};

//-------所有函数写在下面--------
function saveHeadData() {
    var ctx = this;
    ctx.conf.ipt = true;
    localStorage.setItem('preview-head', ctx.$data.headCode);
    ctx.$set(ctx.conf, 'show', false);
};
