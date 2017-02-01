import $ from 'jquery';

let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

com.props = {
    conf: Object, //{show,startTab,myInfo}
};

//所有数据写在这里
com.data = function data() {
    return {
        actTab: '',
        reg: {},
        login: {},
        rst: {},
        set: {},
    };
};

com.watch = {
    conf: {
        handler: function (val, oldval) {
            //使关闭窗口的钩子生效
            if (!val.show && val.onHide) {
                val.onHide(this);
            }
        },
        deep: true,
    },
}


//所有直接使用的方法写在这里
com.methods = {
    tabClick,
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {};

//-------所有函数写在下面--------

function tabClick(e) {
    console.log('tabClick', e);
};

//
