/// <reference path="./view.ts" />
/// <reference path="../browser.ts" />
/// <reference path="../lang/string.ts" />
/// <reference path="../dom/observe.ts" />

module su.views {
    /**
     * 
     */
    export class Textarea extends views.View {
        name: "textarea" | "composer" = "textarea";
        element: HTMLTextAreaElement;
        parent;
        constructor(parent, textareaElement: HTMLElement, config) {
            super(parent, textareaElement, config);
            this._observe();
        }
        clear() {
            this.element.value = "";
        }
        /**
         * 获取textarea中的内容（html代码）
         */
        getValue(parse: boolean) {
            var value = this.isEmpty() ? "" : this.element.value;
            if (parse !== false) {//是否格式化内容
                // parse方法Editor类中定义
                // Editor调用dom.parse,格式化html tag
                value = this.parent.parse(value);
            }
            return value;
        }
        /**
         * 设置textarea中的内容（html代码）
         */
        setValue(html: string, parse: boolean) {
            if (parse !== false) {
                html = this.parent.parse(html);
            }
            this.element.value = html;
        }

        cleanUp(rules) {
            var html = this.parent.parse(this.element.value, undefined, rules);
            this.element.value = html;
        }
        hasPlaceholderSet() {
            var supportsPlaceholder = browser.supportsPlaceholderAttributeOn(this.element),
                placeholderText = this.element.getAttribute("placeholder") || null,
                value = this.element.value,
                isEmpty = !value;
            // 两种清空内容为空但有placeholder属性，或有值但和placeholder相同
            return (supportsPlaceholder && isEmpty) || (value === placeholderText);
        }
        isEmpty() {
            return !lang.string(this.element.value).trim() || this.hasPlaceholderSet();
        }

        _observe() {
            var element = this.element,
                parent = this.parent,
                eventMapping = {
                    focusin: "focus",
                    focusout: "blur"
                },
            /**
             * Calling focus() or blur() on an element doesn't synchronously trigger the attached focus/blur events
             * This is the case for focusin and focusout, so let's use them whenever possible, kkthxbai
             */
            events = browser.supportsEvent("focusin") ? ["focusin", "focusout", "change"] : ["focus", "blur", "change"];

            parent.on("beforeload", function () {
                dom.observe(element, events, function (event) {
                    var eventName = eventMapping[event.type] || event.type;
                    parent.fire(eventName).fire(eventName + ":textarea");
                });

                dom.observe(element, ["paste", "drop"], function () {
                    setTimeout(function () { parent.fire("paste").fire("paste:textarea"); }, 0);
                });
            });
        }
    }
}