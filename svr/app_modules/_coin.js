/**
 * 货币系统，编码得经验，经验换金币，使用功能减金币
 */

var _coin = {};



//-------------------apis-----------------------------

/**
 * 修改用户金币数量，添加历史记录
 */
_zrouter.addApi('/coinAdd', {
    validator: {
        token: _conf.regx.token,
        name: _conf.regx.name,
    },
    method: async function accSaveProfile(ctx) {
        var name = ctx.xdata.name;
        var token = ctx.xdata.token;

        //先检查name有没有被其他用户使用
        var hasUsed = await _mngs.models.user.findOne(noDel({
            name: name,
        }), '_id');
        if (hasUsed) throw Error().zbind(_msg.Errs.AccNameHasUsed, `:${name}`);

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

        var page = {
            author: acc._id,
            name: name,
        };

        var newPage = await _mngs.models.page.update(noDel(page), page, {
            upsert: true
        });

        acc = _mngs.fns.clearDoc(acc);

        ctx.body = new _msg.Msg(null, ctx, acc);
    },
});



//-------------------functions-----------------------------



//导出模块
module.exports = _coin;
