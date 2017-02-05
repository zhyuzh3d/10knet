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
import Account from '../../dialogs/Account/Account.html';
import SetAccPage from '../../dialogs/SetAccPage/SetAccPage.html';
import PageTemplates from '../../dialogs/PageTemplates/PageTemplates.html';
import Beautify from 'js-beautify';


com.components = {
    Coder,
    Dbox,
    PageSet,
    ShareHtml,
    About,
    Account,
    SetAccPage,
    PageTemplates,
};

com.data = function data() {
    vc = this;
    var ctx = this;
    var fileName = localStorage.getItem('lastFileName');
    var accountInfo = {}; //??用户信息，每次启动应自动获取

    return {
        msg: 'Hello from blocks/Ee/Ee.js',
        accInfo: undefined,
        accPage: undefined,
        refreshCss, //三个函数将作为数据传给coder编辑器
        refreshBody,
        refreshJs,
        cssData: {
            code: localStorage.getItem('preview-css') || '',
        },
        bodyData: {
            code: localStorage.getItem('preview-body') || '',
        },
        jsData: {
            code: localStorage.getItem('preview-js') || '',
        },
        setDialogConf: { //设置按钮，关闭时候同步刷新预览
            show: false,
            onHide: function (tarctx) {
                refreshJsMenual(ctx);
                var pname = tarctx.conf.fileName;
                ctx.$set(ctx.$data, 'fileName', pname);
                localStorage.setItem('lastFileName', pname);
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
                if (tarctx.conf.select) {
                    loadTemplate(tarctx.conf.template, ctx);
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
                    loadTemplate(tarctx.conf.loadFile, ctx);
                };
            },
        },
        accInfo: undefined, //用户的账号信息
        file: {}, //上传后的文件
        localFiles: {}, //本地存储曾经上传的文件信息
        fileName: fileName, //当前页面名称，下次上传时候使用
        codersBoxVis: true,
    };
};

com.methods = {
    refreshJsMenual: function () {
        refreshJsMenual(this);
    },
    openShareDialog: openShareDialog,
    uploadFile: function () {
        uploadFile(this);
    },
    selectUploadFile: function () {
        selectUploadFile(this, true);
    },
    uploadIptChanged: function (file) {
        uploadIptChanged(file, this);
    },
    beautifyCss: function () {
        beautifyCss(this);
    },
    beautifyBody: function () {
        beautifyBody(this);
    },
    beautifyJs: function () {
        beautifyJs(this);
    },
    saveAccPage: saveAccPage,
    autoSetAccPage: autoSetAccPage,
};


com.mounted = async function () {
    jo = $(this.$el);
    var ctx = this;

    previewMsgHub = document.querySelector('iframe[preview]').contentWindow;

    //激活顶部导航栏菜单
    this.$xrouter.xset('NavBar', {
        activeMenu: 'ee',
    });

    //使用导航栏背景
    this.$xrouter.xset('App', {
        barBg: '',
    });

    //自动登录
    await ctx.$xglobal.fns.autoLogin(ctx);

    //如果都为空，那么自动载入start模版
    if (ctx.$data.cssData.code == '' && ctx.$data.bodyData.code == '' && ctx.$data.jsData.code == '') {
        loadTemplate(ctx.$xglobal.conf.pageTemplates['start'], ctx, true);
    };

    //从本地读取accPage并设定
    await ctx.autoSetAccPage();
};


//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------

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
    var pageFile = await uploadFile('page', 'index.html', blob, ctx);
    ctx.$set(ctx.$data, 'file', pageFile);

    ctx.$notify.success({
        title: `保存页面成功`,
        message: `已经将页面更新为最新版本`,
    });
};



async function createPage(ctx, token, name) {
    var api = ctx.$xglobal.conf.apis.pageNew;
    var data = {
        token: token,
        name: name,
    };
    var res = await ctx.rRun(api, data);
    return res;
};



function beautifyCss(ctx) {
    beautifyCode('css', ctx);
};

function beautifyBody(ctx) {
    beautifyCode('body', ctx);
};

function beautifyJs(ctx) {
    beautifyCode('js', ctx);
};

function beautifyCode(part, ctx) {
    var cmEditor = ctx.jsData.editor;
    var cmDoc = cmEditor.doc;

    var cursorpos = cmDoc.getCursor();
    var scrollpos = cmEditor.getScrollInfo();

    if (part == 'js') {
        var fcode = Beautify.js(ctx.$data.jsData.code);
        ctx.$set(ctx.$data.jsData, 'code', fcode);
        localStorage.setItem('preview-js', fcode);
    } else if (part == 'body') {
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
 */
async function loadTemplate(temp, ctx, force) {
    if (force) { //不提示，直接载入
        $.get(temp.url, function (data) {
            fillEditors(data, ctx);
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
            fillEditors(data, ctx);
        });
    }).catch(() => {});
};

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
    var res = await uploadFile('none', file.name, file, ctx);
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
 */
async function uploadFile(tag, fileName, file, ctx) {
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

    var url = ctx.$data.accPage ? ctx.$data.accPage.accUrl : undefined;
    if (url) {
        ctx.shareDialogConf.show = true;
        ctx.shareDialogConf.url = url;
        return;
    };

    //未登录或者没有设置accPage的用户，组装文件上传获得随机地址
    var pageData = await assemblePage(ctx);
    var blob = new Blob([pageData], {
        type: 'html'
    });
    var pageFile = await uploadFile('share', 'index.html', blob, ctx);
    ctx.$set(ctx.$data, 'file', pageFile);

    ctx.shareDialogConf.show = true;
    ctx.shareDialogConf.url = ctx.$data.file.url;
};

/**
 * 填充编辑器,将一个html文件解析填充到三个编辑器
 */
function fillEditors(data, ctx) {
    if (!data) return;

    var tempDiv = $('<div></div>');
    tempDiv.append(data);

    var headCode = tempDiv.find('div[head][10knet]').html();;
    var cssCode = tempDiv.find('style[10knet]').html();
    var bodyCode = tempDiv.find('div[body][10knet]').html();
    var jsCode = tempDiv.find('script[10knet]').html();

    //触发coder填充
    localStorage.setItem('preview-head', headCode);
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
function refreshJsMenual(ctx) {
    sendPreviewCmd('reload', {
        part: 'all',
    });
};
