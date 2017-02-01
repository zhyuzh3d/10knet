/*通用函数
 */
const _zfns = {
    urlToReqOpt,
    objToSearchStr,
};

//导出模块
module.exports = _zfns;


//-------------------------- functions------------------
/**
 * 解析url地址生成request请求option设置对象
 * @param   {string} str = '' url地址栏
 * @returns {object}   option对象{proto,host,path,method}
 */
function urlToReqOpt(str = '') {
    var hostMatch = str.match(/^(?:(http|https):\/\/)?([\w.]+)(?:\/)?/);
    var opt;
    if (hostMatch) {
        opt = {
            protocol: hostMatch[1] ? hostMatch[1] + ':' : 'http:',
            hostname: hostMatch[2],
            path: str.substr(hostMatch[0] ? hostMatch[0].length - 1 : 0),
            method: 'GET'
        };
    };
    return opt;
};

/**
 * 解析url地址生成request请求option设置对象
 * @param   {object} obj 需要转换的obj，对象格式的children将被json字符串化
 * @returns {string}   转换完成的字符串，前后都没有&符号
 */
function objToSearchStr(obj = {}) {
    var str = '';
    for (var attr in obj) {
        var val = obj[attr];
        var valStr = (val && val.constructor == String) ? val : JSON.stringify(val);
        if (val) str += `${attr}=${encodeURIComponent(valStr)}&`
    };
    if (str.length > 0 && str[str.length - 1] == '&') {
        str = str.substr(0, str.length - 1);
    };

    return str;
};


/**
 * 扩展JSON安全parse方法
 * @param   {string} str 字符串
 * @returns {object} 成功的对象或undefined
 */
JSON.safeParse = function (str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return undefined;
    };
};
``


//--------------------test---------------
