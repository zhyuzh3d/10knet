/*mongoose数据库基本功能
 */

var _mngs = {};

_mngs.startPrms = function () {
    var prms = new Promise(function (resolvefn, rejectfn) {
        $mongoose.connect('mongodb://localhost/10knet_dev');
        _mngs.db = $mongoose.connection;
        _mngs.db.on('error', function (err) {
            _zloger.err('_mngs:startPrms:db error', err);
            rejectfn(err);
        });
        _mngs.db.once('open', function () {
            _zloger.info('_mngs:startPrms:mongoose is ready.');
            resolvefn(_mngs);
        });
    });
    return prms;
};


var fns = _mngs.fns = {}; //全部操作方法
var schemas = _mngs.schemas = {}; //全部图式
var models = _mngs.models = {}; //全部模型


//用户数据
schemas.user = new $mongoose.Schema({
    name: String,
    phone: String,
    avatar: {
        type: String,
        default: '//10knet.com/imgs/10knet.jpg',
    },
    sex: {
        type: String,
        default: 'unknow',
    },
    _pw: String,
}, {
    strict: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'update_at',
    },
});
models.user = $mongoose.model('user', schemas.user);





//导出模块
module.exports = _mngs;
