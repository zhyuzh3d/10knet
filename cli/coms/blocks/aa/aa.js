import Vue from 'vue'
import $ from 'jquery';

//100k
/*
import {
    Popover,
    Button,
    Tooltip,
    Notification,
    MessageBox,
}
from 'element-ui'
Vue.use(Popover);
Vue.use(Button);
Vue.use(Tooltip);
const notify = Notification
Vue.prototype.$notify = notify;
const confirm = MessageBox.confirm;
Vue.prototype.$confirm = confirm;
*/


/*
//所有要用的元素都写在这里200k
import Dbox from '../../symbols/Dbox/Dbox.html';
import PageSet from '../../dialogs/PageSet/PageSet.html';
import ShareHtml from '../../dialogs/ShareHtml/ShareHtml.html';
import About from '../../dialogs/About/About.html';
import Account from '../../dialogs/Account/Account.html';
import SetAccPage from '../../dialogs/SetAccPage/SetAccPage.html';
import PageTemplates from '../../dialogs/PageTemplates/PageTemplates.html';
*/

//import Beautify from 'js-beautify';//40k



var com = {};
export default com;
com.components = {
    //Dbox,
    //    PageSet,
    //    ShareHtml,
    //    About,
    //    Account,
    //    SetAccPage,
    //    PageTemplates,
};



//Vue.use(Dialog);
//Vue.use(Tabs);
//Vue.use(Row);
//Vue.use(Col);
//Vue.use(TabPane);
//const notify = Notification
//Vue.prototype.$notify = notify;
//const confirm = MessageBox.confirm;
//Vue.prototype.$confirm = confirm;

//var $;


com.beforeCreate = async function () {
    //$ = await System.import('jquery');
    //console.log('>>>load $', $('body'));
};


//所有直接用到的组件在这里导入
//import Coder from '../../blocks/Coder/Coder.html';
//import Dbox from '../../symbols/Dbox/Dbox.html';
com.components = {
    //    Coder,
    //    Dbox,
};

//所有数据写在这里
com.data = function data() {
    return {
        msg: 'Hello from blocks/Temp/Temp.js'
    };
};



//所有直接使用的方法写在这里
com.methods = {};


com.mounted = async function () {
    //if (!$) $ = await System.import('jquery');
    //console.log('>>>use $', $('body'));

    //console.log('>>>use lds', System.import('jquery'));
    //var lds = await System.import('lodash');
    //lds.drop();

    /*
    this.$notify.success({
        title: `恭喜你，增加码币!`,
    });

    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
    */
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
