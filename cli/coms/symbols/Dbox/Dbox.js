/**
 * 可以动态调整四边大小的盒子
 */
import $ from 'jquery';
var com = {};
export default com;

var barWid = '10';
window.DboxDragMaskArr = [];

com.components = {};

com.props = {
    useRight: String,
    useLeft: String,
    useTop: String,
    useBottom: String,
    wid: String,
    hei: String,
    barSize: String,
    minWid: String,
    minHei: String,
    maxWid: String,
    maxHei: String,
    xidTag: String,
};

com.data = function data() {
    return {
        rdragging: false,
        sizeX: this.wid || '100%',
        sizeY: this.hei || '100%',
        mWid: this.minWid || this.barSize || barWid,
        mHei: this.minHei || this.barSize || barWid,
    };
};

com.methods = {
    startDrag: function (evt, tag) {
        startDrag(evt, this, tag);
    },
};


com.mounted = function () {

};

//------------------------functions-----------------------
function startDrag(evt, ctx, tag) {
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
            wid = (wid < ctx.mWid) ? ctx.mWid : wid;
            ctx.$set(ctx.$data, 'sizeX', wid + 'px');
            if (ctx.xid) {
                ctx.$xrouter.xset(ctx.xid, {
                    sizeX: wid + 'px',
                });
            };
        };

        if (tag == 'top' || tag == 'bottom') {
            var hei = jo.height() + offsetY;
            hei = (hei < ctx.mHei) ? ctx.mHei : hei;
            ctx.$set(ctx.$data, 'sizeY', hei + 'px');
            console.log('>>>xid', ctx.xid);
            if (ctx.xid) {
                ctx.$xrouter.xset(ctx.xid, {
                    sizeY: hei + 'px',
                });
            };
        };
    });

    mask.mouseup(removeMask);

    window.DboxDragMaskArr.push(mask);
    $('body').append(mask);
};


function removeMask(evt) {
    window.DboxDragMaskArr.forEach(function (item, i) {
        item.remove();
    });
    window.DboxDragMaskArr = [];
    $('#DboxDragMask').remove();
};
