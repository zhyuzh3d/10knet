/**
 * mongoose数据库基本功能
 * 删除统一使用__del=true
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

//-------------------functions-----------------------------


var fns = _mngs.fns = {
    clearDoc,
    noDel,
};

/**
 * 补充数据__del查询字段
 */
function noDel(obj) {
    var res = {};
    for (var attr in obj) {
        res[attr] = obj[attr];
    };

    res.__del = {
        $ne: true
    };

    return res;
};


/**
 * 将所有下划线开头的属性都删除，但保留_id
 * 必须具有_id字段才会被清理
 * @param   {object} obj    obj
 * @returns {object} obj
 */
function clearDoc(doc) {
    //如果undefined,null,0,false，直接返回
    if (!doc) return doc;

    //如果是队列，那么逐个执行
    if (doc.constructor == Array) {
        var arr = [];
        doc.forEach(function (item) {
            arr.push(clearDoc(item));
        });
        return arr;
    };

    //如果有_id属性(必然是对象)，那么先转object，再针对每个属性执行
    if (doc['_id']) {
        var obj = doc.toObject ? doc.toObject() : Object(doc);
        for (var attr in obj) {
            if (attr != '_id' && attr[0] == '_') {
                delete obj[attr];
            } else {
                obj[attr] = clearDoc(obj[attr]);
            };
        };

        doc = obj;
    };

    return doc;
};


//----------------schemas&&models-------------------------
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
    page: { //上传者id
        type: String,
        ref: 'page',
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
