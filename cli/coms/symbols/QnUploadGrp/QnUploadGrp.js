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

com.data = function () {
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
    test,
};



com.mounted = function () {
    jo = $(this.$el);
    vc.$data.inputBtnJo = jo.find('input');
};

//----------------functions-----------------------

function test() {
    try {
        test2();
    } catch (err) {
        console.log('err>>', err);
    }
};

async function test2() {
    try {
        //var api = conf.apis.qnRandKeyUploadToken;
        var api = '/122233/22';
        var data = {
            tag: 'none'
        };
        var res = await vc.rRun(api, data);
        console.log('>>>>res', res);
    } catch (err) {
        vc.$message.error(err.tip);
    };
};






async function fileSelected() {




    //    getUploadToken(function (token) {
    //        startUpload(token);
    //    });
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
