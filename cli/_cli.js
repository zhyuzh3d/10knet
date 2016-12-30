//主战入口文件，将自动载入子站并完成vue和插件的初始化
import Vue from 'vue';

//elements ui主题库
import './theme/index.css';
import './conf/common.css'; //自定义样式
import ElementUI from 'element-ui';
Vue.use(ElementUI);

//xglobal全局插件及载入设置
import conf from './xglobal/conf.js';
import fns from './xglobal/fns.js';
import dialogs from './xglobal/dialogs.js';
import rmtrun from './xglobal/rmtrun.js';
import xglobal from './plugins/xglobal.js';
Vue.use(xglobal, {
    xglobal: {
        //将通过beforCreate附着到组件的this，任意字段
        conf,
        fns,
    },
    xcomponent: {
        //将附着到每个组件，可以使用data，methods等字段
        methods: {
            rmtrun,
        },
        data: function () {
            return {
                dialogs
            }
        },
    },
});

//xrouter路由插件
import xrouter from './plugins/xrouter.js';
Vue.use(xrouter);

//初始化vue,使用App组件开始
import App from './coms/pages/App/App.html';

var app = new Vue({
    el: '#App', //挂载点
    render: function (h) {
        return h(App);
    }
});
