/*非敏感设置信息，可公开
由nodejs引入
*/

const _conf = {
    Domain: '10knet.com',
    SvrPort: 8000,
    Domains: ['10knet.com', 'www.10knet.com'],
    Qiniu: {
        BucketName: "app10knet",
        BucketDomain: "http://app.10knet.com/",
    },

};

//导出模块
module.exports = _conf;


//-----------外层xconf.js参考-----------------------
/*
var _xconf = {
    Qiniu: {
        ACCESS_KEY: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        SECRET_KEY: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    },
};
module.exports = _xconf;
*/
