import Vue from 'vue'
import $ from 'jquery';
var com = {};
export default com;

com.data = function data() {
    var ctx=this;

    return {
        msg: 'Hello from practice/PracticeDetail/PracticeDetail.js',
    };
};

com.props = {
    xid: {
        type: String,
        default: 'PracticeDetail'
    },
};
