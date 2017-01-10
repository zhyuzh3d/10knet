import $ from 'jquery';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定
let previewMsgHub;

//所有要用的元素都写在这里
import Editor from '../../blocks/Editor/Editor.html';
import Coder from '../../blocks/Coder/Coder.html';
import Dbox from '../../symbols/Dbox/Dbox.html';
com.components = {
    Editor,
    Coder,
    Dbox,
};

com.data = function data() {
    vc = this;
    return {
        msg: 'Hello from blocks/Ee/Ee.js',
        refreshCss, //三个函数将作为数据传给coder编辑器
        refreshHtml,
        refreshJs,
        cssData: localStorage.getItem('preview-css') || '/*css样式*/',
        htmlData: localStorage.getItem('preview-html') || '/*body标记*/',
        jsData: localStorage.getItem('preview-js') || '/*javascript脚本*/',
    };
};



com.mounted = function () {
    jo = $(this.$el);
    previewMsgHub = document.querySelector('iframe[preview]').contentWindow;

    //激活顶部导航栏菜单
    vc.$xrouter.xset('NavBar', {
        activeMenu: 'ee',
    });

    //使用导航栏背景
    vc.$xrouter.xset('App', {
        barBg: '',
    });

};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------
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
    if (key == '\r') {
        localStorage.setItem('preview-js', code);
        sendPreviewCmd('reload', {
            lang: 'js',
        });
    };
};
