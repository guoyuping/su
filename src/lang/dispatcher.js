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
