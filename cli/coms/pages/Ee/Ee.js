import $ from 'jquery';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定

//所有要用的元素都写在这里
import Editor from '../../blocks/Editor/Editor.html';
import Coder from '../../blocks/Coder/Coder.html';
import Dbox from '../../symbols/Dbox/Dbox.html';
com.components = {
    Editor,
    Coder,
    Dbox,
};



com.data = function data() {
    vc = this;
    return {
        msg: 'Hello from blocks/Ee/Ee.js',
        opt: {
            mode: 'text/html',
            lineNumbers: false,
        }
    };
};

com.mounted = function () {
    jo = $(this.$el);

    //激活顶部导航栏菜单
    vc.$xrouter.xset('NavBar', {
        activeMenu: 'ee',
    });

    //使用导航栏背景
    vc.$xrouter.xset('App', {
        barBg: '',
    });

};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------
