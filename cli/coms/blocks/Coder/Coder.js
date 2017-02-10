/**
 * 代码编辑器模块，支持xid传入，根据xid自动恢复卷动位置等
 */

import Vue from 'vue';
import $ from 'jquery';

import {
    codemirror, CodeMirror
}
from 'vue-codemirror';

import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/css-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/searchcursor.js';

var com = {};
export default com;

var selStr; //选中的字符串，用于自动提示使用

//所有直接用到的组件在这里导入
com.components = {
    codemirror
};

//所有数据写在这里
com.data = function () {
    var ctx = this;

    return {
        msg: 'Hello from blocks/Coder/Coder.js',
        editor: undefined,
        CM: CodeMirror,
        codeData: ctx.data,
        scrollInfo: { //自动保存和恢复卷动位置
            top: 0,
            left: 0,
        },
        options: ctx.opts || {
            mode: ctx.mode || 'javascript',
            lineNumbers: true,
            tabSize: 4,
            theme: ctx.theme || 'monokai',
            line: true,
            keyMap: "sublime",
            styleActiveLine: true,
            tabMode: "indent",
            lineWrapping: true,
            foldGutter: true,
            gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            lint: true,
            matchBrackets: true,
            matchTags: ctx.mode == 'text/html' ? {
                bothTags: true
            } : undefined,
            autoCloseBrackets: true,
            autoCloseTags: true,
            continueComments: "Enter",
            extraKeys: {
                "Ctrl-Q": "toggleComment",
                'Alt': function (cm) {
                    cm.foldCode(cm.getCursor());
                },
            }
        },
    };
};

//所有直接使用的方法写在这里
com.methods = {
    typeWriter: typeWriter,
    typeWriterDel: typeWriterDel,
};

com.props = {
    xid: String,
    data: Object,
    opts: Object,
    mode: String,
    theme: String,
    fontSize: {
        type: String,
        default: '13',
    },
    keyupFn: Function, //fn(code,key,ctx)
};


//加载到页面之前执行的函数
com.beforeMount = function () {};

//监视数据变化
com.watch = {
    fontSize: function (val, oldVal) {
        setFontSize(val, this);
    },
    datax: {
        handler: function (val, oldVal) {
            var editor = this.$refs.myEditor.editor;
            editor.doc.setValue(val.code || '');
        },
        deep: true,
    },
};


//加载到页面之后执行的函数
com.mounted = function () {
    var ctx = this;
    var codejo = $(this.$el);
    if (ctx.xid) codejo.attr('xid', ctx.xid);

    var editor = this.$refs.myEditor.editor;
    ctx.$data.editor = editor;
    ctx.data.editor = editor;

    //设置自动提示
    var ctx = this;
    editor.on('keydown', function (cm, event) {
        editorKeydown(cm, event, ctx);
    });
    editor.on('keyup', function (cm, evt) {
        editorKeyup(cm, evt, ctx);
        console.log('keyup cm', cm, event);
        console.log('keyup editor', ctx.$data.editor);
    });

    //利用xset自动恢复滚动位置，延迟确保生效
    setTimeout(function () {
        editor.scrollTo(ctx.$data.scrollInfo.left, ctx.$data.scrollInfo.top);
    }, 200);

    //滚动的时候自动保存位置
    editor.on('scroll', function (cm, evt) {
        var xid = codejo.attr('xid');
        if (xid) {
            ctx.$xrouter.xset(xid, {
                scrollInfo: editor.getScrollInfo(),
            });
        };
    });

    editor.setSize('100%', '100%');
    setFontSize(ctx.fontSize, ctx);
};


//---------------functions----------------

/**
 * 打字机插入字符，动画添加效果
 * @param {string} str 要添加的字符串
 */
async function typeWriter(str) {
    var ctx = this;
    var editor = ctx.$data.editor;

    for (var i = 0; i < str.length; i++) {
        await ctx.$xglobal.fns.sleep(250);
        try {
            editor.doc.replaceSelection(str[i]);
        } catch (err) {
            console.log('Coder:typeWriter:failed:', err);
        };
        editorKeyup(editor, {
            keyCode: str.charCode,
        }, ctx);
    };
    await ctx.$xglobal.fns.sleep(250);
    return ctx;
};

/**
 * 打字机删除字符，动画删除效果
 * @param {string} str 要添加的字符串
 */
async function typeWriterDel(n) {
    var ctx = this;
    var editor = ctx.$data.editor;

    for (var i = 0; i < n; i++) {
        await ctx.$xglobal.fns.sleep(250);
        try {
            editor.execCommand('delCharAfter');
        } catch (err) {
            console.log('Coder:typeWriterDel:failed:', err);
        };
        editorKeyup(editor, {
            keyCode: 46, //删除键
        }, ctx);
    };
    await ctx.$xglobal.fns.sleep(250);
    return ctx;
};



/**
 * watch中实现自动设置页面的文字大小，设置后刷新编辑器
 * @param {number} size 文字大小
 * @param {object}   ctx  ctx
 */
function setFontSize(size, ctx) {
    let editor = ctx.$refs.myEditor.editor;
    editor.getWrapperElement().style["font-size"] = `${size}px`;
    editor.refresh();
};

/**
 * codemirror事件监听，按键按下；更新selStr用于anyword代码提示
 * @param {object} cm    codemirror
 * @param {object} event event
 */
function editorKeydown(cm, event, ctx) {
    let editor = ctx.$refs.myEditor.editor;
    selStr = editor.doc.getSelection();
};

/**
 * codemirror事件监听，按键抬起；弹出代码自动提示
 * @param {object} cm    codemirror
 * @param {object} event event
 */
function editorKeyup(cm, event, ctx) {
    var editor = ctx.$refs.myEditor.editor;

    //同步data.code数据
    var codeStr = editor.doc.getValue();
    ctx.$set(ctx.data, 'code', codeStr);
    ctx.$set(ctx.codeData, 'code', codeStr);

    //结合anyword和javascript两个提示器
    var char = String.fromCharCode(event.keyCode);

    //处理外部传来的控制器函数
    if (ctx.keyupFn) {
        ctx.keyupFn(ctx.$refs.myEditor.content, char, ctx);
    };

    //对于非字母数字点或者按下ctrlalt的，忽略
    if (!cm.state.completionActive && /[0-9A-Za-z\.\¾]/.test(char) && !event.altKey && !event.ctrlKey) {
        CodeMirror.showHint(cm, function (edtr, opts) {

            //根据模式自适应提示引擎
            var mod = ctx.mode;
            if (mod == 'text/html') mod = 'html';
            var res = CodeMirror.hint[mod](edtr, opts);

            res = CodeMirror.hint.anyword(edtr, {
                list: (res && res.list) ? res.list : []
            });
            return res;
        }, {
            completeSingle: false
        });
    };
};
