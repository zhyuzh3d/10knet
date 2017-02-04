document.domain = '10knet.com';



/**
 * 重新加载整个页面
 */
function reload() {
    location.reload();
};

/**
 * 页面加载后自动从ls恢复css,js,body
 */
function autoRefresh() {
    refreshCss();
    refreshBody();
    reloadAll();
};

autoRefresh();

/**
 * 刷新页面的css,js,html代码
 * @param {object} params {part:'xxx'}
 */
function refresh(params) {
    if (!params) return;

    var part = params.part;

    switch (part) {
        case 'css':
            refreshCss();
            break;
        case 'body':
            refreshBody();
            break;
        case 'all':
            reloadAll();
            break;
        default:
            console.log('refresh:part is unknown', part);
            break;
    };
};


/**
 * 从ls重新载入css内容
 */
function refreshCss() {
    var data = localStorage.getItem('preview-css');
    $('style[preview]').empty();
    $('style[preview]').append(data);
};

/**
 * 从ls重新载入body内容
 */
function refreshBody() {
    var data = localStorage.getItem('preview-body');
    $('body').find('div[preview]').empty();
    $('body').find('div[preview]').append(data);
};

/**
 * 从ls重新载入head内容
 */
function reloadHead() {
    var headData = localStorage.getItem('preview-head');
    if (headData) {
        $('head').empty();
        $('head').append(headData);
    };
};

/**
 * 从ls重新载入js内容
 */
function reloadJs() {
    var jsData = localStorage.getItem('preview-js');
    //外加try-catch捕获异常
    try {
        eval(jsData);
    } catch (err) {
        showErr(err);
    };
};

/**
 * 重新载入head和js代码，从ls读取数据并运行
 */
function reloadAll() {
    reloadHead();
    reloadJs();
};


/**
 * 在body内显示错误信息的函数
 * @param {object} err err
 */
function showErr(err) {
    var div = $('<div></div>');
    div.css({
        color: '#444',
        'font-size': '12px',
        'word-wrap': 'break-word',
        'line-height': '20px',
        '-webkit-font-smoothing': 'antialiased',
    });
    $('<h5 style="color:#000;font-size:16px">Javascript脚本代码异常:</h5>').appendTo(div);
    $('<h3 style="color:red;font-size:18px">' + err.message + '</h3>').appendTo(div);
    $('<p>' + err.stack + '</p>').appendTo(div);
    $("body").empty();
    $('body').append(div);
};



/**
 * 接收父层窗口传来的信息,字符串化的对象;
 * {id:'...',cmd:'refresh',params:{part:'css'}};
 */
window.addEventListener('message', function (e) {
    //禁止跨域访问
    if (e.source.location.host != location.host) {
        console.log('preview/message:source illegal!');
        return;
    };

    var obj;

    try {
        obj=JSON.parse(e.data);
    } catch (err) {
        console.warn('preview/message:JSON parse err.', e.data);
    };


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



