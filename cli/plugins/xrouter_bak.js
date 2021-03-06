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
    go: xgo,
    restore: xrestore,
    xset: xset,
};
export default xrouter;

let xcoms = xrouter.xcoms = {}; //用于路由的全部具有xid属性的组件

/**
 * 初始化路由，将路由注入到全局，组件内如需使用可以自由添加
 * @param {object} Vue
 * @param {object} options
 */
xrouter.install = function (Vue, options) {

    //向每个组件添加mixin，挂载时候根据ls读取之前的参数设置重新初始化
    //挂载时将组件加入xcoms(xid到vc的映射)，销毁时候清除组件
    Vue.mixin({
        beforeCreate: function () {
            //将xrouter注入到元素的$xrouter
            var ctx = this;
            this.$xrouter = xrouter;
            this.$xcoms = xrouter.xcoms;
            this.$xset = xset;
            this.$xgo = xgo;
            this.$xrestore = xrestore;
        },
        mounted: function () {
            var ctx = this;

            //同时兼容props和标记内的xid属性（顶级app没有props）
            var xid = this.xid || ((this.$el && this.$el.getAttribute) ? this.$el.getAttribute('xid') : undefined);

            console.log('>>>>xcoms _xid', xid, this.$el.id);


            //路由组件管理
            if (xid) {
                //如果id重复，那么提示,但不覆盖
                if (xcoms[xid] && ctx.constructor != Vue) {
                    console.warn('xrouter/mounted/xcoms:duplicate xid [' + xid + '],ignored.');
                } else if (ctx.constructor != Vue) {
                    xcoms[xid] = ctx;
                };
                //自动恢复组件状态,可禁用然后改为手工恢复
                if (!ctx.$data._xrestoreDisabled) xrouter.restore(xid);
            };
        },
        destroyed: function () {
            //销毁时候清除coms
            var key = this.$el.id;
            if (xcoms[key]) delete xcoms[key];
        },
    });
};

/**
 * 显示所有可用的xcoms，用于测试
 */
xrouter.showComs = function () {
    console.log('xrouter:showComs', xcoms);
};

/**
 * 跳转函数，实际上是用a标签引发hash变化,然后被hashchange监听触发路由，同时存储到ls
 * @param   {string} parentXid  vue对象的props.xid或html标记内的xid属性,依次获取vuecom
 * @param   {object} dataKeyValObj 要修改的键值属性,类似{mainView: 'temp'}
 * @returns {object} vuecom对象
 */
async function xgo(parentXid, dataKeyValObj) {
    //支持$xset只有一个参数，功能相当于$set但是会本地存储和恢复，同样触发xset功能,不用hash
    if (!dataKeyValObj) {
        dataKeyValObj = parentXid;
        parentXid = this.$el ? this.$el.getAttribute('xid') : undefined;
    };

    if (!parentXid) {
        console.error('xrouter:$xgo:xid not defined.');
        return;
    };

    var hash = JSON.stringify([parentXid, dataKeyValObj]);
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
 * @param {string} xid 元素的xid
 */
async function xrestore(xid) {
    //获取本地ls存储的dataKeyValObj
    var lskey = JSON.stringify(['xrouter', xid]);
    var lsval = localStorage.getItem(lskey);

    if (!lsval) return false;

    var lsKeyValObj = JSON.safeParse(lsval);

    var res;
    if (lsKeyValObj) {
        var com = await xrouter.xset(xid, lsKeyValObj, false);
        if (com) {
            com.xrestored = lsKeyValObj;
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
 * @param   {string} xid       元件的xid
 * @param   {object} keyValObj 修改$data的键值对
 * @param   {boolean} unsave 是否保存
 * @returns {boolean}  成功返回com真失败undefined
 */
async function xset(xid, keyValObj, unsave) {
    var res;

    //如果第一个传进来的不是字符串，那么尝试从ctx上获取xid
    if (xid && xid.constructor != String) {
        xid = this.$el ? this.$el.getAttribute('xid') : undefined;
    };


    //获取vc对象
    var ctx = xcoms[xid];
    if (!ctx) {
        console.warn('xrouter:xset:can not find parent component xid [' + xid + '],saved for restore.');
        xrouter.showComs();
    } else {
        res = ctx;

        //把设置的过程记录到xsetConf，避免xset延迟进程不能被组件restore检测到
        if (ctx.$data._xsetConf) {
            ctx.$data._xsetConf.keyVal = keyValObj;
            if (ctx.$data._xsetConf.before) {
                await ctx.$data._xsetConf.before(keyValObj);
            };
        };

        //根据dataKeyValObj为com设置$set每个$data值
        for (var key in keyValObj) {
            if (ctx.$data[key] != undefined) {
                //使_xsetConf钩子生效
                var beforefn, afterfn;
                if (ctx.$data._xsetConf && ctx.$data._xsetConf[key]) {
                    beforefn = ctx.$data._xsetConf[key].before;
                    afterfn = ctx.$data._xsetConf[key].after;
                };

                //beforefn->设置data属性->afterfn
                if (beforefn) await beforefn(keyValObj[key], ctx.$data[key], ctx);
                ctx.$set(ctx, key, keyValObj[key]);
                if (afterfn) await afterfn(keyValObj[key], ctx.$data[key], ctx);
            } else {
                console.warn(`'xrouter:xset:can not add property to com:${key}`);
            };
        };
        if (ctx.$data._xsetConf) {
            if (ctx.$data._xsetConf.before) {
                await ctx.$data._xsetConf.after(keyValObj, ctx);
            }
            ctx.$data._xsetConf.state = false;
        };
    };


    //即使com还不存在也先保存，等待com载入后会自动恢复
    if (!unsave) {
        //保存到本地缓存,可用于恢复组件状态，
        //用json化的数组作为键、值,掺入'xrouter'避免和其他插件重复
        //单页面应用不用担心跳转
        var lskey = JSON.stringify(['xrouter', xid]);

        //先读取已经存储的对象，然后再合并对象，再存储
        var orgval = localStorage.getItem(lskey) || {};
        orgval = JSON.safeParse(orgval);

        var addval = keyValObj;
        var newval = Object.assign({}, orgval, addval);
        newval = JSON.stringify(newval);
        localStorage.setItem(lskey, newval);
    };

    return ctx;
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
        if (xidKVarr.constructor != Array || xidKVarr.length < 2) {
            console.error('xrouter:hashchange:hash format err', xidKVarr);
            return false;
        };

        //真正触发路由
        xrouter.xset(xidKVarr[0], xidKVarr[1]);
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
