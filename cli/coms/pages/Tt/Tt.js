//import $ from 'jquery';
var $ = () => System.import('jquery');

import Vue from 'vue';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定


import Nn from '../../blocks/temp/temp.html';
com.components = {
    Nn,
};

//所有数据写在这里
com.data = function data() {
    vc = this;
    return {
        msg: 'Hello from blocks/Tt/Tt.js',
        testView: 'nn',
    };
};

//所有直接使用的方法写在这里
com.methods = {
    logTest: function () {
        console.log('Tt:logTest.');
    },
};

//加载到页面前执行的函数
com.beforeMount = function () {
    jo = $(this.$el);
};

com.mounted = async function () {
    var ctx = this;



    //激活顶部导航栏菜单
    vc.$xrouter.xset('NavBar', {
        activeMenu: 'tt',
    });

    //使用导航栏背景
    vc.$xrouter.xset('App', {
        barBg: '',
    });

};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------
