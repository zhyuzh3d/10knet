/**
 * 关于我们弹窗
 */

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

com.props = {
    xid: String,
    conf: Object, //{show,pageName,file{name,url,key...}}
};

//所有数据写在这里
com.data = function data() {
    return {};
};

com.watch = {
    'conf.show': {
        handler: function (val, oldval) {
            var ctx = this;
            //使关闭窗口的钩子生效
            if (!val && ctx.conf.onHide) {
                ctx.conf.onHide(this);
            }
        }
    },
}


//所有直接使用的方法写在这里
com.methods = {};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {};

//-------所有函数写在下面--------
