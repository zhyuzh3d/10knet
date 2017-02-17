/**
 * 全局路由函数文件，将被xglobal插件载入到每个component;
 * before创建this.$xrouter；
 * mounted创建分离的方法:
 * $xcoms,$xconfs,$xgetConf,$xgetComId,$xset,$xgo,$xrestore,$xisRestored
 * 停用自动恢复_xrestoreDisabled
 * $xcoms列出所有组件comid(xid-sid)格式；没有xid的不管理，没有id的仅用xid
 * $xconfs列出所有组件调动的状态，comid索引，{cmd:'xset',value:kv};
 * 本地版本检测，版本升级将清空旧版本的ls数据xrouterSavedKeys所有key，
 * $xset的钩子需要放在$data._xsetConf[key],before,after函数(newval,oldval,ctx)
 */

/**
 * 旧版本数据清理
 */
var ver = 0.65;
var clearLs = false;
(function () {
    var lsver = Number(localStorage.getItem('xrouterVersion')) || 0;
    if (ver > lsver) {
        if (lsver <= 0.5) {
            //强力清理0.5版本及以下所有xrouter存储的字段
            for (var key in localStorage) {
                if (key.indexOf('xrouter') != -1) {
                    localStorage.removeItem(key);
                };
            };
        } else if (clearLs) {
            // 对于0.5版本以上仅clearLs时候清理xrouterSavedKeys列表内的字段
            var keysArr = localStorage.getItem('xrouterSavedKeys');
            keysArr = JSON.safeParse(keysArr);
            if (keysArr) {
                if (keysArr.constructor != Array) {
                    localStorage.removeItem('xrouterSavedKeys');
                } else {
                    keysArr.forEach(function (key) {
                        localStorage.removeItem(key);
                    });
                };
            };
        }
    };
    localStorage.setItem('xrouterVersion', ver);
})();


//这些方法都会beforemount时候分别添加到ctx
var $xcoms = {}; //用于路由的全部具有xid属性的组件
var $xconfs = {}; //用于路由的全部具有xid属性的组件
var $xrouter = {
    $xcoms: $xcoms,
    $xconfs: $xconfs,
    $xgetConf,
    $xgetComId,
    $xset,
    $xgo,
    $xrestore,
    $xisRestored,
    $xsetByHash,
};
export default $xrouter;

/**
 * 初始化路由，将路由注入到全局，组件内如需使用可以自由添加
 * @param {object} Vue
 * @param {object} options
 */
$xrouter.install = function (Vue, options) {

    //向每个组件添加mixin，挂载时候根据ls读取之前的参数设置重新初始化
    //挂载时将组件加入xcoms(xid到vc的映射)，销毁时候清除组件
    Vue.mixin({
        beforeCreate: function () {
            var ctx = this;
            ctx.$xrouter = $xrouter;
            for (var key in $xrouter) {
                ctx[key] = $xrouter[key];
            };
        },
        mounted: async function () {
            var ctx = this;
            var comid = ctx.$xgetComId();

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
                if (!ctx.$data._xrestoreDisabled) {
                    await ctx.$xrestore(comid);
                };
            };
        },
        destroyed: function () {
            var ctx = this;
            var comid = ctx.$xgetComId();

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
 * 获取一个ctx的comid，格式xid-sid
 * @param {object} ctx ctx
 */
function $xgetComId(ctx) {
    if (!ctx) ctx = this;

    //同时兼容props和标记内的xid属性（顶级app没有props）
    var xid = ctx.xid || ((ctx.$el && ctx.$el.getAttribute) ? this.$el.getAttribute('xid') : undefined);

    //获取自身coms的$data/props的id，或者从元素上提取sid
    var sid = ctx.sid;
    if (!sid) sid = ctx.$el ? this.$el.getAttribute('sid') : undefined;

    //真实的索引是外部xid加内部的id
    var comid = xid ? (sid ? xid + '-' + sid : xid) : undefined;

    return comid;
};

/**
 * 获取一个ctx的comid，格式xid-sid
 * @param {object} ctx ctx
 */
function $xgetConf(ctx) {
    if (!ctx) ctx = this;

    var comid = ctx.$xgetComId();
    var conf;
    if (comid) conf = $xconfs[comid] || {};

    return conf;
};

/**
 * 统一的本地存储键名
 * @param   {string} comid comid
 * @returns {string}   key
 */
function genXrouterLsKey(comid) {
    return 'xrouter-' + comid;
};

/**
 * 跳转函数，实际上是用a标签引发hash变化,然后被hashchange监听触发路由，同时存储到ls
 * @param   {string} comid  vue对象的xid-sid拼合格式，可省略
 * @param   {object} data 要修改的键值属性,类似{mainView: 'temp'}
 * @returns {object} vuecom对象
 */
async function $xgo(comid, data) {
    var ctx = this;

    //仅有一个参数的情况
    if (!data) {
        data = comid;
        comid = ctx.$xgetComId();
    };

    if (!comid) {
        console.warn('xrouter:$xgo:comid not defined.');
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
    if (!comid) comid = ctx.$xgetComId();
    if (!comid) {
        console.warn('xrouter:$xgo:comid not defined.');
        return;
    };

    //获取本地ls存储的dataKeyValObj
    //var lskey = JSON.stringify(['xrouter', comid]);
    var lskey = genXrouterLsKey(comid);
    var lsval = localStorage.getItem(lskey);

    if (!lsval) return false;

    var lsKeyValObj = JSON.safeParse(lsval);

    var res;
    if (lsKeyValObj) {
        var com = await ctx.$xset(lsKeyValObj, comid);

        //记录到xconf[comid]状态
        if (com) {
            $xconfs[comid] = $xconfs[comid] || {};
            $xconfs[comid].xrestore = 1;
            $xconfs[comid].xrestoreValue = lsKeyValObj;

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
 * 检测某个属性是否已经被恢复
 * @param {[[Type]]} key [[Description]]
 */
function $xisRestored(key) {
    var ctx = this;
    var conf = ctx.$xgetConf();
    var res = false;

    if (conf && conf.xrestore) {
        if (key) {
            if (conf.xrestoreValue[key] !== undefined) {
                res = true;
            };
        } else {
            res = true;
        };
    };
    return res;
};




/**
 * 跨元件执行设置xset函数，是所有跳转路由的基础;
 * 即使找不到父层com也会存储，等待载入时候自动恢复
 * @param {boolean} data   需要设置的数据
 * @param {string} comid  comid,可省略默认使用this的comid
 * @param {boolean} unsave 是否保存
 */
async function $xset(data, comid, unsave) {
    var ctx = this;

    if (!comid) comid = ctx.$xgetComId();
    if (!comid) {
        console.warn('xrouter:xset:comid is undefined.');
        return;
    };

    //获取目标com对象
    var tarCtx = $xcoms[comid];
    if (!tarCtx) {
        console.warn('xrouter:xset:com is not in xcoms', data, comid);
        console.info('└──Valid coms:', $xcoms);
        return;
    };

    //数组自身循环处理，对象直接处理
    if (tarCtx.constructor == Array) {
        for (var i = 0; i < tarCtx.length; i++) {
            await tarCtx[i].$set(data, comid, unsave);
        };
    } else {
        $xconfs[comid] = $xconfs[comid] || {};
        $xconfs[comid].xset = 1;
        $xconfs[comid].xsetValue = data;


        var xsetConf = tarCtx.$data._xsetConf;
        if (xsetConf && xsetConf.before) {
            await tarCtx.$data._xsetConf.before(data, tarCtx);
        };

        //设置data
        for (var key in data) {
            if (tarCtx.$data.hasOwnProperty(key)) {

                //使_xsetConf钩子生效,仅限tar对象的第一层
                var beforefn, afterfn;
                if (xsetConf && xsetConf[key]) {
                    beforefn = xsetConf[key].before;
                    afterfn = xsetConf[key].after;
                };

                //三步设置，beforefn->设置data属性->afterfn
                if (beforefn) {
                    await beforefn(data[key], tarCtx.$data[key], tarCtx);
                };

                //如果这个值是个对象，那么先合并已有字段，否则直接覆盖
                var val = data[key];
                if (val && val.constructor == Object && tarCtx[key] && tarCtx[key].constructor == Object) {
                    val = Object.assign(val, tarCtx[key]);
                };
                tarCtx.$set(tarCtx, key, val);

                //afterfn
                if (afterfn) {
                    await afterfn(data[key], tarCtx.$data[key], tarCtx);
                };

            } else {
                console.warn(`xrouter:xset:can not add ${key} to ${comid}`);
            };
        };

        if (!unsave) {
            //保存到本地缓存,可用于恢复组件状态，单页面应用不用担心路径问题
            //用json化的数组作为键、值,掺入'xrouter'避免和其他插件重复
            //var lskey = JSON.stringify(['xrouter', comid]);
            var lskey = genXrouterLsKey(comid);

            //先读取已经存储的对象，然后再合并对象，再存储
            var orgval = localStorage.getItem(lskey);
            orgval = JSON.safeParse(orgval) || {};

            var addval = data;
            var newval = Object.assign({}, orgval, addval);
            newval = JSON.stringify(newval);

            //本地存储，同时添加到xrouterSavedKeys
            localStorage.setItem(lskey, newval);

            var skey = 'xrouterSavedKeys';
            var skeysArr = localStorage.getItem(skey);
            skeysArr = JSON.safeParse(skeysArr) || [];

            skeysArr.push(lskey);
            skeysArr = JSON.stringify(skeysArr);
            localStorage.setItem(skey, skeysArr);
        };

        if (xsetConf && xsetConf.after) {
            await tarCtx.$data._xsetConf.after(data, tarCtx);
        };

        //设置结束
        $xconfs[comid].xset = 0; //执行完毕，挂起状态

    };

    return data;
};

/**
 * 通过地址栏跳转
 * @returns {boolean} [[Description]]
 */
async function $xsetByHash() {
    var hash = location.hash;
    if (hash.length < 2) return undefined;
    hash = decodeURIComponent(hash.substr(1)); //去除#

    var xidKVarr = JSON.safeParse(hash);
    if (!xidKVarr || xidKVarr.constructor != Array || xidKVarr.length < 2) {
        console.warn('xrouter:hashchange:hash format err', xidKVarr);
        return false;
    };

    var data = xidKVarr[1];
    var comid = xidKVarr[0];

    $xconfs[comid] = $xconfs[comid] || {};
    $xconfs[comid].xhash = 1;
    $xconfs[comid].xhashValue = data;

    //真正触发路由，保存到本地
    var res = await $xset(data, comid);
    if (!res) return undefined;

    return data;
};


/**
 * 监听地址栏导航，执行利用xset实现router路由
 */
window.addEventListener('hashchange', $xsetByHash);

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
