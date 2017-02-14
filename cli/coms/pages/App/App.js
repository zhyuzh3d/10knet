import Vue from 'vue';

let com = {};
export default com;


//所有要用的元素都写在这里
//import Ee from '../../pages/Ee/Ee.html';
//import Tt from '../../pages/Tt/Tt.html';
//import Tt from '../../blocks/aa/aa.html';
//com.components = {Tt};

com.props = {
    xid: {
        type: String,
        default: 'MyApp',
    }
};

//所有数据写在这里
com.data = function data() {
    var ctx = this;
    return {
        mainView: '',
        barBg: '', //inherit 透明
        urls: ctx.$xglobal.conf.urls, //全部素材地址
        apis: ctx.$xglobal.conf.apis, //全部api接口路径
        pageDisabled: true,
        _xrestoreDisabled: true, //停用自动恢复
    };
};

com.methods = {};

com.beforeMount = async function () {
    var ctx = this;
    //根据地址栏路径动态载入子站
    var com;

    switch (location.pathname) {
        case '/tt':
            com = await System.import('../../pages/Tt/Tt.html');
            Vue.component('tt', com);
            ctx.$set(ctx.$data, 'mainView', 'tt');
            break;
        default:
            com = await System.import('../../pages/Ee/Ee.html');
            Vue.component('ee', com);
            ctx.$set(ctx.$data, 'mainView', 'ee');
            break;
    };
};

//加载到页面后执行的方法
com.mounted = async function () {
    var ctx = this;
};

//-------functions--------



//
