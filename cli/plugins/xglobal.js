/*提供全局数据注入和周转的插件
 */

let glb = {};
export default glb;


/**
 * 插件初始化安装
 * @param {Vue} Vue     传进来的Vue对象
 * @param {object}   options 传进来的参数，可包含两个字段xglobal和xcomponent，前者所有属性将被注入到元素中 this.$xglobal中（并自动维护挂载到页面的所有组件coms对象，以xid映射），后者注入到每个元素的data,methods,mounted..，如需对xglobal的属性初始化，须编写init(Vue,options)函数
 */
glb.install = function (Vue, options) {
    var xglobal = options.xglobal;
    if (!xglobal) xglobal = {};


    //混入全局，可以被元素中this.$xglobal引用
    Vue.mixin({
        beforeCreate: function () {
            this.$xglobal = xglobal;
        },
    });

    //为每个xglobal属性对象进行初始化
    for (var attr in xglobal) {
        var sub = xglobal[attr];
        if (sub.init) sub.init(Vue, options);
    };

    //混入每个元素，可以直接在元素内使用
    var xcomponent = options.xcomponent;
    if (!xcomponent) xcomponent = {};
    xcomponent.props = {
        xid: String
    };
    for (var attr in xcomponent) {
        var mixin = {
            $vue: Vue
        };
        mixin[attr] = xcomponent[attr];
        Vue.mixin(mixin);
    };
};
