/**
 * 货币系统，编码得经验，经验换金币，使用功能减金币
 */
var _coin = {};

var noDel = _mngs.fns.noDel;

//-------------------apis-----------------------------

/**
 * 增加经验，修改用户硬币数量，添加历史记录
 * 返回exp总数和coin总数
 */
_zrouter.addApi('/coinChangeExp', {
    validator: {
        token: _conf.regx.token,
        delta: _conf.regx.int8,
    },
    method: async function accSaveProfile(ctx) {
        var token = ctx.xdata.token;
        var delta = ctx.xdata.delta;

        var acc = await _coin.changeExp(token, delta);

        acc = _mngs.fns.clearDoc(acc);

        ctx.body = new _msg.Msg(null, ctx, acc);
    },
});


//-------------------functions-----------------------------
/**
 * 修改用户的经验数量，自动同步变化硬币数量
 * @param {mngdoc} acc mongo的user对象
 * @param {number} delta 增减变化量，整数
 * @param {object} ext 附加记录到his的信息对象
 * @return {accdoc} 变化后的acc数量
 */
_coin.changeExp = async function changeExp(token, delta, ext) {
    var acc = await _acc.getAccByToken(token, 'exp coin');
    var params = {
        exp: delta,
        coin: delta / _conf.Coin.ExpPerCoin,
    };

    var res = await acc.update({
        $inc: params
    });

    //写入历史记录
    if (ext) params = Object.assign(params, ext);
    await new _mngs.models.his({
        tag: 'changeExp',
        author: acc._id,
        target: acc._id,
        targetType: _mngs.types.user,
        params: params,
    }).save();

    acc.exp += params.exp;
    acc.coin += params.coin;

    return acc;
};


/**
 * 单独修改用户的硬币数量，消费，与exp无关
 * 这个函数没有对外的接口，仅在后台程序之间调用
 * @param {mngdoc} acc mongo的user对象
 * @param {number} delta 增减变化量，整数
 * @param {object} ext 附加记录到his.params的信息对象
 * @return {accdoc} 变化后的acc数量
 */
_coin.changeCoin = async function changeCoin(token, delta, ext) {
    var acc = await _acc.getAccByToken(token, 'exp coin');
    var params = {
        coin: delta,
    };

    var res = await acc.update({
        $inc: params
    });

    //写入历史记录
    if (ext) params = Object.assign(params, ext);
    await new _mngs.models.his({
        tag: 'changeCoin',
        author: acc._id,
        target: acc._id,
        targetType: _mngs.types.user,
        params: params,
    }).save();

    acc.coin += params.coin;

    return acc;
};


//导出模块
module.exports = _coin;
