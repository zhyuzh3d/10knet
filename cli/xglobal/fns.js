/*全局函数文件，将被xglobal插件载入到每个component的this.$xglobal.fns备用
 */

let fns = {
    getCookie,
    validate,
    autoLogin,
};
export default fns;

//------------------functions------------
/**
 * 自动登录，使用token
 */
async function autoLogin(ctx) {
    try {
        var token = localStorage.getItem('accToken');
        if (!token) {
            ctx.$notify.error({
                title: `您还没有登录，请先登录或注册`,
                message: '登录后可以获得更多功能',
            });
            return;
        };

        var api = ctx.$xglobal.conf.apis.accAutoLogin;
        var data = {
            token: token,
        };
        var res = await ctx.rRun(api, data);

        if (!res.err) {
            ctx.$notify.success({
                title: '自动登录成功!',
            });

            //数据放入xglobal
            ctx.$set(ctx.$xglobal, 'accInfo', res.data);
            ctx.$set(ctx.$data, 'accInfo', res.data);
        };
    } catch (err) {
        console.log('>>>XX', ctx.$data);
        if (!ctx.$notify) return;
        ctx.$notify.error({
            title: `自动登录失败，请尝试使用密码登录`,
            message: err.tip,
        });
    };
};

/**
 * 从本地读取cookie
 * @param   {string}   cookieName key键名
 * @returns {string} value
 */
function getCookie(cookieName) {
    var arr = document.cookie.match(new RegExp("(?:^| )" + cookieName + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[1]);
    return null;
};

/**
 * 扩展JSON安全parse方法
 * @param   {string} str 字符串
 * @returns {object} 成功的对象或undefined
 */
JSON.safeParse = function (str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return undefined;
    };
};

/**
 * 对el包裹的input事件进行验证，在el-input上使用;验证通过将在vali对象上添加字段pass
 * <el-input ref='regMobile' @change='validate("regMobile")'>
 * @param {object} evt event
 * @returns {boolean} 通过验证为true
 */
function validate(ctx, ref) {
    var vali = ctx.$data.validates ? ctx.$data.validates[ref] : undefined;
    if (!vali) return;
    var fn = vali ? vali.fn : undefined;
    if (!fn) return;

    var jo = $(ctx.$refs[ref].$el);
    var type = fn.constructor;
    var iptjo = jo.find('input');
    var val = iptjo.val();
    var tipjo = $('<div id="valiTip" style="font-size:10px;color:red;text-align:left"></div>');
    var tip = vali ? vali.tip : '您输入的格式不完整或不正确';
    tipjo.html(tip);

    if ((type == Function && fn(val)) || (type == RegExp && fn.test(String(val)))) {
        ctx.$set(ctx.$data.validates[ref], 'pass', true);
        jo.find('#valiTip').remove();
        iptjo.css('color', 'inherit');
        return true;
    } else {
        ctx.$set(ctx.$data.validates[ref], 'pass', false);
        iptjo.css('color', 'red');
        jo.find('#valiTip').remove();
        jo.append(tipjo);
        return false;
    };
};
