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
            REG: 'set in _xconf', //发送注册短信码模版号
            RST: 'set in _xconf', //发送重置短信码模版号
        },
        ExpMin: 'set in _xconf', //短信码过期时间，分钟
    }, _xconf.Sms),
    Coin: {
        ExpPerCoin: 50, //每个50个经验兑换1个金币
    },
};


//正则表达式
_conf.regx = {
    mobile: /^1\d{10}$/, //手机号码
    mobileCode: /^\d{6}$/, //短信验证码
    pw: /^[A-Za-z0-9]{32}$/, //密码，md5加密后
    name: /^[A-Za-z0-9]{4,18}$/, //用户名，主页地址名，不能用中文
    nick: /^[\S\s]{4,18}$/, //昵称，任意字符
    avatar: /^(http)?(s)?(:)?\/\/app\.10knet.com\/[\S\s]{3,256}$/, //头像，必须来自app.10knet网站，以便于裁切
    token: /^[A-Za-z0-9-]{32,64}$/, //用户token，数字字母横线
    mngId: /^[a-z0-9-]{16,64}$/, //mongo数据库文档id，数字字母
    pageName: /^[A-Za-z0-9_]{4,64}$/, //页面名称，数字字母下划线
    int8: /^-?\d{1,8}$/, //正负整数,99999999
};





//导出模块
module.exports = _conf;
