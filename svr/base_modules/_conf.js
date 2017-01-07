/*非敏感设置信息，可公开
由nodejs引入
敏感信息放在_xconf文件内，字段与_conf完全对应，可以合并覆盖
*/

const _conf = {
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
};





//导出模块
module.exports = _conf;
