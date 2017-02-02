/*全局的post/get远程ajax方法，提供一个rRun方法，返回Promise
 */
import $ from 'jquery';

var rRun = remoteRun;
export default rRun;


//-------------------functions------------------

/**
 * 远程remoteRun运行，实际是post远程接口并返回promise
 * @param   {string} api  接口路径，完全版的地址
 * @param   {object} data 传输的数据
 * @param   {object} opt  额外的选项，将覆盖默认选项
 * @returns {promise} promsie
 */
function remoteRun(api, data, opt) {

    var prms = new Promise(function (resolve, reject) {
        var apistr = (api.constructor == String) ? api : api.url;
        var xhr;
        var ajaxObj;

        if (api.constructor == String) {
            var dt, tp;
            //如有数据，则默认POST
            if (data) {
                tp = 'POST';
                dt = data.constructor == String ? data : JSON.stringify(data);
            } else {
                tp = 'GET';
            };

            //第一个参数为url字符串
            ajaxObj = {
                type: tp,
                url: api,
                data: dt,
                dataType: 'json',
                contentType: 'application/json',
                xhrFields: {
                    withCredentials: true
                },
            };

            //合并第三个参数
            if (opt) ajaxObj = Object.assign(ajaxObj, opt);
        } else {
            //第一个参数为设置对象，忽略后面的参数
            ajaxObj = api;
        };

        //补足完成事件和出错处理,使用异步处理，不使用回调
        ajaxObj.success = function (msg) {
            //测试输出
            if (location.href.indexOf('http://10knet.com/?dev') == 0) {
                console.log(`rRun:${apistr}:`, data, msg);
            };

            //解析msg格式,判断msg.err
            if (msg && !msg.err) {
                msg.res ? resolve(msg.res) : resolve(msg); //输出整个返回，兼容外部站点
            } else {
                if (msg && msg.err) msg.err.tip = '服务端提示:' + msg.err.tip;
                if (!msg) msg = {
                    err: 'unkown'
                };
                reject(msg.err);
            };
        };

        ajaxObj.error = function (xhr, err) {
            //重组err,合成标准的err格式
            var zerr = {
                id: xhr.status,
                tip: `服务端提示:${apistr}:ERR${xhr.status}:${xhr.statusText}.`,
                err: err,
                xhr: xhr,
            };

            reject(zerr);
        };


        //启动请求
        $.ajax(ajaxObj);
    });

    return prms;
};
