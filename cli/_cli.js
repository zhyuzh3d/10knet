//主战入口文件，将自动载入子站并完成vue和插件的初始化
import Vue from 'vue';


//判断是否开发模式决定是否异步载入模块
//zglobal应该在index.html的script标记中声明为对象
/*
const USE_ASYNC_IMPORT = false;
zglobal.import = function (str) {
    if (!USE_ASYNC_IMPORT) {
        return require(`${str}`);
    } else {
        return System.import(`${str}`)
    }
};

var A2pp = zglobal.import('./coms/pages/App/App.html');
console.log('>>>>>', A2pp);
*/




//elements ui主题库
import './theme/index.css';
import './conf/common.css'; //自定义样式
import ElementUI from 'element-ui';
Vue.use(ElementUI);

//xglobal全局插件及载入设置
import conf from './xglobal/conf.js';
import fns from './xglobal/fns.js';
import xglobal from './plugins/xglobal.js';
Vue.use(xglobal, {
    xglobal: {
        //将通过beforCreate附着到组件的this，任意字段
        conf: conf,
        fns: fns,
    },
    xcomponent: {
        //将附着到每个组件，可以使用data，methods等字段
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
