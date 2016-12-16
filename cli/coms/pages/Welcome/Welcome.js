var $ = () => System.import('jquery');

let com = {};
export default com;

let vc; //vueComponent对象
let jo; //对应的jquery对象,mounted函数内设定

import FullScreen from '../../symbols/FullScreen/FullScreen.html';
com.components = {
    FullScreen
};

com.data = function data() {
    vc = this;
    return {
        conf: this.$xglobal.conf,
    };
};

com.beforeCreate = function () {};

com.mounted = function () {
    jo = $(this.$el);

    //激活顶部导航栏菜单
    vc.$xrouter.xset('NavBar', {
        activeMenu: 'welcome'
    });

    //导航栏不使用背景
    vc.$xrouter.xset('App', {
        barBg: 'inherit',
    });
};
