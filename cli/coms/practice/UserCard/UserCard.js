import Vue from 'vue'
import $ from 'jquery';
import Moment from 'moment';
var com = {};
export default com;

//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from units/UserCard/UserCard.js',
    };
};

com.props = {
    fill: Object,
    index: Number,
};

com.methods = {
    goUserDetail: function () {
        var ctx = this;
        var tarCtx = ctx.$xcoms['App_mainView-Tt'];

        //跳转到detail页面
        tarCtx.$xset({
            userDetailId: ctx.fill.id,
        });

        tarCtx.$xgo({
            homeView: 'UserDetail',
        });
    },
};

com.mounted = function () {};

