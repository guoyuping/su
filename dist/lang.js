var su;
(function (su) {
    var lang;
    (function (lang) {
        function array(arr) {
            return {
                /**
                 * Check whether a given object exists in an array
                 *
                 * @example
                 *    lang.array([1, 2]).contains(1);
                 *    // => true
                 *
                 * Can be used to match array with array. If intersection is found true is returned
                 */
                contains: function (needle) {
                    if (Array.isArray(needle)) {
                        for (var i = needle.length; i--;) {
                            if (array(arr).indexOf(needle[i]) !== -1) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        return array(arr).indexOf(needle) !== -1;
                    }
                },
                /**
                 * Check whether a given object exists in an array and return index
                 * If no elelemt found returns -1
                 *
                 * @example
                 *    lang.array([1, 2]).indexOf(2);
                 *    // => 1
                 */
                indexOf: function (needle) {
                    if (arr.indexOf) {
                        return arr.indexOf(needle);
                    }
                    else {
                        for (var i = 0, length = arr.length; i < length; i++) {
                            if (arr[i] === needle) {
                                return i;
                            }
                        }
                        return -1;
                    }
                },
                /**
                 * Substract one array from another
                 *
                 * @example
                 *    lang.array([1, 2, 3, 4]).without([3, 4]);
                 *    // => [1, 2]
                 */
                without: function (arrayToSubstract) {
                    arrayToSubstract = array(arrayToSubstract);
                    var newArr = [], i = 0, length = arr.length;
                    for (; i < length; i++) {
                        if (!arrayToSubstract.contains(arr[i])) {
                            newArr.push(arr[i]);
                        }
                    }
                    return newArr;
                },
                /**
                 * Return a clean native array
                 *
                 * Following will convert a Live NodeList to a proper Array
                 * @example
                 *    var childNodes = lang.array(document.body.childNodes).get();
                 */
                get: function () {
                    var i = 0, length = arr.length, newArray = [];
                    for (; i < length; i++) {
                        newArray.push(arr[i]);
                    }
                    return newArray;
                },
                /**
                 * Creates a new array with the results of calling a provided function on every element in this array.
                 * optionally this can be provided as second argument
                 *
                 * @example
                 *    var childNodes = lang.array([1,2,3,4]).map(function (value, index, array) {
                        return value * 2;
                 *    });
                 *    // => [2,4,6,8]
                 */
                map: function (callback, thisArg) {
                    if (Array.prototype.map) {
                        return arr.map(callback, thisArg);
                    }
                    else {
                        var len = arr.length >>> 0, A = new Array(len), i = 0;
                        for (; i < len; i++) {
                            A[i] = callback.call(thisArg, arr[i], i, arr);
                        }
                        return A;
                    }
                },
                /* ReturnS new array without duplicate entries
                 *
                 * @example
                 *    var uniq = lang.array([1,2,3,2,1,4]).unique();
                 *    // => [1,2,3,4]
                 */
                unique: function () {
                    var vals = [], max = arr.length, idx = 0;
                    while (idx < max) {
                        if (!array(vals).contains(arr[idx])) {
                            vals.push(arr[idx]);
                        }
                        idx++;
                    }
                    return vals;
                }
            };
        }
        lang.array = array;
        ;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
var su;
(function (su) {
    var lang;
    (function (lang) {
        /**
         * event事件分发
         * 绑定event的行为函数
         */
        var Dispatcher = (function () {
            function Dispatcher() {
                this.events = {};
                console.log("dispatcher constructor:\r\n");
            }
            /**
             * 将handler放入this.events[eventName] 的handlers数组中，绑定event的行为
             */
            Dispatcher.prototype.on = function (eventName, handler) {
                this.events = this.events || {};
                this.events[eventName] = this.events[eventName] || [];
                this.events[eventName].push(handler);
                return this;
            };
            /**
             * 将handler从this.events[eventName] 的handlers数组中删除
             */
            Dispatcher.prototype.off = function (eventName, handler) {
                this.events = this.events || {};
                var i = 0, handlers, newHandlers;
                if (eventName) {
                    handlers = this.events[eventName] || [],
                        newHandlers = [];
                    for (; i < handlers.length; i++) {
                        if (handlers[i] !== handler && handler) {
                            newHandlers.push(handlers[i]);
                        }
                    }
                    this.events[eventName] = newHandlers;
                }
                else {
                    // Clean up all events
                    this.events = {};
                }
                return this;
            };
            /**
             * 执行event中绑定的每一个handler方法
             *
             * @example
             * let d = new lang.DispatcherT();
             * d.on("hello",function(){
             *      console.log('打印a');
             * }).fire("hello");
             * // 打印a
             * d.on("hello",function(){
             *      console.log('打印b');
             * }).fire("hello");
             * // 打印a
             * // 打印b
             */
            Dispatcher.prototype.fire = function (eventName, payload) {
                this.events = this.events || {};
                var handlers = this.events[eventName] || [], i = 0;
                for (; i < handlers.length; i++) {
                    handlers[i].call(this, payload);
                }
                return this;
            };
            // deprecated, use .on()
            Dispatcher.prototype.observe = function (eventName, handler) {
                return this.on.apply(this, arguments);
            };
            // deprecated, use .off()
            Dispatcher.prototype.stopObservin = function (eventName, handler) {
                return this.off.apply(this, arguments);
            };
            return Dispatcher;
        }());
        lang.Dispatcher = Dispatcher;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
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
var su;
(function (su) {
    var lang;
    (function (lang) {
        function string(str) {
            var WHITE_SPACE_START = /^\s+/;
            var WHITE_SPACE_END = /\s+$/;
            var ENTITY_REG_EXP = /[&<>\t"]/g;
            var ENTITY_MAP = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': "&quot;",
                '\t': "&nbsp; "
            };
            str = String(str);
            return {
                /**
                 * @example
                 *    wysihtml.lang.string("   foo   ").trim();
                 *    // => "foo"
                 */
                trim: function () {
                    return str.replace(WHITE_SPACE_START, "").replace(WHITE_SPACE_END, "");
                },
                /**
                 * @example
                 *    wysihtml.lang.string("Hello #{name}").interpolate({ name: "Christopher" });
                 *    // => "Hello Christopher"
                 */
                interpolate: function (vars) {
                    for (var i in vars) {
                        str = this.replace("#{" + i + "}").by(vars[i]);
                    }
                    return str;
                },
                /**
                 * @example
                 *    wysihtml.lang.string("Hello Tom").replace("Tom").with("Hans");
                 *    // => "Hello Hans"
                 */
                replace: function (search) {
                    return {
                        by: function (replace) {
                            return str.split(search).join(replace);
                        }
                    };
                },
                /**
                 * @example
                 *    wysihtml.lang.string("hello<br>").escapeHTML();
                 *    // => "hello&lt;br&gt;"
                 */
                escapeHTML: function (linebreaks, convertSpaces) {
                    var html = str.replace(ENTITY_REG_EXP, function (c) { return ENTITY_MAP[c]; });
                    if (linebreaks) {
                        html = html.replace(/(?:\r\n|\r|\n)/g, '<br />');
                    }
                    if (convertSpaces) {
                        html = html.replace(/  /gi, "&nbsp; ");
                    }
                    return html;
                }
            };
        }
        lang.string = string;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
