/// <reference path="./textarea.ts" />
/// <reference path="../lang/string.ts" />
/// <reference path="./composer.ts" />

module su.views{
    /**
     * 同步器
     * 让textarea和composer的内容同步，并在提交form的时候保证textarea里内容和composer内的一致
     * 初始化后每400毫秒同步一次
     */
    export class Synchronizer {
        editor;
        textarea: views.Textarea;
        composer: views.Composer;
        INTERVAL = 400;
        constructor(editor, textarea: views.Textarea, composer: views.Composer) {
            this.editor = editor;
            this.textarea = textarea;
            this.composer = composer;

            this._observe();
        }

        /**
         * 将composer内的html代码copy到textarea里
         * Sync html from composer to textarea
         * Takes care of placeholders
         * @param {Boolean} shouldParseHtml Whether the html should be sanitized before inserting it into the textarea
         */
        fromComposerToTextarea(shouldParseHtml?: boolean) {
            this.textarea.setValue(lang.string(this.composer.getValue(false, false)).trim(), shouldParseHtml);
        }

        /**
         * 将textarea内的html代码copy到composer里
         * Sync value of textarea to composer
         * Takes care of placeholders
         * @param {Boolean} shouldParseHtml Whether the html should be sanitized before inserting it into the composer
         */
        fromTextareaToComposer(shouldParseHtml?: boolean) {
            let textareaValue = this.textarea.getValue(false);
            if (textareaValue) {
                this.composer.setValue(textareaValue, shouldParseHtml);
            } else {
                this.composer.clear();
                this.editor.fire("set_placeholder");
            }
        }

        /**
         * 同步
         * 根据editor的currentView是textarea还是composer来决定
         * 调用fromTextareaToComposer或fromComposerToTextarea
         * Invoke syncing based on view state
         * @param {Boolean} shouldParseHtml Whether the html should be sanitized before inserting it into the composer/textarea
         */
        sync(shouldParseHtml: boolean) {
            if (this.editor.currentView.name === "textarea") {
                this.fromTextareaToComposer(shouldParseHtml);
            } else {
                this.fromComposerToTextarea(shouldParseHtml);
            }
        }

        /**
         * Initializes interval-based syncing
         * also makes sure that on-submit the composer's content is synced with the textarea
         * immediately when the form gets submitted
         */
        _observe() {
            var interval,
                //that = this,
                form = this.textarea.element.form,
                startInterval = () => {
                    interval = setInterval(() => { this.fromComposerToTextarea(); }, this.INTERVAL);
                },
                stopInterval = function () {
                    clearInterval(interval);
                    interval = null;
                };

            startInterval();

            if (form) {
                // If the textarea is in a form make sure that after onreset and onsubmit the composer
                // has the correct state
                dom.observe(form, "submit", () => {
                    this.sync(true);
                });
                dom.observe(form, "reset", () => {
                    setTimeout(() => { this.fromTextareaToComposer(); }, 0);
                });
            }

            this.editor.on("change_view", (view) => {
                if (view === "composer" && !interval) {
                    this.fromTextareaToComposer(true);
                    startInterval();
                } else if (view === "textarea") {
                    this.fromComposerToTextarea(true);
                    stopInterval();
                }
            });

            this.editor.on("destroy:composer", stopInterval);
        }
    }
}