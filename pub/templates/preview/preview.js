//刷新iframe页面
function reload() {
    location.reload();
};

//载入后自动从保存的ls中恢复
function autoRefresh() {
    refreshCss();
    refreshHtml();
    reloadJs();
};

autoRefresh();

function refresh(params) {
    if (!params) return;

    var lang = params.lang;

    switch (lang) {
        case 'css':
            refreshCss();
            break;
        case 'html':
            refreshHtml();
            break;
        case 'js':
            refreshJs();
            break;
        default:
            console.log('refresh:lang is unknown', lang);
            break;
    };
};

function refreshCss() {
    var data = localStorage.getItem('preview-css');
    $('style[preview]').empty();
    $('style[preview]').append(data);
};

function refreshHtml() {
    var data = localStorage.getItem('preview-html');
    $('body').empty();
    $('body').append(data);
};

function refreshJs() {
    //reload();
};




function reloadJs() {
    var data = localStorage.getItem('preview-js');
    $('script[preview]').remove();
    var sdom = $('<script preview></script>');

    //外加try-catch捕获异常
    try {
        eval(data);
    } catch (err) {
        showErr(err);
    };
};

function showErr(err) {
    var div = $('<div></div>');
    div.css({
        color: '#888',
        'font-size': '12px',
        'word-wrap': 'break-word',
        'line-height': '20px',
    });
    $('<h5 style="color:#000;font-size:16px">Javascript脚本代码异常:</h5>').appendTo(div);
    $('<h3 style="color:red;font-size:18px">' + err.message + '</h3>').appendTo(div);
    $('<p>' + err.stack + '</p>').appendTo(div);
    $("body").empty();
    $('body').append(div);
};



/**
 * 接收父层窗口传来的信息,字符串化的对象;
 * {id:'...',cmd:'refresh',params:{lang:'css'}};
 */
window.addEventListener('message', function (e) {
    //禁止跨域访问
    if (e.source.location.host != location.host) {
        console.log('preview/message:source illegal!');
        return;
    };

    var obj = JSON.safeParse(e.data);

    if (obj) {
        //执行刷新
        if (obj.cmd == 'refresh') {

            refresh(obj.params);
        } else if (obj.cmd == 'reload') {
            reload();
        }
    } else {
        console.warn('preview/message:data format err', e.data);
    };

    //发送回执
    var ackmsg = { //回执对象
        cmd: 'ACK',
        time: new Date().getTime(),
        id: obj ? obj.id : undefined,
    };
    e.ports[0].postMessage('ACK');
}, false);




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
