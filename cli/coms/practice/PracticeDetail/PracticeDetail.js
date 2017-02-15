import Vue from 'vue'
import $ from 'jquery';
var com = {};
export default com;

com.data = function data() {
    var ctx=this;

    return {
        msg: 'Hello from pages/PracticeDetail/PracticeDetail.js',
        practiceId:'999',
    };
};

com.props = {
    xid: {
        type: String,
        default: 'PracticeDetail'
    },
};
