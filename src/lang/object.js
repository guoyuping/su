var su;
(function (su) {
    var lang;
    (function (lang) {
        function object(obj) {
            return {
                /**
                 * @example
                 *    lang.object({ foo: 1, bar: 1 }).merge({ bar: 2, baz: 3 }).get();
                 *    // => { foo: 1, bar: 2, baz: 3 }
                 */
                merge: function (otherObj, deep) {
                    for (var i in otherObj) {
                        if (deep && object(otherObj[i]).isPlainObject() && (typeof obj[i] === "undefined" || object(obj[i]).isPlainObject())) {
                            if (typeof obj[i] === "undefined") {
                                obj[i] = object(otherObj[i]).clone(true);
                            }
                            else {
                                object(obj[i]).merge(object(otherObj[i]).clone(true));
                            }
                        }
                        else {
                            obj[i] = object(otherObj[i]).isPlainObject() ? object(otherObj[i]).clone(true) : otherObj[i];
                        }
                    }
                    return this;
                },
                difference: function (otherObj) {
                    var diffObj = {};
                    // Get old values not in comparing object
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            if (!otherObj.hasOwnProperty(i)) {
                                diffObj[i] = obj[i];
                            }
                        }
                    }
                    // Get new and different values in comparing object
                    for (var o in otherObj) {
                        if (otherObj.hasOwnProperty(o)) {
                            if (!obj.hasOwnProperty(o) || obj[o] !== otherObj[o]) {
                                diffObj[0] = obj[0];
                            }
                        }
                    }
                    return diffObj;
                },
                /**
                 * 返回 参数 obj
                 */
                get: function () {
                    return obj;
                },
                /**
                 * 克隆一个对象
                 * @example
                 *    lang.object({ foo: 1 }).clone();
                 *    // => { foo: 1 }
                 *
                 *    v0.4.14 adds options for deep clone : lang.object({ foo: 1 }).clone(true);
                 */
                clone: function (deep) {
                    var newObj = {}, i;
                    if (obj === null || !object(obj).isPlainObject()) {
                        return obj;
                    }
                    for (i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            if (deep) {
                                newObj[i] = object(obj[i]).clone(deep);
                            }
                            else {
                                newObj[i] = obj[i];
                            }
                        }
                    }
                    return newObj;
                },
                /**
                 * @example
                 *    lang.object([]).isArray();
                 *    // => true
                 */
                isArray: function () {
                    return Object.prototype.toString.call(obj) === "[object Array]";
                },
                /**
                 * @example
                 *    lang.object(function() {}).isFunction();
                 *    // => true
                 */
                isFunction: function () {
                    return Object.prototype.toString.call(obj) === '[object Function]';
                },
                isPlainObject: function () {
                    return obj && Object.prototype.toString.call(obj) === '[object Object]' && !(("Node" in window) ? obj instanceof Node : obj instanceof Element || obj instanceof Text);
                },
                /**
                 * @example
                 *    lang.object({}).isEmpty();
                 *    // => true
                 */
                isEmpty: function () {
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            return false;
                        }
                    }
                    return true;
                }
            };
        }
        lang.object = object;
        ;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
