/*page页面相关功能
 */
var _page = {};

var noDel = _mngs.fns.noDel;

//-------------------apis--------------------
/**
 * 创建一个新的页面
 * 返回这个页面
 */
_zrouter.addApi('/pageNew', {
    validator: {
        token: _conf.regx.token, //用户token认证信息
        name: _conf.regx.pageName,
    },
    method: async function pageNew(ctx) {
        var token = ctx.xdata.token;
        var name = ctx.xdata.name;

        //根据token获取用户id
        var acc = await _mngs.models.user.findOne(noDel({
            _token: token
        }), '_id');
        if (!acc) throw Error().zbind(_msg.Errs.AccNotExist);

        //检测是否有重名的page
        var hasUsed = await _mngs.models.page.findOne(noDel({
            author: acc.id,
            name: name,
        }), '_id');
        if (hasUsed) throw Error().zbind(_msg.Errs.PageNameUsed, `:${name}`);

        //创建新页面
        var newPage = await new _mngs.models.page({
            author: acc.id,
            name: name,
        }).save();

        newPage = _mngs.fns.clearDoc(newPage);

        ctx.body = new _msg.Msg(null, ctx, newPage);
    },
});



/**
 * 删除一个页面,只是设置__del:true，并不真的删除
 * 返回空
 */
_zrouter.addApi('/pageDel', {
    validator: {
        token: _conf.regx.token, //用户token认证信息
        name: _conf.regx.pageName,
    },
    method: async function pageNew(ctx) {
        var token = ctx.xdata.token;
        var name = ctx.xdata.name;

        //根据token获取用户id
        var acc = await _mngs.models.user.findOne(noDel({
            _token: token
        }), '_id');
        if (!acc) throw Error().zbind(_msg.Errs.AccNotExist);

        //直接更新__del字段
        var res = await _mngs.models.page.update(noDel({
            author: acc.id,
            name: name,
        }), {
            __del: true
        });
        if (res.n == 0) throw Error().zbind(_msg.Errs.PageNoExist, `:${name}`);

        ctx.body = new _msg.Msg(null, ctx, null);
    },
});


/**
 * 获取用户所有页面列表,
 * 返回基本信息列表，只有id和名称
 */
_zrouter.addApi('/pageGetList', {
    validator: {
        token: _conf.regx.token, //用户token认证信息
    },
    method: async function pageGetList(ctx) {
        var token = ctx.xdata.token;

        //根据token获取用户id
        var acc = await _mngs.models.user.findOne(noDel({
            _token: token,
        }), '_id');
        if (!acc) throw Error().zbind(_msg.Errs.AccNotExist);

        //获取此用户所有page列表
        var list = await _mngs.models.page.find(noDel({
            author: acc._id,
        }), 'name file').populate('file', 'url').exec();

        list = _mngs.fns.clearDoc(list);

        ctx.body = new _msg.Msg(null, ctx, list);
    },
});


/**
 * 根据用户名获取他的主页page(含file),任何人都可以获取
 * 返回page信息
 */
_zrouter.addApi('/pageGetHomePage', {
    validator: {
        name: _conf.regx.name, //用户名
    },
    method: async function pageGetHomePage(ctx) {
        var name = ctx.xdata.name;

        //获取用户的_id
        var acc = await _mngs.models.user.findOne(noDel({
            name: name,
        }), '_id');
        if (!acc) throw Error().zbind(_msg.Errs.AccNotExist);

        //获取同名的page
        var page = await _mngs.models.page.findOne(noDel({
            author: acc._id,
            name: name,
        })).populate('file').exec();
        if (!page) throw Error().zbind(_msg.Errs.PageNoExist, `:${name}`);

        page = _mngs.fns.clearDoc(page);

        ctx.body = new _msg.Msg(null, ctx, page);
    },
});


/**
 * 根据用户名和页面名获取page信息
 * 返回基本page信息
 */
_zrouter.addApi('/pageGetPageByANamePName', {
    validator: {
        accName: _conf.regx.name, //用户名
        pageName: _conf.regx.pageName, //页面名
    },
    method: async function pageGetPageByANamePName(ctx) {
        var accName = ctx.xdata.accName;
        var pageName = ctx.xdata.pageName;

        //获取用户的_id
        var acc = await _mngs.models.user.findOne(noDel({
            name: accName,
        }), '_id');
        if (!acc) throw Error().zbind(_msg.Errs.AccNotExist);

        //获取同名的page
        var page = await _mngs.models.page.findOne(noDel({
            author: acc._id,
            name: pageName,
        })).populate('file').exec();
        if (!page) throw Error().zbind(_msg.Errs.PageNoExist, `,作者[${accName}]页面[${pageName}]`);

        page = _mngs.fns.clearDoc(page);

        ctx.body = new _msg.Msg(null, ctx, page);
    },
});



//-------------------functions--------------------






//导出模块
module.exports = _page;
