/// <reference path="./view.ts" />
/// <reference path="../browser.ts" />
/// <reference path="../lang/string.ts" />
/// <reference path="../dom/observe.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var su;
(function (su) {
    var views;
    (function (views) {
        /**
         *
         */
        var Textarea = (function (_super) {
            __extends(Textarea, _super);
            function Textarea(parent, textareaElement, config) {
                _super.call(this, parent, textareaElement, config);
                this.name = "textarea";
                this._observe();
            }
            Textarea.prototype.clear = function () {
                this.element.value = "";
            };
            /**
             * 获取textarea中的内容（html代码）
             */
            Textarea.prototype.getValue = function (parse) {
                var value = this.isEmpty() ? "" : this.element.value;
                if (parse !== false) {
                    // parse方法Editor类中定义
                    // Editor调用dom.parse,格式化html tag
                    value = this.parent.parse(value);
                }
                return value;
            };
            /**
             * 设置textarea中的内容（html代码）
             */
            Textarea.prototype.setValue = function (html, parse) {
                if (parse !== false) {
                    html = this.parent.parse(html);
                }
                this.element.value = html;
            };
            Textarea.prototype.cleanUp = function (rules) {
                var html = this.parent.parse(this.element.value, undefined, rules);
                this.element.value = html;
            };
            Textarea.prototype.hasPlaceholderSet = function () {
                var supportsPlaceholder = su.browser.supportsPlaceholderAttributeOn(this.element), placeholderText = this.element.getAttribute("placeholder") || null, value = this.element.value, isEmpty = !value;
                // 两种清空内容为空但有placeholder属性，或有值但和placeholder相同
                return (supportsPlaceholder && isEmpty) || (value === placeholderText);
            };
            Textarea.prototype.isEmpty = function () {
                return !su.lang.string(this.element.value).trim() || this.hasPlaceholderSet();
            };
            Textarea.prototype._observe = function () {
                var element = this.element, parent = this.parent, eventMapping = {
                    focusin: "focus",
                    focusout: "blur"
                }, 
                /**
                 * Calling focus() or blur() on an element doesn't synchronously trigger the attached focus/blur events
                 * This is the case for focusin and focusout, so let's use them whenever possible, kkthxbai
                 */
                events = su.browser.supportsEvent("focusin") ? ["focusin", "focusout", "change"] : ["focus", "blur", "change"];
                parent.on("beforeload", function () {
                    su.dom.observe(element, events, function (event) {
                        var eventName = eventMapping[event.type] || event.type;
                        parent.fire(eventName).fire(eventName + ":textarea");
                    });
                    su.dom.observe(element, ["paste", "drop"], function () {
                        setTimeout(function () { parent.fire("paste").fire("paste:textarea"); }, 0);
                    });
                });
            };
            return Textarea;
        }(views.View));
        views.Textarea = Textarea;
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
