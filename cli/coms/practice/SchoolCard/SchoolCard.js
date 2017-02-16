import Vue from 'vue'
import $ from 'jquery';
var com = {};
export default com;

import Fake from '../_data/fake.js';

//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from paractice/SchoolCard/SchoolCard.js',
    };
};

com.props = {
    fill: {
        type: Object,
        default: function () {
            return Fake.classArr[0].school;
        },
    },
    index: Number,
};

com.methods = {
    goSchoolDetail: function () {
        var ctx = this;
        var tarCtx = ctx.$xcoms['App_mainView-Tt'];

        //跳转到detail页面
        tarCtx.$xset({
            schoolDetailId: ctx.fill.id,
        });

        tarCtx.$xgo({
            homeView: 'SchoolDetail',
        });
    },
};

com.mounted = function () {
    var ctx = this;
    com.Tt = ctx.$xcoms['App_mainView-Tt'];
};
