/*全局设置文件，将被xglobal插件载入到每个component的this.$xglobal.conf备用
 */

var conf = {};
export default conf;

//所有尚未统一的原有页面，原则上元素内不使用任何字符串格式的url地址
conf.urls = {
    host: 'http://10knet.com/',
    githubLogin: 'https://github.com/login/oauth/authorize?client_id=bcc991a3db5d401bd4af&scope=user,repo,delete_repo,public_repo',
};

conf.imgs = {}

//所有接口，原则上元素内不使用任何字符串格式的接口url地址
conf.apis = {
    qnRandKeyUploadToken: `//${location.host}/api/qnRandKeyUploadToken`,
};

//默认模版相关
conf.temp = {
    headData: '<title>10knet | 未标题</title>\n<meta charset="utf-8"/>\n<script src="//cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>',
};


//所有的页面模版
conf.pageTemplates = {
    'Hello world!': {
        name: 'Hello world!',
        desc: '第一次接触编码？从这里开始吧！最简单的起步模版。带有jquery和bootstrap库。',
        url: 'http://10knet.com/templates/pages/helloWorld.html',
        show:true,
    },
    '个人简历': {
        name: '个人简历',
        desc: '用代码自由编写自己的在线简历，从这个模版开始吧！带有jquery和bootstrap库，自动匹配电脑和手机屏幕',
        url: 'http://10knet.com/templates/pages/resume.html',
        show:true,
    },
    '2D(绘图)起步': {
        name: '2D(绘图)起步',
        desc: '学习做2D特效图像或者2D游戏编码，从这里开始。适合刚刚开始接触计算机图像编程的用户。带有jquery和createjs库。',
        url: 'http://10knet.com/templates/pages/2dgraphic.html',
        show:true,
    },
    '3D(VR)起步': {
        name: '3D(VR)起步',
        desc: '做3D图像或者虚拟现实场景，从这里起步。适合第一次接触3D／VR的同学。带有jquery和aframe和three.js两个库。',
        url: 'http://10knet.com/templates/pages/3dgraphic.html',
    },
}
