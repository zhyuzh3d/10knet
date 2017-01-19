import $ from 'jquery';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定
let previewMsgHub;

//所有要用的元素都写在这里
import Editor from '../../blocks/Editor/Editor.html';
import Coder from '../../blocks/Coder/Coder.html';
import GitBar from '../../blocks/GitBar/GitBar.html';
import Dbox from '../../symbols/Dbox/Dbox.html';
com.components = {
    Editor,
    Coder,
    Dbox,
    GitBar,
};

com.data = function data() {
    vc = this;
    var ctx = this;
    return {
        msg: 'Hello from blocks/Ee/Ee.js',
        refreshCss, //三个函数将作为数据传给coder编辑器
        refreshHtml,
        refreshJs,
        cssData: localStorage.getItem('preview-css') || '/*css样式*/',
        htmlData: localStorage.getItem('preview-html') || '<!--html内body标记-->',
        jsData: localStorage.getItem('preview-js') || '/*javascript脚本*/',
        githubFilesToSave: {
            'index.html': {
                fileName: 'index.html',
                data: 'Hello github save file',
                needSave: true,
                saveStatus: undefined,
            },
        },
        githubBeforeSave: function () {
            githubBeforeSave(ctx);
        },
        githubOnProjectChange: function () {
            return githubOnProjectChange(ctx);
        },
        githubOnFileLoaded: function (fileObj, project) {
            return githubOnFileLoaded(fileObj, project, ctx);
        },
    };
};

com.methods = {};


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
 * 当github的项目切换的时候，返回一个对象要求自动载入index.html文件内容
 */
function githubOnProjectChange(ctx) {
    return {
        autoLoadFile: 'index.html'
    };
};


/**
 * 当github自动载入index.html之后，弹出提示是否填充到三个编辑器
 */
function githubOnFileLoaded(fileObj, project, ctx) {
    var data = fileObj.content;
    if (!data) return;
    ctx.$set(ctx.$data.githubFilesToSave['index.html'], 'sha', fileObj.sha);

    ctx.$confirm(`是否将${project.name}/${fileObj.name}加载到编辑器？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        fillEditors(data, ctx);
    }).catch(() => {});
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
 * 保存之前整合css，js到githubFilesToSave的index.html文件数据
 */
function githubBeforeSave(ctx) {
    var cssData = localStorage.getItem('preview-css');
    var bodyData = localStorage.getItem('preview-html');
    var jsData = localStorage.getItem('preview-js');

    var data = `<!DOCTYPE html>\n<head>\n<title>10knet.com | H5试验场</title>\n<meta charset="utf-8" />\n<script src="//cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>\n</head>\n<style 10knet>${cssData}</style>\n<body><div 10knet>${bodyData}</div></body>\n<script 10knet>${jsData}</script>`;

    ctx.$data.githubFilesToSave['index.html'].data = data;
};




function sendPreviewCmd(cmd, params) {
    let cmdChannel = new MessageChannel();
    cmdChannel.port1.addEventListener('message', recvPreviewMsg);

    var msg = {
        cmd: cmd, //'reload','refresh',
        params: params, //{lang}
    };

    previewMsgHub.postMessage(JSON.stringify(msg), '/', [cmdChannel.port2]);
};

function recvPreviewMsg(e) {
    console.log('blocks/Editor/RecvChannelMsg,', e.data);
};

function refreshCss(code, key) {
    localStorage.setItem('preview-css', code);
    sendPreviewCmd('refresh', {
        lang: 'css',
    });
};

function refreshHtml(code, key) {
    localStorage.setItem('preview-html', code);
    sendPreviewCmd('refresh', {
        lang: 'html',
    });
};

function refreshJs(code, key) {
    localStorage.setItem('preview-js', code);
    if (key == '\r') {
        sendPreviewCmd('reload', {
            lang: 'js',
        });
    };
};
