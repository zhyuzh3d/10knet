/**
 * 基于七牛的上传按钮。
 * 只有一个按钮界面，输出一个uploadFiles数据对象
 * 其中每个file包含uploadInfo{token,key,domain,url,percent},自动刷新数据
 * 提供接口：type按钮颜色，accept接受文件格式字符串，multiple多文件，uploadFiles上传列表
 * 如果传入blob对象(可带有文件名blob.name和blob.lastModifiedDate)，那么直接上传数据，文件格式由blob确定new blob(['xxx'],{type:'text/plain'});
 * 注意，blob模式每次保存的都是不同的文件
 */

import $ from 'jquery';
var com = {};
export default com;

var vc; //vueComponent对象
var jo; //对应的jquery对象,mounted函数内设定
var conf; //全局设定参数

com.components = {};


com.props = {
    text: String, //按钮显示文字
    type: String, //按钮样式颜色
    blob: Blob, //上传的数据{name,type,lastModifiedDate}，这个选项将覆盖下面的选项
    accept: String, //接受的文件格式
    multiple: String, //是否可以选择多个文件,true,false
    uploadFiles: Object, //上传文件列表
};

com.created = function () {
    conf = this.$xglobal.conf;
}

com.data = function () {
    vc = this;

    var label = vc.text ? vc.text : (vc.blob ? '保存' : '选择文件');
    return {
        selectedFiles: undefined,
        dialogs: vc.$xglobal.dialogs,
        label: label,
    };
};

com.methods = {
    filesSelected,
    clickHandler,
};

com.mounted = function () {
    jo = $(this.$el);
    vc.$data.inputBtnJo = jo.find('input');

    //由于v-bind:multiple异常，在这里处理
    if (vc.multiple == 'true') jo.find('input').attr('multiple', 'true');




};

//----------------functions-----------------------


/**
 * 按钮点击事件控制
 * 如果没有blob，那么就开始选择文件
 * 如果有blob，那么直接开始上传
 */
async function clickHandler() {
    if (!vc.blob) {
        //选择文件上传模式
        jo.find('input').click();
    } else {
        //直接上传数据模式，清除uploadFiles中相同fileName的文件避免重复
        if (!vc.blob.name) vc.blob.name = 'temp.html';
        if (!vc.blob.type) vc.blob.type = 'text/plain';
        if (!vc.blob.lastModifiedDate) vc.blob.lastModifiedDate = new Date();

        for (var attr in vc.uploadFiles) {
            var file = vc.uploadFiles[attr];
            if (file && vc.blob.name && vc.blob.name == file.name) {
                vc.$set(vc.uploadFiles, attr, undefined);
                delete vc.uploadFiles[attr];
            };
        };

        filesSelected([vc.blob]);
    };
};


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

            //填充必要的后续使用信息，uploadInfo
            file.uploadInfo = {
                token: res.data.token,
                key: res.data.key,
                domain: res.data.domain,
                url: res.data.url,
                percent: 0,
                xhr: undefined,
                abort: function () {
                    xhrAbort(file);
                },
            };
            startUploadOneFile(file); //异步调用
        };
    } catch (err) {
        vc.$message.error(err.message || err.tip);
    };
};


/**
 * 取消上传的方法，被file.uploadInfo.abort调用
 * @param {object} file 用户选择的文件
 */
function xhrAbort(file) {
    if (file.uploadInfo.xhr) {
        file.uploadInfo.xhr.abort();
        vc.$set(vc.uploadFiles, file.uploadInfo.key, undefined);
        delete vc.uploadFiles[file.uploadInfo.key];
    };
};



/**
 * 开始上传文件，满足多个文件上传的异步调用
 * @param {object} file input的file对象，包含uploadInfo{url,key,..}
 */
async function startUploadOneFile(file) {
    try {
        //先把文件填充到上传列表
        vc.$set(vc.uploadFiles, file.uploadInfo.key, file);

        //开始上传
        var fres = await uploadOneFile(file);
        vc.$message.success(`上传成功:${file.name}`);

        //更新下载链接
        if (file.uploadInfo.url != fres.data.url) { //避免异常
            file.uploadInfo.url = fres.data.url;
            vc.$set(vc.uploadFiles, file.uploadInfo.key, undefined); //强力刷新
            vc.$set(vc.uploadFiles, file.uploadInfo.key, file);
        };
    } catch (err) {
        if (err.err == 'abort') {
            vc.$message.success(`上传取消:${file.name}`);
        } else {
            vc.$message.error(err.tip || err.message);
        };
    }
};


/**
 * 上传单个文件的方法，不直接使用，所以没有try捕获，谁用谁捕获
 * @param   {object}   file input的文件对象
 * @returns {object} 上传后服务端返回的对象resp
 */
async function uploadOneFile(file) {
    //准备fromdata
    var formdata = new FormData();
    formdata.append('file', file);
    formdata.append('token', file.uploadInfo.token);
    formdata.append('key', file.uploadInfo.key);

    //发起上传
    var set = {
        url: "http://up.qiniu.com",
        data: formdata,
        type: 'POST',
        processData: false, //屏蔽掉ajax自动header处理
        contentType: false, //屏蔽掉ajax自动header处理
        beforeSend: function (xhr) { //上传之前提取xhr，用于取消
            file.uploadInfo.xhr = xhr;
        },
    };


    //上传过程中自动更新文件进度
    set.xhr = function () {
        //为ajax添加progress事件监听
        var xhr = $.ajaxSettings.xhr();

        xhr.upload.addEventListener("progress", function (evt) {
            progressHandler(file, evt);
        }, false);
        return xhr;
    };

    //发起请求，返回结果
    var res = await vc.rRun(set);

    return res;
};


/**
 * 上传进程中的控制器，主要用来更新每个file的uploadInfo.percent
 * @param {object} file 用户选择的文件对象，需要具有uploadInfo字段
 * @param {object} evt  进程事件
 */
function progressHandler(file, evt) {
    if (evt.lengthComputable) {
        file.uploadInfo.percent = (100 * evt.loaded / evt.total).toFixed(0);
        vc.$set(vc.uploadFiles, file.uploadInfo.key, undefined);
        vc.$set(vc.uploadFiles, file.uploadInfo.key, file);
    };
};
