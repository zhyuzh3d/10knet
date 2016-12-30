/*全局的post/get远程ajax方法，提供一个rmtrun方法，返回Promise
 */
import $ from 'jquery';

var rmtrun = rmtPost;
export default rmtrun;


//-------------------functions------------------

function rmtPost(api, data, opt) {
    var prms = new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",
            url: api,
            data: dat,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (msg) {
                console.log(`rmtrun:${api}:${msg}`);

                //解析msg格式,判断msg.err
                if (!msg.err) {
                    resolve(msg.res);
                } else {
                    reject(err);
                };
            },
            error: function (xhr, err) {
                reject(err);
            },
        });
    });

    return prms;
};
