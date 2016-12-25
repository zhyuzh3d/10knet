/*接口Api对象定义
 *提供所有api的创建和管理方法
 *提供apiObj对象的定义
 */
'use strict';

const _zapi = {
    apis: {}, //所有api的容器
    addApi: addApi,
};

module.exports = _zapi;

//----------------------------------

class Api {
    constructor(path, method, validator) {
        this.path = path;
        this.method = method;
        this.validator = validator;

        //验证方法
        this.avalidate = async function (ctx, next) {

        };
    };
};


var a = new Api(1, 2, 3);
Api.showpath();


function addApi() {

};
