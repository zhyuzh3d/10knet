/**
 * 编辑器页面布局及左侧栏按钮功能；
 * Coder太重1M多，延迟加载
 */

import Vue from 'vue'
import $ from 'jquery';

//载入element-ui组件
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
const alert = MessageBox.alert;
Vue.prototype.$alert = alert;

let com = {};
export default com;

let previewMsgHub; //用于向preview iframe传输指令

//所有要用的元素都写在这里
import Dbox from '../../symbols/Dbox/Dbox.html';
import PageSet from '../../dialogs/PageSet/PageSet.html';
import ShareHtml from '../../dialogs/ShareHtml/ShareHtml.html';
import About from '../../dialogs/About/About.html';
import Account from '../../dialogs/Account/Account.html';
import SetAccPage from '../../dialogs/SetAccPage/SetAccPage.html';
import PageTemplates from '../../dialogs/PageTemplates/PageTemplates.html';

//import Beautify from 'js-beautify';
var Beautify; //coder的hud按钮点击时候再加载这个功能

com.components = {
    Dbox,
    PageSet,
    ShareHtml,
    About,
    Account,
    SetAccPage,
    PageTemplates,
};

//动态加载功能,附着$data._xsetConf,所有路由都由xrouter触发，不需要watch
var comCtx; //指向ctx，限不重复使用的组件
com.beforeCreate = function () {
    comCtx = this;
};

//动态加载coder组件；同时也附着到$data._xsetConf以确保restore正常
var xsetConf = {};
xsetConf.coderView = {
    before: async function mainViewLoader(name, oldName) {
        var com = await System.import('../../blocks/Coder/Coder.html');
        Vue.component('coder', com);
        comCtx.$set(comCtx.$data, 'coderLoaded', true);
    },
};

//接收父层传来的tag属性
com.props = {
    xid: String, //必须加入xid字段并且html中:xid='xid'才能保留外部传来的xid
};

//组件数据
com.data = function data() {
    var ctx = this;

    return {
        msg: 'Hello from blocks/Ee/Ee.js',
        coderView: '',
        _xsetConf: xsetConf, //设置xset的钩子事件
        coderLoaded: false, //控制圆圈是否显示
        accInfo: undefined, //账号信息
        accPage: undefined, //page信息
        refreshCss, //三个函数将作为数据传给coder编辑器
        refreshBody, //同上
        refreshJs, //同上
        cssData: { //子层$set无法直接修改对象，这里使用code属性就可以被修改
            code: localStorage.getItem('preview-css') || '',
        },
        bodyData: { //同上
            code: localStorage.getItem('preview-body') || '',
        },
        jsData: { //同上
            code: localStorage.getItem('preview-js') || '',
        },
        setDialogConf: { //设置按钮，关闭时候同步刷新预览
            show: false,
            onHide: function (tarctx) {
                refreshJsMenual(ctx);
                var pname = tarctx.conf.fileName;
            },
        },
        shareDialogConf: { //分享按钮，关闭时候同步刷新预览
            show: false,
            onHide: function (ctx) {}
        },
        aboutDialogConf: { //打开关于窗口的按钮
            show: false,
        },
        pageTempDialogConf: { //打开模版窗口的按钮
            show: false,
            onHide: function (tarctx) {
                if (tarctx.conf.ipt) {
                    ctx.loadTemplate(tarctx.conf.template);
                };
            },
        },
        accountDialogConf: { //打开账号登陆窗口的按钮
            show: false,
            onHide: function (tarctx) {
                ctx.$set(ctx.$data, 'accInfo', tarctx.$xglobal.accInfo);
            },
        },
        setAccPageDialogConf: { //打开账号登陆窗口的按钮
            show: false,
            onHide: function (tarctx) {
                ctx.$set(ctx.$data, 'accPage', tarctx.conf.setPage);
                if (tarctx.conf.loadFile) {
                    ctx.loadTemplate(tarctx.conf.loadFile);
                };
            },
        },
        file: {}, //上传后的临时file文件
        localFiles: {}, //本地存储曾经上传的文件信息
        codersBoxVis: true, //编辑器显示开关
    };
};

//所有组件方法
com.methods = {
    refreshJsMenual: refreshJsMenual,
    openShareDialog: openShareDialog,
    uploadFile: uploadFile,
    selectUploadFile: selectUploadFile,
    uploadIptChanged: uploadIptChanged,
    loadTemplate: loadTemplate,
    beautifyCode: beautifyCode,
    saveAccPage: saveAccPage,
    autoSetAccPage: autoSetAccPage,
    saveMyExp: saveMyExp,
    autoSaveExp: autoSaveExp,
    fillEditors: fillEditors,
};

//组件加载后执行
com.mounted = async function () {
    var ctx = this;

    //载入编辑器
    ctx.$xset(ctx, {
        coderView: 'coder',
    });

    //预先加载beauty
    if (!Beautify) Beautify = await System.import('js-beautify');

    previewMsgHub = document.querySelector('iframe[preview]').contentWindow;

    //自动登录
    await ctx.$xglobal.fns.autoLogin(ctx);

    //如果都为空，那么自动载入start模版
    if (ctx.$data.cssData.code == '' && ctx.$data.bodyData.code == '' && ctx.$data.jsData.code == '') {
        ctx.loadTemplate(ctx.$xglobal.conf.pageTemplates['start'], true);
    };

    //从本地读取accPage并设定
    await ctx.autoSetAccPage();

    //启动自动保存经验
    setInterval(ctx.autoSaveExp, ctx.$xglobal.conf.set.expAutoSaveTime);
};


//-----------------functions-------------------------

/**
 * 设定本地存储的用户exp值,空参数+1
 */
function changeLsExp(delta) {
    var token = localStorage.getItem('accToken');
    if (!token) return;
    var orgexp = localStorage.getItem('myLocalExp');
    if (!orgexp || !Number(orgexp)) orgexp = 0;
    if (!delta) delta = 1;
    orgexp = Number(orgexp) + Number(delta);
    localStorage.setItem('myLocalExp', orgexp);
};

/**
 * 获取本地存储的用户exp值
 */
function getLsExp(delta) {
    var token = localStorage.getItem('accToken');
    if (!token) return 0;
    var orgexp = localStorage.getItem('myLocalExp');
    if (!orgexp || !Number(orgexp)) {
        localStorage.setItem('myLocalExp', 0);
        return 0
    };
    return orgexp;
};


/**
 * 保存经验值到云端,仅在联网状况下有效
 */
async function saveMyExp() {
    var ctx = this;
    try {
        //获取随机key的token
        var api = ctx.$xglobal.conf.apis.coinChangeExp;
        var data = {
            token: localStorage.getItem('accToken'),
            delta: getLsExp(),
            page: ctx.$data.accPage ? ctx.$data.accPage._id : undefined,
        };
        if (!data.token) throw Error('您还没有注册和登录，无法保存经验值');

        var res = await ctx.rRun(api, data);
        if (res.err) {
            throw Error(res.err.tip);
        } else {
            var expAdd = Math.floor(Number(res.data.exp) - Number(ctx.accInfo.exp));
            if (expAdd > 0) {
                ctx.$notify.success({
                    title: `恭喜你，增加${expAdd}经验!`,
                });
            };

            var coinAdd = Math.floor(Number(res.data.coin) - Number(ctx.accInfo.coin))
            if (coinAdd > 0) {
                setTimeout(function () {
                    ctx.$notify.success({
                        title: `恭喜你，增加${coinAdd}码币!`,
                    });
                }, 100); //延迟避免重叠
            };

            changeLsExp(data.delta * -1); //本地去掉已经存储的数量
            ctx.$set(ctx.accInfo, 'coin', res.data.coin);
            ctx.$set(ctx.accInfo, 'exp', res.data.exp);
        };

    } catch (err) {
        ctx.$notify.error({
            title: `保存经验值失败`,
            message: err.tip || err.message,
        });
    };
};

/**
 * 自动保存经验值,检测codeLocal超过50就保存，否则不保存
 */
function autoSaveExp() {
    var ctx = this;
    var token = localStorage.getItem('accToken');
    if (token && getLsExp() > ctx.$xglobal.conf.set.expAutoSaveMin) {
        ctx.saveMyExp();
    };
};


/**
 * 自动设定accPage，先从本地读取，如果没有就设定为用户名同名的首页page
 */
async function autoSetAccPage() {
    var ctx = this;

    var lsAccPage = localStorage.getItem('accPage');
    if (lsAccPage) {
        lsAccPage = JSON.safeParse(lsAccPage);
        if (lsAccPage) ctx.$set(ctx.$data, 'accPage', lsAccPage);
    } else {
        var accInfo = ctx.$xglobal.accInfo;
        if (!accInfo || !accInfo.name) return;

        try {
            //获取同名的page
            var api = ctx.$xglobal.conf.apis.pageGetPageByANamePName;
            var data = {
                accName: accInfo.name,
                pageName: accInfo.name,
            };

            var res = await ctx.rRun(api, data);
            var page = res.data;

            ctx.$set(ctx.$data, 'accPage', page);
            localStorage.setItem('accPage', JSON.stringify(page));
        } catch (err) {
            console.log('>Ee:autoSetAccPage:failed,', err);
        };
    };
};


/**
 * 上传代码到page（由uploadFile函数自动设定pageId）；
 */
async function saveAccPage() {
    var ctx = this;

    var aPage = JSON.safeParse(localStorage.getItem('accPage'));
    if (!aPage) {
        ctx.$notify.error({
            title: `您还没有创建页面`,
            message: `请先创建页面然后再执行保存`,
        });
        return;
    };

    var pageData = await assemblePage(ctx);
    var blob = new Blob([pageData], {
        type: 'html'
    });
    //直接上传，pageId由uploadFile函数生成
    var pageFile = await ctx.uploadFile('page', 'index.html', blob);
    ctx.$set(ctx.$data, 'file', pageFile);

    ctx.$notify.success({
        title: `保存页面成功`,
        message: `已经将页面更新为最新版本`,
    });
};


/**
 * Coder编辑器右上角hud点击时候的执行函数
 * @param {string} part css,body/html,js
 */
async function beautifyCode(part) {
    var ctx = this;

    if (!Beautify) Beautify = await System.import('js-beautify');

    var cmEditor = ctx.jsData.editor;
    var cmDoc = cmEditor.doc;

    var cursorpos = cmDoc.getCursor();
    var scrollpos = cmEditor.getScrollInfo();

    if (part == 'js') {
        var fcode = Beautify.js(ctx.$data.jsData.code);
        ctx.$set(ctx.$data.jsData, 'code', fcode);
        localStorage.setItem('preview-js', fcode);
    } else if (part == 'body' || part == 'html') {
        var fcode = Beautify.html(ctx.$data.bodyData.code);
        ctx.$set(ctx.$data.bodyData, 'code', fcode);
        localStorage.setItem('preview-body', fcode);
    } else if (part == 'css') {
        var fcode = Beautify.css(ctx.$data.cssData.code);
        ctx.$set(ctx.$data.cssData, 'code', fcode);
        localStorage.setItem('preview-css', fcode);
    };

    //手工刷新预览
    refreshJsMenual(ctx);

    setTimeout(function () {
        cmDoc.setCursor(cursorpos);
        cmEditor.scrollTo(scrollpos.left, scrollpos.top);
    }, 200);
};


/**
 * 将一个模版page文件载入到编辑器
 * @param {object}   temp  模版对象或文件对象，必须要有url字段
 * @param {[[Type]]} force 是否禁止确认弹窗
 */
async function loadTemplate(temp, force) {
    var ctx = this;
    if (force) { //不提示，直接载入
        $.get(temp.url, function (data) {
            ctx.fillEditors(data);
        });
        return;
    };
    //弹出提示确认
    ctx.$confirm('是否用模版代码替换编辑器内容，替换后将无法返回', '确认替换编辑器内容', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        $.get(temp.url, function (data) {
            ctx.fillEditors(data);
        });
    }).catch(() => {});
};

/**
 * 选择一个文件上传
 */
async function selectUploadFile() {
    var ctx = this;
    var iptjo = $(ctx.$el).find('#uploadIpt');
    iptjo.click();
};

/**
 * 监听隐身上传按钮，启动上传一个文件
 */
async function uploadIptChanged(file) {
    var ctx = this;
    var confset = ctx.$xglobal.conf.set;
    var maxSize = ctx.$data.accInfo ? confset.accUploadMaxSizeKb : confset.userUploadMaxSizeKb

    //限制上传文件最大1M
    if (file.size / 1024 > maxSize) {
        var accM = confset.accUploadMaxSizeStr;
        var usrM = confset.userUploadMaxSizeStr;

        var str = ctx.$data.accInfo ? '注册用户单个上传文件不超过' + accM : '未注册用户单个上传文件不超过' + usrM;
        ctx.$notify.error({
            title: `上传失败，文件大小超过限制`,
            message: str,
        });
        return;
    };

    var ipt = $(ctx.$el).find('#uploadIpt');
    var res = await ctx.uploadFile('none', file.name, file);
    ctx.$alert(res.url, '已经存储到云端', {
        confirmButtonText: '确定'
    });
};

/**
 * 组装head,css,body
 */
async function assemblePage(ctx) {
    var cssCode = localStorage.getItem('preview-css');
    var headCode = localStorage.getItem('preview-head') || ctx.$xglobal.conf.temp.headData;
    var bodyCode = localStorage.getItem('preview-body');
    var jsCode = localStorage.getItem('preview-js');

    //为解决跨域安全问题，jsCode中添加域名锁定；document.domain = '10knet.com'；
    var domainRegx = /[;\n\r]+\s*document\.domain\s*=\s*'10knet.com'\s*[;\n\r]+/;
    if (!domainRegx.test(jsCode)) {
        jsCode += "\ndocument.domain = '10knet.com';";
    };

    var data = `<!DOCTYPE html>\n<head>\n<div head 10knet>${headCode}</div>\n</head>\n<style 10knet>${cssCode}</style>\n<body><div body 10knet>${bodyCode}</div></body>\n<script 10knet>${jsCode}</script>`;

    return data;
};

/**
 * 获取token并上传文件
 * @param   {string} tag      上传标记，参照后端qn设置,none,share,page;自动为page添加pageId
 * @param   {string} fileName 指定文件名,url格式app.10knet.com/randkey/filename
 * @param   {string} file     上传的文件对象或者blob
 * @returns {object} token接口和upload接口两次数据的合并结果
 */
async function uploadFile(tag, fileName, file) {
    var ctx = this;
    try {
        //获取随机key的token
        var tokenApi = ctx.$xglobal.conf.apis.qnRandKeyUploadToken;
        var data = {
            token: localStorage.getItem('accToken'),
            tag: tag ? tag : 'none',
            fileName: fileName ? fileName : "untitled",
        };

        //如果accPage本地不为空，那么附带pageId
        var aPage = JSON.safeParse(localStorage.getItem('accPage'));

        var pageId = aPage ? aPage._id : undefined;
        if (tag == 'page' && pageId) {
            data.pageId = pageId;
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
            message: err.tip || err.message || '原因未知',
        });
    }
};

/**
 * 打开分享按钮的一刻进行上传
 * 组装head,css,body,js并上传page，然后打开分享窗口
 */
async function openShareDialog() {
    var ctx = this;

    //如果已经登录，直接分享page地址
    var url = ctx.$data.accPage ? ctx.$data.accPage.accUrl : undefined;
    if (url) {
        //先保存
        await ctx.saveAccPage();

        //检测地址是否主页，缩短地址
        if (ctx.$data.accPage.name == ctx.$data.accInfo.name) {
            url = 'http://' + ctx.$data.accInfo.name + '.10knet.com';
        };
        ctx.shareDialogConf.show = true;
        ctx.shareDialogConf.url = url;
        return;
    };

    //未登录或者没有设置accPage的用户，组装文件上传获得随机地址
    var pageData = await assemblePage(ctx);
    var blob = new Blob([pageData], {
        type: 'html'
    });
    var pageFile = await ctx.uploadFile('share', 'index.html', blob);
    ctx.$set(ctx.$data, 'file', pageFile);

    ctx.shareDialogConf.show = true;
    ctx.shareDialogConf.url = ctx.$data.file.url;
};

/**
 * 填充编辑器,将一个10knet标准html文件解析填充到三个编辑器
 */
function fillEditors(data) {
    var ctx = this;
    if (!data) return;

    var tempDiv = $('<div></div>');
    tempDiv.append(data);

    var headCode = tempDiv.find('div[head][10knet]').html();;
    var cssCode = tempDiv.find('style[10knet]').html();
    var bodyCode = tempDiv.find('div[body][10knet]').html();
    var jsCode = tempDiv.find('script[10knet]').html();

    localStorage.setItem('preview-head', headCode);
    localStorage.setItem('preview-css', cssCode);
    localStorage.setItem('preview-body', bodyCode);
    localStorage.setItem('preview-js', jsCode);

    //触发coder填充
    ctx.$set(ctx.$data.cssData, 'code', cssCode);
    ctx.$set(ctx.$data.bodyData, 'code', bodyCode);
    ctx.$set(ctx.$data.jsData, 'code', jsCode);

    //刷新预览
    refreshCss(cssCode);
    refreshBody(bodyCode);
    refreshJs(jsCode);
    refreshJsMenual(ctx);
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

    //增加本地经验值
    changeLsExp();
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

    //增加本地经验值
    changeLsExp();
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

    //增加本地经验值
    changeLsExp();
};

/**
 * 发送命令要求刷新js预览，从本地缓存读取（本地缓存被coder自动更新）
 */
function refreshJsMenual() {
    sendPreviewCmd('reload', {
        part: 'all',
    });
};








//
