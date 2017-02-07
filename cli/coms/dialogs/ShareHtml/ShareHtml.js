import Vue from 'vue';
import jquery from 'jquery';
import {
    Dialog,
    Button,
}
from 'element-ui'
Vue.use(Dialog);
Vue.use(Button);


window.$ = window.jQuery = jquery;
require('jquery.qrcode');

let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

com.props = {
    conf: Object, //{show,file:{name,url,key...}}
};

//所有数据写在这里
com.data = function data() {

    return {
        defaultTitle: '我在10knet.com学编程，你也来试试看吧！',
        defaultUrl: 'http://10knet.com',
        defaultPic: 'http://10knet.com/imgs/10knetSqr64.png',
        qqUrl: undefined,
        qzoneUrl: undefined,
        weiboUrl: undefined,
    };
};

com.watch = {
    conf: {
        handler: function (val, oldval) {
            var ctx = this;
            //使关闭窗口的钩子生效
            if (!val.show && val.onHide) {
                val.onHide(this);
            };

            if (val.show) {
                setTimeout(function () {
                    drawQrcode(ctx);
                    genUrl(ctx);
                }, 200);
            };
        },
        deep: true
    },
}


//所有直接使用的方法写在这里
com.methods = {

};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {
    var headStr = this.$xglobal.conf.temp.headData;
};

//-------所有函数写在下面--------

function drawQrcode(ctx) {
    if (!ctx.conf.url) {
        ctx.$set(ctx.conf, 'url', ctx.$xglobal.conf.urls.host);
    };
    var url = ctx.conf.url;
    var boxjo = $(ctx.$el).find('#qrcodeBox');

    boxjo.empty();
    boxjo.qrcode({
        width: 180,
        height: 180,
        text: url,
    });
};


function genUrl(ctx) {
    var title = ctx.conf.title ? ctx.conf.title : ctx.$data.defaultTitle;
    var url = ctx.conf.url ? ctx.conf.url : ctx.$data.defaultUrl;
    var pic = ctx.conf.pic ? ctx.conf.pic : ctx.$data.defaultPic;

    var params = `title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&pic=${encodeURIComponent(pic)}`

    var qqUrl = `http://connect.qq.com/widget/shareqq/index.html?${params}`;
    ctx.$set(ctx.$data, 'qqUrl', qqUrl);

    var qzoneUrl = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?${params}&summary=我在10knet.com学习编程啦，你也来吧！`;
    ctx.$set(ctx.$data, 'qzoneUrl', qzoneUrl);

    var weiboUrl = `http://service.weibo.com/share/share.php?${params}`;
    ctx.$set(ctx.$data, 'weiboUrl', weiboUrl);
};






//
