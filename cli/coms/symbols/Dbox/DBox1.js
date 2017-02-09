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
    conf:String,
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
    xid:String,
};

com.data = function data() {
    return {
        rdragging: false,
        sizeX: this.wid || '100%',
        sizeY: this.hei || '100%',
        mnWid: this.minWid || this.barSize || barWid,
        mxWid: this.maxWid || window.innerWidth,
        mnHei: this.minHei || this.barSize || barWid,
        mxHei: this.maxHei || window.innerHeight,
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
            wid = (wid < ctx.mnWid) ? ctx.mnWid : wid;
            wid = (wid > ctx.mxWid) ? ctx.mxWid : wid;

            ctx.$set(ctx.$data, 'sizeX', wid + 'px');
            if (ctx.xid) {
                ctx.$xrouter.xset(ctx.xid, {
                    sizeX: wid + 'px',
                });
            };
        };

        if (tag == 'top' || tag == 'bottom') {
            var hei = jo.height() + offsetY;
            hei = (hei < ctx.mnHei) ? ctx.mnHei : hei;
            hei = (hei > ctx.mxHei) ? ctx.mxHei : hei;
            ctx.$set(ctx.$data, 'sizeY', hei + 'px');
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
