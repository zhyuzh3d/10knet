import $ from 'jquery';

let com = {};
export default com;

//所有直接用到的组件在这里导入
import Coder from '../../blocks/Coder/Coder.html';
com.components = {
    Coder
};

com.props = {
    conf: Object, //{show,pageName,file{name,url,key...}}
};

//所有数据写在这里
com.data = function data() {
    var headStr = this.$xglobal.conf.temp.headData;

    return {
        title: `页面头部<head>代码`,
        headData: localStorage.getItem('preview-head') || headStr,
        headCode: localStorage.getItem('preview-head') || headStr,
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
        deep: true
    },
}


//所有直接使用的方法写在这里
com.methods = {
    saveHeadData: function () {
        saveHeadData(this);
    },
    syncCode: function (code) {
        this.$data.headCode = code;
    },
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {
    var ctx = this;
};

//-------所有函数写在下面--------
function saveHeadData(ctx) {
    localStorage.setItem('preview-head', ctx.$data.headCode);
    ctx.$set(ctx.conf, 'show', false);
};
