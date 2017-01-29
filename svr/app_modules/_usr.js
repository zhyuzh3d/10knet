/*user账号相关功能
 */

var _usr = {};

//初始化mongoose数据库
_usr.test = async function () {

    await _zprms.gen([new _mngs.models.user({
        name: 'zhyuzh',
        _pw: '123455',
    }), 'save']);

    var res = await _zprms.gen([$mongoose.model('user'), 'find'], {
        name: 'zhyuzh'
    });

    console.log('>>>>find', res);
};







//导出模块
module.exports = _usr;
