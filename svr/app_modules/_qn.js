/*七牛云存储相关的函数和接口，如获取token等
 */
'use strict';

const _qn = {
    conf: {
        Port: 19110,
        Uptoken_Url: "/uptoken",
        Domain: "http://qiniu-plupload.qiniudn.com/",
        UploadCallbackUrl: `http://$(_conf.Domain)/qn/uploadCallback`,
        BucketName: _conf.Qiniu.BucketName,
        BucketDomain: _conf.Qiniu.BucketDomain,
        ACCESS_KEY: _xconf.Qiniu.ACCESS_KEY,
        SECRET_KEY: _xconf.Qiniu.SECRET_KEY,
    },
    uploadTags: {
        none: true,
    },
    genUploadToken: genUploadToken,
};


(function () {
    //初始化七牛的访问密匙设置
    $qiniu.conf.ACCESS_KEY = _qn.conf.ACCESS_KEY;
    $qiniu.conf.SECRET_KEY = _qn.conf.SECRET_KEY;

    //启动端口监听
    _app.listen(_qn.conf.Port);
    _zloger.info(`_qn:Server is listening on ${_qn.conf.Port}.`);
})();

module.exports = _qn;

//-------------------apis--------------------

/**
 * 获取上传随机文件名的token
 * @resp {object} data {domain:'xxx',token:'xxx'}
 */
_zrouter.addApi('/qnRandKeyUploadToken', {
    validator: {
        tag: function (ipt, ctx) {
            return _qn.uploadTags[ipt];
        },
    },
    method: async function (ctx) {
        var data = {
            domain: _qn.conf.BucketDomain,
            token: genUploadToken()
        };
        ctx.body = new _msg.Msg(null, ctx, data);
    },
});


//-------------------functions----------------

/**
 * 发送上传许可的token，可以指定文件名或随机文件名
 * @param   {string} key 可选，文件名，默认为空随机文件名
 * @returns {string} token
 */
function genUploadToken(tag = 'default', key) {
    var keystr = key ? (_qn.conf.BucketName + ':' + key) : _qn.conf.BucketName;
    var pubPutPolicy = new $qiniu.rs.PutPolicy(keystr);

    pubPutPolicy.returnBody = '{"name": $(fname),"size": $(fsize),"type": $(mimeType),"color": $(exif.ColorSpace.val),"key":$(key),"w": $(imageInfo.width),"h": $(imageInfo.height),"hash": $(etag)}';
    pubPutPolicy.callbackUrl = _qn.conf.UploadCallbackUrl;
    pubPutPolicy.callbackBody = `filename=$(fname)&filesize=$(fsize)&type=$(mimeType)&tag=${tag}`;

    var token = pubPutPolicy.token();
    return token;
};
