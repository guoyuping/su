/// <reference path="./lang/array.ts" />
/// <reference path="./lang/dispatcher.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./browser.ts" />
/// <reference path="./views/sourceview.ts" />
/// <reference path="./views/synchronizer.ts" />
/// <reference path="./dom/parse.ts" />
/// <reference path="./dom/class.ts" />
var su;
(function (su) {
    /**
     * WYSIHTML Editor
     *
     * @param {Element} editableElement Reference to the textarea which should be turned into a rich text interface
     * @param {Object} [config] See defaults object below for explanation of each individual config option
     *
     * @events
     *    load
     *    beforeload (for internal use only)
     *    focus
     *    focus:composer
     *    focus:textarea
     *    blur
     *    blur:composer
     *    blur:textarea
     *    change
     *    change:composer
     *    change:textarea
     *    paste
     *    paste:composer
     *    paste:textarea
     *    newword:composer
     *    destroy:composer
     *    undo:composer
     *    redo:composer
     *    beforecommand:composer
     *    aftercommand:composer
     *    enable:composer
     *    disable:composer
     *    change_view
     */
    var undef;
    var Editor = (function (_super) {
        __extends(Editor, _super);
        function Editor(editableElement, config) {
            var _this = this;
            _super.call(this);
            this.defaults = {
                // Give the editor a name, the name will also be set as class name on the iframe and on the iframe's body
                name: undef,
                // Whether the editor should look like the textarea (by adopting styles)
                style: true,
                // Whether urls, entered by the user should automatically become clickable-links
                autoLink: true,
                // Tab key inserts tab into text as default behaviour. It can be disabled to regain keyboard navigation
                handleTabKey: true,
                // Object which includes parser rules to apply when html gets cleaned
                // See parser_rules/*.js for examples
                parserRules: { tags: { br: {}, span: {}, div: {}, p: {}, b: {}, i: {}, u: {} }, classes: {} },
                // Object which includes parser when the user inserts content via copy & paste. If null parserRules will be used instead
                pasteParserRulesets: null,
                // Parser method to use when the user inserts content
                parser: su.dom.parse,
                // By default wysihtml will insert a <br> for line breaks, set this to false to use <p>
                useLineBreaks: true,
                // Double enter (enter on blank line) exits block element in useLineBreaks mode.
                // It enables a way of escaping out of block elements and splitting block elements
                doubleLineBreakEscapesBlock: true,
                // Array (or single string) of stylesheet urls to be loaded in the editor's iframe
                stylesheets: [],
                // Placeholder text to use, defaults to the placeholder attribute on the textarea element
                placeholderText: undef,
                // Whether the rich text editor should be rendered on touch devices (wysihtml >= 0.3.0 comes with basic support for iOS 5)
                supportTouchDevices: true,
                // Whether senseless <span> elements (empty or without attributes) should be removed/replaced with their content
                cleanUp: true,
                // Whether to use div instead of secure iframe
                contentEditableMode: false,
                classNames: {
                    // Class name which should be set on the contentEditable element in the created sandbox iframe, can be styled via the 'stylesheets' option
                    composer: "wysihtml-editor",
                    // Class name to add to the body when the wysihtml editor is supported
                    body: "wysihtml-supported",
                    // classname added to editable area element (iframe/div) on creation
                    sandbox: "wysihtml-sandbox",
                    // class on editable area with placeholder
                    placeholder: "wysihtml-placeholder",
                    // Classname of container that editor should not touch and pass through
                    uneditableContainer: "wysihtml-uneditable-container"
                },
                // Browsers that support copied source handling will get a marking of the origin of the copied source (for determinig code cleanup rules on paste)
                // Also copied source is based directly on selection - 
                // (very useful for webkit based browsers where copy will otherwise contain a lot of code and styles based on whatever and not actually in selection).
                // If falsy value is passed source override is also disabled
                copyedFromMarking: '<meta name="copied-from" content="wysihtml">'
            };
            console.log("editor constructor:\r\n");
            //编辑器html元素
            this.editableElement = typeof (editableElement) === "string" ? document.getElementById(editableElement) : editableElement;
            // 合并config  
            this.config = su.lang.object({}).merge(this.defaults).merge(config).get();
            // 浏览器是否支持contentEditable
            this._isCompatible = su.browser.supported();
            // merge classNames
            if (config && config.classNames) {
                su.lang.object(this.config.classNames).merge(config.classNames);
            }
            // 是否时textarea
            if (this.editableElement.nodeName.toLowerCase() != "textarea") {
                this.config.contentEditableMode = true;
                this.config.noTextarea = true;
            }
            // 如果editableElement是textarea，把textarea作为当前显示方式
            if (!this.config.noTextarea) {
                this.textarea = new su.views.Textarea(this, this.editableElement, this.config);
                this.currentView = this.textarea;
            }
            // 过滤掉不支持和不想要的浏览器
            if (!this._isCompatible || (!this.config.supportTouchDevices && su.browser.isTouchDevice())) {
                setTimeout(function () { _this.fire("beforeload").fire("load"); }, 0);
                return;
            }
            // Add class name to body, to indicate that the editor is supported
            su.dom.addClass(document.body, this.config.classNames.body);
            this.composer = new su.views.Composer(this, this.editableElement, this.config);
            this.currentView = this.composer;
            // 格式化标签
            // if (typeof (this.config.parser) === "function") {
            //     this._initParser();
            // }
            this.on("beforeload", this.handleBeforeLoad);
        }
        Editor.prototype.handleBeforeLoad = function () {
            if (!this.config.noTextarea) {
                this.synchronizer = new su.views.Synchronizer(this, this.textarea, this.composer);
            }
            else {
                this.sourceView = new su.views.SourceView(this, this.composer);
            }
            this.runEditorExtenders();
        };
        Editor.prototype.runEditorExtenders = function () {
            su.editorExtenders.forEach(function (extender) {
                extender(this);
            }.bind(this));
        };
        return Editor;
    }(su.lang.Dispatcher));
    su.Editor = Editor;
})(su || (su = {}));
