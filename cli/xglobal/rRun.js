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

        var ajaxObj = {
            type: "POST",
            url: api,
            data: data,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (msg) {
                //测试输出
                console.log(`rRun:${api}:${msg}`);

                //解析msg格式,判断msg.err
                if (!msg.err) {
                    resolve(msg.res);
                } else {
                    reject(err);
                };
            },
            error: function (xhr, err) {
                //重组err,合成标准的err格式
                var zerr = {
                    id: xhr.status,
                    tip: `rRun:${xhr.statusText}:${api},${data}`
                };
                reject(zerr);
            },
        };

        if (opt) ajaxObj = Object.assign(ajaxObj, opt);

        $.ajax(ajaxObj);
    });

    return prms;
};
