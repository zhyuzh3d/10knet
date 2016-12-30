var $ = () => System.import('jquery');

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定

//所有要用的元素都写在这里
import NavBar from '../../blocks/NavBar/NavBar.html';
import Welcome from '../../pages/Welcome/Welcome.html';
import Dashboard from '../../pages/Dashboard/Dashboard.html';
import Kk from '../../pages/Kk/Kk.html';
import Nn from '../../pages/Nn/Nn.html';
import Ee from '../../pages/Ee/Ee.html';
import Tt from '../../pages/Tt/Tt.html';
com.components = {
    NavBar,
    Welcome,
    Dashboard,
    Kk,
    Nn,
    Ee,
    Tt,
};


//所有数据写在这里
com.data = function data() {
    vc = this;
    return {
        mainView: '',
        barBg: '', //inherit 透明
        urls: this.$xglobal.conf.urls, //全部素材地址
        apis: this.$xglobal.conf.apis, //全部api接口路径
        //dialogPermit: this.dialogs.permit.options, //通用确认弹窗
        //dialogWarn: this.dialogs.warn.options, //通用警告弹窗

        //dialogPermit: this.$xglobal.dialogs.permit.options, //通用确认弹窗
        //dialogWarn: this.$xglobal.dialogs.warn.options, //通用警告弹窗
    };
};

//所有直接使用的方法写在这里
com.methods = {
    getMyProfile,
};

//加载到页面前执行的函数
com.beforeMount = function () {
    jo = $(this.$el);
};

com.mounted = function () {
    //初次自动载入welcome页，后续依赖xrestore自动切换
    if (!vc.xrestored) {
        vc.$xrouter.go('App', {
            mainView: 'welcome'
        });
    };
};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------

/**
 * 从顶部导航栏获取用户档案
 * @returns {object} 用户档案对象
 */

function getMyProfile() {
    let vcom = vc.$xglobal.coms.TopBar;
    return vcom ? vcom.$data.myProfile : {};
};
