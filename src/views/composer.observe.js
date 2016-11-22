/// <reference path="../browser.ts" />
/// <reference path="../su.ts" />
/// <reference path="../quirks/redraw.ts" />
/// <reference path="../dom/styles.ts" />
/// <reference path="../dom/get_parent_element.ts" />
/// <reference path="../dom/dom_node.ts" />
/// <reference path="./composer.ts" />
var su;
(function (su) {
    var views;
    (function (views) {
        var doc = document, win = window, HOST_TEMPLATE = doc.createElement("div"), 
        /**
         * Styles to copy from textarea to the composer element
         */
        TEXT_FORMATTING = [
            "background-color",
            "color", "cursor",
            "font-family", "font-size", "font-style", "font-variant", "font-weight",
            "line-height", "letter-spacing",
            "text-align", "text-decoration", "text-indent", "text-rendering",
            "word-break", "word-wrap", "word-spacing"
        ], 
        /**
         * Styles to copy from textarea to the iframe
         */
        BOX_FORMATTING = [
            "background-color",
            "border-collapse",
            "border-bottom-color", "border-bottom-style", "border-bottom-width",
            "border-left-color", "border-left-style", "border-left-width",
            "border-right-color", "border-right-style", "border-right-width",
            "border-top-color", "border-top-style", "border-top-width",
            "clear", "display", "float",
            "margin-bottom", "margin-left", "margin-right", "margin-top",
            "outline-color", "outline-offset", "outline-width", "outline-style",
            "padding-left", "padding-right", "padding-top", "padding-bottom",
            "position", "top", "left", "right", "bottom", "z-index",
            "vertical-align", "text-align",
            "-webkit-box-sizing", "-moz-box-sizing", "-ms-box-sizing", "box-sizing",
            "-webkit-box-shadow", "-moz-box-shadow", "-ms-box-shadow", "box-shadow",
            "-webkit-border-top-right-radius", "-moz-border-radius-topright", "border-top-right-radius",
            "-webkit-border-bottom-right-radius", "-moz-border-radius-bottomright", "border-bottom-right-radius",
            "-webkit-border-bottom-left-radius", "-moz-border-radius-bottomleft", "border-bottom-left-radius",
            "-webkit-border-top-left-radius", "-moz-border-radius-topleft", "border-top-left-radius",
            "width", "height"
        ], ADDITIONAL_CSS_RULES = [
            "html                 { height: 100%; }",
            "body                 { height: 100%; padding: 1px 0 0 0; margin: -1px 0 0 0; }",
            "body > p:first-child { margin-top: 0; }",
            "._wysihtml-temp     { display: none; }",
            su.browser.isGecko ?
                "body.placeholder { color: graytext !important; }" :
                "body.placeholder { color: #a9a9a9 !important; }",
            // Ensure that user see's broken images and can delete them
            "img:-moz-broken      { -moz-force-broken-image-icon: 1; height: 24px; width: 24px; }"
        ];
        /**
         * With "setActive" IE offers a smart way of focusing elements without scrolling them into view:
         * http://msdn.microsoft.com/en-us/library/ms536738(v=vs.85).aspx
         *
         * Other browsers need a more hacky way: (pssst don't tell my mama)
         * In order to prevent the element being scrolled into view when focusing it, we simply
         * move it out of the scrollable area, focus it, and reset it's position
         */
        var focusWithoutScrolling = function (element) {
            if (element.setActive) {
                // Following line could cause a js error when the textarea is invisible
                // See https://github.com/xing/wysihtml5/issues/9
                try {
                    element.setActive();
                }
                catch (e) { }
            }
            else {
                var elementStyle = element.style, originalScrollTop = doc.documentElement.scrollTop || doc.body.scrollTop, originalScrollLeft = doc.documentElement.scrollLeft || doc.body.scrollLeft, originalStyles = {
                    position: elementStyle.position,
                    top: elementStyle.top,
                    left: elementStyle.left,
                    WebkitUserSelect: elementStyle.WebkitUserSelect
                };
                su.dom.setStyles({
                    position: "absolute",
                    top: "-99999px",
                    left: "-99999px",
                    // Don't ask why but temporarily setting -webkit-user-select to none makes the whole thing performing smoother
                    WebkitUserSelect: "none"
                }).on(element);
                element.focus();
                su.dom.setStyles(originalStyles).on(element);
                if (win.scrollTo) {
                    // Some browser extensions unset this method to prevent annoyances
                    // "Better PopUp Blocker" for Chrome http://code.google.com/p/betterpopupblocker/source/browse/trunk/blockStart.js#100
                    // Issue: http://code.google.com/p/betterpopupblocker/issues/detail?id=1
                    win.scrollTo(originalScrollLeft, originalScrollTop);
                }
            }
            // Testing requires actions to be accessible from out of scope
        };
        var domNode = su.dom.domNode, 
        /**
         * Map keyCodes to query commands
         */
        shortcuts = {
            "66": "bold",
            "73": "italic",
            "85": "underline" // U
        };
        views.actions = {
            // Adds multiple eventlisteners to target, bound to one callback
            // TODO: If needed elsewhere make it part of wysihtml.dom or sth
            addListeners: function (target, events, callback) {
                for (var i = 0, max = events.length; i < max; i++) {
                    target.addEventListener(events[i], callback, false);
                }
            },
            // Removes multiple eventlisteners from target, bound to one callback
            // TODO: If needed elsewhere make it part of wysihtml.dom or sth
            removeListeners: function (target, events, callback) {
                for (var i = 0, max = events.length; i < max; i++) {
                    target.removeEventListener(events[i], callback, false);
                }
            },
            // Override for giving user ability to delete last line break in table cell
            fixLastBrDeletionInTable: function (composer, force) {
                if (composer.selection.caretIsInTheEndOfNode()) {
                    var sel = composer.selection.getSelection(), aNode = sel.anchorNode;
                    if (aNode && aNode.nodeType === 1 && (su.dom.getParentElement(aNode, { query: 'td, th' }, false, composer.element) || force)) {
                        var nextNode = aNode.childNodes[sel.anchorOffset];
                        if (nextNode && (nextNode.nodeType === 1 ? 1 : 0) & (nextNode.nodeName === "BR" ? 1 : 0)) {
                            nextNode.parentNode.removeChild(nextNode);
                            return true;
                        }
                    }
                }
                return false;
            },
            // If found an uneditable before caret then notify it before deletion
            handleUneditableDeletion: function (composer) {
                var before = composer.selection.getBeforeSelection(true);
                if (before && (before.type === "element" || before.type === "leafnode") && before.node.nodeType === 1 && before.node.classList.contains(composer.config.classNames.uneditableContainer)) {
                    if (views.actions.fixLastBrDeletionInTable(composer, true)) {
                        return true;
                    }
                    try {
                        var ev = new CustomEvent("wysihtml:uneditable:delete", { bubbles: true, cancelable: false });
                        before.node.dispatchEvent(ev);
                    }
                    catch (err) { }
                    before.node.parentNode.removeChild(before.node);
                    return true;
                }
                return false;
            },
            // Deletion with caret in the beginning of headings and other block elvel elements needs special attention
            // Not allways does it concate text to previous block node correctly (browsers do unexpected miracles here especially webkit)
            fixDeleteInTheBeginningOfBlock: function (composer) {
                var selection = composer.selection, prevNode = selection.getPreviousNode();
                if (selection.caretIsFirstInSelection(su.browser.usesControlRanges()) && prevNode) {
                    if (prevNode.nodeType === 1 &&
                        su.dom.domNode(prevNode).is.block() &&
                        !domNode(prevNode).test({
                            query: "ol, ul, table, tr, dl"
                        })) {
                        if ((/^\s*$/).test(prevNode.textContent || prevNode.innerText)) {
                            // If heading is empty remove the heading node
                            prevNode.parentNode.removeChild(prevNode);
                            return true;
                        }
                        else {
                            if (prevNode.lastChild) {
                                var selNode = prevNode.lastChild, selectedNode = selection.getSelectedNode(), commonAncestorNode = domNode(prevNode).commonAncestor(selectedNode, composer.element), curNode = su.dom.getParentElement(selectedNode, {
                                    query: "h1, h2, h3, h4, h5, h6, p, pre, div, blockquote"
                                }, false, commonAncestorNode || composer.element);
                                if (curNode) {
                                    domNode(curNode).transferContentTo(prevNode, true);
                                    selection.setAfter(selNode);
                                    return true;
                                }
                                else if (su.browser.usesControlRanges()) {
                                    selectedNode = selection.getCaretNode();
                                    domNode(selectedNode).transferContentTo(prevNode, true);
                                    selection.setAfter(selNode);
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            },
            /* In IE when deleting with caret at the begining of LI, list gets broken into half instead of merging the LI with previous */
            /* This does not match other browsers an is less intuitive from UI standpoint, thus has to be fixed */
            fixDeleteInTheBeginningOfLi: function (composer) {
                if (su.browser.hasLiDeletingProblem()) {
                    var selection = composer.selection.getSelection(), aNode = selection.anchorNode, listNode, prevNode, firstNode, isInBeginnig = composer.selection.caretIsFirstInSelection(), prevNode, intermediaryNode;
                    // Fix caret at the beginnig of first textNode in LI
                    if (aNode.nodeType === 3 && selection.anchorOffset === 0 && aNode === aNode.parentNode.firstChild) {
                        aNode = aNode.parentNode;
                        isInBeginnig = true;
                    }
                    if (isInBeginnig && aNode && aNode.nodeType === 1 && aNode.nodeName === "LI") {
                        prevNode = domNode(aNode).prev({ nodeTypes: [1, 3], ignoreBlankTexts: true });
                        if (!prevNode && aNode.parentNode && (aNode.parentNode.nodeName === "UL" || aNode.parentNode.nodeName === "OL")) {
                            prevNode = domNode(aNode.parentNode).prev({ nodeTypes: [1, 3], ignoreBlankTexts: true });
                            intermediaryNode = aNode.parentNode;
                        }
                        if (prevNode) {
                            firstNode = aNode.firstChild;
                            domNode(aNode).transferContentTo(prevNode, true);
                            if (intermediaryNode && intermediaryNode.children.length === 0) {
                                intermediaryNode.remove();
                            }
                            if (firstNode) {
                                composer.selection.setBefore(firstNode);
                            }
                            else if (prevNode) {
                                if (prevNode.nodeType === 1) {
                                    if (prevNode.lastChild) {
                                        composer.selection.setAfter(prevNode.lastChild);
                                    }
                                    else {
                                        composer.selection.selectNode(prevNode);
                                    }
                                }
                                else {
                                    composer.selection.setAfter(prevNode);
                                }
                            }
                            return true;
                        }
                    }
                }
                return false;
            },
            fixDeleteInTheBeginningOfControlSelection: function (composer) {
                var selection = composer.selection, prevNode = selection.getPreviousNode(), selectedNode = selection.getSelectedNode(), afterCaretNode;
                if (selection.caretIsFirstInSelection()) {
                    if (selectedNode.nodeType === 3) {
                        selectedNode = selectedNode.parentNode;
                    }
                    afterCaretNode = selectedNode.firstChild;
                    domNode(selectedNode).transferContentTo(prevNode, true);
                    if (afterCaretNode) {
                        composer.selection.setBefore(afterCaretNode);
                    }
                    return true;
                }
                return false;
            },
            // Fixes some misbehaviours of enters in linebreaks mode (natively a bit unsupported feature)
            // Returns true if some corrections is applied so events know when to prevent default
            doLineBreaksModeEnterWithCaret: function (composer) {
                var breakNodes = "p, pre, div, blockquote", caretInfo, parent, txtNode, ret = false;
                caretInfo = composer.selection.getNodesNearCaret();
                if (caretInfo) {
                    if (caretInfo.caretNode || caretInfo.nextNode) {
                        parent = su.dom.getParentElement(caretInfo.caretNode || caretInfo.nextNode, { query: breakNodes }, 2);
                        if (parent === composer.element) {
                            parent = undefined;
                        }
                    }
                    if (parent && caretInfo.caretNode) {
                        if (domNode(caretInfo.caretNode).is.lineBreak()) {
                            if (composer.config.doubleLineBreakEscapesBlock) {
                                // Double enter (enter on blank line) exits block element in useLineBreaks mode.
                                ret = true;
                                caretInfo.caretNode.parentNode.removeChild(caretInfo.caretNode);
                                // Ensure surplous line breaks are not added to preceding element
                                if (domNode(caretInfo.nextNode).is.lineBreak()) {
                                    caretInfo.nextNode.parentNode.removeChild(caretInfo.nextNode);
                                }
                                var brNode = composer.doc.createElement('br');
                                if (domNode(caretInfo.nextNode).is.lineBreak() && caretInfo.nextNode === parent.lastChild) {
                                    parent.parentNode.insertBefore(brNode, parent.nextSibling);
                                }
                                else {
                                    composer.selection.splitElementAtCaret(parent, brNode);
                                }
                                // Ensure surplous blank lines are not added to preceding element
                                if (caretInfo.nextNode && caretInfo.nextNode.nodeType === 3) {
                                    // Replaces blank lines at the beginning of textnode
                                    caretInfo.nextNode.data = caretInfo.nextNode.data.replace(/^ *[\r\n]+/, '');
                                }
                                composer.selection.setBefore(brNode);
                            }
                        }
                        else if (caretInfo.caretNode.nodeType === 3 && su.browser.hasCaretBlockElementIssue() && caretInfo.textOffset === caretInfo.caretNode.data.length && !caretInfo.nextNode) {
                            // This fixes annoying webkit issue when you press enter at the end of a block then seemingly nothing happens.
                            // in reality one line break is generated and cursor is reported after it, but when entering something cursor jumps before the br
                            ret = true;
                            var br1 = composer.doc.createElement('br'), br2 = composer.doc.createElement('br'), f = composer.doc.createDocumentFragment();
                            f.appendChild(br1);
                            f.appendChild(br2);
                            composer.selection.insertNode(f);
                            composer.selection.setBefore(br2);
                        }
                    }
                }
                return ret;
            }
        };
        var handleDeleteKeyPress = function (event, composer) {
            var selection = composer.selection, element = composer.element;
            if (selection.isCollapsed()) {
                /**
                 * when the editor is empty in useLineBreaks = false mode, preserve
                 * the default value in it which is <p><br></p>
                 */
                if (composer.isEmpty() && !composer.config.useLineBreaks) {
                    event.preventDefault();
                    return;
                }
                if (views.actions.handleUneditableDeletion(composer)) {
                    event.preventDefault();
                    return;
                }
                if (views.actions.fixDeleteInTheBeginningOfLi(composer)) {
                    event.preventDefault();
                    return;
                }
                if (views.actions.fixDeleteInTheBeginningOfBlock(composer)) {
                    event.preventDefault();
                    return;
                }
                if (views.actions.fixLastBrDeletionInTable(composer)) {
                    event.preventDefault();
                    return;
                }
                if (su.browser.usesControlRanges()) {
                    if (views.actions.fixDeleteInTheBeginningOfControlSelection(composer)) {
                        event.preventDefault();
                        return;
                    }
                }
            }
            else {
                if (selection.containsUneditable()) {
                    event.preventDefault();
                    selection.deleteContents();
                }
            }
        };
        var handleEnterKeyPress = function (event, composer) {
            if (composer.config.useLineBreaks && !event.shiftKey && !event.ctrlKey) {
                // Fixes some misbehaviours of enters in linebreaks mode (natively a bit unsupported feature)
                var breakNodes = "p, pre, div, blockquote", caretInfo, parent, txtNode;
                if (composer.selection.isCollapsed()) {
                    if (views.actions.doLineBreaksModeEnterWithCaret(composer)) {
                        event.preventDefault();
                    }
                }
            }
            if (su.browser.hasCaretAtLinkEndInsertionProblems() && composer.selection.caretIsInTheEndOfNode()) {
                var target = composer.selection.getSelectedNode(true), targetEl = (target && target.nodeType === 3) ? target.parentNode : target, // target guaranteed to be an Element
                invisibleSpace, space;
                if (targetEl && targetEl.closest('a') && target.nodeType === 3 && target === targetEl.lastChild) {
                    // Seems like enter was pressed and caret was at the end of link node
                    // This means user wants to escape the link now (caret is last in link node too).
                    composer.selection.setAfter(targetEl);
                }
            }
        };
        var handleTabKeyDown = function (composer, element, shiftKey) {
            if (!composer.selection.isCollapsed()) {
                composer.selection.deleteContents();
            }
            else if (composer.selection.caretIsInTheBeginnig('li')) {
                if (shiftKey) {
                    if (composer.commands.exec('outdentList'))
                        return;
                }
                else {
                    if (composer.commands.exec('indentList'))
                        return;
                }
            }
            // Is &emsp; close enough to tab. Could not find enough counter arguments for now.
            composer.commands.exec("insertHTML", "&emsp;");
        };
        var handleDomNodeRemoved = function (event) {
            if (this.domNodeRemovedInterval) {
                clearInterval(this.domNodeRemovedInterval);
            }
            this.parent.fire("destroy:composer");
        };
        // Listens to "drop", "paste", "mouseup", "focus", "keyup" events and fires
        var handleUserInteraction = function (event) {
            this.parent.fire("beforeinteraction", event).fire("beforeinteraction:composer", event);
            setTimeout((function () {
                this.parent.fire("interaction", event).fire("interaction:composer", event);
            }).bind(this), 0);
        };
        var handleFocus = function (event) {
            this.parent.fire("focus", event).fire("focus:composer", event);
            // Delay storing of state until all focus handler are fired
            // especially the one which resets the placeholder
            setTimeout((function () {
                this.focusState = this.getValue(false, false);
            }).bind(this), 0);
        };
        var handleBlur = function (event) {
            if (this.focusState !== this.getValue(false, false)) {
                //create change event if supported (all except IE8)
                var changeevent = event;
                if (typeof Object.create == 'function') {
                    changeevent = Object.create(event, { type: { value: 'change' } });
                }
                this.parent.fire("change", changeevent).fire("change:composer", changeevent);
            }
            this.parent.fire("blur", event).fire("blur:composer", event);
        };
        var handlePaste = function (event) {
            this.parent.fire(event.type, event).fire(event.type + ":composer", event);
            if (event.type === "paste") {
                setTimeout((function () {
                    this.parent.fire("newword:composer");
                }).bind(this), 0);
            }
        };
        var handleCopy = function (event) {
            if (this.config.copyedFromMarking) {
                // If supported the copied source can be based directly on selection
                // Very useful for webkit based browsers where copy will otherwise contain a lot of code and styles based on whatever and not actually in selection.
                if (su.browser.supportsModernPaste()) {
                    event.clipboardData.setData("text/html", this.config.copyedFromMarking + this.selection.getHtml());
                    event.clipboardData.setData("text/plain", this.selection.getPlainText());
                    event.preventDefault();
                }
                this.parent.fire(event.type, event).fire(event.type + ":composer", event);
            }
        };
        var handleKeyUp = function (event) {
            var keyCode = event.keyCode;
            if (keyCode === su.SPACE_KEY || keyCode === su.ENTER_KEY) {
                this.parent.fire("newword:composer");
            }
        };
        var handleMouseDown = function (event) {
            if (!su.browser.canSelectImagesInContentEditable()) {
                // Make sure that images are selected when clicking on them
                var target = event.target, allImages = this.element.querySelectorAll('img'), notMyImages = this.element.querySelectorAll('.' + this.config.classNames.uneditableContainer + ' img'), myImages = su.lang.array(allImages).without(notMyImages);
                if (target.nodeName === "IMG" && su.lang.array(myImages).contains(target)) {
                    this.selection.selectNode(target);
                }
            }
            // Saves mousedown position for IE controlSelect fix
            if (su.browser.usesControlRanges()) {
                this.selection.lastMouseDownPos = { x: event.clientX, y: event.clientY };
                setTimeout(function () {
                    delete this.selection.lastMouseDownPos;
                }.bind(this), 0);
            }
        };
        // IE has this madness of control selects of overflowed and some other elements (weird box around element on selection and second click selects text)
        // This fix handles the second click problem by adding cursor to the right position under cursor inside when controlSelection is made
        var handleIEControlSelect = function (event) {
            var target = event.target, pos = this.selection.lastMouseDownPos;
            if (pos) {
                var body = document.body;
                var caretPosition = body.createTextRange();
                setTimeout(function () {
                    try {
                        caretPosition.moveToPoint(pos.x, pos.y);
                        caretPosition.select();
                    }
                    catch (e) { }
                }.bind(this), 0);
            }
        };
        var handleClick = function (event) {
            if (this.config.classNames.uneditableContainer) {
                // If uneditables is configured, makes clicking on uneditable move caret after clicked element (so it can be deleted like text)
                // If uneditable needs text selection itself event.stopPropagation can be used to prevent this behaviour
                var uneditable = su.dom.getParentElement(event.target, { query: "." + this.config.classNames.uneditableContainer }, false, this.element);
                if (uneditable) {
                    this.selection.setAfter(uneditable);
                }
            }
        };
        var handleDrop = function (event) {
            if (!su.browser.canSelectImagesInContentEditable()) {
                // TODO: if I knew how to get dropped elements list from event I could limit it to only IMG element case
                setTimeout((function () {
                    this.selection.getSelection().removeAllRanges();
                }).bind(this), 0);
            }
        };
        var handleKeyDown = function (event) {
            var keyCode = event.keyCode, command = shortcuts[keyCode], target = this.selection.getSelectedNode(true), targetEl = (target && target.nodeType === 3) ? target.parentNode : target, // target guaranteed to be an Element
            parent;
            // Select all (meta/ctrl + a)
            if ((event.ctrlKey || event.metaKey) && !event.altKey && keyCode === 65) {
                this.selection.selectAll();
                event.preventDefault();
                return;
            }
            // Shortcut logic
            if ((event.ctrlKey || event.metaKey) && !event.altKey && command) {
                this.commands.exec(command);
                event.preventDefault();
            }
            if (keyCode === su.BACKSPACE_KEY) {
                // Delete key override for special cases
                handleDeleteKeyPress(event, this);
            }
            // Make sure that when pressing backspace/delete on selected images deletes the image and it's anchor
            if (keyCode === su.BACKSPACE_KEY || keyCode === su.DELETE_KEY) {
                if (target && target.nodeName === "IMG") {
                    event.preventDefault();
                    parent = target.parentNode;
                    parent.removeChild(target); // delete the <img>
                    // And it's parent <a> too if it hasn't got any other child nodes
                    if (parent.nodeName === "A" && !parent.firstChild) {
                        parent.parentNode.removeChild(parent);
                    }
                    setTimeout((function () {
                        su.quirks.redraw(this.element);
                    }).bind(this), 0);
                }
            }
            if (this.config.handleTabKey && keyCode === su.TAB_KEY) {
                // TAB key handling
                event.preventDefault();
                handleTabKeyDown(this, this.element, event.shiftKey);
            }
            if (keyCode === su.ENTER_KEY) {
                handleEnterKeyPress(event, this);
            }
        };
        var handleKeyPress = function (event) {
            // This block should run only if some character is inserted (nor command keys like delete, backspace, enter, etc.)
            if (event.which !== 0) {
                // Test if caret is last in a link in webkit and try to fix webkit problem,
                // that all inserted content is added outside of link.
                // This issue was added as a not thought through fix for getting caret after link in contenteditable if it is last in editable area.
                // Allthough it fixes this minor case it actually introduces a cascade of problems when editing links.
                // The standard approachi in other wysiwygs seems as a step backwards - introducing a separate modal for managing links content text.
                // I find it to be too big of a tradeoff in terms of expected simple UI flow, thus trying to fight against it.
                // Also adds link escaping by double space with caret at the end of link for all browsers
                if (this.selection.caretIsInTheEndOfNode()) {
                    var target = this.selection.getSelectedNode(true), targetEl = (target && target.nodeType === 3) ? target.parentNode : target, // target guaranteed to be an Element
                    invisibleSpace, space;
                    if (targetEl && targetEl.closest('a') && target === targetEl.lastChild) {
                        if (event.which !== 32 || this.selection.caretIsInTheEndOfNode(true) && su.browser.hasCaretAtLinkEndInsertionProblems()) {
                            // Executed if there is no whitespace before caret in textnode in case of pressing space.
                            // Whitespace before marks that user wants to escape the node by pressing double space.
                            // Otherwise insert the character in the link not out as it would like to go natively
                            invisibleSpace = this.doc.createTextNode(su.INVISIBLE_SPACE);
                            this.selection.insertNode(invisibleSpace);
                            this.selection.setBefore(invisibleSpace);
                            setTimeout(function () {
                                if (invisibleSpace.textContent.length > 1) {
                                    invisibleSpace.textContent = invisibleSpace.textContent.replace(su.INVISIBLE_SPACE_REG_EXP, '');
                                    this.selection.setAfter(invisibleSpace);
                                }
                                else {
                                    invisibleSpace.remove();
                                }
                            }.bind(this), 0);
                        }
                        else if (event.which === 32) {
                            // Seems like space was pressed and there was a space before the caret allready
                            // This means user wants to escape the link now (caret is last in link node too) so we let the native browser do it-s job and escape.
                            // But lets move the trailing space too out of link if present
                            if (target.nodeType === 3 && (/[\u00A0 ]$/).test(target.textContent)) {
                                target.textContent = target.textContent.replace(/[\u00A0 ]$/, '');
                                space = this.doc.createTextNode(' ');
                                targetEl.parentNode.insertBefore(space, targetEl.nextSibling);
                                this.selection.setAfter(space, false);
                                event.preventDefault();
                            }
                        }
                    }
                }
            }
        };
        var handleIframeFocus = function (event) {
            setTimeout((function () {
                if (this.doc.querySelector(":focus") !== this.element) {
                    this.focus();
                }
            }).bind(this), 0);
        };
        var handleIframeBlur = function (event) {
            setTimeout((function () {
                this.selection.getSelection().removeAllRanges();
            }).bind(this), 0);
        };
        su.views.Composer.prototype.observe = function () {
            var that = this, container = (this.sandbox.getIframe) ? this.sandbox.getIframe() : this.sandbox.getContentEditable(), element = this.element, focusBlurElement = (su.browser.supportsEventsInIframeCorrectly() || this.sandbox.getContentEditable) ? this.element : this.sandbox.getWindow();
            this.focusState = this.getValue(false, false);
            this.actions = views.actions;
            // --------- destroy:composer event ---------
            container.addEventListener(["DOMNodeRemoved"], handleDomNodeRemoved.bind(this), false);
            // DOMNodeRemoved event is not supported in IE 8
            // TODO: try to figure out a polyfill style fix, so it could be transferred to polyfills and removed if ie8 is not needed
            if (!su.browser.supportsMutationEvents()) {
                this.domNodeRemovedInterval = setInterval(function () {
                    if (!su.dom.contains(document.documentElement, container)) {
                        handleDomNodeRemoved.call(this);
                    }
                }, 250);
            }
            views.actions.addListeners(focusBlurElement, ['drop', 'paste', 'mouseup', 'focus', 'keyup'], handleUserInteraction.bind(this));
            focusBlurElement.addEventListener('focus', handleFocus.bind(this), false);
            focusBlurElement.addEventListener('blur', handleBlur.bind(this), false);
            views.actions.addListeners(this.element, ['drop', 'paste', 'beforepaste'], handlePaste.bind(this));
            this.element.addEventListener('copy', handleCopy.bind(this), false);
            this.element.addEventListener('mousedown', handleMouseDown.bind(this), false);
            this.element.addEventListener('click', handleClick.bind(this), false);
            this.element.addEventListener('drop', handleDrop.bind(this), false);
            this.element.addEventListener('keyup', handleKeyUp.bind(this), false);
            this.element.addEventListener('keydown', handleKeyDown.bind(this), false);
            this.element.addEventListener('keypress', handleKeyPress.bind(this), false);
            // IE controlselect madness fix
            if (su.browser.usesControlRanges()) {
                this.element.addEventListener('mscontrolselect', handleIEControlSelect.bind(this), false);
            }
            this.element.addEventListener("dragenter", (function () {
                this.parent.fire("unset_placeholder");
            }).bind(this), false);
        };
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
