import Vue from 'vue'
import $ from 'jquery';
var com = {};
export default com;

import {
    Dialog,
    Button,
    Tabs,
    Row,
    Col,
    Notification,
    TabPane,
    MessageBox,
}
from 'element-ui'
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Tabs);
Vue.use(Row);
Vue.use(Col);
Vue.use(TabPane);
const notify = Notification
Vue.prototype.$notify = notify;
const confirm = MessageBox.confirm;
Vue.prototype.$confirm = confirm;

import Fake from '../_data/fake.js';
import UserCard from '../../practice/PracticeDetail/PracticeDetail.html';
import TaskCard from '../../practice/TaskCard/TaskCard.html';

com.components = {
    UserCard,
    TaskCard,
};

com.data = function data() {
    var ctx = this;

    return {
        msg: 'Hello from pages/ClassDetail/ClassDetail.js',
        activeName: 'practice',
        accInfo: Fake.accInfo,
    };
};

com.props = {
    xid: {
        type: String,
        default: 'ClassDetail'
    },
    fill: {
        type: Object,
        default: function () {
            return Fake.practiceArr[0];
        },
    }
};

com.methods = {
    xgoTab: function () {
        this.$xset({
            activeName: this.$data.activeName
        });
    },
    goBack: function () {
        history.back()
    },
    goHome: function () {
        var ctx = this;
        var tarCtx = ctx.$xcoms['App_mainView-Tt'];

        tarCtx.$xgo({
            homeView: 'UserHome',
        });
    },
};

com.mounted = function () {
    var ctx = this;
    $(document).ready(function () {
        $('.el-tabs__item:contains(全部日程)').html('全部日程<span class="warntag">' + ctx.fill.daysDelayCount + '</span>');
        $('.el-tabs__item:contains(每日任务)').html('每日任务<span class="warntag">' + ctx.fill.days[0].taskArr.length + '</span>');
    });
};





//
