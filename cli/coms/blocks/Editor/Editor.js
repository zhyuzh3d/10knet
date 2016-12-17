//var $ = () => System.import('jquery');
import $ from 'jquery';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定

//所有直接用到的组件在这里导入
com.components = {};

//所有数据写在这里
com.data = function data() {
    vc = this;
    return {
        msg: 'Hello from blocks/Temp/Temp.js',
        code: ''
    };
};

//所有直接使用的方法写在这里
com.methods = {
    refreshPreview,
    reloadPage
};

com.props = {
    lang: String,
};

//加载到页面前执行的函数
com.beforeMount = function () {
    jo = $(this.$el);
};

com.mounted = function () {
    jo = $(this.$el);
    startChannel();
};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------
let iframeWindow;

function startChannel() {
    iframeWindow = document.querySelector('iframe[preview]').contentWindow;
};

function RecvChannelMsg(e) {
    console.log('blocks/Editor/RecvChannelMsg,', e.data);
};

function refreshPreview() {
    var vcom = this;

    localStorage.setItem('preview-' + vcom.lang, vcom.$data.code);

    let cmdChannel = new MessageChannel();
    cmdChannel.port1.addEventListener('message', RecvChannelMsg);

    var msg = {
        cmd: 'refresh',
        params: {
            lang: vcom.lang,
        }
    };

    iframeWindow.postMessage(JSON.stringify(msg), '/', [cmdChannel.port2]);
};

function reloadPage() {
    var vcom = this;

    localStorage.setItem('preview-' + vcom.lang, vcom.$data.code);

    let cmdChannel = new MessageChannel();
    cmdChannel.port1.addEventListener('message', RecvChannelMsg);

    var msg = {
        cmd: 'reload',
    };

    iframeWindow.postMessage(JSON.stringify(msg), '/', [cmdChannel.port2]);
};
