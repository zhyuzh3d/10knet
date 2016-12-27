/*七牛云存储相关的函数和接口，如获取token等
 */
'use strict';

const _qn = {
    conf: {
        Port: 19110,
        Uptoken_Url: "/uptoken",
        Domain: "http://qiniu-plupload.qiniudn.com/",
        BucketName: _conf.Qiniu.BucketName,
        BucketDomain: _conf.Qiniu.BucketDomain,
        ACCESS_KEY: _xconf.QINIU.ACCESS_KEY,
        SECRET_KEY: _xconf.QINIU.SECRET_KEY,
    },
};

(function () {
    _app.listen(_qn.conf.Port);
    _zloger.log(`_qn:Server is listening on ${_qn.conf.Port}.`);
})();

module.exports = _qn;

//-------------------functions--------------------
