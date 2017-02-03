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
    mobile: String,
    avatar: {
        type: String,
        default: 'http://app.10knet.com/ryNCjtgOg/10knetSqr64.png', //必须app.10knet.com以便于裁剪
    },
    sex: {
        type: String,
        default: 'unknown',
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


//文件对象
schemas.file = new $mongoose.Schema({
    uploader: { //上传者id
        type: String,
        ref: 'user',
    },
    filename: String,
    filesize: Number,
    hash: String,
    tag: String,
    url: String,
}, {
    strict: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'update_at',
    },
});
models.file = $mongoose.model('file', schemas.file);

//页面对象，每个页面对应一个当前文件file(html)以及多个历史file版本his
schemas.page = new $mongoose.Schema({
    name: String, //页面名，每用户不可重复
    author: {
        type: String,
        ref: 'user',
    },
    file: { //当前文件
        type: String,
        ref: 'file',
    },
    his: [{ //历史版本，不断添加
        type: String,
        ref: 'file'
    }],
}, {
    strict: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'update_at',
    },
});
models.page = $mongoose.model('page', schemas.page);







//导出模块
module.exports = _mngs;
