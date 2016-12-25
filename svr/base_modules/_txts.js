/*所有错误、返回信息设置
 *兼容多语言
 */
'use strict';

const _txts = {
    err: {
        routerPathNotFound: '找不到您所请求的API路径',
        routerPathFormatErr: '您请求的API路径格式错误',
        routerMethodNotFound: '找不到您所请求的API方法',
        routerBodyFormatErr: '您提交的数据格式错误',
    }
}

module.exports = _txts;
