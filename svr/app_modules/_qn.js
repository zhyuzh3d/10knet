/*七牛云存储相关的函数和接口，如获取token等
 */
'use strict';

const _qn = {
    init: init,
    conf: {
        Port: 19110,
        Uptoken_Url: "/uptoken",
        Domain: "http://qiniu-plupload.qiniudn.com/",
        BucketName: _xconf.qiniu.BucketName,
        BucketDomain: _xconf.qiniu.BucketDomain,
        ACCESS_KEY: _xconf.qiniu.ACCESS_KEY,
        SECRET_KEY: _xconf.qiniu.SECRET_KEY,
    },
};

(function () {
    //    await new Promise(function (okfn, errfn) {
    //        _app.listen(_qn.conf.Port, function () {
    //            console.log('qn listen1');
    //            okfn();
    //        });
    //    });

    //await start();


    //console.log('qn listen2');
})();

module.exports = _qn;

//---------------------------------------
function init() {
    console.log('>>>>qn init.');
};




async function readf(timeout) {
    return new Promise((resolve, reject) => {
        $fs.readFile('./app_modules/_qn.js', function (err, dt) {
            resolve(dt);
        });
    });
}

async function start() {
    //    //    var s = await _app.listen(_qn.conf.Port);
    //    //    var s = await $fs.readFile('./app_modules/_qn.js', function (err, dt) {
    //    //        console.log('>>>dt', dt);
    //    //    });
    //
    //    console.log('>>>>', readf());
    //    var ff = new Promise((resolve, reject) => {
    //        $fs.readFile('./app_modules/_qn.js', function (err, dt) {
    //            resolve(dt);
    //        });
    //    });
    //
    //        var s = await (new Promise((resolve, reject) => {
    //            _app.listen(_qn.conf.Port, function (err, dt) {
    //                console.log('>>>>listen ok');
    //                resolve(dt);
    //            });
    //        }));
    //
    //    //    var s = await _app.listen(_qn.conf.Port, function (err, dt) {
    //    var s = await $fs.readFile('./app_modules/_qn.js', function (err, dt) {
    //        console.log('>>>>111');
    //    });

    //await _app.listen.zprms(_qn.conf.Port);

    console.log('>>>>>>222');





};

start();

/*
var aa = (async function aa() {
    return await start();
})();

console.log('>>>>aaa', aa);
*/
