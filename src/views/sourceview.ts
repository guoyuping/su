module su.views{
    /**
     * 根据change_view事件，确定显示textarea还是composer
     */
    export class SourceView {
        editor;
        composer;
        textarea: HTMLTextAreaElement;
        constructor(editor, composer) {
            this.editor = editor;
            this.composer = composer;

            this._observe();
        }
        /**
         * 显示textarea，隐藏composer
         */
        switchToTextarea(shouldParseHtml) {
            var composerStyles = this.composer.win.getComputedStyle(this.composer.element),
                width = parseFloat(composerStyles.width),
                height = Math.max(parseFloat(composerStyles.height), 100);

            if (!this.textarea) {
                this.textarea = this.composer.doc.createElement('textarea');
                this.textarea.className = "wysihtml-source-view";
            }
            this.textarea.style.width = width + 'px';
            this.textarea.style.height = height + 'px';
            this.textarea.value = this.editor.getValue(shouldParseHtml, true);
            this.composer.element.parentNode.insertBefore(this.textarea, this.composer.element);
            this.editor.currentView = "source";
            this.composer.element.style.display = 'none';
        }
        /**
         * 删除textarea显示composer
         */
        switchToComposer(shouldParseHtml) {
            var textareaValue = this.textarea.value;
            if (textareaValue) {
                this.composer.setValue(textareaValue, shouldParseHtml);
            } else {
                this.composer.clear();
                this.editor.fire("set_placeholder");
            }
            this.textarea.parentNode.removeChild(this.textarea);
            this.editor.currentView = this.composer;
            this.composer.element.style.display = '';
        }

        _observe() {
            this.editor.on("change_view", function (view) {
                if (view === "composer") {
                  
                    this.switchToComposer(true);
                } else if (view === "textarea") {
                    this.switchToTextarea(true);
                    
                }
            }.bind(this));
        }

    }
}