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
import PracticeCard from '../../practice/PracticeCard/PracticeCard.html';
import UserCard from '../../practice/UserCard/UserCard.html';

com.components = {
    PracticeCard,
    UserCard,
};

com.data = function data() {
    var ctx = this;

    return {
        msg: 'Hello from pages/ClassDetail/ClassDetail.js',
        activeName: 'practice',
        practiceArr: Fake.practiceArr,
        accInfo: Fake.accInfo,
        showDesc: false,
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
            return Fake.classArr[0];
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
