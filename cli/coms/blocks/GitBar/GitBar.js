import $ from 'jquery';
import 'jquery.cookie';

let com = {};
export default com;

//在这里引用其他组件
com.components = {};

//所有数据写在这里
com.props = {
    filesToSave: Object,
    //需要存储为文件的数据{'index.html':{fileName,msg,data,lastSave,saveStatus}}
    beforeSave: Function, //存储之前执行的函数，可用于整理文件数据
    onProjectChange: Function, //当切换项目的时候，此函数可以返回路径数组要求载入['index.html']
    onFileLoaded: Function, //当文件被载入之后运行,fn(fileObj)，可根据fileObj自行判断处理
};

//所有数据写在这里
com.data = function data() {
    return {
        loginUrl: this.$xglobal.conf.urls.githubLogin,
        myInfo: null,
        projects: null,
        projectAct: null,
    };
};

//监控当前项目变化
com.watch = {
    projectAct: function (val, org) {
        projectChange(val, this);
    },
};

//所有直接使用的方法写在这里
com.methods = {
    getMyInfo: getMyInfo,
    logout: logout,
    actProject: function (index) {
        actProject(this, index);
    },
    showNewProjectDialog: function () {
        showNewProjectDialog(this);
    },
    showDelProjectDialog: function (p) {
        showDelProjectDialog(p, this);
    },
    saveFiles: function () {
        saveFiles(this);
    },
    shareUrl: function () {
        shareUrl(this);
    },
};

//加载到页面后运行的函数写在这里
com.mounted = function () {
    getMyInfo(this);
    getProjects(this);
};

//----------------所有函数写在下面-----------------


function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
};

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
};

/**
 * 发布pages，弹出分享窗口
 */
async function shareUrl(ctx) {
    var token = $.cookie('github_access_token');
    if (!token || !ctx.$data.projectAct) return;

    var fullname = ctx.$data.projectAct.full_name;
    if (!fullname) return;

    try {
        var url = `https://api.github.com/repos/${fullname}/pages?access_token=${token}`;
        var res = await ctx.rRun(url, null, {
            type: 'GET',
            xhrFields: {},
        });
        window.open(`https://${ctx.$data.projectAct.owner.login}.github.io/${ctx.$data.projectAct.name}/`);

    } catch (err) {
        //还没开启Pages功能
        var str = '点击确定进入Github项目设置页面，在GitHub Pages的Source一栏选择Master branch然后Save保存;然后再回到这里重新分享';
        ctx.$confirm(str, `您需要手工为项目${fullname}开启Pages功能`, {
            confirmButtonText: '确定',
            cancelButtonText: '关闭',
            type: 'warning'
        }).then(() => {
            window.open(`https://github.com/${fullname}/settings`);
        })
    };
};


/**
 * 当前项目变化，让外面进来的onProjectChange钩子生效。
 */
async function projectChange(p, ctx) {
    var set = ctx.onProjectChange ? ctx.onProjectChange() : {};
    if (set.autoLoadFile) {
        try {
            var token = $.cookie('github_access_token');
            if (!token || !ctx.$data.projectAct) return;

            var fullname = ctx.$data.projectAct.full_name;

            var url = `https://api.github.com/repos/${fullname}/contents/${set.autoLoadFile}?access_token=${token}`;
            var res = await ctx.rRun(url, null, {
                type: 'GET',
                xhrFields: {},
            });

            //调用外部传来的钩子
            if (res.content) res.content = b64_to_utf8(res.content);
            if (ctx.onFileLoaded) ctx.onFileLoaded(res, p);
        } catch (err) {
            ctx.$notify.error({
                title: `自动载入${set.autoLoadFile}文件失败`,
                message: err.message || '原因未知，请确认您曾经保存过文件',
            });
        };
    };
};

/**
 * 扫描filestosave对象，对需要进行存储的文件进行存储。
 */
async function saveFiles(ctx) {
    if (ctx.beforeSave) ctx.beforeSave();

    for (var key in ctx.filesToSave) {
        var item = ctx.filesToSave[key];
        if (item.needSave) {
            saveFile(item, ctx);
        };
    };
};

/**
 * 将本地存储的文件缓存数据存到当前项目下。
 */
async function saveFile(item, ctx) {
    try {
        var errtip;

        var fname = item.fileName;
        if (!fname) errtip = '文件名未定义，无法保存文件';
        var msg = item.msg || 'Auto commit by 10knet.com';
        var data = item.data || 'Hello github!Hello 10knet!';

        var token = $.cookie('github_access_token');
        if (!token) errtip = '你还没登录Github账号，无法保存文件';

        if (errtip) {
            ctx.$notify.error({
                title: errtip,
                message: '存储取消',
            });
            return;
        };

        item.saveStatus = 'saving';

        var pact = ctx.$data.projectAct;
        var fullname = pact ? pact.full_name : undefined;
        var url = `https://api.github.com/repos/${fullname}/contents/${fname}?access_token=${token}`;

        var dat = {
            "message": msg,
            "content": utf8_to_b64(data),
            "sha": item.sha,
        };

        var res = await ctx.rRun(url, dat, {
            type: 'PUT',
            xhrFields: {},
        });

        item.saveStatus = 'success';
        item.needSave = false;

        ctx.$notify({
            title: '存储文件成功',
            message: fname,
            type: 'success',
        });

    } catch (e) {
        item.saveStatus = 'error';
        ctx.$notify.error({
            title: '存储文件失败',
            message: e.message || '原因未知',
        });
    };
};

/**
 * 弹窗提示创建新文件名称
 */
async function showNewFileDialog(ctx) {
    ctx.$prompt('请使用完整文件名称和类型，如index.html', '输入文件名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9a-zA-Z]{4,16}\.[0-9a-zA-Z]{2,4}/,
        inputErrorMessage: '请使用4～16位英文和数组组合'
    }).then(function (ipt) {
        createFile(ipt.value, ctx);
    }).catch(function (err) {});
};

/**
 * 弹窗提示删除项目
 */
async function showDelProjectDialog(p, ctx) {
    var str = `您必须正确输入项目名称${p.name}才能将其删除`;
    ctx.$prompt(str, '删除项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: new RegExp(p.name),
        inputErrorMessage: '输入不正确'
    }).then(function (ipt) {
        delProject(p, ctx);
    }).catch(function (err) {});
};

/**
 * 从github仓库删除一个项目
 */
async function delProject(p, ctx) {
    var token = $.cookie('github_access_token');

    if (!token) {
        ctx.$notify.error({
            title: '你还没登录Github账号，无法删除项目',
            message: '请您先登录Github账号',
        });
        return;
    };

    var url = 'https://api.github.com/repos/' + p.full_name + '?access_token=' + token;

    //返回数据状态不规则，不能使用rRun方法
    $.ajax({
        type: 'DELETE',
        url: url,
        complete: function (xhr, ts) {
            if (xhr.status == '204') {
                ctx.$notify({
                    title: '删除项目成功',
                    message: '可能需要几分钟后才会生效，请耐心等待',
                    type: 'success'
                });

                //如果当前激活了这个项目，那么重置undefined
                if (ctx.$data.projectAct.full_name = p.full_name) {
                    ctx.$xrouter.xset('GitBar', {
                        projectAct: undefined,
                    });
                };

                //刷新项目下拉列表
                getProjects(ctx);
            } else {
                ctx.$notify.error({
                    title: '删除项目失败',
                    message: '原因未知',
                });
            }
        },
        error: function (err) {
            ctx.$notify.error({
                title: '删除项目成功',
                message: err.message || '原因未知',
            });
        },
    });
};


/**
 * 弹窗提示输入新项目名称
 */
async function showNewProjectDialog(ctx) {
    ctx.$prompt('建议使用4~16位的英文和数字组合', '请输入项目名称', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[0-9a-zA-Z]{4,16}/,
        inputErrorMessage: '名称格式不正确'
    }).then(function (ipt) {
        newProject(ipt.value, ctx);
    }).catch(function (err) {});
};

/**
 * 向github仓库创建一个新的项目
 */
async function newProject(pname, ctx) {
    try {
        var token = $.cookie('github_access_token');

        if (!token) {
            ctx.$notify.error({
                title: '你还没登录Github账号，无法创建项目',
                message: '请您先登录Github账号',
            });
            return;
        };

        var url = 'https://api.github.com/user/repos?access_token=' + token;
        var dat = {
            name: pname,
        };
        var res = await ctx.rRun(url, dat, {
            type: 'POST',
            xhrFields: {},
        });

        //激活新建的项目
        ctx.$xrouter.xset('GitBar', {
            projectAct: res,
        });

        //刷新项目下拉列表
        getProjects(ctx);

    } catch (e) {
        ctx.$notify.error({
            title: '创建新项目失败',
            message: e.message || '原因未知',
        });
    };
};


/**
 * 将当前项目设置为激活项目
 * @param {string} index index
 */
async function actProject(ctx, index) {
    ctx.$xrouter.xset('GitBar', {
        projectAct: ctx.$data.projects[index],
    });
};


/**
 * 获取用户项目列表
 * @param {object} ctx ctx
 */
async function getProjects(ctx) {
    var token = $.cookie('github_access_token');

    if (!token) {
        ctx.$notify.error({
            title: '获取Github账号信息失败',
            message: '请您先登录Github账号',
        });
        ctx.$set(ctx.$data, 'projectAct', undefined);
        return;
    };

    try {
        var url = 'https://api.github.com/user/repos?access_token=' + token;
        var res = await ctx.rRun(url, null, {
            type: 'GET',
            xhrFields: {},
        });
        ctx.$set(ctx.$data, 'projects', res);
        if (res.length > 0 && !ctx.$data.projectAct) {
            ctx.$xrouter.xset('GitBar', {
                projectAct: res[0],
            });
        };
        if (res.length < 1) {
            ctx.$xrouter.xset('GitBar', {
                projectAct: undefined,
            });
        };

    } catch (err) {
        ctx.$set(ctx.$data, 'projects', undefined);
        ctx.$xrouter.xset('GitBar', {
            projectAct: undefined,
        });
        ctx.$notify.error({
            title: '获取Github项目列表失败',
            message: err.message ? err.message : '原因未知',
        });
    };
};

/**
 * 去掉cookie里面的token信息，实现注销效果，刷新页面
 */
async function logout() {
    $.removeCookie('github_access_token', {
        path: '/',
        domain: '.10knet.com',
    });
    location.reload();
};

/**
 * 获取用户的github信息
 * @param {object} ctx ctx
 */
async function getMyInfo(ctx) {
    var token = $.cookie('github_access_token');

    if (!token) {
        ctx.$notify.error({
            title: '获取Github账号信息失败',
            message: '请您先登录Github账号',
        });
        return;
    };

    try {
        var url = 'https://api.github.com/user?access_token=' + token;
        var info = await ctx.rRun(url, null, {
            type: 'GET',
            xhrFields: {},
        });
        ctx.$set(ctx.$data, 'myInfo', info);
    } catch (err) {
        ctx.$set(ctx.$data, 'myInfo', undefined);
        ctx.$notify.error({
            title: '获取Github账户信息失败',
            message: err.message ? err.message : '原因未知',
        });
    };
};
