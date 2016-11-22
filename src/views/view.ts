module su.views {
    export class View {
        name: "textarea"|"composer";
        parent;//必须是Dispatcher或其扩展类
        element: HTMLElement;
        config: any = {};
        constructor(parent, textareaElement: HTMLElement, config) {
          
            this.parent = parent;
            this.element = textareaElement;
            this.config = config;
            if (!this.config.noTextarea) {//如果是textarea
                this._observeViewChange();
            }
        }
        /**
         * 绑定beforeload、change_view事件到editor上
         */
        _observeViewChange() {
            //var that = this;
            // 绑定beforeload事件的方法
            this.parent.on("beforeload", () => {
                // 绑定change_view事件的方法
                this.parent.on("change_view", (view) => {
                    if (view === this.name) {
                        this.parent.currentView = this;
                        this.show();
                        // Using tiny delay here to make sure that the placeholder is set before focusing
                        setTimeout(function () { this.focus(); }, 0);
                    } else {
                        this.hide();
                    }
                });
            });
        }
        hide() {
            this.element.style.display = "none";
        }

        show() {
            this.element.style.display = "";
        }
        focus(setToEnd?) {
            if (this.element
                // ownerDocument 属性以 Document 对象的形式返回节点的 owner document
                && this.element.ownerDocument
                // querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素
                && this.element.ownerDocument.querySelector(":focus") === this.element
            ) { // 如果已经焦点元素
                return;
            }
            // 否则聚焦到element
            try { if (this.element) { this.element.focus(); } } catch (e) { }
        }
        disable() {
            this.element.setAttribute("disabled", "disabled");
        }
        enable() {
            this.element.removeAttribute("disabled");
        }
    }
    /**
     * TODO: the following methods still need unit test coverage
     */
}