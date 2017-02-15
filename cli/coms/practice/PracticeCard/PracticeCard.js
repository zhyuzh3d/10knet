import Vue from 'vue'
import $ from 'jquery';
import Moment from 'moment';
var com = {};
export default com;

//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from units/PracticeCard/PracticeCard.js',
    };
};

com.props = {
    fill: Object,
    index: Number,
};

com.methods = {
    goPacticeDetail: function () {
        var ctx = this;
        var tarCtx = ctx.$xcoms['App_mainView-Tt'];

        //跳转到detail页面
        tarCtx.$xset({
            practiceDetailId: ctx.fill.id,
        });

        tarCtx.$xgo({
            homeView: 'PracticeDetail',
        });
    },
};

com.mounted = function () {
    var ctx = this;
    com.Tt = ctx.$xcoms['App_mainView-Tt'];
};

