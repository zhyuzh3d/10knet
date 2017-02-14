import Vue from 'vue'
import $ from 'jquery';
var com = {};
export default com;

com.data = function data() {
    var ctx=this;
    return {
        msg: 'Hello from pages/PracticeDetail/PracticeDetail.js',
        practiceId:ctx.$xcoms['Ee'].$data.practiceDetailId,
    };
};

com.props = {
    xid: {
        type: String,
        default: 'PracticeDetail'
    },
    practiceId: String,
};
