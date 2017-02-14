/**
 * 根据用户身份，加载老师页面或学生页面，不自动恢复
 */


import Vue from 'vue';
import $ from 'jquery';

let com = {};
export default com;

com.components = {};

var xsetConf = {};
xsetConf.homeView = {
    before: async function beforeXsetHomeView(name, oldName) {
        var com;
        switch (name) {
            case 'PracticeDetail':
                var com = await System.import('../../pages/PracticeDetail/PracticeDetail.html');
                break;
            case 'TeacherHome':
                var com = await System.import('../../pages/TeacherHome/TeacherHome.html');
                break;
            default:
                var com = await System.import('../../pages/TeacherHome/TeacherHome.html');
                break;
        };
        Vue.component(name, com);
    },
};



//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from blocks/Tt/Tt.js',
        homeView: '',
        practiceDetailId: '', //映射到PracticeDetail页面
        _xrestoreDisabled: true, //停用自动恢复
    };
};

com.props = {
    xid: {
        type: String,
        default: 'Ee',
    },
};

//所有直接使用的方法写在这里
com.methods = {};

//加载到页面前执行的函数
com.beforeMount = async function () {
    var ctx = this;

    //??发送请求获取用户身份，根据用户身份加载页面
    ctx.$xset(ctx.xid, {
        homeView: 'TeacherHome',
    });
    console.log('>>>xid', ctx.xid);

    //    var com = await System.import('../../pages/TeacherHome/TeacherHome.html');
    //    Vue.component('TeacherHome', com);
    //    ctx.$set(ctx.$data, 'homeView', 'TeacherHome');

};

com.mounted = async function () {};

//-------functions--------
