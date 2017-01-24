import $ from 'jquery';

let com = {};
export default com;

//所有直接用到的组件在这里导入
import Coder from '../../blocks/Coder/Coder.html';
com.components = {
    Coder
};

com.props = {
    conf: Object, //{show}
};

//所有数据写在这里
com.data = function data() {
    var ctx = this;
    return {
        templates: ctx.$xglobal.conf.pageTemplates,
        inputUrl: '',
    };
};

com.watch = {
    conf: {
        handler: function (val, oldval) {
            var ctx = this;
            //使关闭窗口的钩子生效
            if (val.show) {
                ctx.$set(ctx.$data, 'templates', ctx.$xglobal.conf.pageTemplates);
            };

            if (!val.show && val.onHide) {
                val.onHide(this);

                //如果用户手工输入了地址，那么清理template信息
                if (ctx.$data.inputUrl != ctx.conf.template.url) {
                    ctx.conf.template = {
                        url: ctx.$data.inputUrl,
                        name: 'untitled',
                        desc: 'none',
                    };
                };
            };

        },
        deep: true
    },
}


//所有直接使用的方法写在这里
com.methods = {
    closeDialog: function () {
        closeDialog(this);
    },
    iframeLoad: function (e) {
        iframeLoad(e, this);
    },
    seleletTemp: function (url) {
        seleletTemp(url, this);
    }
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {
    var ctx = this;
    if (!ctx.conf.template) {
        ctx.conf.template = {};
    };
};

//-------所有函数写在下面--------
function closeDialog(ctx) {
    ctx.conf.select = true;
    ctx.$set(ctx.conf, 'show', false);
};


/**
 * 点击卡片选择模版
 * @param {object}   temp temp{name,url,desc}
 * @param {object} ctx ctx
 */
function seleletTemp(temp, ctx) {
    ctx.$set(ctx.conf, 'template', temp);
    ctx.$set(ctx.$data, 'inputUrl', temp.url);
};


/**
 * iframe预览窗口载入后自动缩放，适配宽度
 * @param {object}   evt evt
 * @param {object} ctx ctx
 */
function iframeLoad(evt, ctx) {
    var jo = $(evt.target);
    jo.hide();
    var inwid = jo.width();
    var outwid = jo.parent().width();
    var rate = outwid / inwid;
    jo.css('transform', `scale(${rate},${rate})`);
    jo.show();
};




//
