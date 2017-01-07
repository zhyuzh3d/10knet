/**
 * github相关的用户登录接口和app创建数据存储等接口
 * 目的是一实现账号系统，二简化github流程界面
 */
'use strict';

const _github = {
    conf: {
        ClientId: _xconf.Github.ClientId,
        ClientSecret: _xconf.Github.ClientSecret,
    },
};


(function () {

})();

module.exports = _github;

//-------------------apis--------------------
/**
 * 用户访问github登录授权页面之后访问的地址
 * 向后跳转返回原来页面,返回用户信息和repo
 * @redirect {string} url 'back'
 */
_zrouter.addApi('/githubLoginCallback', {
    validator: {
        //对请求合法性检查可以放在这里，参照github文档
        code: /^\w{8,64}$/,
        state: /^(undefined|\d{8,32})$/,
    },
    method: loginCallback,
});




//-------------------functions----------------

/**
 * 用户向github服务器登录之后的回调
 * @param {object} ctx ctx
 */
async function loginCallback(ctx) {
    var url = 'https://github.com/login/oauth/access_token?';
    url += _zfns.objToSearchStr({
        client_id: _conf.Github.ClientId,
        client_secret: _conf.Github.ClientSecret,
        code: ctx.xdata.code,
        state: ctx.xdata.state,
    });

    //使用code兑换token,写入cookie：github_access_token
    var res = await _zreq(url);
    var token = res.match(/access_token=(\w+)&/);
    if (token) token = token[1];
    ctx.cookies.set('github_access_token', token, {
        domain: _conf.Domain,
        maxAge: 1000 * 3600 * 24 * 30,
        httpOnly: false
    });

    //重定向
    ctx.redirect('back');
};
