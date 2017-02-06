/*account账号相关功能
 */
var _acc = {};

var noDel = _mngs.fns.noDel;
//-------------------apis--------------------
/**
 * 用户注册之前获取手机验证码，以此确认对此手机号码所有权
 * 成功返回空
 */
_zrouter.addApi('/accGetMobileRegCode', {
    validator: {
        mobile: _conf.regx.mobile,
    },
    method: async function accGetMobileRegCode(ctx) {
        var mobile = ctx.xdata.mobile;

        //检测此手机号码mongo是否已经被注册用户使用
        var mobileUsed = await $mongoose.model('user').findOne(noDel({
            mobile: mobile,
        }), '_id');
        if (mobileUsed) throw Error().zbind(_msg.Errs.AccMobileHasUsed, `手机号码:${mobile}`);

        //检测此手机号码rds是否刚刚已经发送还没过期
        var rdsKey = _rds.k.mobileRegCode(mobile);
        var hasSend = await _zprms.gen([_rds.cli, 'exists'], rdsKey);
        if (hasSend) throw Error().zbind(_msg.Errs.AccRegCodeHasSend, `手机号码:${mobile}`);

        //发送验证码
        var code = await _sms.sendCode(ctx.xdata.mobile, 'reg');

        //写入rds数据库,过期时间秒
        var exp = _conf.Sms.ExpMin * 60;
        var hasSend = await _zprms.gen([_rds.cli, 'setex'], rdsKey, exp, code);

        ctx.body = new _msg.Msg(null, ctx, null);
    },
});


/**
 * 用户忘记密码的时候获取手机验证码，以此确认对此手机号码所有权来修改密码
 * 成功返回空
 */
_zrouter.addApi('/accGetMobileRstCode', {
    validator: {
        mobile: _conf.regx.mobile,
    },
    method: async function accGetMobileRstCode(ctx) {
        var mobile = ctx.xdata.mobile;

        //检测此手机号码mongo是否已经被注册用户使用
        var mobileUsed = await $mongoose.model('user').findOne(noDel({
            mobile: mobile,
        }), '_id');
        if (!mobileUsed) throw Error().zbind(_msg.Errs.AccNotExist, `手机号码:${mobile}`);

        //检测此手机号码rds是否刚刚已经发送还没过期
        var rdsKey = _rds.k.mobileRstCode(mobile);
        var hasSend = await _zprms.gen([_rds.cli, 'exists'], rdsKey);
        if (hasSend) throw Error().zbind(_msg.Errs.AccRstCodeHasSend, `手机号码:${mobile}`);

        //发送验证码
        var code = await _sms.sendCode(ctx.xdata.mobile, 'rst');

        //写入rds数据库,过期时间秒
        var exp = _conf.Sms.ExpMin * 60;
        var hasSend = await _zprms.gen([_rds.cli, 'setex'], rdsKey, exp, code);

        ctx.body = new _msg.Msg(null, ctx, null);
    },
});


/**
 * 使用手机号和验证码注册为用户，返回用户token
 */
_zrouter.addApi('/accRegByMobile', {
    validator: {
        mobile: _conf.regx.mobile,
        code: _conf.regx.mobileCode,
        pw: _conf.regx.pw,
    },
    method: async function accRegByMobile(ctx) {
        var mobile = ctx.xdata.mobile;
        var code = ctx.xdata.code;
        var pw = ctx.xdata.pw;

        //rds检测手机号码和验证码是否匹配
        var codeKey = _rds.k.mobileRegCode(mobile);
        var rdsCode = await _zprms.gen([_rds.cli, 'get'], codeKey);
        if (rdsCode != code) throw Error().zbind(_msg.Errs.AccRegCodeNotMatch, '手机号码:' + mobile);

        //mng检测手机号码是否已经被其他用户注册
        var mobileUsed = await $mongoose.model('user').findOne(noDel({
            mobile: mobile,
        }), '_id');
        if (mobileUsed) throw Error().zbind(_msg.Errs.AccMobileHasUsed, `手机号码:${mobile}`);

        //mng创建新的用户，随机token密钥
        var token = $uuid.v4();
        var newAcc = await new _mngs.models.user({
            mobile: mobile,
            _pw: pw,
            _token: token,
        }).save();

        newAcc._pw = undefined;

        ctx.body = new _msg.Msg(null, ctx, {
            token: token,
            acc: newAcc,
        });
    },
});


/**
 * 用户修改常规信息，如name，avatar等
 */
_zrouter.addApi('/accSaveProfile', {
    validator: {
        token: _conf.regx.token,
        name: _conf.regx.name,
    },
    method: async function accSaveProfile(ctx) {
        var name = ctx.xdata.name;
        var token = ctx.xdata.token;

        //先检查name有没有被其他用户使用且不是被自己使用
        var hasUsed = await _mngs.models.user.findOne(noDel({
            name: name,
        }), '_id _token');

        if (hasUsed && hasUsed.toObject()._token != token) throw Error().zbind(_msg.Errs.AccNameHasUsed, `:${name}`);

        //mng使用token提取user直接进行操作
        var res = await _mngs.models.user.update(noDel({
            _token: token,
        }), {
            name: name,
        });
        if (res.n == 0) throw Error().zbind(_msg.Errs.AccNotExist);

        //保存成功后为每个用户创建一个同名的page，作为用户的首页
        var acc = await _mngs.models.user.findOne(noDel({
            _token: token,
        }));

        var newPage = await _page.upsertNew(acc.id, name);
        acc = _mngs.fns.clearDoc(acc);

        ctx.body = new _msg.Msg(null, ctx, acc);
    },
});


/**
 * 根据短信修改密码
 */
_zrouter.addApi('/accChangePw', {
    validator: {
        mobile: _conf.regx.mobile,
        code: _conf.regx.mobileCode,
        pw: _conf.regx.pw,
    },
    method: async function accChangePw(ctx) {
        var mobile = ctx.xdata.mobile;
        var code = ctx.xdata.code;
        var pw = ctx.xdata.pw;

        //rds检测rstCode和mobile是否匹配
        var codeKey = _rds.k.mobileRstCode(mobile);
        var rdsCode = await _zprms.gen([_rds.cli, 'get'], codeKey);
        if (rdsCode != code) throw Error().zbind(_msg.Errs.AccRstCodeNotMatch, '手机号码:' + mobile);

        //mng修改密码
        var res = await _mngs.models.user.update(noDel({
            mobile: mobile,
        }), {
            _pw: pw,
        });

        if (res.n == 0) throw Error().zbind(_msg.Errs.AccNotExist);

        ctx.body = new _msg.Msg(null, ctx, null);
    },
});


/**
 * 用户登录，获取token
 */
_zrouter.addApi('/accLogin', {
    validator: {
        mobile: _conf.regx.mobile,
        pw: _conf.regx.pw,
    },
    method: async function accLogin(ctx) {
        var mobile = ctx.xdata.mobile;
        var pw = ctx.xdata.pw;

        //mng使用token提取user直接进行操作
        var res = await _mngs.models.user.findOne(noDel({
            mobile: mobile,
            _pw: pw,
        }));
        if (!res) throw Error().zbind(_msg.Errs.AccPwNotMatch, `手机号码:${mobile}`);

        //去除敏感信息,这里需要保留_token，不能使用clearDoc方法清理
        res._pw = undefined;

        ctx.body = new _msg.Msg(null, ctx, res);
    },
});

/**
 * 自动登录，使用token验证
 */
_zrouter.addApi('/accAutoLogin', {
    validator: {
        token: _conf.regx.token,
    },
    method: async function accAutoLogin(ctx) {
        var token = ctx.xdata.token;
        var res = await _acc.getAccByToken(token);

        res = _mngs.fns.clearDoc(res);
        ctx.body = new _msg.Msg(null, ctx, res);
    },
});


//-------------------functions--------------------

/**
 * 获取账号Id，通过token，使用token提取user直接进行操作
 * @param   {string}   token token
 * @param   {string}   str 要获取的附加字段,默认为空，只带_id字段
 * @returns {object} accInfo
 */
_acc.getAccByToken = async function getAccByToken(token, str) {
    var res = await _mngs.models.user.findOne(noDel({
        _token: token,
    }), str);

    if (!res) throw Error().zbind(_msg.Errs.AccTokenNotMatch);
    return res;
};





//导出模块
module.exports = _acc;
