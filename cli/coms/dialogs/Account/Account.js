import $ from 'jquery';
import md5 from 'md5';

let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

com.props = {
    conf: Object, //{show,startTab,myInfo}
};

//所有数据写在这里
com.data = function data() {
    return {
        actTab: 'login',
        reg: {
            codeBtnDis: false,
        },
        login: {},
        rst: {
            codeBtnDis: false,
        },
        set: {},
        validates: { //input格式验证，fn或正则，和html的ref对应名称
            regMobile: {
                fn: /^1\d{10}$/,
                tip: '真实的11位数字手机号码'
            },
            regCode: {
                fn: /^\d{6}$/,
                tip: '手机短信中的六位数字'
            },
            regPw: {
                fn: /^[\s\S]{6,18}$/,
                tip: '任意6～18位字符'
            },
            loginMobile: {
                fn: /^1\d{10}$/,
                tip: '真实的11位数字手机号码'
            },
            loginPw: {
                fn: /^[\s\S]{6,18}$/,
                tip: '任意6～18位字符'
            },
            rstMobile: {
                fn: /^1\d{10}$/,
                tip: '真实的11位数字手机号码'
            },
            rstCode: {
                fn: /^\d{6}$/,
                tip: '手机短信中的六位数字'
            },
            rstPw: {
                fn: /^[\s\S]{6,18}$/,
                tip: '任意6～18位字符'
            },
            setName: {
                fn: /^[A-Za-z0-9]{4,18}$/,
                tip: '4~18位字母和数字'
            },
        },
    };
};

com.watch = {
    conf: {
        handler: function (val, oldval) {
            var ctx = this;

            //使关闭窗口的钩子生效
            if (!val.show && val.onHide) {
                val.onHide(this);
            };

            if (val.show) {
                //自动调整默认打开的tab
                if (ctx.$xglobal.accInfo) {
                    ctx.$set(ctx.$data, 'actTab', 'set');
                } else {
                    ctx.$set(ctx.$data, 'actTab', 'login');
                };
            };
        },
        deep: true,
    },
    actTab: actTabChange,
};


//所有直接使用的方法写在这里
com.methods = {
    tabClick: tabClick,
    validate: function (ref) {
        this.$xglobal.fns.validate(this, ref);
    },
    sendRegCode: sendRegCode,
    sendRstCode: sendRstCode,
    regByMobile: regByMobile,
    saveProfile: saveProfile,
    mobileLogin: mobileLogin,
    changePw: changePw,
    accLogout: accLogout,
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {
    var ctx = this;

    //自动调整默认打开的tab
    if (ctx.$xglobal.accInfo) {
        ctx.$set(ctx.$data, 'actTab', 'set');
    };
};

//--------------------------functions---------------------------

/**
 * 监听actTab变化，强制同步切换标签卡
 * @param {object} evt event
 */
function actTabChange(val, oldval) {
    var ctx = this;
    var tabs = {
        'reg': '注册',
        'login': '登录',
        'rst': '忘记密码',
        'set': '设置',
    };
    $(ctx.$el).find(`.el-tabs__item:contains("${tabs[val]}")`).click();
};


/**
 * 切换标签页事件
 * @param {object} evt event
 */
function tabClick(evt) {
    var ctx = this;
    ctx.$set(ctx.$data, 'actTab', evt.name);
};


/**
 * 发送注册验证码,10秒内发1次（服务端限制5分钟发3次）
 */
async function sendRegCode() {
    var ctx = this;

    try {
        ctx.$set(ctx.$data.rst, 'codeBtnDis', true);
        setTimeout(function () {
            ctx.$set(ctx.$data.rst, 'codeBtnDis', false);
        }, 10000);

        var api = ctx.$xglobal.conf.apis.accGetMobileRstCode;
        var data = {
            mobile: ctx.$data.reg.mobile,
        };
        var res = await ctx.rRun(api, data);
        if (!res.err) {
            ctx.$notify.success({
                title: `验证码已经发送到您的手机，请注意查收`,
                message: `手机号码是${data.mobile}`,
            });
        };
    } catch (err) {
        ctx.$notify.error({
            title: `发送重置验证码失败`,
            message: err.tip,
        });
    };
};


/**
 * 发送重置验证码,10秒内发1次（服务端限制5分钟发3次）
 */
async function sendRstCode() {
    var ctx = this;

    try {
        ctx.$set(ctx.$data.reg, 'codeBtnDis', true);
        setTimeout(function () {
            ctx.$set(ctx.$data.reg, 'codeBtnDis', false);
        }, 10000);

        var api = ctx.$xglobal.conf.apis.accGetMobileRstCode;
        var data = {
            mobile: ctx.$data.rst.mobile,
        };
        var res = await ctx.rRun(api, data);
        if (!res.err) {
            ctx.$notify.success({
                title: `验证码已经发送到您的手机，请注意查收`,
                message: `手机号码是${data.mobile}`,
            });
        };
    } catch (err) {
        ctx.$notify.error({
            title: `发送注册验证码失败`,
            message: err.tip,
        });
    };
};


/**
 * 注册新用户
 */
async function regByMobile() {
    var ctx = this;
    try {
        var api = ctx.$xglobal.conf.apis.accRegByMobile;
        var data = {
            mobile: ctx.$data.reg.mobile,
            code: ctx.$data.reg.code,
            pw: md5(ctx.$data.reg.pw),
        };
        var res = await ctx.rRun(api, data);

        if (!res.err) {
            ctx.$notify.success({
                title: `恭喜您成为新用户！`,
                message: '强烈建议您立即设定个人首页地址',
            });

            //切换tab到设置
            ctx.$set(ctx.$data, 'actTab', 'set');

            //将token存到ls
            localStorage.setItem('accToken', res.data.token);
        };
    } catch (err) {
        ctx.$notify.error({
            title: `注册新用户失败`,
            message: err.tip,
        });
    };
};


/**
 * 设定用户资料（name域名，avatar头像等）
 */
async function saveProfile() {
    var ctx = this;
    try {
        var token = localStorage.getItem('accToken');
        if (!token) {
            ctx.$notify.error({
                title: `您还没有登录，请先登录或注册`,
                message: '只有登录成功后才能修改资料',
            });
            return;
        };

        var api = ctx.$xglobal.conf.apis.accSaveProfile;
        var data = {
            token: token,
            name: ctx.$data.set.name,
        };
        var res = await ctx.rRun(api, data);

        if (!res.err) {
            ctx.$notify.success({
                title: '保存成功!',
            });

            //关闭弹窗
            ctx.$set(ctx.conf, 'state', 'set');
            ctx.$set(ctx.conf, 'show', false);
        };
    } catch (err) {
        ctx.$notify.error({
            title: `保存失败`,
            message: err.tip,
        });
    };
};

/**
 * 使用手机号码和密码登录
 */
async function mobileLogin() {
    var ctx = this;
    try {
        var api = ctx.$xglobal.conf.apis.accLogin;
        var data = {
            mobile: ctx.$data.login.mobile,
            pw: md5(ctx.$data.login.pw),
        };
        var res = await ctx.rRun(api, data);

        if (!res.err) {
            ctx.$notify.success({
                title: '登录成功!',
            });

            //数据放入xglobal
            ctx.$set(ctx.$xglobal, 'accInfo', res.data);

            //token写入本地
            localStorage.setItem('accToken', res.data._token);

            //关闭弹窗
            ctx.$set(ctx.conf, 'state', 'login');
            ctx.$set(ctx.conf, 'show', false);
        };
    } catch (err) {
        ctx.$notify.error({
            title: `登录失败`,
            message: err.tip,
        });
    };
};

/**
 * 重置密码，根据手机短信验证码修改密码
 */
async function changePw() {
    var ctx = this;
    try {
        var api = ctx.$xglobal.conf.apis.accChangePw;
        var data = {
            mobile: ctx.$data.rst.mobile,
            code: ctx.$data.rst.code,
            pw: md5(ctx.$data.rst.pw),
        };
        var res = await ctx.rRun(api, data);

        if (!res.err) {
            ctx.$notify.success({
                title: '修改成功，请使用新密码登录',
            });

            //切换tab到登录
            ctx.$set(ctx.$data, 'actTab', 'login');
        };
    } catch (err) {
        ctx.$notify.error({
            title: `修改密码失败`,
            message: err.tip,
        });
    };
};

/**
 * 注销，清除token和$xglobal.accInfo
 */
async function accLogout() {
    var ctx = this;
    localStorage.removeItem('accToken');
    ctx.$set(ctx.$xglobal, 'accInfo', null);

    //关闭弹窗
    ctx.$set(ctx.conf, 'state', 'logout');
    ctx.$set(ctx.conf, 'show', false);
};


//
