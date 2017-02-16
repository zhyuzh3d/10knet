import Vue from 'vue'
import $ from 'jquery';
var com = {};
export default com;

import Fake from '../_data/fake.js';

import {
    Dialog,
    Button,
    Row,
    Col,
    Notification,
    MessageBox,
    Tooltip
}
from 'element-ui'
Vue.use(Tooltip);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
const notify = Notification
Vue.prototype.$notify = notify;
const confirm = MessageBox.confirm;
Vue.prototype.$confirm = confirm;

//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from paractice/TaskCard/TaskCard.js',
    };
};

com.props = {
    fill: {
        type: Object,
        default: function () {
            return Fake.practiceArr[0].days[0].taskArr;
        },
    },
    index: Number,
};

com.methods = {
    checkTask: function () {
        console.log('>>>xxx');
    },
};

com.mounted = function () {};
