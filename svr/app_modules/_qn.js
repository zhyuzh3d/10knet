/*七牛云存储相关的函数和接口，如获取token等
 */
'use strict';

const _qn = {
    conf: {
        Port: 19110,
        Uptoken_Url: "/uptoken",
        Domain: "http://qiniu-plupload.qiniudn.com/",
        UploadCallbackUrl: `http://${_conf.Domain}/api/qnUploadCallback`,
        BucketName: _conf.Qiniu.BucketName,
        BucketDomain: _conf.Qiniu.BucketDomain,
        ACCESS_KEY: _conf.Qiniu.ACCESS_KEY,
        SECRET_KEY: _conf.Qiniu.SECRET_KEY,
    },
    uploadTags: {
        none: true,
        page: true,
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
 * 用户上传文件到七牛之后七牛回调这个接口
 * 这里生成结果发送给七牛然后由七牛传给用户
 * @resp {object} data {url:'http://xxx'}
 */
_zrouter.addApi('/qnUploadCallback', {
    validator: {
        //对请求合法性检查可以放在这里，参照七牛文档
    },
    method: async function (ctx) {
        var file = ctx.request.body;

        //??限制文件大小和类型可以放在这里

        //mng根据token获取用户id,记录到uploader字段
        var accToken = file.accToken;
        var accId;
        if (accToken) {
            var uploaderId = await _mngs.models.user.findOne({
                _token: accToken,
            }, '_id');
            accId = uploaderId;
            if (uploaderId) file.uploader = uploaderId;
        };

        delete file['accToken'];

        //mng保存文件对象,uploader可用populate方法自动填充读取
        var mngFile = await new _mngs.models.file(file).save();

        //如果附带了pageId字段，那么先验证page的author与acctoken是否匹配，然后再加入page.his
        var pageId = file.pageId;
        if (pageId && accToken && accId) {
            var author = await _mngs.models.page.findOne({
                _id: pageId,
            }, 'author');
            console.log('>>>qnUploadCallback authorId', author);


        };




        ctx.body = new _msg.Msg(null, ctx, mngFile);
    },
});


/**
 * 获取上传随机文件名的token
 * @resp {object} data {domain:'xxx',token:'xxx',key:'xxx/xx.xx'}
 */
_zrouter.addApi('/qnRandKeyUploadToken', {
    validator: {
        token: function (ipt, ctx) { //用来判断用户身份,允许为空
            return (ipt === undefined || ipt === null || _conf.regx.token.test(ipt));
        },
        pageId: function (ipt, ctx) {
            return (ipt === undefined || ipt === null || _conf.regx.mngId.test(ipt));
        },
        tag: function (ipt, ctx) { //标志文件的用途，如page或素材none
            return _qn.uploadTags[ipt];
        },
        fileName: /^(undefined|([\S\s]{1,64}\.\w{1,6}))$/
    },
    method: async function (ctx) {
        var fkey = $shortid.generate();
        if (ctx.xdata.fileName) fkey += '/' + ctx.xdata.fileName;

        var url = _qn.conf.BucketDomain + '/' + fkey;
        var upToken = genUploadToken(fkey, {
            url: _qn.conf.BucketDomain + '/' + fkey,
            accToken: ctx.xdata.token,
            tag: ctx.xdata.tag,
        });

        var data = {
            domain: _qn.conf.BucketDomain,
            token: upToken,
            key: fkey, //前端需要使用这个key上传到七牛
            url: url,
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
function genUploadToken(key, callbackBody) {
    var keystr = key ? (_qn.conf.BucketName + ':' + key) : _qn.conf.BucketName;
    var pubPutPolicy = new $qiniu.rs.PutPolicy(keystr);

    pubPutPolicy.callbackUrl = _qn.conf.UploadCallbackUrl;

    //回调的数据字段,这些字段将用来判断文件类型和大小，超过限制的将被删除
    var cbstr = `filename=$(fname)&`;
    cbstr += `filesize=$(fsize)&`;
    cbstr += `type=$(mimeType)&`;
    cbstr += `hash=$(etag)&`;

    //自定义回调字段，将callbackBodyUri传进来的参数序列化
    if (callbackBody) {
        for (var attr in callbackBody) {
            var val = callbackBody[attr];
            if (val.constructor != String) val = JSON.stringify(val); //避免'"xxx"'情况
            cbstr += `${attr}=${val}&`
        };
    };

    pubPutPolicy.callbackBody = cbstr;

    var token = pubPutPolicy.token();
    return token;
};
