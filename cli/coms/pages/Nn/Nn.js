import $ from 'jquery';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定

com.components = {};

//所有数据写在这里
com.data = function data() {
    vc = this;
    return {
        msg: 'Hello from blocks/Nn/Nn.js'
    };
};

//所有直接使用的方法写在这里
com.methods = {};

//加载到页面前执行的函数
com.beforeMount = function () {
    jo = $(this.$el);
};

com.mounted = function () {


};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------
