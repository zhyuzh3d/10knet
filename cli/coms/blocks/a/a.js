import Vue from 'vue'
var $ = () => System.import('jquery');

/*
 */
import {
    Button,
    Message,
    MessageBox,
    Notification,

}
from 'element-ui'
Vue.use(Button);

const confirm = MessageBox.confirm;
Vue.prototype. $confirm = confirm;

const notify = Notification;
Vue.prototype.$notify = notify;

var com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from blocks/Temp/Temp.js'
    };
};



//所有直接使用的方法写在这里
com.methods = {};

//加载到页面前执行的函数
com.beforeMount = function () {};

com.mounted = function () {
    var a = $('body');

    this.$notify.success({
        title: `恭喜你，增加码币!`,
    });

    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------
/*



'mainView': async function (val, oldVal) {
        var ctx = this;
        if (val[0] == '$') return;

        ctx.$set(ctx.$data, 'mainView', '$');
        var com = await System.import('../../pages/Ee/Ee.html');
        Vue.component('ee', com);
        ctx.$set(ctx.$data, 'mainView', val[1].toUpperCase() + val.substr(2));
    },


    */
