/*全局函数文件，将被xglobal插件载入到每个component的this.$xglobal.fns备用
 */
let fns = {
    getCookie,
};
export default fns;

//------------------functions------------

/**
 * 从本地读取cookie
 * @param   {string}   cookieName key键名
 * @returns {string} value
 */
function getCookie(cookieName) {
    var arr = document.cookie.match(new RegExp("(?:^| )" + cookieName + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[1]);
    return null;
};
