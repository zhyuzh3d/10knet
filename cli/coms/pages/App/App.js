import Vue from 'vue';

let com = {};
export default com;

//所有要用的元素都写在这里
import Ee from '../../pages/Ee/Ee.html';
//import Ee from '../../blocks/aa/aa.html';
com.components = {
    Ee,
};

com.props = {
    xid: String
};

//所有数据写在这里
com.data = function data() {
    var ctx = this;
    return {
        mainView: 'ee',
        barBg: '', //inherit 透明
        urls: ctx.$xglobal.conf.urls, //全部素材地址
        apis: ctx.$xglobal.conf.apis, //全部api接口路径
        pageDisabled: true,
    };
};

com.methods = {};

//加载到页面后执行的方法
com.mounted = async function () {
    var ctx = this;


    //避免为空或者xrestore失败
    if (!ctx.$data.mainView || ctx.$data.mainView == '' || !ctx.xrestored) {
        ctx.$xrouter.go('App', {
            mainView: 'ee'
        });
    };
};

//-------functions--------



//
