/*非敏感设置信息，可公开
由nodejs引入
敏感信息放在_xconf文件内，字段与_conf完全对应，可以合并覆盖
*/

//设置信息
var _conf = {
    Domain: '10knet.com',
    SvrPort: 8000,
    Domains: ['10knet.com', 'www.10knet.com'],
    Qiniu: Object.assign({
        BucketName: "app10knet",
        BucketDomain: "http://app.10knet.com",
        ACCESS_KEY: "set in _xconf",
        SECRET_KEY: "set in _xconf",
    }, _xconf.Qiniu),
    Github: Object.assign({
        AppName: '10knet',
        HomeUrl: 'http://www.10knet.com/',
        AuthCallbackUrl: 'http://www.10knet.com/api/githubLoginCallBack',
        ClientId: 'bcc991a3db5d401bd4af',
        ClientSecret: 'set in _xconf',
    }, _xconf.Github),
    Sms: Object.assign({
        AppId: 'set in _xconf',
        AppKey: 'set in _xconf',
        Templates: {
            REG: 'set in _xconf',
            RST: 'set in _xconf',
        },
        ExpMin: 'set in _xconf',
    }, _xconf.Sms),
};


//正则表达式
_conf.regx = {
    mobile: /^1\d{10}$/,
    mobileCode: /^\d{6}$/,
};





//导出模块
module.exports = _conf;
