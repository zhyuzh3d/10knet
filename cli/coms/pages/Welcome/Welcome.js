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


};
