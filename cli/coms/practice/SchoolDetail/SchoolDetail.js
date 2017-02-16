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

com.components = {};

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
            var scl = Fake.classArr[0].school;
            scl.classArr = Fake.classArr;
            scl.teacherArr = Fake.classArr[0].memberArr;
            scl.practiceArr = Fake.practiceArr;
            console.log('>>>school',scl);
            return scl;
        },
    }
};

com.methods = {
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
