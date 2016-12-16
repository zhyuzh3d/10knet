import $ from 'jquery';
var com = {};
export default com;

var vc; //vueComponent对象
var jo; //对应的jquery对象,mounted函数内设定

com.components = {};

com.props = {
    imgUrl: String, //背景图像地址
    bgColor: { //背景颜色
        type: String,
        default: 'none'
    },
    colorAlpha: { //背景颜色透明
        default: 1
    },
    imgAlpha: { //背景图片透明
        default: 1
    },
};


com.data = function data() {
    vc = this;
    return {
        wid:window.innerWidth+'px',
        hei:window.innerHeight+'px',
    };
};

com.mounted = function () {
    jo = $(this.$el);
    if (vc.imgUrl) {
        //监听窗口变化，自动调整图像大小
        $(window).resize(function () {
            vc.$set(vc,'wid',window.innerWidth+'px');
            vc.$set(vc,'hei',window.innerHeight+'px');
            resizeImg();
        });

        //图片载入后确定图片宽高
        var imgjo = jo.find('#imgBg');
        imgjo.attr('src', this.imgUrl);
        imgjo.on('load', function (e) {
            imgWid = imgjo.width();
            imgHei = imgjo.height();
            resizeImg();
        });

    };
};

var imgWid; //背景图片宽度,mounted图片load载入后设定
var imgHei; //背景图片高度,mounted图片load载入后设定
/**
 * 根据屏幕宽高比和图片宽高比适配图片显示尺寸并重新定位图片到屏幕中央
 */
function resizeImg() {
    var imgjo = jo.find('#imgBg');
    var imgRatio = imgWid / imgHei;
    var scrRatio = window.innerWidth / window.innerHeight;

    var clrjo=jo.find('#clrBg');
    clrjo.css('height', window.innerHeight + 'px');
    clrjo.css('width', window.innerWidth + 'px');

    if (imgRatio > scrRatio) {
        //高度充满
        imgjo.css('height', window.innerHeight + 'px');
        imgjo.css('width', 'auto');

        //向左偏移
        var offset = -0.5 * (imgWid * (window.innerHeight / imgHei) - window.innerWidth);
        imgjo.css('left', offset + 'px');
        imgjo.css('top', '0');
    } else {
        //宽度充满
        imgjo.css('width', window.innerWidth + 'px');
        imgjo.css('height', 'auto');

        //向上偏移
        var offset = -0.5 * (imgHei * (window.innerWidth / imgWid) - window.innerHeight);
        imgjo.css('top', offset + 'px');
        imgjo.css('left', '0');
    };
};
