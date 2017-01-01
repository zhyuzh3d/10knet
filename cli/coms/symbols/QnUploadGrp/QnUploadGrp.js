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
    multiple: String, //是否可以选择多个文件,true,false
    uploadFiles: Object, //上传文件列表
};

com.created = function () {
    conf = this.$xglobal.conf;
}

com.data = function () {
    vc = this;
    return {
        selectedFiles: undefined,
        inputBtnJo: undefined,
        dialogs: vc.$xglobal.dialogs,
    };
};

com.methods = {
    filesSelected,
};



com.mounted = function () {
    jo = $(this.$el);
    vc.$data.inputBtnJo = jo.find('input');

    console.log('>>>uploadFiles', vc.uploadFiles);

    //由于v-bind:multiple异常，在这里处理
    if (vc.multiple == 'true') jo.find('input').attr('multiple', 'true');
};

//----------------functions-----------------------

/**
 * input选择文件确认后立即执行的方法
 * 获取token->分发每个文件到 uploadOneFile函数
 * @param {FileList} fileList  文件列表对象，$event.target.files传入
 */
async function filesSelected(fileList) {
    try {
        if (!fileList || fileList.length < 1) vc.$message.error('未选取文件.');
        var api = conf.apis.qnRandKeyUploadToken;
        var data = {
            tag: 'none'
        };

        for (var i = 0; i < fileList.length; i++) {
            var file = fileList[i];
            data.fileName = file.name;
            var res = await vc.rRun(api, data);
            file.qn = {
                uploadToken: res.data.token,
                key: res.data.key,
                domain: res.data.domain,
            };
            vc.$set(vc.uploadFiles, res.data.key, file);

            var fres = await uploadOneFile(file);
            file.url = fres.data.url;
            vc.$set(vc.uploadFiles, res.data.key, undefined);
            vc.$set(vc.uploadFiles, res.data.key, file);
        };
    } catch (err) {
        console.log('err', err);
        vc.$message.error(err.message || err.tip);
    };
};


async function uploadOneFile(file) {
    //准备fromdata
    var formdata = new FormData();
    formdata.append('file', file);
    formdata.append('token', file.qn.uploadToken);
    formdata.append('key', file.qn.key);

    //发起上传
    var set = {
        url: "http://up.qiniu.com",
        data: formdata,
        type: 'POST',
        processData: false, //屏蔽掉ajax自动header处理
        contentType: false, //屏蔽掉ajax自动header处理
    };

    //监听上传过程中的处理事件
    if (file.upload && file.upload.progress) {
        set.xhr = function () {
            //为ajax添加progress事件监听
            var xhr = $.ajaxSettings.xhr();
            if (!xhr.file) xhr.file = file;
            xhr.upload.addEventListener("progress", file.upload.progress, false);
            return xhr;
        };
    };

    //发起请求，返回结果
    var res = await vc.rRun(set);

    return res;
};
