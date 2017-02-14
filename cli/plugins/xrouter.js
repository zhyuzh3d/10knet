/**
 * 全局路由函数文件，将被xglobal插件载入到每个component;
 * this.$xrouter及分离的this.$xset,$xgo,$xrestore,$xcoms,
 * 停用自动恢复_xrestoreDisabled
 * 分离后的函数可以胜率xid参数，即指向自身xid；$xrouter.xxx不可以省略
 * 每个可路由切换的组件必须有prop属性xid传入或$el上面有xid属性，
 * 类似<top-bar xid='topbar'>,没有xid的将被忽略无法被路由调动
 * 最根本的函数是xset，$set设置其他组件的数据，如果该属性+BeforeXset数据存在那么将异步执行它
 */

let xrouter = {
    $xcoms,
    $xgetcomid,
    $xset,
    $go,
    $xrestore,
    $xgetconf,
};
export default xrouter;

var $xcoms = {}; //用于路由的全部具有xid属性的组件
var $xconfs = {}; //用于路由的全部具有xid属性的组件

/**
 * 初始化路由，将路由注入到全局，组件内如需使用可以自由添加
 * @param {object} Vue
 * @param {object} options
 */
xrouter.install = function (Vue, options) {

    //向每个组件添加mixin，挂载时候根据ls读取之前的参数设置重新初始化
    //挂载时将组件加入xcoms(xid到vc的映射)，销毁时候清除组件
    Vue.mixin({
        beforeCreate: function () {},
        mounted: function () {
            var ctx = this;
            var comid = $xgetcomid(ctx);

            //指定到数据中
            ctx.$data.$xcomid = comid;
            ctx.$data.$xcoms = $xcoms;

            //路由组件管理
            if (comid && ctx.constructor != Vue) { //忽略单例的Vue
                //如果id重复，将原来的变为数组，把这个新的加入数组，xset的时候也是整个数组循环设置
                if ($xcoms[comid]) {
                    $xcoms[comid] = [$xcoms[comid]];
                    $xcoms[comid].push(ctx);
                } else {
                    $xcoms[comid] = ctx;
                };

                //自动恢复组件状态,可禁用然后改为手工恢复
                if (!ctx.$data._xrestoreDisabled) xrouter.restore(xid);
            };
        },
        data: function () {
            //mounted时候赋值
            return {
                $xcoms: $xcoms,
                $xconfs: $xconfs,
                $xcomid: undefined,
            };
        },
        methods: {
            $xgetcomid,
            $xgetconf,
            $xset,
            $xgo,
            $xrestore,
        },
        destroyed: function () {
            var ctx = this;
            var comid = $xgetcomid(ctx);

            if ($xcoms[comid]) {
                if ($xcoms[comid].constructor == Array) {
                    var index = $xcoms[comid].indexOf(ctx);
                    if (index != -1) $xcoms[comid].splice(index, 1);
                } else {
                    delete $xcoms[comid];
                }
            };
        },
    });
};

/**
 * 获取一个ctx的comid，格式xid-id
 * @param {object} ctx ctx
 */
function $xgetcomid(ctx) {
    if (!ctx) ctx = this;

    //同时兼容props和标记内的xid属性（顶级app没有props）
    var xid = this.xid || ((this.$el && this.$el.getAttribute) ? this.$el.getAttribute('xid') : undefined);

    //获取自身coms的$data/props的id，或者从元素上提取id
    var sid = this.id || this.$data.id;
    if (!sid) sid = this.$el.id;

    //真实的索引是外部xid加内部的id
    var comid = xid ? (sid ? xid + '-' + sid : xid) : undefined;
    return comid;
};

/**
 * 获取一个ctx的comid，格式xid-id
 * @param {object} ctx ctx
 */
function $xgetconf(ctx) {
    if (!ctx) ctx = this;

    var comid = ctx.$xgetcomid();
    var conf;
    if (comid) conf = $xconfs[comid];

    return conf;
};


/**
 * 跳转函数，实际上是用a标签引发hash变化,然后被hashchange监听触发路由，同时存储到ls
 * @param   {string} comid  vue对象的xid-id拼合格式，可省略
 * @param   {object} data 要修改的键值属性,类似{mainView: 'temp'}
 * @returns {object} vuecom对象
 */
async function $xgo(comid, data) {
    var ctx = this;

    //仅有一个参数的情况
    if (!data) {
        data = comid;
        comid = ctx.$xcomid;
    };

    if (!comid) {
        console.error('xrouter:$xgo:comid not defined.');
        return;
    };

    var hash = JSON.stringify([comid, data]);
    hash = encodeURIComponent(hash);

    //模拟锚点为路径添加hash字段
    var anchor = document.createElement('a');
    anchor.href = '#' + hash;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    setTimeout(function () {
        anchor.click();
        document.body.removeChild(anchor);
    }, 25);
};


/**
 * 根据ls存储恢复vuecom的状态，调用xset函数,成功后设置vc.xrestored=true;
 * @param {string} comid 元素的comid拼合格式,可省略
 * @returns {boolean}  成功返回恢复的数据
 */
async function $xrestore(comid) {
    var ctx = this;

    //省略参数情况
    if (!comid) comid = ctx.$xcomid;
    if (!comid) {
        console.error('xrouter:$xgo:comid not defined.');
        return;
    };

    //获取本地ls存储的dataKeyValObj
    var lskey = JSON.stringify(['xrouter', comid]);
    var lsval = localStorage.getItem(lskey);

    if (!lsval) return false;

    var lsKeyValObj = JSON.safeParse(lsval);

    var res;
    if (lsKeyValObj) {
        var com = await $xset({
            comid: comid,
            $data: lsKeyValObj,
        });

        //记录到xconf[comid]状态
        if (com) {
            $xconfs[comid] = {
                xrestore: 1,
                value: lsKeyValObj,
            };
            res = lsKeyValObj;
        } else {
            res = false;
        }
    } else {
        res = false;
    };

    return res;
};

/**
 * 跨元件执行设置xset函数，是所有跳转路由的基础;
 * 即使找不到父层com也会存储，等待载入时候自动恢复
 * @param   {object} opt  设置选项，包含{comid,unsave,$data:{kv}}
 * @returns {boolean}  成功返回com真失败undefined
 */
async function $xset() {
    var opt = arguments;
    var ctx = this;

    //如果没有comid,那么尝试获取自身的comid
    if (!opt.comid) opt.comid = ctx.$xcomid();
    if (!opt.comid) {
        console.error('xrouter:xset:comid is undefined.');
        return;
    };

    //获取目标com对象
    var tarCtx = $xcoms[comid];
    if (!tarCtx) {
        console.error('xrouter:xset:com is not in xcoms', comid);
        return;
    };


    //数组自身循环处理，对象直接处理
    if (tarCtx.constructor == Array) {
        for (var i = 0; i < tarCtx.length; i++) {
            await tarCtx[i].$set(opt);
        };
    } else {
        $xconfs[opt.comid] = {
            xset: 1, //正在执行，保护before,after异步线程避免冲突
            value: opt,
        };

        //设置data
        for (var key in opt.data) {
            if (ctx.$data[key] != undefined) {

                //使_xsetConf钩子生效,仅限tar对象的第一层
                var beforefn, afterfn;
                if (ctx.$data._xsetConf && ctx.$data._xsetConf[key]) {
                    beforefn = ctx.$data._xsetConf[key].before;
                    afterfn = ctx.$data._xsetConf[key].after;
                };

                //三步设置，beforefn->设置data属性->afterfn
                if (beforefn) await beforefn(opt.$data[key], ctx.$data[key], ctx);
                tarCtx.$set(tarCtx.$data, key, opt.$data[key]);
                if (afterfn) await afterfn(opt.$data[key], ctx.$data[key], ctx);

            } else {
                console.warn(`'xrouter:xset:can not add ${key} to ${opt.comid}`);
            };
        };

        if (!unsave) {
            //保存到本地缓存,可用于恢复组件状态，单页面应用不用担心路径问题
            //用json化的数组作为键、值,掺入'xrouter'避免和其他插件重复
            var lskey = JSON.stringify(['xrouter', opt.comid]);

            //先读取已经存储的对象，然后再合并对象，再存储
            var orgval = localStorage.getItem(lskey) || {};
            orgval = JSON.safeParse(orgval);

            var addval = keyValObj;
            var newval = Object.assign({}, orgval, addval);
            newval = JSON.stringify(newval);
            localStorage.setItem(lskey, newval);
        };

        //设置结束
        $xconfs[opt.comid] = {
            xset: 0, //执行完毕，挂起状态
            value: opt,
        };
    };

    return tarCtx;
};


(function () {
    /**
     * 监听地址栏导航，执行利用xset实现router路由
     */
    //$(window).on('hashchange', function (evt) {
    window.onhashchange = function (evt) {
        var hash = location.hash;
        if (hash.length < 2) return false;
        hash = decodeURIComponent(hash.substr(1)); //去除#

        var xidKVarr = JSON.parse(hash);
        if (!xidKVarr || xidKVarr.constructor != Array || xidKVarr.length < 2) {
            console.error('xrouter:hashchange:hash format err', xidKVarr);
            return false;
        };

        //真正触发路由
        $xset({
            comid: xidKVarr[0],
            $data: xidKVarr[1]
        });

        return true;
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
})();
