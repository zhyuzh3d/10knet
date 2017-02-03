/*page页面相关功能
 */
var _page = {};

//-------------------apis--------------------
/**
 * 用户注册之前获取手机验证码，以此确认对此手机号码所有权
 * 成功返回空
 */
_zrouter.addApi('/pageNew', {
    validator: {
        token: _conf.regx.token, //用户token认证信息
        name: _conf.regx.pageName,
    },
    method: async function (ctx) {
        var token = ctx.xdata.token;
        var name = ctx.xdata.name;

        //根据token获取用户id
        var acc = await _mngs.models.user.findOne({
            _token: token,
        }, '_id');
        if (!acc) throw Error().zbind(_msg.Errs.AccNotExist);

        //检测是否有重名的page
        var hasUsed = await _mngs.models.page.findOne({
            author: acc.id,
            name: name,
        }, '_id');
        if (hasUsed) throw Error().zbind(_msg.Errs.PageNameUsed, `:${name}`);

        //创建新页面
        var newPage = await new _mngs.models.page({
            author: acc.id,
            name: name,
        }).save();

        ctx.body = new _msg.Msg(null, ctx, newPage);
    },
});


//-------------------functions--------------------
//






//导出模块
module.exports = _page;
