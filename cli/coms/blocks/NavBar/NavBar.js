var $ = () => System.import('jquery');

var com = {};
export default com;

var vc; //vueComponent对象
var jo; //对应的jquery对象,mounted函数内设定

//所有直接用到的组件在这里导入
com.props = {
    xid: String,
    bgColor: { //背景颜色
        type: String,
        default: ''
    },
};

com.data = function data() {
    vc = this;
    return {
        conf: this.$xglobal.conf,
        urls: this.$xglobal.conf.urls,
        apis: this.$xglobal.conf.apis,
        imgs: this.$xglobal.conf.imgs,
        permitDlgShow: false,
        activeMenu: '',
        permitDlg: {},
        myProfile: {},
    };
};

com.mounted = function () {
    jo = $(this.$el);
    //getMyInfo();
};

com.methods = {
    handleSelect,
};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------

/**
 * 读取用户信息，填充到profile
 */
function getMyInfo() {
    $.ajax({
        type: "POST",
        url: vc.$data.conf.apis.getMyInfo,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            if (res.code == 1) {
                vc.$set(vc, 'myProfile', res.data);
            };
        },
        error: function (err) {},
    });
};

/**
 * 注销账号
 */

function logout() {
    $.ajax({
        type: "POST",
        url: vc.$data.conf.apis.logout,
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        success: function (res) {
            if (res.code == 1) {
                vc.$set(vc, 'myProfile', {});
            };
        },
        error: function (err) {},
    });
};

/**
 * 全部菜单控制
 * @param {string} key  菜单元素的key
 *  @param {Array} path 父子层key构成的数组
 */

function handleSelect(key, path) {
    switch (key) {
        case 'welcome':
            vc.$xrouter.go('App', {
                mainView: 'welcome'
            });
            break;
        case 'dashboard':
            vc.$xrouter.go('App', {
                mainView: 'dashboard'
            });
            break;
        case 'ide':
            vc.$xrouter.go('App', {
                mainView: 'ide'
            });
            break;
        case 'login':
            location.href = vc.$data.urls.loginPage;
            break;
        case 'reg':
            location.href = vc.$data.urls.regPage;
            break;
        case 'home':
            location.href = vc.$data.urls.www;
            break;
        case 'profile':
            location.href = vc.$data.urls.profilePage;
            break;
        case 'logout':
            vc.$set(vc, 'permitDlgShow', true);
            vc.$set(vc, 'permitDlg', {
                text: '您确定要退出吗？'
            });
            break;
        default:
            break;
    };
};
