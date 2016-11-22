/// <reference path="../dom/attribute.ts" />
/// <reference path="../dom/styles.ts" />
/// <reference path="../lib/rangy.d.ts" />
/// <reference path="../dom/text_content.ts" />
/// <reference path="../dom/contenteditable_area.ts" />
/// <reference path="../quirks/ensure_proper_clearing.ts" />
/// <reference path="../dom/simulate_placeholder.ts" />
/// <reference path="../dom/class.ts" />
/// <reference path="../dom/insert.ts" />
/// <reference path="../views/view.ts" />
/// <reference path="../quirks/get_correct_inner_html.ts" />
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
         * 设计器
         */
        var Composer = (function (_super) {
            __extends(Composer, _super);
            function Composer(parent, editableElement, config) {
                _super.call(this, parent, editableElement, config);
                this.name = "composer";
                /**
                 * Editor中设置
                 *
                 */
                if (!this.config.noTextarea) {
                    this.textarea = this.parent.textarea;
                }
                else {
                    this.editableArea = editableElement;
                }
                if (this.config.contentEditableMode) {
                    this._initContentEditableArea();
                }
                else {
                }
            }
            /**
             * 将composer的element中html代码清空
             */
            Composer.prototype.clear = function () {
                //this.element = editableElement
                this.element.innerHTML = su.browser.displaysCaretInEmptyContentEditableCorrectly() ? "" : "<br>";
            };
            /**
             * 获取composer里 this.element的html代码
             */
            Composer.prototype.getValue = function (parse, clearInternals) {
                var value = this.isEmpty() ? "" : su.quirks.getCorrectInnerHTML(this.element);
                if (parse !== false) {
                    value = this.parent.parse(value, (clearInternals === false) ? false : true);
                }
                return value;
            };
            /**
             * 将html添加到composer的this.element里
             */
            Composer.prototype.setValue = function (html, parse) {
                if (parse !== false) {
                    html = this.parent.parse(html);
                }
                try {
                    this.element.innerHTML = html;
                }
                catch (e) {
                    this.element.innerText = html;
                }
            };
            Composer.prototype.cleanUp = function (rules) {
                var bookmark;
                if (this.selection && this.selection.isInThisEditable()) {
                    bookmark = rangy.saveSelection(this.win);
                }
                this.parent.parse(this.element, undefined, rules);
                if (bookmark) {
                    rangy.restoreSelection(bookmark);
                }
            };
            Composer.prototype.show = function () {
                this.editableArea.style.display = this._displayStyle || "";
                if (!this.config.noTextarea && !this.textarea.element.disabled) {
                    // Firefox needs this, otherwise contentEditable becomes uneditable
                    this.disable();
                    this.enable();
                }
            };
            Composer.prototype.hide = function () {
                this._displayStyle = su.dom.getStyle("display").from(this.editableArea);
                if (this._displayStyle === "none") {
                    this._displayStyle = null;
                }
                this.editableArea.style.display = "none";
            };
            Composer.prototype.disable = function () {
                this.parent.fire("disable:composer");
                this.element.removeAttribute("contentEditable");
            };
            Composer.prototype.enable = function () {
                this.parent.fire("enable:composer");
                this.element.setAttribute("contentEditable", "true");
            };
            /**
             * 重写函数
             */
            Composer.prototype.focus = function (setToEnd) {
                // IE 8 fires the focus event after .focus()
                // This is needed by our simulate_placeholder.js to work
                // therefore we clear it ourselves this time
                if (su.browser.doesAsyncFocus() && this.hasPlaceholderSet()) {
                    this.clear();
                }
                //this.base();
                _super.prototype.focus.call(this, setToEnd);
                var lastChild = this.element.lastChild;
                if (setToEnd && lastChild && this.selection) {
                    if (lastChild.nodeName === "BR") {
                        this.selection.setBefore(this.element.lastChild);
                    }
                    else {
                        this.selection.setAfter(this.element.lastChild);
                    }
                }
            };
            Composer.prototype.getScrollPos = function () {
                if (this.doc && this.win) {
                    var pos = {};
                    if (typeof this.win.pageYOffset !== "undefined") {
                        pos.y = this.win.pageYOffset;
                    }
                    else {
                        pos.y = (this.doc.documentElement || this.doc.body.parentNode || this.doc.body).scrollTop;
                    }
                    if (typeof this.win.pageXOffset !== "undefined") {
                        pos.x = this.win.pageXOffset;
                    }
                    else {
                        pos.x = (this.doc.documentElement || this.doc.body.parentNode || this.doc.body).scrollLeft;
                    }
                    return pos;
                }
            };
            Composer.prototype.setScrollPos = function (pos) {
                if (pos && typeof pos.x !== "undefined" && typeof pos.y !== "undefined") {
                    this.win.scrollTo(pos.x, pos.y);
                }
            };
            Composer.prototype.getTextContent = function () {
                return su.dom.getTextContent(this.element);
            };
            Composer.prototype.hasPlaceholderSet = function () {
                return this.getTextContent() == ((this.config.noTextarea) ? this.editableArea.getAttribute("data-placeholder") : this.textarea.element.getAttribute("placeholder")) && this.placeholderSet;
            };
            /**
             * 如果只有<p></p>、<br>等也为空，为placeholder也为空
             */
            Composer.prototype.isEmpty = function () {
                var innerHTML = this.element.innerHTML.toLowerCase();
                return (/^(\s|<br>|<\/br>|<p>|<\/p>)*$/i).test(innerHTML) ||
                    innerHTML === "" ||
                    innerHTML === "<br>" ||
                    innerHTML === "<p></p>" ||
                    innerHTML === "<p><br></p>" ||
                    this.hasPlaceholderSet();
            };
            Composer.prototype._initContentEditableArea = function () {
                var that = this;
                if (this.config.noTextarea) {
                    this.sandbox = new su.dom.ContentEditableArea(function () {
                        that._create();
                    }, {
                        className: this.config.classNames.sandbox
                    }, this.editableArea);
                }
                else {
                    this.sandbox = new su.dom.ContentEditableArea(function () {
                        that._create();
                    }, {
                        className: this.config.classNames.sandbox
                    });
                    this.editableArea = this.sandbox.getContentEditable();
                    su.dom.insert(this.editableArea).after(this.textarea.element);
                    this._createWysiwygFormField();
                }
            };
            // _initSandbox() {
            //     this.sandbox = new su.dom.Sandbox(()=> {
            //         this._create();
            //     }, {
            //             stylesheets: this.config.stylesheets,
            //             className: this.config.classNames.sandbox
            //         });
            //     this.editableArea = this.sandbox.getIframe();
            //     var textareaElement = this.textarea.element;
            //     su.dom.insert(this.editableArea).after(textareaElement);
            //     this._createWysiwygFormField();
            // }
            // Creates hidden field which tells the server after submit, that the user used an wysiwyg editor
            Composer.prototype._createWysiwygFormField = function () {
                if (this.textarea.element.form) {
                    var hiddenField = document.createElement("input");
                    hiddenField.type = "hidden";
                    hiddenField.name = "_wysihtml_mode";
                    hiddenField.value = 1;
                    su.dom.insert(hiddenField).after(this.textarea.element);
                }
            };
            Composer.prototype._create = function () {
                var that = this;
                this.doc = this.sandbox.getDocument();
                this.win = this.sandbox.getWindow();
                this.element = (this.config.contentEditableMode) ? this.sandbox.getContentEditable() : this.doc.body;
                if (!this.config.noTextarea) {
                    this.textarea = this.parent.textarea;
                    this.element.innerHTML = this.textarea.getValue(true, false);
                }
                else {
                    this.cleanUp(); // cleans contenteditable on initiation as it may contain html
                }
                // Make sure our selection handler is ready
                //this.selection = new su.Selection(this.parent, this.element, this.config.classNames.uneditableContainer);
                // Make sure commands dispatcher is ready
                //this.commands = new su.Commands(this.parent);
                if (!this.config.noTextarea) {
                    su.dom.copyAttributes([
                        "className", "spellcheck", "title", "lang", "dir", "accessKey"
                    ]).from(this.textarea.element).to(this.element);
                }
                this._initAutoLinking();
                su.dom.addClass(this.element, this.config.classNames.composer);
                //
                // Make the editor look like the original textarea, by syncing styles
                if (this.config.style && !this.config.contentEditableMode) {
                    this.style();
                }
                this.observe();
                var name = this.config.name;
                if (name) {
                    su.dom.addClass(this.element, name);
                    if (!this.config.contentEditableMode) {
                        su.dom.addClass(this.editableArea, name);
                    }
                }
                this.enable();
                if (!this.config.noTextarea && this.textarea.element.disabled) {
                    this.disable();
                }
                // Simulate html5 placeholder attribute on contentEditable element
                var placeholderText = typeof (this.config.placeholder) === "string"
                    ? this.config.placeholder
                    : ((this.config.noTextarea) ? this.editableArea.getAttribute("data-placeholder") : this.textarea.element.getAttribute("placeholder"));
                if (placeholderText) {
                    su.dom.simulatePlaceholder(this.parent, this, placeholderText, this.config.classNames.placeholder);
                }
                // Make sure that the browser avoids using inline styles whenever possible
                this.commands.exec("styleWithCSS", false);
                // this._initObjectResizing();
                // this._initUndoManager();
                // this._initLineBreaking();
                // Simulate html5 autofocus on contentEditable element
                // This doesn't work on IOS (5.1.1)
                if (!this.config.noTextarea && (this.textarea.element.hasAttribute("autofocus") || document.querySelector(":focus") == this.textarea.element) && !su.browser.isIos()) {
                    setTimeout(function () { that.focus(true); }, 100);
                }
                // IE sometimes leaves a single paragraph, which can't be removed by the user
                if (!su.browser.clearsContentEditableCorrectly()) {
                    su.quirks.ensureProperClearing(this);
                }
                // Set up a sync that makes sure that textarea and editor have the same content
                if (this.initSync && this.config.sync) {
                    this.initSync();
                }
                // Okay hide the textarea, we are ready to go
                if (!this.config.noTextarea) {
                    this.textarea.hide();
                }
                // Fire global (before-)load event
                this.parent.fire("beforeload").fire("load");
            };
            Composer.prototype._initAutoLinking = function () {
                var that = this, supportsDisablingOfAutoLinking = su.browser.canDisableAutoLinking(), supportsAutoLinking = su.browser.doesAutoLinkingInContentEditable();
                if (supportsDisablingOfAutoLinking) {
                    this.commands.exec("AutoUrlDetect", false /*, false*/);
                }
                if (!this.config.autoLink) {
                    return;
                }
                //     // Only do the auto linking by ourselves when the browser doesn't support auto linking
                //     // OR when he supports auto linking but we were able to turn it off (IE9+)
                //     if (!supportsAutoLinking || (supportsAutoLinking && supportsDisablingOfAutoLinking)) {
                //         this.parent.on("newword:composer", function () {
                //             if (su.dom.getTextContent(that.element).match(su.dom.URL_REG_EXP)) {
                //                 var nodeWithSelection = that.selection.getSelectedNode(),
                //                     uneditables = that.element.querySelectorAll("." + that.config.classNames.uneditableContainer),
                //                     isInUneditable = false;
                //                 for (var i = uneditables.length; i--;) {
                //                     if (su.dom.contains(uneditables[i], nodeWithSelection)) {
                //                         isInUneditable = true;
                //                     }
                //                 }
                //                 if (!isInUneditable) su.dom.autoLink(nodeWithSelection, [that.config.classNames.uneditableContainer]);
                //             }
                //         });
                //         su.dom.observe(this.element, "blur", function () {
                //             su.dom.autoLink(that.element, [that.config.classNames.uneditableContainer]);
                //         });
                //     }
                //     // Assuming we have the following:
                //     //  <a href="http://www.google.de">http://www.google.de</a>
                //     // If a user now changes the url in the innerHTML we want to make sure that
                //     // it's synchronized with the href attribute (as long as the innerHTML is still a url)
                //     var // Use a live NodeList to check whether there are any links in the document
                //         links = this.sandbox.getDocument().getElementsByTagName("a"),
                //         // The autoLink helper method reveals a reg exp to detect correct urls
                //         urlRegExp = su.dom.URL_REG_EXP,
                //         getTextContent = function (element) {
                //             var textContent = lang.string(su.dom.getTextContent(element)).trim();
                //             if (textContent.substr(0, 4) === "www.") {
                //                 textContent = "http://" + textContent;
                //             }
                //             return textContent;
                //         };
                //     su.dom.observe(this.element, "keydown", function (event) {
                //         if (!links.length) {
                //             return;
                //         }
                //         var selectedNode = that.selection.getSelectedNode((event.target as Node).ownerDocument),
                //             link = su.dom.getParentElement(selectedNode, { query: "a" }, 4),
                //             textContent;
                //         if (!link) {
                //             return;
                //         }
                //         textContent = getTextContent(link);
                //         // keydown is fired before the actual content is changed
                //         // therefore we set a timeout to change the href
                //         setTimeout(function () {
                //             var newTextContent = getTextContent(link);
                //             if (newTextContent === textContent) {
                //                 return;
                //             }
                //             // Only set href when new href looks like a valid url
                //             if (newTextContent.match(urlRegExp)) {
                //                 link.setAttribute("href", newTextContent);
                //             }
                //         }, 0);
                //     });
                // }
                // _initObjectResizing() {
                //     this.commands.exec("enableObjectResizing", true);
                //     // IE sets inline styles after resizing objects
                //     // The following lines make sure that the width/height css properties
                //     // are copied over to the width/height attributes
                //     if (browser.supportsEvent("resizeend")) {
                //         var properties = ["width", "height"],
                //             propertiesLength = properties.length,
                //             element = this.element;
                //         su.dom.observe(element, "resizeend", function (event) {
                //             var target = <HTMLElement>(event.target || event.srcElement),
                //                 style = target.style,
                //                 i = 0,
                //                 property;
                //             if (target.nodeName !== "IMG") {
                //                 return;
                //             }
                //             for (; i < propertiesLength; i++) {
                //                 property = properties[i];
                //                 if (style[property]) {
                //                     target.setAttribute(property, parseInt(style[property], 10).toString());
                //                     style[property] = "";
                //                 }
                //             }
                //             // After resizing IE sometimes forgets to remove the old resize handles
                //             quirks.redraw(element);
                //         });
                //     }
                // }
                // _initUndoManager() {
                //     this.undoManager = new su.UndoManager(this.parent);
                // }
                // _initLineBreaking() {
                //     var that = this,
                //         USE_NATIVE_LINE_BREAK_INSIDE_TAGS = "li, p, h1, h2, h3, h4, h5, h6",
                //         LIST_TAGS = "ul, ol, menu";
                //     function adjust(selectedNode) {
                //         var parentElement = su.dom.getParentElement(selectedNode, { query: "p, div" }, 2);
                //         if (parentElement && su.dom.contains(that.element, parentElement)) {
                //             that.selection.executeAndRestoreRangy(function () {
                //                 if (that.config.useLineBreaks) {
                //                     if (!parentElement.firstChild || (parentElement.firstChild === parentElement.lastChild && parentElement.firstChild.nodeType === 1 && parentElement.firstChild.classList.contains('rangySelectionBoundary'))) {
                //                         parentElement.appendChild(that.doc.createElement('br'));
                //                     }
                //                     su.dom.replaceWithChildNodes(parentElement);
                //                 } else if (parentElement.nodeName !== "P") {
                //                     su.dom.renameElement(parentElement, "p");
                //                 }
                //             });
                //         }
                //     }
                //     // Ensures when editor is empty and not line breaks mode, the inital state has a paragraph in it on focus with caret inside paragraph
                //     if (!this.config.useLineBreaks) {
                //         su.dom.observe(this.element, ["focus"], function () {
                //             if (that.isEmpty()) {
                //                 setTimeout(function () {
                //                     var paragraph = that.doc.createElement("P");
                //                     that.element.innerHTML = "";
                //                     that.element.appendChild(paragraph);
                //                     if (!browser.displaysCaretInEmptyContentEditableCorrectly()) {
                //                         paragraph.innerHTML = "<br>";
                //                         that.selection.setBefore(paragraph.firstChild);
                //                     } else {
                //                         that.selection.selectNode(paragraph, true);
                //                     }
                //                 }, 0);
                //             }
                //         });
                //     }
                //     su.dom.observe(this.element, "keydown", function (event: KeyboardEvent) {
                //         var keyCode = event.keyCode;
                //         if (event.shiftKey || event.ctrlKey || event.defaultPrevented) {
                //             return;
                //         }
                //         if (keyCode !== su.ENTER_KEY && keyCode !== su.BACKSPACE_KEY) {
                //             return;
                //         }
                //         var blockElement = su.dom.getParentElement(that.selection.getSelectedNode(), { query: USE_NATIVE_LINE_BREAK_INSIDE_TAGS }, 4);
                //         if (blockElement) {
                //             setTimeout(function () {
                //                 // Unwrap paragraph after leaving a list or a H1-6
                //                 var selectedNode = that.selection.getSelectedNode(),
                //                     list;
                //                 if (blockElement.nodeName === "LI") {
                //                     if (!selectedNode) {
                //                         return;
                //                     }
                //                     list = su.dom.getParentElement(selectedNode, { query: LIST_TAGS }, 2);
                //                     if (!list) {
                //                         adjust(selectedNode);
                //                     }
                //                 }
                //                 if (keyCode === su.ENTER_KEY && blockElement.nodeName.match(/^H[1-6]$/)) {
                //                     adjust(selectedNode);
                //                 }
                //             }, 0);
                //             return;
                //         }
                //         if (that.config.useLineBreaks && keyCode === su.ENTER_KEY && !browser.insertsLineBreaksOnReturn()) {
                //             event.preventDefault();
                //             that.commands.exec("insertLineBreak");
                //         }
                //     });
                // }
            };
            return Composer;
        }(views.View));
        views.Composer = Composer;
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
