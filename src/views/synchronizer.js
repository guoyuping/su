/// <reference path="./textarea.ts" />
/// <reference path="../lang/string.ts" />
/// <reference path="./composer.ts" />
var su;
(function (su) {
    var views;
    (function (views) {
        /**
         * 同步器
         * 让textarea和composer的内容同步，并在提交form的时候保证textarea里内容和composer内的一致
         * 初始化后每400毫秒同步一次
         */
        var Synchronizer = (function () {
            function Synchronizer(editor, textarea, composer) {
                this.INTERVAL = 400;
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
            Synchronizer.prototype.fromComposerToTextarea = function (shouldParseHtml) {
                this.textarea.setValue(su.lang.string(this.composer.getValue(false, false)).trim(), shouldParseHtml);
            };
            /**
             * 将textarea内的html代码copy到composer里
             * Sync value of textarea to composer
             * Takes care of placeholders
             * @param {Boolean} shouldParseHtml Whether the html should be sanitized before inserting it into the composer
             */
            Synchronizer.prototype.fromTextareaToComposer = function (shouldParseHtml) {
                var textareaValue = this.textarea.getValue(false);
                if (textareaValue) {
                    this.composer.setValue(textareaValue, shouldParseHtml);
                }
                else {
                    this.composer.clear();
                    this.editor.fire("set_placeholder");
                }
            };
            /**
             * 同步
             * 根据editor的currentView是textarea还是composer来决定
             * 调用fromTextareaToComposer或fromComposerToTextarea
             * Invoke syncing based on view state
             * @param {Boolean} shouldParseHtml Whether the html should be sanitized before inserting it into the composer/textarea
             */
            Synchronizer.prototype.sync = function (shouldParseHtml) {
                if (this.editor.currentView.name === "textarea") {
                    this.fromTextareaToComposer(shouldParseHtml);
                }
                else {
                    this.fromComposerToTextarea(shouldParseHtml);
                }
            };
            /**
             * Initializes interval-based syncing
             * also makes sure that on-submit the composer's content is synced with the textarea
             * immediately when the form gets submitted
             */
            Synchronizer.prototype._observe = function () {
                var _this = this;
                var interval, 
                //that = this,
                form = this.textarea.element.form, startInterval = function () {
                    interval = setInterval(function () { _this.fromComposerToTextarea(); }, _this.INTERVAL);
                }, stopInterval = function () {
                    clearInterval(interval);
                    interval = null;
                };
                startInterval();
                if (form) {
                    // If the textarea is in a form make sure that after onreset and onsubmit the composer
                    // has the correct state
                    su.dom.observe(form, "submit", function () {
                        _this.sync(true);
                    });
                    su.dom.observe(form, "reset", function () {
                        setTimeout(function () { _this.fromTextareaToComposer(); }, 0);
                    });
                }
                this.editor.on("change_view", function (view) {
                    if (view === "composer" && !interval) {
                        _this.fromTextareaToComposer(true);
                        startInterval();
                    }
                    else if (view === "textarea") {
                        _this.fromComposerToTextarea(true);
                        stopInterval();
                    }
                });
                this.editor.on("destroy:composer", stopInterval);
            };
            return Synchronizer;
        }());
        views.Synchronizer = Synchronizer;
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
