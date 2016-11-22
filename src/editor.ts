/// <reference path="./lang/array.ts" />
/// <reference path="./lang/dispatcher.ts" />

/// <reference path="./browser.ts" />

/// <reference path="./views/sourceview.ts" />
/// <reference path="./views/synchronizer.ts" />
/// <reference path="./dom/parse.ts" />
/// <reference path="./dom/class.ts" />

namespace su {
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

    export class Editor extends lang.Dispatcher {
        editableElement: HTMLElement;
        config;
        _isCompatible;
        textarea;
        currentView;
        composer: views.Composer;
        synchronizer;
        sourceView;
        defaults = {
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
            parser: dom.parse,
            // By default wysihtml will insert a <br> for line breaks, set this to false to use <p>
            useLineBreaks: false,
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
            contentEditableMode: true,
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

        }

        constructor(editableElement, config?) {
            super();
            console.log("editor constructor:\r\n");
            //编辑器html元素
            this.editableElement = typeof (editableElement) === "string" ? document.getElementById(editableElement) : editableElement;
            // 合并config  
            this.config = su.lang.object({}).merge(this.defaults).merge(config).get();
            // 浏览器是否支持contentEditable
            this._isCompatible = browser.supported();

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
                this.textarea = new views.Textarea(this, this.editableElement, this.config);
                this.currentView = this.textarea;
            }

            // 过滤掉不支持和不想要的浏览器
            if (!this._isCompatible || (!this.config.supportTouchDevices && browser.isTouchDevice())) {
                setTimeout(() => { this.fire("beforeload").fire("load"); }, 0);
                return;
            }

            // Add class name to body, to indicate that the editor is supported
            dom.addClass(document.body, this.config.classNames.body);

            this.composer = new views.Composer(this, this.editableElement, this.config);
            this.currentView = this.composer;

            // 格式化标签
            // if (typeof (this.config.parser) === "function") {
            //     this._initParser();
            // }

            this.on("beforeload", this.handleBeforeLoad);

        }

        handleBeforeLoad() {
            if (!this.config.noTextarea) {
                this.synchronizer = new su.views.Synchronizer(this, this.textarea, this.composer);
            } else {
               
                this.sourceView = new su.views.SourceView(this, this.composer);
            }
            this.runEditorExtenders();
        }

        runEditorExtenders() {
            su.editorExtenders.forEach(function (extender) {
                extender(this);
            }.bind(this));
        }

        isCompatible() {
            return this._isCompatible;
        }
        clear() {
            this.currentView.clear();
            return this;
        }

        getValue(parse, clearInternals) {
            return this.currentView.getValue(parse, clearInternals);
        }

        setValue(html, parse) {
            this.fire("unset_placeholder");

            if (!html) {
                return this.clear();
            }

            this.currentView.setValue(html, parse);
            return this;
        }
        // cleanUp(rules) {
        //     this.currentView.cleanUp(rules);
        // }

        // focus(setToEnd) {
        //     this.currentView.focus(setToEnd);
        //     return this;
        // }

        // /**
        //  * Deactivate editor (make it readonly)
        //  */
        // disable() {
        //     this.currentView.disable();
        //     return this;
        // }

        // /**
        //  * Activate editor
        //  */
        // enable() {
        //     this.currentView.enable();
        //     return this;
        // }

        // isEmpty() {
        //     return this.currentView.isEmpty();
        // }

        // hasPlaceholderSet() {
        //     return this.currentView.hasPlaceholderSet();
        // }

        // destroy() {
        //     if (this.composer && this.composer.sandbox) {
        //         this.composer.sandbox.destroy();
        //     }
        //     this.fire("destroy:composer");
        //     this.off();
        // }

        parse(htmlOrElement, clearInternals?: boolean, customRules?) {
            var parseContext = (this.config.contentEditableMode) ? document : ((this.composer) ? this.composer.sandbox.getDocument() : null);
            var returnValue = this.config.parser(htmlOrElement, {
                "rules": customRules || this.config.parserRules,
                "cleanUp": this.config.cleanUp,
                "context": parseContext,
                "uneditableClass": this.config.classNames.uneditableContainer,
                "clearInternals": clearInternals
            });
            if (typeof (htmlOrElement) === "object") {
                quirks.redraw(htmlOrElement);
            }
            return returnValue;
        }
        // /**
        //  * Prepare html parser logic
        //  *  - Observes for paste and drop
        //  */
        // _initParser() {
        //     var oldHtml;

        //     if (browser.supportsModernPaste()) {
        //         this.on("paste:composer", function (event) {
        //             event.preventDefault();
        //             oldHtml = dom.getPastedHtml(event);
        //             if (oldHtml) {
        //                 this._cleanAndPaste(oldHtml);
        //             }
        //         }.bind(this));

        //     } else {
        //         this.on("beforepaste:composer", function (event) {
        //             event.preventDefault();
        //             var scrollPos = this.composer.getScrollPos();

        //             dom.getPastedHtmlWithDiv(this.composer, function (pastedHTML) {
        //                 if (pastedHTML) {
        //                     this._cleanAndPaste(pastedHTML);
        //                 }
        //                 this.composer.setScrollPos(scrollPos);
        //             }.bind(this));

        //         }.bind(this));
        //     }
        // }

        // _cleanAndPaste(oldHtml) {
        //     var cleanHtml = quirks.cleanPastedHTML(oldHtml, {
        //         "referenceNode": this.composer.element,
        //         "rules": this.config.pasteParserRulesets || [{ "set": this.config.parserRules }],
        //         "uneditableClass": this.config.classNames.uneditableContainer
        //     });
        //     this.composer.selection.deleteContents();
        //     this.composer.selection.insertHTML(cleanHtml);
        // }
    }
}