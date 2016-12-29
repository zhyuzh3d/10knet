/*全局对话框数据模型和控制器，将被xglobal插件载入到每个component的this.$xglobal.dialog
 */
var dialogs = {};
export default dialogs;


//默认弹窗模版，不可更改
const templates = {
    warn: {
        visible: false,
        size: 'middle',
        title: '警告',
        text: '这只是一个无内容的警示',
        handler: function () {},
        okBtnText: '确 定',
        okHandler: function () {},
    },
    permit: {
        visible: false,
        size: 'middle',
        title: '提示',
        text: '您确定要执行这个操作吗?',
        handler: function () {},
        cancelBtnText: '取 消',
        okBtnText: '确 定',
        okHandler: function () {},
        cancelHandler: function () {},
    },
};

/**
 * 确认对话框warn模型对象
 * 这里只提供数据模型及控制方法，仍然需要在App中实现view和model的绑定并把数据指针指向这里
 * 比如Appcom.$data.dialogWarn=this.$xglobal.dialog.warn.option
 * 然后任何组件中使用vc.$xglobal.dialog.warn.show('新文字',okhandler)
 * show参数也可以传入新的option对象如show({title:'新文字',okHandler:fnhandler})
 */
dialogs.warn = {
    options: templates.warn,
    show: warnShow
};


/**
 * 确认对话框permit模型对象
 * 这里只提供数据模型及控制方法，仍然需要在App中实现view和model的绑定并把数据指针指向这里
 * 比如Appcom.$data.dialogPermit=this.$xglobal.dialog.permit.option
 * 然后任何组件中使用vc.$xglobal.dialog.permit.show('新文字',okhandler,cancelhandler)
 * show参数也可以传入新的option对象如show({title:'新文字',okHandler:fnhandler})
 */
dialogs.permit = {
    options: templates.permit,
    show: permitShow
};



//-----------------functions-------------------


/**
 * 警告对话框warn显示函数
 * @param {string|object}   obj     字符串text或者设置option对象
 * @param {function} okfn     点击确认的函数okHandler
 */
function warnShow(obj, okfn) {
    if (!obj) obj = {};

    //兼容最简单的字符串和函数(str,okfn)格式
    if (obj.constructor == String) {
        obj = {
            text: obj
        };
    };

    //兼容(str,okfn)模式传入处理函数
    if (okfn && okfn.constructor == Function) obj.okHandler = okfn;

    obj = Object.assign(templates.warn, obj); //合并obj和模版，优先使用obj
    obj.visible = true;
    dialogs.warn.options = obj;
};

/**
 * 确认对话框permit显示函数
 * @param {string|object}   obj     字符串text或者设置option对象
 * @param {function} okfn     点击确认的函数okHandler
 * @param {function} cancelfn 点击取消的函数cancelHandler
 */
function permitShow(obj, okfn, cancelfn) {
    if (!obj) obj = {};

    //兼容最简单的字符串和函数(str,okfn)格式
    if (obj.constructor == String) {
        obj = {
            text: obj
        };
    };

    //兼容(str,okfn,cancelfn)模式传入处理函数
    if (okfn && okfn.constructor == Function) obj.okHandler = okfn;
    if (cancelfn && cancelfn.constructor == Function) obj.cancelHandler = cancelfn;

    obj = Object.assign(templates.permit, obj); //合并obj和模版，优先使用obj
    obj.visible = true;
    dialogs.permit.options = obj;
};
