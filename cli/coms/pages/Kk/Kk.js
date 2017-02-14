import $ from 'jquery';

let com = {};
export default com;
let vc; //此元素vueComponent对象
let jo; //此元素对应的jquery对象,mounted函数内设定

//所有直接用到的组件在这里导入
import QnUploadBtn from '../../symbols/QnUploadBtn/QnUploadBtn.html';

com.components = {
    QnUploadBtn,
};

//所有数据写在这里
com.data = function data() {
    vc = this;

    var blob = new Blob(['hello world!!'], {
        type: 'text/plain'
    });
    blob.name = 'testx.html';
    blob.lastModifiedDate = new Date();

    return {
        msg: 'Hello from blocks/Kk/Kk.js',
        uploadFiles: {},
        blob: blob,
        url: URL.createObjectURL(blob),
        gitLoginUrl: vc.$xglobal.conf.urls.githubLogin,
        myGithubInfo: null,
    };
};

//所有直接使用的方法写在这里
com.methods = {
    getUserGithubInfo,
};

//加载到页面前执行的函数
com.beforeMount = function () {
    jo = $(this.$el);
};

com.mounted = function () {

};

//-------所有函数写在下面,可以直接使用vc，jo；禁止在下面直接运行--------
async function getUserGithubInfo() {
    var token = vc.$xglobal.fns.getCookie('github_access_token');

    //如果没有那么就启动授权登录
    if (!token) location.href = vc.$data.gitLoginUrl;

    //已有token就拉取用户信息
    try {

        var dat, url;

        //获取用户信息
        //url = 'https://api.github.com/user?access_token=' + token;

        //获取仓库列表
        //url = 'https://api.github.com/user/repos?access_token=' + token;

        //创建一个仓库POST
        /*
        url = 'https://api.github.com/user/repos?access_token=' + token;
        dat = {
            name: 'testlala'
        };
        */

        //获取仓库文件列表
        //url = 'https://api.github.com/repos/zhyuzh3d/10knet/contents?access_token=' + token;

        //获取单个文件内容atob(info.content)
        url = 'https://api.github.com/repos/zhyuzh3d/10knet/contents/xxx.html?access_token=' + token;

        //创建一个文件:PUT!!!
        /*
        url = 'https://api.github.com/repos/testlala/10knet/contents/xxx.html?access_token=' + token;
        dat = {
            "message": "my commit message",
            "content": btoa('hello github!'),
        };
        */


        var info = await vc.rRun(url, dat, {
            type: 'GET',
            xhrFields: {},
        });


        vc.$set(vc.$data, 'myGithubInfo', atob(info.content));
        //vc.$set(vc.$data, 'myGithubInfo', info);
    } catch (err) {
        //拉取失败也重新启动授权登录
        //location.href = vc.$data.gitLoginUrl;
        console.log('>>>ERR', err);
    };
};
