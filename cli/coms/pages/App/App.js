import Vue from 'vue';

let com = {};
export default com;

//所有要用的元素都写在这里
import Ee from '../../pages/Ee/Ee.html';
//import Ee from '../../blocks/a/a.html';

com.components = {
    Ee,
};

//所有数据写在这里
com.data = function data() {
    var ctx = this;
    return {
        mainView: '',
        barBg: '', //inherit 透明
        urls: ctx.$xglobal.conf.urls, //全部素材地址
        apis: ctx.$xglobal.conf.apis, //全部api接口路径
    };
};

//加载到页面后执行的方法
com.mounted = async function () {
    var ctx = this;
    ctx.$xrouter.go('App', {
        mainView: ''
    });

    //避免为空或者xrestore失败
    if (ctx.$data.mainView == '' || !ctx.xrestored) {
        ctx.$xrouter.go('App', {
            mainView: 'ee'
        });
    };
};

//-------functions--------



//
