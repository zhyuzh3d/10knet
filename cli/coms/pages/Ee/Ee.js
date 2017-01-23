import $ from 'jquery';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定
let previewMsgHub;

//所有要用的元素都写在这里
import Coder from '../../blocks/Coder/Coder.html';
import Dbox from '../../symbols/Dbox/Dbox.html';
import PageSet from '../../dialogs/PageSet/PageSet.html';
import ShareHtml from '../../dialogs/ShareHtml/ShareHtml.html';
import About from '../../dialogs/About/About.html';
com.components = {
    Coder,
    Dbox,
    PageSet,
    ShareHtml,
    About,
};

com.data = function data() {
    vc = this;
    var ctx = this;
    var pageName = localStorage.getItem('lastPageName');

    return {
        msg: 'Hello from blocks/Ee/Ee.js',
        refreshCss, //三个函数将作为数据传给coder编辑器
        refreshBody,
        refreshJs,
        cssData: localStorage.getItem('preview-css') || '/*css样式*/',
        bodyData: localStorage.getItem('preview-body') || '<!--html内body标记-->',
        jsData: localStorage.getItem('preview-js') || '/*javascript脚本*/',
        setDialogConf: { //设置按钮，关闭时候同步刷新预览
            show: false,
            onHide: function (tarctx) {
                refreshJsMenual();
                var pname = tarctx.conf.pageName;
                ctx.$set(ctx.$data, 'pageName', pname);
                localStorage.setItem('lastPageName', pname);
            },
        },
        shareDialogConf: { //分享按钮，关闭时候同步刷新预览
            show: false,
            onHide: function (ctx) {}
        },
        aboutDialogConf: { //打开关于窗口的按钮
            show: false,
        },
        page: {}, //上传后的文件
        localPages: {}, //本地存储曾经上传的文件信息
        pageName: pageName, //当前页面名称，下次上传时候使用
        codersBoxVis: true,
    };
};

com.methods = {
    refreshJsMenual: function () {
        refreshJsMenual();
    },
    openShareDialog: function () {
        openShareDialog(this);
    },
    uploadFile: function () {
        uploadFile(this);
    },
    selectUploadFile: function () {
        selectUploadFile(this, true);
    },
    uploadIptChanged: function (file) {
        uploadIptChanged(file, this);
    },
};


com.mounted = function () {
    jo = $(this.$el);

    previewMsgHub = document.querySelector('iframe[preview]').contentWindow;

    //激活顶部导航栏菜单
    this.$xrouter.xset('NavBar', {
        activeMenu: 'ee',
    });

    //使用导航栏背景
    this.$xrouter.xset('App', {
        barBg: '',
    });

};


//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------

/**
 * 选择一个文件上传
 */
async function selectUploadFile(ctx) {
    var iptjo = $(ctx.$el).find('#uploadIpt');
    iptjo.click();
};

/**
 * 启动上传一个文件
 */
async function uploadIptChanged(file, ctx) {
    var ipt = $(ctx.$el).find('#uploadIpt');
    var res = await uploadFile('none', file.name, file, ctx);
    ctx.$alert(res.url, '已经存储到云端', {
        confirmButtonText: '确定'
    });
};


/**
 * 组装head,css,body
 */
async function assemblePage(ctx) {
    var cssData = localStorage.getItem('preview-css');
    var headData = localStorage.getItem('preview-head') || ctx.$xglobal.conf.temp.headData;
    var bodyData = localStorage.getItem('preview-body');
    var jsData = localStorage.getItem('preview-js');

    var data = `<!DOCTYPE html>\n<head>\n${headData}\n</head>\n<style 10knet>${cssData}</style>\n<body><div 10knet>${bodyData}</div></body>\n<script 10knet>${jsData}</script>`;

    return data;
};


/**
 * 获取token并上传文件
 */
async function uploadFile(tag, fileName, file, ctx) {
    try {
        //获取随机key的token
        var tokenApi = ctx.$xglobal.conf.apis.qnRandKeyUploadToken;
        var data = {
            tag: tag ? tag : 'none',
            fileName: fileName ? fileName : "untitled"
        };
        var tokenRes = await ctx.rRun(tokenApi, data);

        var token = tokenRes.data.token;

        //使用token上传文件
        var formdata = new FormData();
        formdata.append('file', file);
        formdata.append('token', tokenRes.data.token);
        formdata.append('key', tokenRes.data.key);

        var uploadRes = await ctx.rRun({
            url: "http://up.qiniu.com",
            data: formdata,
            type: 'POST',
            processData: false,
            contentType: false,
        });

        var fileInfo = Object.assign({
            file: file
        }, uploadRes.data, tokenRes.data);

        return fileInfo;

    } catch (err) {
        ctx.$notify.error({
            title: `上传页面文件失败`,
            message: err.message || '原因未知',
        });
    }
};

/**
 * 打开分享按钮的一刻进行上传
 * 组装head,css,body,js并上传page，然后打开分享窗口
 */
async function openShareDialog(ctx) {
    var pageData = await assemblePage(ctx);

    var blob = new Blob([pageData], {
        type: 'html'
    });
    var pageFile = await uploadFile('page', ctx.$data.pageName, blob, ctx);
    ctx.$set(ctx.$data, 'page', pageFile);

    ctx.shareDialogConf.show = true;
    ctx.shareDialogConf.url = ctx.$data.page.url;
};

/**
 * 填充编辑器,将一个html文件解析填充到三个编辑器
 */
function fillEditors(data, ctx) {
    if (!data) return;

    var tempDiv = $('<div></div>');
    tempDiv.append(data);

    var cssData = tempDiv.find('style[10knet]').html();
    var bodyData = tempDiv.find('div[10knet]').html();
    var jsData = tempDiv.find('script[10knet]').html();

    //触发coder填充
    ctx.$set(ctx.$data, 'cssData', cssData);
    ctx.$set(ctx.$data, 'htmlData', bodyData);
    ctx.$set(ctx.$data, 'jsData', jsData);

    //刷新预览
    refreshCss(cssData);
    refreshHtml(bodyData);
    refreshJs(jsData);
};


/**
 * 发送命令，让右侧预览窗口刷新
 * @param {string} cmd    'reload'或'refresh'，由preview.js支持
 * @param {object} params 附加参数，{part:'css/body/head/js'}
 */
function sendPreviewCmd(cmd, params) {
    let cmdChannel = new MessageChannel();
    cmdChannel.port1.addEventListener('message', recvPreviewMsg);

    var msg = {
        cmd: cmd,
        params: params,
    };

    previewMsgHub.postMessage(JSON.stringify(msg), '/', [cmdChannel.port2]);
};

/**
 * 发送命令后返回的ACK信息处理
 * @param {object} e 信息对象{data}
 */
function recvPreviewMsg(e) {
    console.log('blocks/Editor/RecvChannelMsg,', e.data);
};

/**
 * 发送命令要求刷新Css预览，同时更新本地缓存
 * @param {string} code 字符串
 * @param {string} key  留空
 */
function refreshCss(code, key) {
    localStorage.setItem('preview-css', code);
    sendPreviewCmd('refresh', {
        part: 'css',
    });
};

/**
 * 发送命令要求刷新Body预览，同时更新本地缓存
 * @param {string} code 字符串
 * @param {string} key  留空
 */
function refreshBody(code, key) {
    localStorage.setItem('preview-body', code);
    sendPreviewCmd('refresh', {
        part: 'body',
    });
};

/**
 * 发送命令要求刷新Js预览，同时更新本地缓存
 * @param {string} code 字符串
 * @param {string} key  留空
 */
function refreshJs(code, key) {
    localStorage.setItem('preview-js', code);
    if (key == '\r') {
        sendPreviewCmd('reload', {
            part: 'all',
        });
    };
};

/**
 * 发送命令要求刷新js预览，从本地缓存读取（本地缓存被coder自动更新）
 */
function refreshJsMenual() {
    sendPreviewCmd('reload', {
        part: 'all',
    });
};
