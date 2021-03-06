/**
 * 扩展函数的Promise方法，务必注意异常捕获，这里不包含reject处理，参见底部samples
 * 为所有函数增加.zprms和.zpromise方法，fn(arg,...,callBackFn(err,res))格式的函数可用；
 * 为所有函数增加.zprms2和.zpromise2方法，fn(callBackFn(err,res)，arg,...)格式的函数可用；
 * .zprms2可用做sleep功能,await setTimeout.zprms2(5000);
 */
'use strict';

const _zprms = {
    info: _zloger.info('_zprms:.zprms & .zpromise method has added to Function.'),
};

(function () {
    Function.prototype.zprms = Function.prototype.zpromise = zprms;
    Function.prototype.zprms2 = Function.prototype.zpromise2 = zprms2;
})();

module.exports = _zprms;

//-----------------------functions------------------------

/**
 * 匹配参数格式fn(arg,...,callBackFn(err,res))的函数
 * @returns {promise} promise
 */
function zprms() {
    var orgArgs = arguments;
    var fn = this;

    var ctx = this.supper;
    console.log('>>>zprms this', ctx);

    var prms = genPromise(ctx, fn, orgArgs, true);
    return prms;
};

/**
 * 匹配参数格式fn(callBackFn(err,res),arg,...)的函数
 * @returns {promise} promise
 */
function zprms2() {
    var orgArgs = arguments;
    var fn = this;
    var prms = genPromise(fn, orgArgs, false);
    return prms;
};

/**
 * 将callback转换为promise的关键函数
 * @param   {function} fn   需要转换的函数
 * @param   {object} args   原始函数的参数，即arguments对象
 * @param   {boolean} cbAtEnd  callback函数是否最后一个参数，默认为true
 * @returns {promise} promise
 */
function genPromise(ctx, fn, args, cbAtEnd = true) {
    return new Promise((resolve, reject) => {
        function callbackFn(err, res) {
            var cbArgs = arguments;

            var datas = [];
            for (var i = 0; i < cbArgs.length; i++) {
                var arg = cbArgs[i];
                if (arg) {
                    if (arg.cosntructor == Error) {
                        //参数里如果有一个Error就reject抛出这个错误
                        reject(arg);
                    } else {
                        datas.push(arg);
                    };
                };
            };

            if (datas.length < 1) {
                datas = undefined;
            } else if (datas.length = 1) {
                datas = datas[0];
            };

            resolve(datas);
        };

        var argsArr = [];
        for (var key in args) {
            argsArr.push(args[key]);
        };

        if (cbAtEnd) {
            argsArr.push(callbackFn);
        } else {
            argsArr.unshift(callbackFn);
        };


        fn.apply(ctx, argsArr);
    });
};


//----------------------------------samples------------------------------------
(async function () {
    try {
        //read a file, then print the buffer.
        //var res = await $fs.readFile.zprms('./base_modules/_zprms2.js');

        //wait 3 sec then print undefined.
        //var res = await setTimeout.zprms2(5000);

        //_zloger.log(`_zprms:samples run:${res}`);
    } catch (err) {
        //_zloger.log(`_zprms:samples err':${err},${res}`);
    };
})();
