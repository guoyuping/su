/// <reference path="../su.ts" />
/// <reference path="../lang/object.ts" />

module su.dom {
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
    export class ContentEditableArea {
        callback;
        config: { className: string };
        element;
        loaded: boolean = false; 
        constructor(readyCallback: {}, config: {}, contentEditable:HTMLElement=null) {
            this.callback = readyCallback || su.EMPTY_FUNCTION;
            this.config = su.lang.object({}).merge(config).get();
            if (!this.config.className) {
                this.config.className = "wysihtml-sandbox";
            }
            if (contentEditable) {
                this.element = this._bindElement(contentEditable);
            } else {
                this.element = this._createElement();
            }
        }
        getContentEditable() {
            return this.element;
        }

        getWindow() {
            return this.element.ownerDocument.defaultView || this.element.ownerDocument.parentWindow;
        }

        getDocument() {
            return this.element.ownerDocument;
        }

        destroy() {

        }

        // creates a new contenteditable and initiates it
        _createElement() {
            var element = doc.createElement("div");
            element.className = this.config.className;
            this._loadElement(element);
            return element;
        }
        // initiates an allready existent contenteditable
        _bindElement(contentEditable?) {
            contentEditable.className = contentEditable.className ? contentEditable.className + " wysihtml-sandbox" : "wysihtml-sandbox";
            this._loadElement(contentEditable, true);
            return contentEditable;
        }

        _loadElement(element, contentExists?) {
            if (!contentExists) {
                var innerHtml = this._getHtml();
                element.innerHTML = innerHtml;
            }

            this.loaded = true;
            // Trigger the callback
            setTimeout(() => { this.callback(this); }, 0);
        }

        _getHtml(templateVars?: never) {
            return '';
        }

    }
}