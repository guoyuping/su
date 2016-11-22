var su;
(function (su) {
    var views;
    (function (views) {
        var View = (function () {
            function View(parent, textareaElement, config) {
                this.config = {};
                this.parent = parent;
                this.element = textareaElement;
                this.config = config;
                if (!this.config.noTextarea) {
                    this._observeViewChange();
                }
            }
            /**
             * 绑定beforeload、change_view事件到editor上
             */
            View.prototype._observeViewChange = function () {
                var _this = this;
                //var that = this;
                // 绑定beforeload事件的方法
                this.parent.on("beforeload", function () {
                    // 绑定change_view事件的方法
                    _this.parent.on("change_view", function (view) {
                        if (view === _this.name) {
                            _this.parent.currentView = _this;
                            _this.show();
                            // Using tiny delay here to make sure that the placeholder is set before focusing
                            setTimeout(function () { this.focus(); }, 0);
                        }
                        else {
                            _this.hide();
                        }
                    });
                });
            };
            View.prototype.hide = function () {
                this.element.style.display = "none";
            };
            View.prototype.show = function () {
                this.element.style.display = "";
            };
            View.prototype.focus = function (setToEnd) {
                if (this.element
                    && this.element.ownerDocument
                    && this.element.ownerDocument.querySelector(":focus") === this.element) {
                    return;
                }
                // 否则聚焦到element
                try {
                    if (this.element) {
                        this.element.focus();
                    }
                }
                catch (e) { }
            };
            View.prototype.disable = function () {
                this.element.setAttribute("disabled", "disabled");
            };
            View.prototype.enable = function () {
                this.element.removeAttribute("disabled");
            };
            return View;
        }());
        views.View = View;
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
