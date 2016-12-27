/*日志记录器，输出到控制台同时记录到文件，每天一个文件自动累积
 */
'use strict';

const _zloger = {
    koaMiddleWare: koaMiddleWare,
    folderPath: process.cwd() + '/zloger/', //日志存放的目录
    todayPath: '', //今天的日志目录，自动更改
    log: log,
    save: save,
};

(function () {
    autoSetTodayPath(); //启动定时，自动切换todayPath
})();

module.exports = _zloger;


//--------------------functions------------------

async function koaMiddleWare(ctx, next) {
    const start = new Date();
    const stm = $moment(start).format('YYYY/MM/DD hh:mm:ss');
    var str = `${ctx.method} : ${ctx.url}`;
    _zloger.log(str);
    await next();
    const ms = new Date() - start;
    _zloger.log(`${str} -> ${ms}ms`);
};

/**
 * 记录到文件
 * 控制台输出time+data，文件内记录为{time,data}
 * @param {object} data 需要记录的数据，直接输出，转为json保存
 * @param {boolean} type 自定义类型，inf,err等
 * @param {string} filename  保存的文件名,默认default
 */
function save(data, type = 'INFO', filename = 'default') {
    var obj = {
        time: new Date(),
        type: type.toUpperCase(),
        data: data
    };
    var str = JSON.stringify(obj) + '\n';

    var file = $path.join(_zloger.todayPath, filename); //当天文件夹内文件
    $fs.appendFile(file, str, (err) => {
        if (err) _zloger.log(`_loger:logToFile failed:${file}`, 'ERR', false);
    });
};


/**
 * 输出到控制台
 * 控制台输出time+data,自动截取error前512字符
 * @param {object} data 需要记录的数据，直接输出
 * @param {boolean} type 自定义类型，INFO,ERR,WARN都应大写
 * @param {string} filename  保存的文件名,默认default
 */
function log(data, type = 'INFO', dosave = true, filename = 'default') {
    var nowstr = $moment().format('YY-MM-DD hh:mm:ss');
    console.log('[', type, ']', nowstr, data);
    if (dosave) _zloger.save(data, type.toUpperCase(), filename);
};

/**
 * 自动设置todayFolder，如果没有就创建
 */
function setTodayPath() {
    if (!$fs.existsSync(_zloger.folderPath)) $fs.mkdir(_zloger.folderPath);
    var todayFolder = $path.join(_zloger.folderPath, $moment().format('YYYY-MM-DD'));
    if (!$fs.existsSync(todayFolder)) $fs.mkdirSync(todayFolder);
    _zloger.todayPath = todayFolder;
};

/**
 * 自动切换todayPath；
 * 先立即切换，然后定时到午夜12点再切换，并启动每24小时切换
 */
function autoSetTodayPath() {
    setTodayPath();
    var dist0 = $moment($moment().format('YYYY-MM-DD')).add(1, 'd') - $moment();
    setTimeout(function () {
        setTodayPath();
        setInterval(function () {
            setTodayPath();
        }, 3600000 * 24);
    }, dist0 + 1000);
};
