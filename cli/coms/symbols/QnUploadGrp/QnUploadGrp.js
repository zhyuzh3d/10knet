import $ from 'jquery';
var com = {};
export default com;

var vc; //vueComponent对象
var jo; //对应的jquery对象,mounted函数内设定
var conf; //全局设定参数

com.components = {};


com.props = {
    type: String, //按钮样式颜色
    accept: String, //接受的文件格式
};

com.created = function () {
    conf = this.$xglobal.conf;
}

com.data = function data() {
    vc = this;
    return {
        uploadedFiles: {},
        selectedFile: undefined,
        inputBtnJo: undefined,
        dialogs: vc.$xglobal.dialogs,
    };
};

com.methods = {
    fileSelected,
    lala: function () {
        console.log('>>>>>lala');
    },
};



com.mounted = function () {
    jo = $(this.$el);
    vc.$data.inputBtnJo = jo.find('input');
};

//----------------functions-----------------------
function fileSelected() {
    getUploadToken(function (token) {
        startUpload(token);
    });
};

function getUploadToken(okfn) {
    var api = conf.apis.qnRandKeyUploadToken;
    var data = {
        tag: 'none'
    };

    $.post(api, data, function (msg) {
        console.log('>POST', api, data, msg);
        if (!msg.err) {
            startUpload(msg.res.data.token);
        } else {
            console.log('>>>msg err', msg)
        }
    });
};

function startUpload(token) {
    console.log('>>>startUpload', token);
};
