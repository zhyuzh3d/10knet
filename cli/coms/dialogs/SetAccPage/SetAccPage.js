/**
 *设定当前工作的页面
 *输入ctx.conf.loadFile，非空则载入模版文件
 */

import $ from 'jquery';

let com = {};
export default com;

//所有直接用到的组件在这里导入
com.components = {};

com.props = {
    conf: Object, //{show,pageName,file{name,url,key...}}
};

//所有数据写在这里
com.data = function data() {
    return {
        nameList: undefined,
        iptName: '',
        isNew: false,
        loadCode: false,
    };
};

com.watch = {
    'conf.show': {
        handler: async function (val, oldval) {
            var ctx = this;
            //使关闭窗口的钩子生效
            if (!val && ctx.conf.onHide && ctx.conf.state == 'set') {
                //更新conf.loadFile
                if (ctx.conf.setPage && ctx.conf.setPage.file && ctx.$data.loadCode) {
                    ctx.conf.loadFile = ctx.conf.setPage.file;
                } else {
                    ctx.conf.loadFile = undefined;
                };

                ctx.conf.onHide(ctx);
            };

            //从服务器读取page列表，从ls读取当前accPage
            if (val) {
                await ctx.getPageNameList();
                ctx.$set(ctx.conf, 'state', undefined);
            };
        }
    },
};


//所有直接使用的方法写在这里
com.methods = {
    setAccPage: setAccPage,
    newAccPage: newAccPage,
    clearIpt: clearIpt,
    querySearch(ipt, cb) {
        var ctx = this;
        var nameList = ctx.$data.nameList;
        var results = ipt ? nameList.filter(ctx.createFilter(ipt)) : nameList;
        if (results.length == 0) {
            ctx.$set(ctx.$data, 'isNew', true);
        } else {
            ctx.$set(ctx.$data, 'isNew', false);
        };
        cb(results);
    },
    createFilter(str) {
        return (name) => {
            return (name.value.indexOf(str.toLowerCase()) != -1);
        };
    },
    handleSelect: function (item) {
        var ctx = this;
        ctx.$set(ctx.conf, 'setPage', item);
    },
    getPageNameList: getPageNameList,
};

//加载到页面前执行的函数
com.beforeMount = function () {};

//加载到页面后执行的函数
com.mounted = function () {
    var ctx = this;

};

//-------所有函数写在下面--------

/**
 * 清除输入框，激活显示列表
 */
function clearIpt() {
    var ctx = this;
    ctx.$set(ctx.$data, 'iptName', undefined);
    setTimeout(function () {
        $(ctx.$el).find('input').focus();
    }, 200);
};


/**
 * 读取用户的所有page列表，基本信息name和_id，补充value作为下拉自动完成使用
 */
async function getPageNameList() {
    var ctx = this;
    var api = ctx.$xglobal.conf.apis.pageGetList;

    var token = localStorage.getItem('accToken');
    if (!token) {
        ctx.$notify.error({
            title: `你还没有登录，无法设置页面`,
        });
        return;
    };

    var data = {
        token: localStorage.getItem('accToken'),
    };

    try {
        var res = await ctx.rRun(api, data);
        var list = res.data;
        var lsPage = localStorage.getItem('accPage');
        var lsPageId;

        if (lsPage) {
            lsPage = JSON.safeParse(lsPage);
            if (lsPage) lsPageId = lsPage._id;
        };

        list.forEach(function (item) {
            item.value = item.name;
            if (ctx.$xglobal.accInfo.name == item.name) {
                item.accUrl = `http://${ctx.$xglobal.accInfo.name}.10knet.com`;
            } else {
                item.accUrl = `http://${ctx.$xglobal.accInfo.name}.10knet.com/${item.name}`;
            };


            if (item._id == lsPageId) {
                ctx.$set(ctx.$data, 'iptName', item.name);
                ctx.$set(ctx.conf, 'setPage', item);
                ctx.$set(ctx.$data, 'isNew', false);
                localStorage.setItem('accPage', JSON.stringify(item));
            };
        });
        ctx.$set(ctx.$data, 'nameList', list);

    } catch (err) {
        ctx.$notify.error({
            title: `你还没有登录，无法设置页面`,
            message: err.tip || err.message,
        });
    };
};



/**
 * 设置按钮,只是关闭窗口，由外部onhide提取setPage字段处理
 */
async function setAccPage() {
    var ctx = this;
    ctx.$data.nameList.forEach(function (item) {
        if (item.value == ctx.$data.iptName) {
            ctx.$set(ctx.conf, 'setPage', item);
            localStorage.setItem('accPage', JSON.stringify(item));
        };
    });

    ctx.$set(ctx.conf, 'show', false);
    ctx.$set(ctx.conf, 'state', 'set');
};


/**
 * 新建页面按钮，创建新页面然后关闭窗口，由外部onhide提取setPage字段处理
 */
async function newAccPage() {
    var ctx = this;
    var token = localStorage.getItem('accToken');
    if (!token) {
        ctx.$notify.error({
            title: `您还没有登录，无法创建新页面`,
        });
    };

    try {
        var api = ctx.$xglobal.conf.apis.pageNew;
        var data = {
            token: token,
            name: ctx.$data.iptName,
        };
        var res = await ctx.rRun(api, data);
        var page = res.data;

        //填充到setPage
        ctx.$set(ctx.conf, 'setPage', page);

        ctx.$notify.success({
            title: `创建页面文件成功`,
            message: `您的代码将被保存到此页面${name}`,
        });

        localStorage.setItem('accPage', JSON.stringify(page));
        ctx.$set(ctx.conf, 'show', false);
        ctx.$set(ctx.conf, 'state', 'set');
    } catch (err) {
        ctx.$notify.error({
            title: `创建页面文件失败`,
            message: err.tip || err.message || '原因未知',
        });
    };
};








//
