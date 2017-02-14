import Vue from 'vue'
import $ from 'jquery';
import Moment from 'moment';
var com = {};
export default com;

//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from units/PracticeCard/PracticeCard.js'
    };
};

com.props = {
    fill: Object,
    index: Number,
};

com.methods = {
    goPacticeDetail: function () {
        //跳转到detail页面
        this.$xgo({
            practiceDetailId: this.fill.id,
        });

        this.$xgo({
            homeView: 'PracticeDetail',
        });
    },
}
