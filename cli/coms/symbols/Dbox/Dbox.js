/**
 * 可以动态调整四边大小的盒子
 * conf的属性都可以动态调整
 */
import $ from 'jquery';
var com = {};
export default com;

var barSize = '6';
window.DboxDragMaskArr = [];

com.props = {
    conf: Object, //所有属性支持动态调整
    xid: String,
    display: String,
};

com.data = function data() {
    var ctx = this;
    return {
        rdragging: false,
        width: '100%', //用于restore,支持$xset保存恢复
        height: '100%', //用于restore,支持$xset保存恢复
    };
};

com.watch = {
    //这里的属性支持$xset保存恢复
    width: function (val, oldval) {
        var ctx = this;
        ctx.$set(ctx.conf, 'width', val);
    },
    height: function (val, oldval) {
        var ctx = this;
        ctx.$set(ctx.conf, 'height', val);
    },
};

com.methods = {
    startDrag: startDrag,
};


com.mounted = function () {
    var ctx = this;

    //初始化conf默认数据
    if (!ctx.conf.barSize) ctx.$set(ctx.conf, 'barSize', barSize);
    if (!ctx.conf.barColor) ctx.$set(ctx.conf, 'barColor', '#AAA');
    if (!ctx.conf.width) ctx.$set(ctx.conf, 'width', '100%');
    if (!ctx.conf.height) ctx.$set(ctx.conf, 'height', '100%');
    if (!ctx.conf.minWidth) ctx.$set(ctx.conf, 'minWidth', ctx.conf.barSize);
    if (!ctx.conf.minHeight) ctx.$set(ctx.conf, 'minHeight', ctx.conf.barSize);
    if (!ctx.conf.maxWidth) ctx.$set(ctx.conf, 'maxWidth', window.innerWidth);
    if (!ctx.conf.maxHeight) ctx.$set(ctx.conf, 'maxHeight', window.innerWidth);
};

//------------------------functions-----------------------

/**
 * 边框拖动的时候执行事件，调整盒子尺寸
 * @param {object}   evt evt
 * @param {string} tag top,right,left,bottom
 */
function startDrag(evt, tag) {
    var ctx = this;

    var tar = $(evt.target);
    var jo = tar.parents('#Dbox');
    var mask = $('<div id="DboxDragMask"></div>');
    var orgPos = {
        x: evt.screenX,
        y: evt.screenY,
    };

    mask.css({
        background: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        'z-index': '1000'
    });

    mask.mousemove(function (moveEvt) {
        var offsetX = moveEvt.screenX - orgPos.x;
        var offsetY = moveEvt.screenY - orgPos.y;
        orgPos.x = moveEvt.screenX;
        orgPos.y = moveEvt.screenY;


        if (tag == 'right' || tag == 'left') {
            var wid = jo.width() + offsetX;
            wid = (wid < ctx.conf.minWidth) ? ctx.conf.minWidth : wid;
            wid = (wid > ctx.conf.maxWidth) ? ctx.conf.maxWidth : wid;
            console.log('>>>>dbox', wid, ctx.conf.minWidth, ctx.conf.maxWidth);

            ctx.$set(ctx.conf, 'width', wid + 'px');
            if (ctx.xid) {
                ctx.$xrouter.xset(ctx.xid, {
                    width: wid + 'px',
                });
            };
        };

        if (tag == 'top' || tag == 'bottom') {
            var hei = jo.height() + offsetY;
            hei = (hei < ctx.conf.minHei) ? ctx.conf.minHei : hei;
            hei = (hei > ctx.conf.maxHei) ? ctx.conf.maxHei : hei;
            ctx.$set(ctx.$data, 'height', hei + 'px');
            if (ctx.xid) {
                ctx.$xrouter.xset(ctx.xid, {
                    height: hei + 'px',
                });
            };
        };
    });

    mask.mouseup(removeMask);

    window.DboxDragMaskArr.push(mask);
    $('body').append(mask);
};


/**
 * 遮罩事件，清除自身（mask）
 * @param {object} evt evt
 */

function removeMask(evt) {
    window.DboxDragMaskArr.forEach(function (item, i) {
        item.remove();
    });
    window.DboxDragMaskArr = [];
    $('#DboxDragMask').remove();
};
