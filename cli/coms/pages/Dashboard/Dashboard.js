var $ = () => System.import('jquery');

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定

com.data = function data() {
    vc = this;
    return {
        msg: 'HelloXX from blocks/Dashboard/Dashboard.js'
    };
};

com.mounted = function () {
    jo = $(this.$el);


    //激活顶部导航栏菜单
    vc.$xrouter.xset('NavBar', {
        activeMenu: 'dashboard',
    });

    //使用导航栏背景
    vc.$xrouter.xset('App', {
        barBg: '',
    });
};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------

