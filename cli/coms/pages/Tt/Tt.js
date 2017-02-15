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
    before: async function beforeXsetHomeView(name, oldName, ctx) {
        var com;
        switch (name) {
            case 'PracticeDetail':
                var com = await System.import('../../practice/PracticeDetail/PracticeDetail.html');
                break;
            case 'UserDetail':
                var com = await System.import('../../practice/UserDetail/UserDetail.html');
                break;
            case 'ClassDetail':
                var com = await System.import('../../practice/ClassDetail/ClassDetail.html');
                break;
            case 'UserHome':
                var com = await System.import('../../practice/UserHome/UserHome.html');
                break;
            default:
                var com = await System.import('../../practice/UserHome/UserHome.html');
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
        _xsetConf: xsetConf,
        practiceDetailId: '', //映射到PracticeDetail页面
        classDetailId: '', //映射到PracticeDetail页面
        userDetailId: '', //映射到userDetail页面
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
com.mounted = async function () {
    var ctx = this;
    var xhash = await ctx.$xsetByHash();

    //如果地址栏没有跳转，那么自动加载用户首页，首页根据用户身份区别处理
    var xConfHash = ctx.$xgetConf();
    if (!xConfHash.xhash || !xConfHash.xhashValue['homeView']) {
        await ctx.$xgo({
            homeView: 'UserHome',
        });
    };
};


//-------functions--------
