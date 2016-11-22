/// <reference path="../su.ts" />
/// <reference path="../lang/object.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        var doc = document;
        /**
         * 1.如果contentEditable存在，如果contentEditable不存在，则创建一个div
         * 2.将config的className添加其上，如果className不存在默认值是“wysihtml-sandbox”
         * 3.执行readyCallback函数，此函数返回创建的ContentEditableArea对象
         * @example
         * new ContentEditableArea(function(){
         *      element = this.element; //this 为ContentEditableArea对象
         *      console.log("Result："+element.className)
         * },{className:"test-class"});
         *
         * //执行结果：Result：test-class
         */
        var ContentEditableArea = (function () {
            function ContentEditableArea(readyCallback, config, contentEditable) {
                if (contentEditable === void 0) { contentEditable = null; }
                this.loaded = false;
                this.callback = readyCallback || su.EMPTY_FUNCTION;
                this.config = su.lang.object({}).merge(config).get();
                if (!this.config.className) {
                    this.config.className = "wysihtml-sandbox";
                }
                if (contentEditable) {
                    this.element = this._bindElement(contentEditable);
                }
                else {
                    this.element = this._createElement();
                }
            }
            ContentEditableArea.prototype.getContentEditable = function () {
                return this.element;
            };
            ContentEditableArea.prototype.getWindow = function () {
                return this.element.ownerDocument.defaultView || this.element.ownerDocument.parentWindow;
            };
            ContentEditableArea.prototype.getDocument = function () {
                return this.element.ownerDocument;
            };
            ContentEditableArea.prototype.destroy = function () {
            };
            // creates a new contenteditable and initiates it
            ContentEditableArea.prototype._createElement = function () {
                var element = doc.createElement("div");
                element.className = this.config.className;
                this._loadElement(element);
                return element;
            };
            // initiates an allready existent contenteditable
            ContentEditableArea.prototype._bindElement = function (contentEditable) {
                contentEditable.className = contentEditable.className ? contentEditable.className + " wysihtml-sandbox" : "wysihtml-sandbox";
                this._loadElement(contentEditable, true);
                return contentEditable;
            };
            ContentEditableArea.prototype._loadElement = function (element, contentExists) {
                var _this = this;
                if (!contentExists) {
                    var innerHtml = this._getHtml();
                    element.innerHTML = innerHtml;
                }
                this.loaded = true;
                // Trigger the callback
                setTimeout(function () { _this.callback(_this); }, 0);
            };
            ContentEditableArea.prototype._getHtml = function (templateVars) {
                return '';
            };
            return ContentEditableArea;
        }());
        dom.ContentEditableArea = ContentEditableArea;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
