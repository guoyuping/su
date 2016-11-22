var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var su;
(function (su) {
    var browser;
    (function (browser) {
        browser.userAgent = navigator.userAgent;
        var testElement = document.createElement("div");
        browser.isGecko = browser.userAgent.indexOf("Gecko") !== -1 && browser.userAgent.indexOf("KHTML") === -1 && !isIE(); //mozilla
        browser.isWebKit = browser.userAgent.indexOf("AppleWebKit/") !== -1 && !isIE();
        browser.isChrome = browser.userAgent.indexOf("Chrome/") !== -1 && !isIE();
        browser.isOpera = browser.userAgent.indexOf("Opera/") !== -1 && !isIE();
        function isIE(version, equation) {
            var rv = -1;
            var reg;
            if (navigator.appName == "Mircosoft Internet Explorer") {
                reg = /MSIE ([0-9]{1,}[\.0-9]{0,})/;
            }
            else if (navigator.appName == 'Netscape') {
                if (browser.userAgent.indexOf("Trident") > -1) {
                    reg = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/;
                }
                else if ((/Edge\/(\d+)./i).test(browser.userAgent)) {
                    reg = /Edge\/(\d+)./i;
                }
            }
            if (reg && reg.exec(browser.userAgent)) {
                rv = parseFloat(RegExp.$1);
            }
            if (rv === -1) {
                return false;
            }
            if (!version) {
                return true;
            }
            if (!equation) {
                return version === rv;
            }
            if (equation === "<") {
                return version < rv;
            }
            if (equation === ">") {
                return version > rv;
            }
            if (equation === "<=") {
                return version <= rv;
            }
            if (equation === ">=") {
                return version >= rv;
            }
        }
        browser.isIE = isIE;
        function iosVersion(userAgent) {
            return +((/ipad|iphone|ipod/.test(userAgent) && userAgent.match(/ os (\d+).+? like mac os x/)) || [undefined, 0])[1];
        }
        browser.iosVersion = iosVersion;
        function androidVersion(userAgent) {
            return +(userAgent.match(/android (\d+)/) || [undefined, 0])[1];
        }
        browser.androidVersion = androidVersion;
        /**
         * 排除不能处理和显示contentEditable的浏览器
         * Exclude browsers that are not capable of displaying and handling
         * contentEditable as desired:
         *    - iPhone, iPad (tested iOS 4.2.2) and Android (tested 2.2) refuse to make contentEditables focusable
         *    - IE < 8 create invalid markup and crash randomly from time to time
         *
         * @return {Boolean}
         */
        function supported() {
            var userAgent = navigator.userAgent.toLowerCase();
            // Essential for making html elements editable
            var hasContentEditableSupport = "contentEditable" in testElement;
            // Following methods are needed in order to interact with the contentEditable area
            var hasEditingApiSupport = document.execCommand && document.queryCommandSupported && document.queryCommandState;
            // document selector apis are only supported by IE 8+, Safari 4+, Chrome and Firefox 3.5+
            var hasQuerySelectorSupport = document.querySelector && document.querySelectorAll;
            // contentEditable is unusable in mobile browsers (tested iOS 4.2.2, Android 2.2, Opera Mobile, WebOS 3.05)
            var isIncompatibleMobileBrowser = (isIos() && iosVersion(userAgent) < 5) || (isAndroid() && androidVersion(userAgent) < 4) || userAgent.indexOf("opera mobi") !== -1 || userAgent.indexOf("hpwos/") !== -1;
            return hasContentEditableSupport
                && hasEditingApiSupport
                && hasQuerySelectorSupport
                && !isIncompatibleMobileBrowser;
        }
        browser.supported = supported;
        function isTouchDevice() {
            return supportsEvent("touchmove");
        }
        browser.isTouchDevice = isTouchDevice;
        function isIos() {
            return (/ipad|iphone|ipod/i).test(browser.userAgent);
        }
        browser.isIos = isIos;
        function isAndroid() {
            return browser.userAgent.indexOf("Android") !== -1;
        }
        browser.isAndroid = isAndroid;
        /**
         * Whether the browser supports sandboxed iframes
         * Currently only IE 6+ offers such feature <iframe security="restricted">
         *
         * http://msdn.microsoft.com/en-us/library/ms534622(v=vs.85).aspx
         * http://blogs.msdn.com/b/ie/archive/2008/01/18/using-frames-more-securely.aspx
         *
         * HTML5 sandboxed iframes are still buggy and their DOM is not reachable from the outside (except when using postMessage)
         */
        function supportsSandboxedIframes() {
            return isIE();
        }
        browser.supportsSandboxedIframes = supportsSandboxedIframes;
        /**
         * IE6+7 throw a mixed content warning when the src of an iframe
         * is empty/unset or about:blank
         * window.querySelector is implemented as of IE8
         */
        function throwsMixedContentWarningWhenIframeSrcIsEmpty() {
            return !("querySelector" in document);
        }
        browser.throwsMixedContentWarningWhenIframeSrcIsEmpty = throwsMixedContentWarningWhenIframeSrcIsEmpty;
        /**
         * Whether the caret is correctly displayed in contentEditable elements
         * Firefox sometimes shows a huge caret in the beginning after focusing
         */
        function displaysCaretInEmptyContentEditableCorrectly() {
            return isIE(12, ">");
        }
        browser.displaysCaretInEmptyContentEditableCorrectly = displaysCaretInEmptyContentEditableCorrectly;
        /**
         * Opera and IE are the only browsers who offer the css value
         * in the original unit, thx to the currentStyle object
         * All other browsers provide the computed style in px via window.getComputedStyle
         */
        function hasCurrentStyleProperty() {
            return "currentStyle" in testElement;
        }
        browser.hasCurrentStyleProperty = hasCurrentStyleProperty;
        /**
         * Whether the browser inserts a <br> when pressing enter in a contentEditable element
         */
        function insertsLineBreaksOnReturn() {
            return browser.isGecko;
        }
        browser.insertsLineBreaksOnReturn = insertsLineBreaksOnReturn;
        function supportsPlaceholderAttributeOn(element) {
            return "placeholder" in element;
        }
        browser.supportsPlaceholderAttributeOn = supportsPlaceholderAttributeOn;
        function supportsEvent(eventName) {
            return "on" + eventName in testElement
                || (function () {
                    testElement.setAttribute("on" + eventName, "return;");
                    return typeof (testElement["on" + eventName]) === "function";
                })();
        }
        browser.supportsEvent = supportsEvent;
        /**
         * Opera doesn't correctly fire focus/blur events when clicking in- and outside of iframe
         */
        function supportsEventsInIframeCorrectly() {
            return !browser.isOpera;
        }
        browser.supportsEventsInIframeCorrectly = supportsEventsInIframeCorrectly;
        /**
         * Everything below IE9 doesn't know how to treat HTML5 tags
         *
         * @param {Object} context The document object on which to check HTML5 support
         *
         * @example
         *    wysihtml.browser.supportsHTML5Tags(document);
         */
        function supportsHTML5Tags(context) {
            var element = context.createElement("div"), html5 = "<article>foo</article>";
            element.innerHTML = html5;
            return element.innerHTML.toLowerCase() === html5;
        }
        browser.supportsHTML5Tags = supportsHTML5Tags;
        /**
         * Checks whether a document supports a certain queryCommand
         * In particular, Opera needs a reference to a document that has a contentEditable in it's dom tree
         * in oder to report correct results
         *
         * @param {Object} doc Document object on which to check for a query command
         * @param {String} command The query command to check for
         * @return {Boolean}
         *
         * @example
         *    wysihtml.browser.supportsCommand(document, "bold");
         */
        function supportsCommand(doc, command) {
            // Following commands are supported but contain bugs in some browsers
            // TODO: investigate if some of these bugs can be tested without altering selection on page, instead of targeting browsers and versions directly
            var buggyCommands = {
                // formatBlock fails with some tags (eg. <blockquote>)
                "formatBlock": isIE(10, "<="),
                // When inserting unordered or ordered lists in Firefox, Chrome or Safari, the current selection or line gets
                // converted into a list (<ul><li>...</li></ul>, <ol><li>...</li></ol>)
                // IE and Opera act a bit different here as they convert the entire content of the current block element into a list
                "insertUnorderedList": isIE(),
                "insertOrderedList": isIE()
            };
            // Firefox throws errors for queryCommandSupported, so we have to build up our own object of supported commands
            var supported = {
                "insertHTML": browser.isGecko
            };
            var isBuggy = buggyCommands[command];
            if (!isBuggy) {
                // Firefox throws errors when invoking queryCommandSupported or queryCommandEnabled
                try {
                    // 如果命令不被支持，将触发 NotSupportedError 异常
                    return doc.queryCommandSupported(command);
                }
                catch (e1) { }
                try {
                    // Returns a Boolean which is true if the command is enabled and false if the command isn't.
                    return doc.queryCommandEnabled(command);
                }
                catch (e2) {
                    return !!supported[command];
                }
            }
            return false;
        }
        browser.supportsCommand = supportsCommand;
        /**
         * IE: URLs starting with:
         *    www., http://, https://, ftp://, gopher://, mailto:, new:, snews:, telnet:, wasis:, file://,
         *    nntp://, newsrc:, ldap://, ldaps://, outlook:, mic:// and url:
         * will automatically be auto-linked when either the user inserts them via copy&paste or presses the
         * space bar when the caret is directly after such an url.
         * This behavior cannot easily be avoided in IE < 9 since the logic is hardcoded in the mshtml.dll
         * (related blog post on msdn
         * http://blogs.msdn.com/b/ieinternals/archive/2009/09/17/prevent-automatic-hyperlinking-in-contenteditable-html.aspx).
         */
        function doesAutoLinkingInContentEditable() {
            return isIE();
        }
        browser.doesAutoLinkingInContentEditable = doesAutoLinkingInContentEditable;
        /**
         * As stated above, IE auto links urls typed into contentEditable elements
         * Since IE9 it's possible to prevent this behavior
         */
        function canDisableAutoLinking() {
            return supportsCommand(document, "AutoUrlDetect");
        }
        browser.canDisableAutoLinking = canDisableAutoLinking;
        /**
         * IE leaves an empty paragraph in the contentEditable element after clearing it
         * Chrome/Safari sometimes an empty <div>
         */
        function clearsContentEditableCorrectly() {
            return browser.isGecko || browser.isOpera || browser.isWebKit;
        }
        browser.clearsContentEditableCorrectly = clearsContentEditableCorrectly;
        /**
         * IE gives wrong results for getAttribute
         */
        function supportsGetAttributeCorrectly() {
            var td = document.createElement("td");
            return td.getAttribute("rowspan") != "1";
        }
        browser.supportsGetAttributeCorrectly = supportsGetAttributeCorrectly;
        /**
         * When clicking on images in IE, Opera and Firefox, they are selected, which makes it easy to interact with them.
         * Chrome and Safari both don't support this
         */
        function canSelectImagesInContentEditable() {
            return browser.isGecko || isIE() || browser.isOpera;
        }
        browser.canSelectImagesInContentEditable = canSelectImagesInContentEditable;
        /**
         * All browsers except Safari and Chrome automatically scroll the range/caret position into view
         */
        function autoScrollsToCaret() {
            return !browser.isWebKit;
        }
        browser.autoScrollsToCaret = autoScrollsToCaret;
        /**
         * Check whether the browser automatically closes tags that don't need to be opened
         */
        function autoClosesUnclosedTags() {
            var clonedTestElement = testElement.cloneNode(false), returnValue, innerHTML;
            clonedTestElement.innerHTML = "<p><div></div>";
            innerHTML = clonedTestElement.innerHTML.toLowerCase();
            returnValue = innerHTML === "<p></p><div></div>" || innerHTML === "<p><div></div></p>";
            // Cache result by overwriting current function
            var autoClosesUnclosedTags = function () { return returnValue; };
            return returnValue;
        }
        browser.autoClosesUnclosedTags = autoClosesUnclosedTags;
        /**
         * Whether the browser supports the native document.getElementsByClassName which returns live NodeLists
         */
        function supportsNativeGetElementsByClassName() {
            return String(document.getElementsByClassName).indexOf("[native code]") !== -1;
        }
        browser.supportsNativeGetElementsByClassName = supportsNativeGetElementsByClassName;
        /**
         * As of now (19.04.2011) only supported by Firefox 4 and Chrome
         * See https://developer.mozilla.org/en/DOM/Selection/modify
         */
        function supportsSelectionModify() {
            return "getSelection" in window && "modify" in window.getSelection(); //HTML5标准API 
        }
        browser.supportsSelectionModify = supportsSelectionModify;
        /**
         * Opera needs a white space after a <br> in order to position the caret correctly
         */
        function needsSpaceAfterLineBreak() {
            return browser.isOpera;
        }
        browser.needsSpaceAfterLineBreak = needsSpaceAfterLineBreak;
        /**
         * Whether the browser supports the speech api on the given element
         * See http://mikepultz.com/2011/03/accessing-google-speech-api-chrome-11/
         *
         * @example
         *    var input = document.createElement("input");
         *    if (wysihtml.browser.supportsSpeechApiOn(input)) {
         *      // ...
         *    }
         */
        function supportsSpeechApiOn(input) {
            var chromeVersion = browser.userAgent.match(/Chrome\/(\d+)/) || [undefined, 0];
            return chromeVersion[1] >= 11 && ("onwebkitspeechchange" in input || "speech" in input);
        }
        browser.supportsSpeechApiOn = supportsSpeechApiOn;
        /**
         * IE9 crashes when setting a getter via Object.defineProperty on XMLHttpRequest or XDomainRequest
         * See https://connect.microsoft.com/ie/feedback/details/650112
         * or try the POC http://tifftiff.de/ie9_crash/
         */
        function crashesWhenDefineProperty(property) {
            return isIE(9) && (property === "XMLHttpRequest" || property === "XDomainRequest");
        }
        browser.crashesWhenDefineProperty = crashesWhenDefineProperty;
        /**
         * IE is the only browser who fires the "focus" event not immediately when .focus() is called on an element
         */
        function doesAsyncFocus() {
            return isIE(12, ">");
        }
        browser.doesAsyncFocus = doesAsyncFocus;
        /**
         * In IE it's impssible for the user and for the selection library to set the caret after an <img> when it's the lastChild in the document
         */
        function hasProblemsSettingCaretAfterImg() {
            return isIE();
        }
        browser.hasProblemsSettingCaretAfterImg = hasProblemsSettingCaretAfterImg;
        /* In IE when deleting with caret at the begining of LI, List get broken into half instead of merging the LI with previous */
        function hasLiDeletingProblem() {
            return isIE();
        }
        browser.hasLiDeletingProblem = hasLiDeletingProblem;
        function hasUndoInContextMenu() {
            return browser.isGecko || browser.isChrome || browser.isOpera;
        }
        browser.hasUndoInContextMenu = hasUndoInContextMenu;
        /**
         * Opera sometimes doesn't insert the node at the right position when range.insertNode(someNode)
         * is used (regardless if rangy or native)
         * This especially happens when the caret is positioned right after a <br> because then
         * insertNode() will insert the node right before the <br>
         */
        function hasInsertNodeIssue() {
            return browser.isOpera;
        }
        browser.hasInsertNodeIssue = hasInsertNodeIssue;
        /**
         * IE 8+9 don't fire the focus event of the <body> when the iframe gets focused (even though the caret gets set into the <body>)
         */
        function hasIframeFocusIssue() {
            return isIE();
        }
        browser.hasIframeFocusIssue = hasIframeFocusIssue;
        /**
         * Chrome + Safari create invalid nested markup after paste
         *
         *  <p>
         *    foo
         *    <p>bar</p> <!-- BOO! -->
         *  </p>
         */
        function createsNestedInvalidMarkupAfterPaste() {
            return browser.isWebKit;
        }
        browser.createsNestedInvalidMarkupAfterPaste = createsNestedInvalidMarkupAfterPaste;
        // In all webkit browsers there are some places where caret can not be placed at the end of blocks and directly before block level element
        //   when startContainer is element.
        function hasCaretBlockElementIssue() {
            return browser.isWebKit;
        }
        browser.hasCaretBlockElementIssue = hasCaretBlockElementIssue;
        function supportsMutationEvents() {
            return ("MutationEvent" in window);
        }
        browser.supportsMutationEvents = supportsMutationEvents;
        /**
          IE (at least up to 11) does not support clipboardData on event.
          It is on window but cannot return text/html
          Should actually check for clipboardData on paste event, but cannot in firefox
        */
        function supportsModernPaste() {
            return !isIE();
        }
        browser.supportsModernPaste = supportsModernPaste;
        // Unifies the property names of element.style by returning the suitable property name for current browser
        // Input property key must be the standard
        function fixStyleKey(key) {
            if (key === "cssFloat") {
                return ("styleFloat" in document.createElement("div").style) ? "styleFloat" : "cssFloat";
            }
            return key;
        }
        browser.fixStyleKey = fixStyleKey;
        function usesControlRanges() {
            return document.body && "createControlRange" in document.body;
        }
        browser.usesControlRanges = usesControlRanges;
        // Webkit browsers have an issue that when caret is at the end of link it is moved outside of link while inserting new characters,
        // so all inserted content will be after link. Selection before inserion is reported to be in link though.
        // This makes changing link texts from problematic to impossible (if link is just 1 characer long) for the user.
        // TODO: needs to be tested better than just browser as it some day might get fixed
        function hasCaretAtLinkEndInsertionProblems() {
            return browser.isWebKit;
        }
        browser.hasCaretAtLinkEndInsertionProblems = hasCaretAtLinkEndInsertionProblems;
    })(browser = su.browser || (su.browser = {}));
})(su || (su = {}));
var su;
(function (su) {
    /**
* Rich Text Query/Formatting Commands
*
* @example
*    var commands = new wysihtml.Commands(editor);
*/
    var Commands = (function () {
        function Commands(editor) {
            this.editor = editor;
            this.composer = editor.composer;
            this.doc = this.composer.doc;
        }
        /**
         * 检测浏览器的document是否支持 command
         *
         * @param {String} command The command string which to check (eg. "bold", "italic", "insertUnorderedList")
         * @example
         *    commands.supports("createLink");
         */
        Commands.prototype.support = function (command) {
            return su.browser.supportsCommand(this.doc, command);
        };
        /**
         * Check whether the browser supports the given command
         * https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand
         *
         * @param {String} command The command string which to execute (eg. "bold", "italic", "insertUnorderedList")
         * @param {String} [value] The command value parameter, needed for some commands ("createLink", "insertImage", ...), optional for commands that don't require one ("bold", "underline", ...)
         * @example
         *    commands.exec("insertImage", "http://a1.twimg.com/profile_images/113868655/schrei_twitter_reasonably_small.jpg");
         */
        Commands.prototype.exec = function (command, value) {
            var obj = su.commands[command], args = su.lang.array(arguments).get(), method = obj && obj.exec, result = null;
            // If composer ahs placeholder unset it before command
            // Do not apply on commands that are behavioral 
            if (this.composer.hasPlaceholderSet() && !su.lang.array(['styleWithCSS', 'enableObjectResizing', 'enableInlineTableEditing']).contains(command)) {
                this.composer.element.innerHTML = "";
                this.composer.selection.selectNode(this.composer.element);
            }
            this.editor.fire("beforecommand:composer");
            if (method) {
                args.unshift(this.composer);
                result = method.apply(obj, args);
            }
            else {
                try {
                    // try/catch for buggy firefox
                    result = this.doc.execCommand(command, false, value);
                }
                catch (e) { }
            }
            this.editor.fire("aftercommand:composer");
            return result;
        };
        Commands.prototype.remove = function (command, commandValue) {
            var obj = su.commands[command], args = su.lang.array(arguments).get(), method = obj && obj.remove;
            if (method) {
                args.unshift(this.composer);
                return method.apply(obj, args);
            }
        };
        return Commands;
    }());
    su.Commands = Commands;
})(su || (su = {}));
var su;
(function (su) {
    var lang;
    (function (lang) {
        function array(arr) {
            return {
                /**
                 * Check whether a given object exists in an array
                 *
                 * @example
                 *    lang.array([1, 2]).contains(1);
                 *    // => true
                 *
                 * Can be used to match array with array. If intersection is found true is returned
                 */
                contains: function (needle) {
                    if (Array.isArray(needle)) {
                        for (var i = needle.length; i--;) {
                            if (array(arr).indexOf(needle[i]) !== -1) {
                                return true;
                            }
                        }
                        return false;
                    }
                    else {
                        return array(arr).indexOf(needle) !== -1;
                    }
                },
                /**
                 * Check whether a given object exists in an array and return index
                 * If no elelemt found returns -1
                 *
                 * @example
                 *    lang.array([1, 2]).indexOf(2);
                 *    // => 1
                 */
                indexOf: function (needle) {
                    if (arr.indexOf) {
                        return arr.indexOf(needle);
                    }
                    else {
                        for (var i = 0, length = arr.length; i < length; i++) {
                            if (arr[i] === needle) {
                                return i;
                            }
                        }
                        return -1;
                    }
                },
                /**
                 * Substract one array from another
                 *
                 * @example
                 *    lang.array([1, 2, 3, 4]).without([3, 4]);
                 *    // => [1, 2]
                 */
                without: function (arrayToSubstract) {
                    arrayToSubstract = array(arrayToSubstract);
                    var newArr = [], i = 0, length = arr.length;
                    for (; i < length; i++) {
                        if (!arrayToSubstract.contains(arr[i])) {
                            newArr.push(arr[i]);
                        }
                    }
                    return newArr;
                },
                /**
                 * Return a clean native array
                 *
                 * Following will convert a Live NodeList to a proper Array
                 * @example
                 *    var childNodes = lang.array(document.body.childNodes).get();
                 */
                get: function () {
                    var i = 0, length = arr.length, newArray = [];
                    for (; i < length; i++) {
                        newArray.push(arr[i]);
                    }
                    return newArray;
                },
                /**
                 * Creates a new array with the results of calling a provided function on every element in this array.
                 * optionally this can be provided as second argument
                 *
                 * @example
                 *    var childNodes = lang.array([1,2,3,4]).map(function (value, index, array) {
                        return value * 2;
                 *    });
                 *    // => [2,4,6,8]
                 */
                map: function (callback, thisArg) {
                    if (Array.prototype.map) {
                        return arr.map(callback, thisArg);
                    }
                    else {
                        var len = arr.length >>> 0, A = new Array(len), i = 0;
                        for (; i < len; i++) {
                            A[i] = callback.call(thisArg, arr[i], i, arr);
                        }
                        return A;
                    }
                },
                /* ReturnS new array without duplicate entries
                 *
                 * @example
                 *    var uniq = lang.array([1,2,3,2,1,4]).unique();
                 *    // => [1,2,3,4]
                 */
                unique: function () {
                    var vals = [], max = arr.length, idx = 0;
                    while (idx < max) {
                        if (!array(vals).contains(arr[idx])) {
                            vals.push(arr[idx]);
                        }
                        idx++;
                    }
                    return vals;
                }
            };
        }
        lang.array = array;
        ;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
var su;
(function (su) {
    var lang;
    (function (lang) {
        /**
         * event事件分发
         * 绑定event的行为函数
         */
        var Dispatcher = (function () {
            function Dispatcher() {
                this.events = {};
                console.log("dispatcher constructor:\r\n");
            }
            /**
             * 将handler放入this.events[eventName] 的handlers数组中，绑定event的行为
             */
            Dispatcher.prototype.on = function (eventName, handler) {
                this.events = this.events || {};
                this.events[eventName] = this.events[eventName] || [];
                this.events[eventName].push(handler);
                return this;
            };
            /**
             * 将handler从this.events[eventName] 的handlers数组中删除
             */
            Dispatcher.prototype.off = function (eventName, handler) {
                this.events = this.events || {};
                var i = 0, handlers, newHandlers;
                if (eventName) {
                    handlers = this.events[eventName] || [],
                        newHandlers = [];
                    for (; i < handlers.length; i++) {
                        if (handlers[i] !== handler && handler) {
                            newHandlers.push(handlers[i]);
                        }
                    }
                    this.events[eventName] = newHandlers;
                }
                else {
                    // Clean up all events
                    this.events = {};
                }
                return this;
            };
            /**
             * 执行event中绑定的每一个handler方法
             *
             * @example
             * let d = new lang.DispatcherT();
             * d.on("hello",function(){
             *      console.log('打印a');
             * }).fire("hello");
             * // 打印a
             * d.on("hello",function(){
             *      console.log('打印b');
             * }).fire("hello");
             * // 打印a
             * // 打印b
             */
            Dispatcher.prototype.fire = function (eventName, payload) {
                this.events = this.events || {};
                var handlers = this.events[eventName] || [], i = 0;
                for (; i < handlers.length; i++) {
                    handlers[i].call(this, payload);
                }
                return this;
            };
            // deprecated, use .on()
            Dispatcher.prototype.observe = function (eventName, handler) {
                return this.on.apply(this, arguments);
            };
            // deprecated, use .off()
            Dispatcher.prototype.stopObservin = function (eventName, handler) {
                return this.off.apply(this, arguments);
            };
            return Dispatcher;
        }());
        lang.Dispatcher = Dispatcher;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
var su;
(function (su) {
    var views;
    (function (views) {
        /**
         * 根据change_view事件，确定显示textarea还是composer
         */
        var SourceView = (function () {
            function SourceView(editor, composer) {
                this.editor = editor;
                this.composer = composer;
                this._observe();
            }
            /**
             * 显示textarea，隐藏composer
             */
            SourceView.prototype.switchToTextarea = function (shouldParseHtml) {
                var composerStyles = this.composer.win.getComputedStyle(this.composer.element), width = parseFloat(composerStyles.width), height = Math.max(parseFloat(composerStyles.height), 100);
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
            };
            /**
             * 删除textarea显示composer
             */
            SourceView.prototype.switchToComposer = function (shouldParseHtml) {
                var textareaValue = this.textarea.value;
                if (textareaValue) {
                    this.composer.setValue(textareaValue, shouldParseHtml);
                }
                else {
                    this.composer.clear();
                    this.editor.fire("set_placeholder");
                }
                this.textarea.parentNode.removeChild(this.textarea);
                this.editor.currentView = this.composer;
                this.composer.element.style.display = '';
            };
            SourceView.prototype._observe = function () {
                this.editor.on("change_view", function (view) {
                    if (view === "composer") {
                        this.switchToComposer(true);
                    }
                    else if (view === "textarea") {
                        this.switchToTextarea(true);
                    }
                }.bind(this));
            };
            return SourceView;
        }());
        views.SourceView = SourceView;
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
var su;
(function (su) {
    var views;
    (function (views) {
        var View = (function () {
            function View(parent, textareaElement, config) {
                this.config = {};
                this.parent = parent;
                this.element = textareaElement;
                this.config = config;
                if (!this.config.noTextarea) {
                    this._observeViewChange();
                }
            }
            /**
             * 绑定beforeload、change_view事件到editor上
             */
            View.prototype._observeViewChange = function () {
                var _this = this;
                //var that = this;
                // 绑定beforeload事件的方法
                this.parent.on("beforeload", function () {
                    // 绑定change_view事件的方法
                    _this.parent.on("change_view", function (view) {
                        if (view === _this.name) {
                            _this.parent.currentView = _this;
                            _this.show();
                            // Using tiny delay here to make sure that the placeholder is set before focusing
                            setTimeout(function () { this.focus(); }, 0);
                        }
                        else {
                            _this.hide();
                        }
                    });
                });
            };
            View.prototype.hide = function () {
                this.element.style.display = "none";
            };
            View.prototype.show = function () {
                this.element.style.display = "";
            };
            View.prototype.focus = function (setToEnd) {
                if (this.element
                    && this.element.ownerDocument
                    && this.element.ownerDocument.querySelector(":focus") === this.element) {
                    return;
                }
                // 否则聚焦到element
                try {
                    if (this.element) {
                        this.element.focus();
                    }
                }
                catch (e) { }
            };
            View.prototype.disable = function () {
                this.element.setAttribute("disabled", "disabled");
            };
            View.prototype.enable = function () {
                this.element.removeAttribute("disabled");
            };
            return View;
        }());
        views.View = View;
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
var su;
(function (su) {
    var lang;
    (function (lang) {
        function string(str) {
            var WHITE_SPACE_START = /^\s+/;
            var WHITE_SPACE_END = /\s+$/;
            var ENTITY_REG_EXP = /[&<>\t"]/g;
            var ENTITY_MAP = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': "&quot;",
                '\t': "&nbsp; "
            };
            str = String(str);
            return {
                /**
                 * @example
                 *    wysihtml.lang.string("   foo   ").trim();
                 *    // => "foo"
                 */
                trim: function () {
                    return str.replace(WHITE_SPACE_START, "").replace(WHITE_SPACE_END, "");
                },
                /**
                 * @example
                 *    wysihtml.lang.string("Hello #{name}").interpolate({ name: "Christopher" });
                 *    // => "Hello Christopher"
                 */
                interpolate: function (vars) {
                    for (var i in vars) {
                        str = this.replace("#{" + i + "}").by(vars[i]);
                    }
                    return str;
                },
                /**
                 * @example
                 *    wysihtml.lang.string("Hello Tom").replace("Tom").with("Hans");
                 *    // => "Hello Hans"
                 */
                replace: function (search) {
                    return {
                        by: function (replace) {
                            return str.split(search).join(replace);
                        }
                    };
                },
                /**
                 * @example
                 *    wysihtml.lang.string("hello<br>").escapeHTML();
                 *    // => "hello&lt;br&gt;"
                 */
                escapeHTML: function (linebreaks, convertSpaces) {
                    var html = str.replace(ENTITY_REG_EXP, function (c) { return ENTITY_MAP[c]; });
                    if (linebreaks) {
                        html = html.replace(/(?:\r\n|\r|\n)/g, '<br />');
                    }
                    if (convertSpaces) {
                        html = html.replace(/  /gi, "&nbsp; ");
                    }
                    return html;
                }
            };
        }
        lang.string = string;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * 给元素添加events的handler函数，可以通过handler函数的参数event的event.type来判断当前是哪个事件
         * Method to set dom events
         *
         * @example
         *    wysihtml.dom.observe(iframe.contentWindow.document.body, ["focus", "blur"], function(event) { ...event.type==="blur" });
         */
        function observe(element, eventNames, handler) {
            eventNames = typeof (eventNames) === "string" ? [eventNames] : eventNames;
            var handlerWrapper, eventName, i = 0, length = eventNames.length;
            for (; i < length; i++) {
                eventName = eventNames[i];
                if (element.addEventListener) {
                    element.addEventListener(eventName, handler, false);
                }
                else {
                    handlerWrapper = function (event) {
                        if (!("target" in event)) {
                            event.target = event.srcElement;
                        }
                        event.preventDefault = event.preventDefault || function () {
                            this.returnValue = false;
                        };
                        event.stopPropagation = event.stopPropagation || function () {
                            this.cancelBubble = true;
                        };
                        handler.call(element, event);
                    };
                    element.attachEvent("on" + eventName, handlerWrapper);
                }
            }
            return {
                stop: function () {
                    var eventName, i = 0, length = eventNames.length;
                    for (; i < length; i++) {
                        eventName = eventNames[i];
                        if (element.removeEventListener) {
                            element.removeEventListener(eventName, handler, false);
                        }
                        else {
                            element.detachEvent("on" + eventName, handlerWrapper);
                        }
                    }
                }
            };
        }
        dom.observe = observe;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="./view.ts" />
/// <reference path="../browser.ts" />
/// <reference path="../lang/string.ts" />
/// <reference path="../dom/observe.ts" />
var su;
(function (su) {
    var views;
    (function (views) {
        /**
         *
         */
        var Textarea = (function (_super) {
            __extends(Textarea, _super);
            function Textarea(parent, textareaElement, config) {
                _super.call(this, parent, textareaElement, config);
                this.name = "textarea";
                this._observe();
            }
            Textarea.prototype.clear = function () {
                this.element.value = "";
            };
            /**
             * 获取textarea中的内容（html代码）
             */
            Textarea.prototype.getValue = function (parse) {
                var value = this.isEmpty() ? "" : this.element.value;
                if (parse !== false) {
                    // parse方法Editor类中定义
                    // Editor调用dom.parse,格式化html tag
                    value = this.parent.parse(value);
                }
                return value;
            };
            /**
             * 设置textarea中的内容（html代码）
             */
            Textarea.prototype.setValue = function (html, parse) {
                if (parse !== false) {
                    html = this.parent.parse(html);
                }
                this.element.value = html;
            };
            Textarea.prototype.cleanUp = function (rules) {
                var html = this.parent.parse(this.element.value, undefined, rules);
                this.element.value = html;
            };
            Textarea.prototype.hasPlaceholderSet = function () {
                var supportsPlaceholder = su.browser.supportsPlaceholderAttributeOn(this.element), placeholderText = this.element.getAttribute("placeholder") || null, value = this.element.value, isEmpty = !value;
                // 两种清空内容为空但有placeholder属性，或有值但和placeholder相同
                return (supportsPlaceholder && isEmpty) || (value === placeholderText);
            };
            Textarea.prototype.isEmpty = function () {
                return !su.lang.string(this.element.value).trim() || this.hasPlaceholderSet();
            };
            Textarea.prototype._observe = function () {
                var element = this.element, parent = this.parent, eventMapping = {
                    focusin: "focus",
                    focusout: "blur"
                }, 
                /**
                 * Calling focus() or blur() on an element doesn't synchronously trigger the attached focus/blur events
                 * This is the case for focusin and focusout, so let's use them whenever possible, kkthxbai
                 */
                events = su.browser.supportsEvent("focusin") ? ["focusin", "focusout", "change"] : ["focus", "blur", "change"];
                parent.on("beforeload", function () {
                    su.dom.observe(element, events, function (event) {
                        var eventName = eventMapping[event.type] || event.type;
                        parent.fire(eventName).fire(eventName + ":textarea");
                    });
                    su.dom.observe(element, ["paste", "drop"], function () {
                        setTimeout(function () { parent.fire("paste").fire("paste:textarea"); }, 0);
                    });
                });
            };
            return Textarea;
        }(views.View));
        views.Textarea = Textarea;
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
/// <reference path="../lang/array.ts" />
/// <reference path="../browser.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * Copy a set of attributes from one element to another
         *
         * @param {Array} attributesToCopy List of attributes which should be copied
         * @return {Object} Returns an object which offers the "from" method which can be invoked with the element where to
         *    copy the attributes from., this again returns an object which provides a method named "to" which can be invoked
         *    with the element where to copy the attributes to (see example)
         *
         * @example
         *    var textarea    = document.querySelector("textarea"),
         *        div         = document.querySelector("div[contenteditable=true]"),
         *        anotherDiv  = document.querySelector("div.preview");
         *    wysihtml.dom.copyAttributes(["spellcheck", "value", "placeholder"]).from(textarea).to(div).andTo(anotherDiv);
         *
         */
        function copyAttributes(attributesToCopy) {
            return {
                from: function (elementToCopyFrom) {
                    return {
                        to: function pasteElementAttributesTo(elementToCopyTo) {
                            var attribute, i = 0, length = attributesToCopy.length;
                            for (; i < length; i++) {
                                attribute = attributesToCopy[i];
                                if (typeof (elementToCopyFrom[attribute]) !== "undefined" && elementToCopyFrom[attribute] !== "") {
                                    elementToCopyTo[attribute] = elementToCopyFrom[attribute];
                                }
                            }
                            return { andTo: pasteElementAttributesTo };
                        }
                    };
                }
            };
        }
        dom.copyAttributes = copyAttributes;
        /**
        * 获得一个element的attribute
        *
        * IE gives wrong results for hasAttribute/getAttribute, for example:
        *    var td = document.createElement("td");
        *    td.getAttribute("rowspan"); // => "1" in IE
        *
        * Therefore we have to check the element's outerHTML for the attribute
        */
        function getAttribute(node, attributeName) {
            var HAS_GET_ATTRIBUTE_BUG = !su.browser.supportsGetAttributeCorrectly();
            attributeName = attributeName.toLowerCase();
            var nodeName = node.nodeName;
            if (nodeName == "IMG" && attributeName == "src" && dom.isLoadedImage(node) === true) {
                // Get 'src' attribute value via object property since this will always contain the
                // full absolute url (http://...)
                // this fixes a very annoying bug in firefox (ver 3.6 & 4) and IE 8 where images copied from the same host
                // will have relative paths, which the sanitizer strips out (see attributeCheckMethods.url)
                return node.src;
            }
            else if (HAS_GET_ATTRIBUTE_BUG && "outerHTML" in node) {
                // Don't trust getAttribute/hasAttribute in IE 6-8, instead check the element's outerHTML
                var outerHTML = node.outerHTML.toLowerCase(), 
                // TODO: This might not work for attributes without value: <input disabled>
                hasAttribute = outerHTML.indexOf(" " + attributeName + "=") != -1;
                return hasAttribute ? node.getAttribute(attributeName) : null;
            }
            else {
                return node.getAttribute(attributeName);
            }
        }
        dom.getAttribute = getAttribute;
        ;
        /**
         * Get all attributes of an element
         *
         * IE gives wrong results for hasAttribute/getAttribute, for example:
         *    var td = document.createElement("td");
         *    td.getAttribute("rowspan"); // => "1" in IE
         *
         * Therefore we have to check the element's outerHTML for the attribute
        */
        function getAttributes(node) {
            var HAS_GET_ATTRIBUTE_BUG = !su.browser.supportsGetAttributeCorrectly(), nodeName = node.nodeName, attributes = [], attr;
            for (attr in node.attributes) {
                if ((node.attributes.hasOwnProperty && node.attributes.hasOwnProperty(attr)) || (!node.attributes.hasOwnProperty && Object.prototype.hasOwnProperty.call(node.attributes, attr))) {
                    if (node.attributes[attr].specified) {
                        if (nodeName == "IMG" && node.attributes[attr].name.toLowerCase() == "src" && dom.isLoadedImage(node) === true) {
                            attributes['src'] = node.src;
                        }
                        else if (su.lang.array(['rowspan', 'colspan']).contains(node.attributes[attr].name.toLowerCase()) && HAS_GET_ATTRIBUTE_BUG) {
                            if (node.attributes[attr].value !== 1) {
                                attributes[node.attributes[attr].name] = node.attributes[attr].value;
                            }
                        }
                        else {
                            attributes[node.attributes[attr].name] = node.attributes[attr].value;
                        }
                    }
                }
            }
            return attributes;
        }
        dom.getAttributes = getAttributes;
        ;
        var mapping = {
            "className": "class"
        };
        function setAttributes(attributes) {
            return {
                on: function (element) {
                    for (var i in attributes) {
                        element.setAttribute(mapping[i] || i, attributes[i]);
                    }
                }
            };
        }
        dom.setAttributes = setAttributes;
        ;
        /**
         *
         * Check whether the given node is a proper loaded image
         * FIXME: Returns undefined when unknown (Chrome, Safari)
         */
        function isLoadedImage(node) {
            try {
                return node.complete && !node.mozMatchesSelector(":-moz-broken");
            }
            catch (e) {
                if (node.complete && node.readyState === "complete") {
                    return true;
                }
            }
        }
        dom.isLoadedImage = isLoadedImage;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
var su;
(function (su) {
    su.commands = {}; //必须初始化，否则prototype undefined
    su.editorExtenders = []; //扩展数组
    su.extendEditor = function (extender) {
        su.editorExtenders.push(extender);
    };
    su.INVISIBLE_SPACE_REG_EXP = /\uFEFF/g;
    su.VOID_ELEMENTS = 'area, base, br, col, embed, hr, img, input, keygen, link, meta, param, source, track, wbr';
    su.PERMITTED_PHRASING_CONTENT_ONLY = 'h1, h2, h3, h4, h5, h6, p, pre';
    su.EMPTY_FUNCTION = function () { };
    su.ELEMENT_NODE = 1; //按键代码
    su.TEXT_NODE = 3;
    su.BACKSPACE_KEY = 8;
    su.ENTER_KEY = 13;
    su.ESCAPE_KEY = 27;
    su.SPACE_KEY = 32;
    su.TAB_KEY = 9;
    su.DELETE_KEY = 46;
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * Get element's style for a specific css property
         *
         * @param {Element} element The element on which to retrieve the style
         * @param {String} property The CSS property to retrieve ("float", "display", "text-align", ...)
         *
         * @example
         *    wysihtml.dom.getStyle("display").from(document.body);
         *    // => "block"
         */
        dom.getStyle = (function getStyle() {
            var stylePropertyMapping = {
                "float": ("styleFloat" in document.createElement("div").style) ? "styleFloat" : "cssFloat"
            }, REG_EXP_CAMELIZE = /\-[a-z]/g;
            function camelize(str) {
                return str.replace(REG_EXP_CAMELIZE, function (match) {
                    return match.charAt(1).toUpperCase();
                });
            }
            return function (property) {
                return {
                    from: function (element) {
                        if (element.nodeType !== su.ELEMENT_NODE) {
                            return;
                        }
                        var doc = element.ownerDocument, camelizedProperty = stylePropertyMapping[property] || camelize(property), style = element.style, currentStyle = element.currentStyle, styleValue = style[camelizedProperty];
                        if (styleValue) {
                            return styleValue;
                        }
                        // currentStyle is no standard and only supported by Opera and IE but it has one important advantage over the standard-compliant
                        // window.getComputedStyle, since it returns css property values in their original unit:
                        // If you set an elements width to "50%", window.getComputedStyle will give you it's current width in px while currentStyle
                        // gives you the original "50%".
                        // Opera supports both, currentStyle and window.getComputedStyle, that's why checking for currentStyle should have higher prio
                        if (currentStyle) {
                            try {
                                return currentStyle[camelizedProperty];
                            }
                            catch (e) {
                            }
                        }
                        var win = doc.defaultView || doc.parentWindow, needsOverflowReset = (property === "height" || property === "width") && element.nodeName === "TEXTAREA", originalOverflow, returnValue;
                        if (win.getComputedStyle) {
                            // Chrome and Safari both calculate a wrong width and height for textareas when they have scroll bars
                            // therfore we remove and restore the scrollbar and calculate the value in between
                            if (needsOverflowReset) {
                                originalOverflow = style.overflow;
                                style.overflow = "hidden";
                            }
                            returnValue = win.getComputedStyle(element, null).getPropertyValue(property);
                            if (needsOverflowReset) {
                                style.overflow = originalOverflow || "";
                            }
                            return returnValue;
                        }
                    }
                };
            };
        })();
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="../lang/array.ts" />
/// <reference path="../su.ts" />
/// <reference path="./get_style.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        function setStyles(styles) {
            return {
                on: function (element) {
                    var style = element.style;
                    if (typeof (styles) === "string") {
                        style.cssText += ";" + styles;
                        return;
                    }
                    for (var i in styles) {
                        if (i === "float") {
                            style.cssFloat = styles[i];
                            style.styleFloat = styles[i];
                        }
                        else {
                            style[i] = styles[i];
                        }
                    }
                }
            };
        }
        dom.setStyles = setStyles;
        ;
        /**
         * Mozilla, WebKit and Opera recalculate the computed width when box-sizing: boder-box; is set
         * So if an element has "width: 200px; -moz-box-sizing: border-box; border: 1px;" then
         * its computed css width will be 198px
         *
         * See https://bugzilla.mozilla.org/show_bug.cgi?id=520992
         */
        var BOX_SIZING_PROPERTIES = ["-webkit-box-sizing", "-moz-box-sizing", "-ms-box-sizing", "box-sizing"];
        var shouldIgnoreBoxSizingBorderBox = function (element) {
            if (hasBoxSizingBorderBox(element)) {
                return parseInt(dom.getStyle("width").from(element), 10) < element.offsetWidth;
            }
            return false;
        };
        var hasBoxSizingBorderBox = function (element) {
            var i = 0, length = BOX_SIZING_PROPERTIES.length;
            for (; i < length; i++) {
                if (dom.getStyle(BOX_SIZING_PROPERTIES[i]).from(element) === "border-box") {
                    return BOX_SIZING_PROPERTIES[i];
                }
            }
        };
        /**
         * Copy a set of styles from one element to another
         * Please note that this only works properly across browsers when the element from which to copy the styles
         * is in the dom
         *
         * Interesting article on how to copy styles
         *
         * @param {Array} stylesToCopy List of styles which should be copied
         * @return {Object} Returns an object which offers the "from" method which can be invoked with the element where to
         *    copy the styles from., this again returns an object which provides a method named "to" which can be invoked
         *    with the element where to copy the styles to (see example)
         *
         * @example
         *    var textarea    = document.querySelector("textarea"),
         *        div         = document.querySelector("div[contenteditable=true]"),
         *        anotherDiv  = document.querySelector("div.preview");
         *    wysihtml.dom.copyStyles(["overflow-y", "width", "height"]).from(textarea).to(div).andTo(anotherDiv);
         *
         */
        function copyStyles(stylesToCopy) {
            return {
                from: function (element) {
                    if (shouldIgnoreBoxSizingBorderBox(element)) {
                        stylesToCopy = su.lang.array(stylesToCopy).without(BOX_SIZING_PROPERTIES);
                    }
                    var cssText = "", length = stylesToCopy.length, i = 0, property;
                    for (; i < length; i++) {
                        property = stylesToCopy[i];
                        cssText += property + ":" + dom.getStyle(property).from(element) + ";";
                    }
                    return {
                        to: function pasteStylesTo(element) {
                            setStyles(cssText).on(element);
                            return { andTo: pasteStylesTo };
                        }
                    };
                }
            };
        }
        dom.copyStyles = copyStyles;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        var documentElement = document.documentElement;
        function setTextContent(element, text) {
            if ("textContent" in documentElement) {
                element.textContent = text;
            }
            else if ("innerText" in documentElement) {
                element.innerText = text;
            }
            else {
                element.nodeValue = text;
            }
        }
        dom.setTextContent = setTextContent;
        ;
        function getTextContent(element) {
            if ("textContent" in documentElement) {
                return element.textContent;
            }
            else if ("innerText" in documentElement) {
                return element.innerText;
            }
            else {
                return element.nodeValue;
            }
        }
        dom.getTextContent = getTextContent;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
var su;
(function (su) {
    var lang;
    (function (lang) {
        function object(obj) {
            return {
                /**
                 * @example
                 *    lang.object({ foo: 1, bar: 1 }).merge({ bar: 2, baz: 3 }).get();
                 *    // => { foo: 1, bar: 2, baz: 3 }
                 */
                merge: function (otherObj, deep) {
                    for (var i in otherObj) {
                        if (deep && object(otherObj[i]).isPlainObject() && (typeof obj[i] === "undefined" || object(obj[i]).isPlainObject())) {
                            if (typeof obj[i] === "undefined") {
                                obj[i] = object(otherObj[i]).clone(true);
                            }
                            else {
                                object(obj[i]).merge(object(otherObj[i]).clone(true));
                            }
                        }
                        else {
                            obj[i] = object(otherObj[i]).isPlainObject() ? object(otherObj[i]).clone(true) : otherObj[i];
                        }
                    }
                    return this;
                },
                difference: function (otherObj) {
                    var diffObj = {};
                    // Get old values not in comparing object
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            if (!otherObj.hasOwnProperty(i)) {
                                diffObj[i] = obj[i];
                            }
                        }
                    }
                    // Get new and different values in comparing object
                    for (var o in otherObj) {
                        if (otherObj.hasOwnProperty(o)) {
                            if (!obj.hasOwnProperty(o) || obj[o] !== otherObj[o]) {
                                diffObj[0] = obj[0];
                            }
                        }
                    }
                    return diffObj;
                },
                /**
                 * 返回 参数 obj
                 */
                get: function () {
                    return obj;
                },
                /**
                 * 克隆一个对象
                 * @example
                 *    lang.object({ foo: 1 }).clone();
                 *    // => { foo: 1 }
                 *
                 *    v0.4.14 adds options for deep clone : lang.object({ foo: 1 }).clone(true);
                 */
                clone: function (deep) {
                    var newObj = {}, i;
                    if (obj === null || !object(obj).isPlainObject()) {
                        return obj;
                    }
                    for (i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            if (deep) {
                                newObj[i] = object(obj[i]).clone(deep);
                            }
                            else {
                                newObj[i] = obj[i];
                            }
                        }
                    }
                    return newObj;
                },
                /**
                 * @example
                 *    lang.object([]).isArray();
                 *    // => true
                 */
                isArray: function () {
                    return Object.prototype.toString.call(obj) === "[object Array]";
                },
                /**
                 * @example
                 *    lang.object(function() {}).isFunction();
                 *    // => true
                 */
                isFunction: function () {
                    return Object.prototype.toString.call(obj) === '[object Function]';
                },
                isPlainObject: function () {
                    return obj && Object.prototype.toString.call(obj) === '[object Object]' && !(("Node" in window) ? obj instanceof Node : obj instanceof Element || obj instanceof Text);
                },
                /**
                 * @example
                 *    lang.object({}).isEmpty();
                 *    // => true
                 */
                isEmpty: function () {
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            return false;
                        }
                    }
                    return true;
                }
            };
        }
        lang.object = object;
        ;
    })(lang = su.lang || (su.lang = {}));
})(su || (su = {}));
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
/// <reference path="../dom/observe.ts" />
var su;
(function (su) {
    var quirks;
    (function (quirks) {
        /**
         * IE and Opera leave an empty paragraph in the contentEditable element after clearing it
         *
         * @param {Object} contentEditableElement The contentEditable element to observe for clearing events
         * @exaple
         *    wysihtml.quirks.ensureProperClearing(myContentEditableElement);
         */
        quirks.ensureProperClearing = (function () {
            var clearIfNecessary = function () {
                var element = this;
                setTimeout(function () {
                    var innerHTML = element.innerHTML.toLowerCase();
                    if (innerHTML == "<p>&nbsp;</p>" ||
                        innerHTML == "<p>&nbsp;</p><p>&nbsp;</p>") {
                        element.innerHTML = "";
                    }
                }, 0);
            };
            return function (composer) {
                su.dom.observe(composer.element, ["cut", "keydown"], clearIfNecessary);
            };
        })();
    })(quirks = su.quirks || (su.quirks = {}));
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
        * Simulate HTML5 placeholder attribute
        *
        * Needed since
        *    - div[contentEditable] elements don't support it
        *    - older browsers (such as IE8 and Firefox 3.6) don't support it at all
        *
        * @param {Object} parent Instance of main wysihtml.Editor class
        * @param {Element} view Instance of wysihtml.views.* class
        * @param {String} placeholderText
        *
        * @example
        *    wysihtml.dom.simulatePlaceholder(this, composer, "Foobar");
        */
        dom.simulatePlaceholder = function (editor, view, placeholderText, placeholderClassName) {
            var CLASS_NAME = placeholderClassName || "wysihtml-placeholder", unset = function () {
                var composerIsVisible = view.element.offsetWidth > 0 && view.element.offsetHeight > 0;
                if (view.hasPlaceholderSet()) {
                    view.clear();
                    view.element.focus();
                    if (composerIsVisible) {
                        setTimeout(function () {
                            var sel = view.selection.getSelection();
                            if (!sel.focusNode || !sel.anchorNode) {
                                view.selection.selectNode(view.element.firstChild || view.element);
                            }
                        }, 0);
                    }
                }
                view.placeholderSet = false;
                dom.removeClass(view.element, CLASS_NAME);
            }, set = function () {
                if (view.isEmpty() && !view.placeholderSet) {
                    view.placeholderSet = true;
                    view.setValue(placeholderText, false);
                    dom.addClass(view.element, CLASS_NAME);
                }
            };
            editor
                .on("set_placeholder", set)
                .on("unset_placeholder", unset)
                .on("focus:composer", unset)
                .on("paste:composer", unset)
                .on("blur:composer", set);
            set();
        };
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="../browser.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        function addClass(element, className) {
            var classList = element.classList;
            if (classList) {
                return classList.add(className);
            }
            if (hasClass(element, className)) {
                return;
            }
            element.className += " " + className;
        }
        dom.addClass = addClass;
        ;
        function removeClass(element, className) {
            var classList = element.classList;
            if (classList) {
                return classList.remove(className);
            }
            element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ");
        }
        dom.removeClass = removeClass;
        ;
        function hasClass(element, className) {
            var classList = element.classList;
            if (classList) {
                return classList.contains(className);
            }
            var elementClassName = element.className;
            return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
        }
        dom.hasClass = hasClass;
        var LIVE_CACHE = {}, DOCUMENT_IDENTIFIER = 1;
        function _getDocumentIdentifier(doc) {
            return doc._wysihtml_identifier || (doc._wysihtml_identifier = DOCUMENT_IDENTIFIER++);
        }
        /**
         *
         * @example dom.hasElementWithClassName(document,"hello")
         */
        dom.hasElementWithClassName = function (doc, className) {
            // getElementsByClassName is not supported by IE<9
            // but is sometimes mocked via library code (which then doesn't return live node lists)
            if (!su.browser.supportsNativeGetElementsByClassName()) {
                return !!doc.querySelector("." + className);
            }
            var key = _getDocumentIdentifier(doc) + ":" + className, cacheEntry = LIVE_CACHE[key];
            if (!cacheEntry) {
                cacheEntry = LIVE_CACHE[key] = doc.getElementsByClassName(className);
            }
            return cacheEntry.length > 0;
        };
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/**
 * 移除css类
 */
//是否有css类
/***
 * 添加css 类
 */
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * 插入节点
         * @param {HTMLElement} elementToInsert 插入的节点
         * @param {HTMLElement} element 参照节点
         */
        function insert(elementToInsert) {
            return {
                after: function (element) {
                    element.parentNode.insertBefore(elementToInsert, element.nextSibling);
                },
                before: function (element) {
                    element.parentNode.insertBefore(elementToInsert, element);
                },
                into: function (element) {
                    element.appendChild(elementToInsert);
                }
            };
        }
        dom.insert = insert;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="../lang/string.ts" />
var su;
(function (su) {
    var quirks;
    (function (quirks) {
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=664398
        //
        // In Firefox this:
        //      var d = document.createElement("div");
        //      d.innerHTML ='<a href="~"></a>';
        //      d.innerHTML;
        // will result in:
        //      <a href="%7E"></a>
        // which is wrong
        var TILDE_ESCAPED = "%7E";
        function getCorrectInnerHTML(element) {
            var innerHTML = element.innerHTML;
            if (innerHTML.indexOf(TILDE_ESCAPED) === -1) {
                return innerHTML;
            }
            var elementsWithTilde = element.querySelectorAll("[href*='~'], [src*='~']"), url, urlToSearch, length, i;
            for (i = 0, length = elementsWithTilde.length; i < length; i++) {
                url = elementsWithTilde[i].href || elementsWithTilde[i].src;
                urlToSearch = su.lang.string(url).replace("~").by(TILDE_ESCAPED);
                innerHTML = su.lang.string(innerHTML).replace(urlToSearch).by(url);
            }
            return innerHTML;
        }
        quirks.getCorrectInnerHTML = getCorrectInnerHTML;
        ;
    })(quirks = su.quirks || (su.quirks = {}));
})(su || (su = {}));
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
/// <reference path="../commands.ts" />
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
                this.selection = new su.Selection(this.parent, this.element, this.config.classNames.uneditableContainer);
                // Make sure commands dispatcher is ready
                this.commands = new su.Commands(this.parent);
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
var su;
(function (su) {
    var dom;
    (function (dom) {
        function getTextNodes(node, ingoreEmpty) {
            var all = [];
            for (node = node.firstChild; node; node = node.nextSibling) {
                if (node.nodeType == 3) {
                    if (!ingoreEmpty || !(/^\s*$/).test(node.innerText || node.textContent)) {
                        all.push(node);
                    }
                }
                else {
                    all = all.concat(dom.getTextNodes(node, ingoreEmpty));
                }
            }
            return all;
        }
        dom.getTextNodes = getTextNodes;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="./insert.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        /* Unwraps element and returns list of childNodes that the node contained.
        *
        * Example:
        *    var childnodes = wysihtml.dom.unwrap(document.querySelector('.unwrap-me'));
        */
        function unwrap(node) {
            var children = [];
            if (node.parentNode) {
                while (node.lastChild) {
                    children.unshift(node.lastChild);
                    dom.insert(node.lastChild).after(node);
                }
                node.parentNode.removeChild(node);
            }
            return children;
        }
        dom.unwrap = unwrap;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="./get_textnodes.ts" />
/// <reference path="../quirks/get_correct_inner_html.ts" />
/// <reference path="./attribute.ts" />
/// <reference path="../lang/object.ts" />
/// <reference path="../su.ts" />
/// <reference path="./unwrap.ts" />
/// <reference path="./class.ts" />
/// <reference path="./get_style.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * HTML Sanitizer
         * Rewrites the HTML based on given rules
         *
         * @param {Element|String} elementOrHtml HTML String to be sanitized OR element whose content should be sanitized
         * @param {Object} [rules] List of rules for rewriting the HTML, if there's no rule for an element it will
         *    be converted to a "span". Each rule is a key/value pair where key is the tag to convert, and value the
         *    desired substitution.
         * @param {Object} context Document object in which to parse the html, needed to sandbox the parsing
         *
         * @return {Element|String} Depends on the elementOrHtml parameter. When html then the sanitized html as string elsewise the element.
         *
         * @example
         *    var userHTML = '<div id="foo" onclick="alert(1);"><p><font color="red">foo</font><script>alert(1);</script></p></div>';
         *    wysihtml.dom.parse(userHTML, {
         *      tags {
         *        p:      "div",      // Rename p tags to div tags
         *        font:   "span"      // Rename font tags to span tags
         *        div:    true,       // Keep them, also possible (same result when passing: "div" or true)
         *        script: undefined   // Remove script elements
         *      }
         *    });
         *    // => <div><div><span>foo bar</span></div></div>
         *
         *    var userHTML = '<table><tbody><tr><td>I'm a table!</td></tr></tbody></table>';
         *    wysihtml.dom.parse(userHTML);
         *    // => '<span><span><span><span>I'm a table!</span></span></span></span>'
         *
         *    var userHTML = '<div>foobar<br>foobar</div>';
         *    wysihtml.dom.parse(userHTML, {
         *      tags: {
         *        div: undefined,
         *        br:  true
         *      }
         *    });
         *    // => ''
         *
         *    var userHTML = '<div class="red">foo</div><div class="pink">bar</div>';
         *    wysihtml.dom.parse(userHTML, {
         *      classes: {
         *        red:    1,
         *        green:  1
         *      },
         *      tags: {
         *        div: {
         *          rename_tag:     "p"
         *        }
         *      }
         *    });
         *    // => '<p class="red">foo</p><p>bar</p>'
         */
        dom.parse = function (elementOrHtml_current, config_current) {
            /* TODO: Currently escaped module pattern as otherwise folloowing default swill be shared among multiple editors.
             * Refactor whole code as this method while workind is kind of awkward too */
            /**
             * It's not possible to use a XMLParser/DOMParser as HTML5 is not always well-formed XML
             * new DOMParser().parseFromString('<img src="foo.gif">') will cause a parseError since the
             * node isn't closed
             *
             * Therefore we've to use the browser's ordinary HTML parser invoked by setting innerHTML.
             */
            var NODE_TYPE_MAPPING = {
                "1": _handleElement,
                "3": _handleText,
                "8": _handleComment
            }, 
            // Rename unknown tags to this
            DEFAULT_NODE_NAME = "span", WHITE_SPACE_REG_EXP = /\s+/, defaultRules = { tags: {}, classes: {} }, currentRules = {
                selectors: {},
                tags: {},
                attributes: {},
                classes: {},
                classes_blacklist: {},
                comments: {}
            }, blockElements = ["ADDRESS", "BLOCKQUOTE", "CENTER", "DIR", "DIV", "DL", "FIELDSET",
                "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "ISINDEX", "MENU",
                "NOFRAMES", "NOSCRIPT", "OL", "P", "PRE", "TABLE", "UL"];
            /**
             * Iterates over all childs of the element, recreates them, appends them into a document fragment
             * which later replaces the entire body content
             */
            function parse(elementOrHtml, config) {
                su.lang.object(currentRules).merge(defaultRules).merge(config.rules).get();
                var context = config.context || elementOrHtml.ownerDocument || document, fragment = context.createDocumentFragment(), isString = typeof (elementOrHtml) === "string", clearInternals = false, element, newNode, firstChild;
                if (config.clearInternals === true) {
                    clearInternals = true;
                }
                if (isString) {
                    element = dom.getAsDom(elementOrHtml, context);
                }
                else {
                    element = elementOrHtml;
                }
                if (currentRules.selectors) {
                    _applySelectorRules(element, currentRules.selectors);
                }
                while (element.firstChild) {
                    firstChild = element.firstChild;
                    newNode = _convert(firstChild, config.cleanUp, clearInternals, config.uneditableClass);
                    if (newNode) {
                        fragment.appendChild(newNode);
                    }
                    if (firstChild !== newNode) {
                        element.removeChild(firstChild);
                    }
                }
                if (config.unjoinNbsps) {
                    // replace joined non-breakable spaces with unjoined
                    var txtnodes = dom.getTextNodes(fragment);
                    for (var n = txtnodes.length; n--;) {
                        txtnodes[n].nodeValue = txtnodes[n].nodeValue.replace(/([\S\u00A0])\u00A0/gi, "$1 ");
                    }
                }
                // Clear element contents
                element.innerHTML = "";
                // Insert new DOM tree
                element.appendChild(fragment);
                return isString ? su.quirks.getCorrectInnerHTML(element) : element;
            }
            function _convert(oldNode, cleanUp, clearInternals, uneditableClass) {
                var oldNodeType = oldNode.nodeType, oldChilds = oldNode.childNodes, oldChildsLength = oldChilds.length, method = NODE_TYPE_MAPPING[oldNodeType], i = 0, fragment, newNode, newChild, nodeDisplay;
                // Passes directly elemets with uneditable class
                if (uneditableClass && oldNodeType === 1 && dom.hasClass(oldNode, uneditableClass)) {
                    return oldNode;
                }
                newNode = method && method(oldNode, clearInternals);
                // Remove or unwrap node in case of return value null or false
                if (!newNode) {
                    if (newNode === false) {
                        // false defines that tag should be removed but contents should remain (unwrap)
                        fragment = oldNode.ownerDocument.createDocumentFragment();
                        for (i = oldChildsLength; i--;) {
                            if (oldChilds[i]) {
                                newChild = _convert(oldChilds[i], cleanUp, clearInternals, uneditableClass);
                                if (newChild) {
                                    if (oldChilds[i] === newChild) {
                                        i--;
                                    }
                                    fragment.insertBefore(newChild, fragment.firstChild);
                                }
                            }
                        }
                        nodeDisplay = dom.getStyle("display").from(oldNode);
                        if (nodeDisplay === '') {
                            // Handle display style when element not in dom
                            nodeDisplay = su.lang.array(blockElements).contains(oldNode.tagName) ? "block" : "";
                        }
                        if (su.lang.array(["block", "flex", "table"]).contains(nodeDisplay)) {
                            fragment.appendChild(oldNode.ownerDocument.createElement("br"));
                        }
                        // TODO: try to minimize surplus spaces
                        if (su.lang.array([
                            "div", "pre", "p",
                            "table", "td", "th",
                            "ul", "ol", "li",
                            "dd", "dl",
                            "footer", "header", "section",
                            "h1", "h2", "h3", "h4", "h5", "h6"
                        ]).contains(oldNode.nodeName.toLowerCase()) && oldNode.parentNode.lastChild !== oldNode) {
                            // add space at first when unwraping non-textflow elements
                            if (!oldNode.nextSibling || oldNode.nextSibling.nodeType !== 3 || !(/^\s/).test(oldNode.nextSibling.nodeValue)) {
                                fragment.appendChild(oldNode.ownerDocument.createTextNode(" "));
                            }
                        }
                        if (fragment.normalize) {
                            fragment.normalize();
                        }
                        return fragment;
                    }
                    else {
                        // Remove
                        return null;
                    }
                }
                // Converts all childnodes
                for (i = 0; i < oldChildsLength; i++) {
                    if (oldChilds[i]) {
                        newChild = _convert(oldChilds[i], cleanUp, clearInternals, uneditableClass);
                        if (newChild) {
                            if (oldChilds[i] === newChild) {
                                i--;
                            }
                            newNode.appendChild(newChild);
                        }
                    }
                }
                // Cleanup senseless <span> elements
                if (cleanUp &&
                    newNode.nodeName.toLowerCase() === DEFAULT_NODE_NAME &&
                    (!newNode.childNodes.length ||
                        ((/^\s*$/gi).test(newNode.innerHTML) && (clearInternals || (oldNode.className !== "_wysihtml-temp-placeholder" && oldNode.className !== "rangySelectionBoundary"))) ||
                        !newNode.attributes.length)) {
                    fragment = newNode.ownerDocument.createDocumentFragment();
                    while (newNode.firstChild) {
                        fragment.appendChild(newNode.firstChild);
                    }
                    if (fragment.normalize) {
                        fragment.normalize();
                    }
                    return fragment;
                }
                if (newNode.normalize) {
                    newNode.normalize();
                }
                return newNode;
            }
            function _applySelectorRules(element, selectorRules) {
                var sel, method, els;
                for (sel in selectorRules) {
                    if (selectorRules.hasOwnProperty(sel)) {
                        if (su.lang.object(selectorRules[sel]).isFunction()) {
                            method = selectorRules[sel];
                        }
                        else if (typeof (selectorRules[sel]) === "string" && elementHandlingMethods[selectorRules[sel]]) {
                            method = elementHandlingMethods[selectorRules[sel]];
                        }
                        els = element.querySelectorAll(sel);
                        for (var i = els.length; i--;) {
                            method(els[i]);
                        }
                    }
                }
            }
            function _handleElement(oldNode, clearInternals) {
                var rule, newNode, tagRules = currentRules.tags, nodeName = oldNode.nodeName.toLowerCase(), scopeName = oldNode.scopeName, renameTag;
                /**
                 * We already parsed that element
                 * ignore it! (yes, this sometimes happens in IE8 when the html is invalid)
                 */
                if (oldNode._wysihtml) {
                    return null;
                }
                oldNode._wysihtml = 1;
                if (oldNode.className === "wysihtml-temp") {
                    return null;
                }
                /**
                 * IE is the only browser who doesn't include the namespace in the
                 * nodeName, that's why we have to prepend it by ourselves
                 * scopeName is a proprietary IE feature
                 * read more here http://msdn.microsoft.com/en-us/library/ms534388(v=vs.85).aspx
                 */
                if (scopeName && scopeName != "HTML") {
                    nodeName = scopeName + ":" + nodeName;
                }
                /**
                 * Repair node
                 * IE is a bit bitchy when it comes to invalid nested markup which includes unclosed tags
                 * A <p> doesn't need to be closed according HTML4-5 spec, we simply replace it with a <div> to preserve its content and layout
                 */
                if ("outerHTML" in oldNode) {
                    if (!su.browser.autoClosesUnclosedTags() &&
                        oldNode.nodeName === "P" &&
                        oldNode.outerHTML.slice(-4).toLowerCase() !== "</p>") {
                        nodeName = "div";
                    }
                }
                if (nodeName in tagRules) {
                    rule = tagRules[nodeName];
                    if (!rule || rule.remove) {
                        return null;
                    }
                    else if (rule.unwrap) {
                        return false;
                    }
                    rule = typeof (rule) === "string" ? { rename_tag: rule } : rule;
                }
                else if (oldNode.firstChild) {
                    rule = { rename_tag: DEFAULT_NODE_NAME };
                }
                else {
                    // Remove empty unknown elements
                    return null;
                }
                // tests if type condition is met or node should be removed/unwrapped/renamed
                if (rule.one_of_type && !_testTypes(oldNode, currentRules, rule.one_of_type, clearInternals)) {
                    if (rule.remove_action) {
                        if (rule.remove_action === "unwrap") {
                            return false;
                        }
                        else if (rule.remove_action === "rename") {
                            renameTag = rule.remove_action_rename_to || DEFAULT_NODE_NAME;
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                }
                newNode = oldNode.ownerDocument.createElement(renameTag || rule.rename_tag || nodeName);
                _handleAttributes(oldNode, newNode, rule, clearInternals);
                _handleStyles(oldNode, newNode, rule);
                oldNode = null;
                if (newNode.normalize) {
                    newNode.normalize();
                }
                return newNode;
            }
            function _testTypes(oldNode, rules, types, clearInternals) {
                var definition, type;
                // do not interfere with placeholder span or pasting caret position is not maintained
                if (oldNode.nodeName === "SPAN" && !clearInternals && (oldNode.className === "_wysihtml-temp-placeholder" || oldNode.className === "rangySelectionBoundary")) {
                    return true;
                }
                for (type in types) {
                    if (types.hasOwnProperty(type) && rules.type_definitions && rules.type_definitions[type]) {
                        definition = rules.type_definitions[type];
                        if (_testType(oldNode, definition)) {
                            return true;
                        }
                    }
                }
                return false;
            }
            function array_contains(a, obj) {
                var i = a.length;
                while (i--) {
                    if (a[i] === obj) {
                        return true;
                    }
                }
                return false;
            }
            function _testType(oldNode, definition) {
                var nodeClasses = oldNode.getAttribute("class"), nodeStyles = oldNode.getAttribute("style"), classesLength, s, s_corrected, a, attr, currentClass, styleProp;
                // test for methods
                if (definition.methods) {
                    for (var m in definition.methods) {
                        if (definition.methods.hasOwnProperty(m) && typeCeckMethods[m]) {
                            if (typeCeckMethods[m](oldNode)) {
                                return true;
                            }
                        }
                    }
                }
                // test for classes, if one found return true
                if (nodeClasses && definition.classes) {
                    nodeClasses = nodeClasses.replace(/^\s+/g, '').replace(/\s+$/g, '').split(WHITE_SPACE_REG_EXP);
                    classesLength = nodeClasses.length;
                    for (var i = 0; i < classesLength; i++) {
                        if (definition.classes[nodeClasses[i]]) {
                            return true;
                        }
                    }
                }
                // test for styles, if one found return true
                if (nodeStyles && definition.styles) {
                    nodeStyles = nodeStyles.split(';');
                    for (s in definition.styles) {
                        if (definition.styles.hasOwnProperty(s)) {
                            for (var sp = nodeStyles.length; sp--;) {
                                styleProp = nodeStyles[sp].split(':');
                                if (styleProp[0].replace(/\s/g, '').toLowerCase() === s) {
                                    if (definition.styles[s] === true || definition.styles[s] === 1 || su.lang.array(definition.styles[s]).contains(styleProp[1].replace(/\s/g, '').toLowerCase())) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
                // test for attributes in general against regex match
                if (definition.attrs) {
                    for (a in definition.attrs) {
                        if (definition.attrs.hasOwnProperty(a)) {
                            attr = su.dom.getAttribute(oldNode, a);
                            if (typeof (attr) === "string") {
                                if (attr.search(definition.attrs[a]) > -1) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            }
            function _handleStyles(oldNode, newNode, rule) {
                var s, v;
                if (rule && rule.keep_styles) {
                    for (s in rule.keep_styles) {
                        if (rule.keep_styles.hasOwnProperty(s)) {
                            v = (s === "float") ? oldNode.style.styleFloat || oldNode.style.cssFloat : oldNode.style[s];
                            // value can be regex and if so should match or style skipped
                            if (rule.keep_styles[s] instanceof RegExp && !(rule.keep_styles[s].test(v))) {
                                continue;
                            }
                            if (s === "float") {
                                // IE compability
                                newNode.style[(oldNode.style.styleFloat) ? 'styleFloat' : 'cssFloat'] = v;
                            }
                            else if (oldNode.style[s]) {
                                newNode.style[s] = v;
                            }
                        }
                    }
                }
            }
            ;
            function _getAttributesBeginningWith(beginning, attributes) {
                var returnAttributes = [];
                for (var attr in attributes) {
                    if (attributes.hasOwnProperty(attr) && attr.indexOf(beginning) === 0) {
                        returnAttributes.push(attr);
                    }
                }
                return returnAttributes;
            }
            function _checkAttribute(attributeName, attributeValue, methodName, nodeName) {
                var method = su.lang.object(methodName).isFunction() ? methodName : attributeCheckMethods[methodName], newAttributeValue;
                if (method) {
                    newAttributeValue = method(attributeValue, nodeName);
                    if (typeof (newAttributeValue) === "string") {
                        return newAttributeValue;
                    }
                }
                return false;
            }
            function _checkAttributes(oldNode, local_attributes) {
                var globalAttributes = su.lang.object(currentRules.attributes || {}).clone(), // global values for check/convert values of attributes
                checkAttributes = su.lang.object(globalAttributes).merge(su.lang.object(local_attributes || {}).clone()).get(), attributes = {}, oldAttributes = su.dom.getAttributes(oldNode), attributeName, newValue, matchingAttributes;
                for (attributeName in checkAttributes) {
                    if ((/\*$/).test(attributeName)) {
                        matchingAttributes = _getAttributesBeginningWith(attributeName.slice(0, -1), oldAttributes);
                        for (var i = 0, imax = matchingAttributes.length; i < imax; i++) {
                            newValue = _checkAttribute(matchingAttributes[i], oldAttributes[matchingAttributes[i]], checkAttributes[attributeName], oldNode.nodeName);
                            if (newValue !== false) {
                                attributes[matchingAttributes[i]] = newValue;
                            }
                        }
                    }
                    else {
                        newValue = _checkAttribute(attributeName, oldAttributes[attributeName], checkAttributes[attributeName], oldNode.nodeName);
                        if (newValue !== false) {
                            attributes[attributeName] = newValue;
                        }
                    }
                }
                return attributes;
            }
            // TODO: refactor. Too long to read
            function _handleAttributes(oldNode, newNode, rule, clearInternals) {
                var attributes = {}, // fresh new set of attributes to set on newNode
                setClass = rule.set_class, // classes to set
                addClass = rule.add_class, // add classes based on existing attributes
                addStyle = rule.add_style, // add styles based on existing attributes
                setAttributes = rule.set_attributes, // attributes to set on the current node
                allowedClasses = currentRules.classes, i = 0, classes = [], styles = [], newClasses = [], oldClasses = "", classesLength, newClassesLength, currentClass, newClass, attributeName, method;
                if (setAttributes) {
                    attributes = su.lang.object(setAttributes).clone();
                }
                // check/convert values of attributes
                attributes = su.lang.object(attributes).merge(_checkAttributes(oldNode, rule.check_attributes)).get();
                if (setClass) {
                    classes.push(setClass);
                }
                if (addClass) {
                    for (attributeName in addClass) {
                        method = addClassMethods[addClass[attributeName]];
                        if (!method) {
                            continue;
                        }
                        newClass = method(su.dom.getAttribute(oldNode, attributeName));
                        if (typeof (newClass) === "string") {
                            classes.push(newClass);
                        }
                    }
                }
                if (addStyle) {
                    for (attributeName in addStyle) {
                        method = addStyleMethods[addStyle[attributeName]];
                        if (!method) {
                            continue;
                        }
                        var newStyle = method(su.dom.getAttribute(oldNode, attributeName));
                        if (typeof (newStyle) === "string") {
                            styles.push(newStyle);
                        }
                    }
                }
                if (typeof (allowedClasses) === "string" && allowedClasses === "any") {
                    if (oldNode.getAttribute("class")) {
                        if (currentRules.classes_blacklist) {
                            oldClasses = oldNode.getAttribute("class");
                            if (oldClasses) {
                                classes = classes.concat(oldClasses.split(WHITE_SPACE_REG_EXP));
                            }
                            classesLength = classes.length;
                            for (; i < classesLength; i++) {
                                currentClass = classes[i];
                                if (!currentRules.classes_blacklist[currentClass]) {
                                    newClasses.push(currentClass);
                                }
                            }
                            if (newClasses.length) {
                                attributes["class"] = su.lang.array(newClasses).unique().join(" ");
                            }
                        }
                        else {
                            attributes["class"] = oldNode.getAttribute("class");
                        }
                    }
                    else {
                        if (classes && classes.length > 0) {
                            attributes["class"] = su.lang.array(classes).unique().join(" ");
                        }
                    }
                }
                else {
                    // make sure that wysihtml temp class doesn't get stripped out
                    if (!clearInternals) {
                        allowedClasses["_wysihtml-temp-placeholder"] = 1;
                        allowedClasses["_rangySelectionBoundary"] = 1;
                        allowedClasses["wysiwyg-tmp-selected-cell"] = 1;
                    }
                    // add old classes last
                    oldClasses = oldNode.getAttribute("class");
                    if (oldClasses) {
                        classes = classes.concat(oldClasses.split(WHITE_SPACE_REG_EXP));
                    }
                    classesLength = classes.length;
                    for (; i < classesLength; i++) {
                        currentClass = classes[i];
                        if (allowedClasses[currentClass]) {
                            newClasses.push(currentClass);
                        }
                    }
                    if (newClasses.length) {
                        attributes["class"] = su.lang.array(newClasses).unique().join(" ");
                    }
                }
                // remove table selection class if present
                if (attributes["class"] && clearInternals) {
                    attributes["class"] = attributes["class"].replace("wysiwyg-tmp-selected-cell", "");
                    if ((/^\s*$/g).test(attributes["class"])) {
                        delete attributes["class"];
                    }
                }
                if (styles.length) {
                    attributes["style"] = su.lang.array(styles).unique().join(" ");
                }
                // set attributes on newNode
                for (attributeName in attributes) {
                    // Setting attributes can cause a js error in IE under certain circumstances
                    // eg. on a <img> under https when it's new attribute value is non-https
                    // TODO: Investigate this further and check for smarter handling
                    try {
                        newNode.setAttribute(attributeName, attributes[attributeName]);
                    }
                    catch (e) { }
                }
                // IE8 sometimes loses the width/height attributes when those are set before the "src"
                // so we make sure to set them again
                if (attributes.src) {
                    if (typeof (attributes.width) !== "undefined") {
                        newNode.setAttribute("width", attributes.width);
                    }
                    if (typeof (attributes.height) !== "undefined") {
                        newNode.setAttribute("height", attributes.height);
                    }
                }
            }
            function _handleText(oldNode) {
                var nextSibling = oldNode.nextSibling;
                if (nextSibling && nextSibling.nodeType === su.TEXT_NODE) {
                    // Concatenate text nodes
                    nextSibling.data = oldNode.data.replace(su.INVISIBLE_SPACE_REG_EXP, "") + nextSibling.data.replace(su.INVISIBLE_SPACE_REG_EXP, "");
                }
                else {
                    // \uFEFF = wysihtml.INVISIBLE_SPACE (used as a hack in certain rich text editing situations)
                    var data = oldNode.data.replace(su.INVISIBLE_SPACE_REG_EXP, "");
                    return oldNode.ownerDocument.createTextNode(data);
                }
            }
            function _handleComment(oldNode) {
                if (currentRules.comments) {
                    return oldNode.ownerDocument.createComment(oldNode.nodeValue);
                }
            }
            // ------------ attribute checks ------------ \\
            var attributeCheckMethods = {
                url: (function () {
                    var REG_EXP = /^https?:\/\//i;
                    return function (attributeValue) {
                        if (!attributeValue || !attributeValue.match(REG_EXP)) {
                            return null;
                        }
                        return attributeValue.replace(REG_EXP, function (match) {
                            return match.toLowerCase();
                        });
                    };
                })(),
                src: (function () {
                    var REG_EXP = /^(\/|https?:\/\/)/i;
                    return function (attributeValue) {
                        if (!attributeValue || !attributeValue.match(REG_EXP)) {
                            return null;
                        }
                        return attributeValue.replace(REG_EXP, function (match) {
                            return match.toLowerCase();
                        });
                    };
                })(),
                href: (function () {
                    var REG_EXP = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
                    return function (attributeValue) {
                        if (!attributeValue || !attributeValue.match(REG_EXP)) {
                            return null;
                        }
                        return attributeValue.replace(REG_EXP, function (match) {
                            return match.toLowerCase();
                        });
                    };
                })(),
                alt: (function () {
                    var REG_EXP = /[^ a-z0-9_\-]/gi;
                    return function (attributeValue, nodeName) {
                        if (!attributeValue) {
                            if (nodeName === "IMG") {
                                return "";
                            }
                            else {
                                return null;
                            }
                        }
                        return attributeValue.replace(REG_EXP, "");
                    };
                })(),
                // Integers. Does not work with floating point numbers and units
                numbers: (function () {
                    var REG_EXP = /\D/g;
                    return function (attributeValue) {
                        attributeValue = (attributeValue || "").replace(REG_EXP, "");
                        return attributeValue || null;
                    };
                })(),
                // Useful for with/height attributes where floating points and percentages are allowed
                dimension: (function () {
                    var REG_EXP = /\D*(\d+)(\.\d+)?\s?(%)?\D*/;
                    return function (attributeValue) {
                        attributeValue = (attributeValue || "").replace(REG_EXP, "$1$2$3");
                        return attributeValue || null;
                    };
                })(),
                any: (function () {
                    return function (attributeValue) {
                        if (!attributeValue) {
                            return null;
                        }
                        return attributeValue;
                    };
                })()
            };
            // ------------ style converter (converts an html attribute to a style) ------------ \\
            var addStyleMethods = {
                align_text: (function () {
                    var mapping = {
                        left: "text-align: left;",
                        right: "text-align: right;",
                        center: "text-align: center;"
                    };
                    return function (attributeValue) {
                        return mapping[String(attributeValue).toLowerCase()];
                    };
                })()
            };
            // ------------ class converter (converts an html attribute to a class name) ------------ \\
            var addClassMethods = {
                align_img: (function () {
                    var mapping = {
                        left: "wysiwyg-float-left",
                        right: "wysiwyg-float-right"
                    };
                    return function (attributeValue) {
                        return mapping[String(attributeValue).toLowerCase()];
                    };
                })(),
                align_text: (function () {
                    var mapping = {
                        left: "wysiwyg-text-align-left",
                        right: "wysiwyg-text-align-right",
                        center: "wysiwyg-text-align-center",
                        justify: "wysiwyg-text-align-justify"
                    };
                    return function (attributeValue) {
                        return mapping[String(attributeValue).toLowerCase()];
                    };
                })(),
                clear_br: (function () {
                    var mapping = {
                        left: "wysiwyg-clear-left",
                        right: "wysiwyg-clear-right",
                        both: "wysiwyg-clear-both",
                        all: "wysiwyg-clear-both"
                    };
                    return function (attributeValue) {
                        return mapping[String(attributeValue).toLowerCase()];
                    };
                })(),
                size_font: (function () {
                    var mapping = {
                        "1": "wysiwyg-font-size-xx-small",
                        "2": "wysiwyg-font-size-small",
                        "3": "wysiwyg-font-size-medium",
                        "4": "wysiwyg-font-size-large",
                        "5": "wysiwyg-font-size-x-large",
                        "6": "wysiwyg-font-size-xx-large",
                        "7": "wysiwyg-font-size-xx-large",
                        "-": "wysiwyg-font-size-smaller",
                        "+": "wysiwyg-font-size-larger"
                    };
                    return function (attributeValue) {
                        return mapping[String(attributeValue).charAt(0)];
                    };
                })()
            };
            // checks if element is possibly visible
            var typeCeckMethods = {
                has_visible_contet: (function () {
                    var txt, isVisible = false, visibleElements = ['img', 'video', 'picture', 'br', 'script', 'noscript',
                        'style', 'table', 'iframe', 'object', 'embed', 'audio',
                        'svg', 'input', 'button', 'select', 'textarea', 'canvas'];
                    return function (el) {
                        // has visible innertext. so is visible
                        txt = (el.innerText || el.textContent).replace(/\s/g, '');
                        if (txt && txt.length > 0) {
                            return true;
                        }
                        // matches list of visible dimensioned elements
                        for (var i = visibleElements.length; i--;) {
                            if (el.querySelector(visibleElements[i])) {
                                return true;
                            }
                        }
                        // try to measure dimesions in last resort. (can find only of elements in dom)
                        if (el.offsetWidth && el.offsetWidth > 0 && el.offsetHeight && el.offsetHeight > 0) {
                            return true;
                        }
                        return false;
                    };
                })()
            };
            var elementHandlingMethods = {
                unwrap: function (element) {
                    dom.unwrap(element);
                },
                remove: function (element) {
                    element.parentNode.removeChild(element);
                }
            };
            return parse(elementOrHtml_current, config_current);
        };
        /**
         * Returns the given html wrapped in a div element
         *
         * Fixing IE's inability to treat unknown elements (HTML5 section, article, ...) correctly
         * when inserted via innerHTML
         *
         * @param {String} html The html which should be wrapped in a dom element
         * @param {Obejct} [context] Document object of the context the html belongs to
         *
         * @example
         *    wysihtml.dom.getAsDom("<article>foo</article>");
         */
        dom.getAsDom = (function () {
            var _innerHTMLShiv = function (html, context) {
                var tempElement = context.createElement("div");
                tempElement.style.display = "none";
                context.body.appendChild(tempElement);
                // IE throws an exception when trying to insert <frameset></frameset> via innerHTML
                try {
                    tempElement.innerHTML = html;
                }
                catch (e) { }
                context.body.removeChild(tempElement);
                return tempElement;
            };
            /**
             * Make sure IE supports HTML5 tags, which is accomplished by simply creating one instance of each element
             */
            var _ensureHTML5Compatibility = function (context) {
                if (context._wysihtml_supportsHTML5Tags) {
                    return;
                }
                for (var i = 0, length = HTML5_ELEMENTS.length; i < length; i++) {
                    context.createElement(HTML5_ELEMENTS[i]);
                }
                context._wysihtml_supportsHTML5Tags = true;
            };
            /**
             * List of html5 tags
             * taken from http://simon.html5.org/html5-elements
             */
            var HTML5_ELEMENTS = [
                "abbr", "article", "aside", "audio", "bdi", "canvas", "command", "datalist", "details", "figcaption",
                "figure", "footer", "header", "hgroup", "keygen", "mark", "meter", "nav", "output", "progress",
                "rp", "rt", "ruby", "svg", "section", "source", "summary", "time", "track", "video", "wbr"
            ];
            return function (html, context) {
                context = context || document;
                var tempElement;
                if (typeof (html) === "object" && html.nodeType) {
                    tempElement = context.createElement("div");
                    tempElement.appendChild(html);
                }
                else if (su.browser.supportsHTML5Tags(context)) {
                    tempElement = context.createElement("div");
                    tempElement.innerHTML = html;
                }
                else {
                    _ensureHTML5Compatibility(context);
                    tempElement = _innerHTMLShiv(html, context);
                }
                return tempElement;
            };
        })();
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="./lang/array.ts" />
/// <reference path="./lang/dispatcher.ts" />
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
        Editor.prototype.isCompatible = function () {
            return this._isCompatible;
        };
        Editor.prototype.clear = function () {
            this.currentView.clear();
            return this;
        };
        Editor.prototype.getValue = function (parse, clearInternals) {
            return this.currentView.getValue(parse, clearInternals);
        };
        Editor.prototype.setValue = function (html, parse) {
            this.fire("unset_placeholder");
            if (!html) {
                return this.clear();
            }
            this.currentView.setValue(html, parse);
            return this;
        };
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
        Editor.prototype.parse = function (htmlOrElement, clearInternals, customRules) {
            var parseContext = (this.config.contentEditableMode) ? document : ((this.composer) ? this.composer.sandbox.getDocument() : null);
            var returnValue = this.config.parser(htmlOrElement, {
                "rules": customRules || this.config.parserRules,
                "cleanUp": this.config.cleanUp,
                "context": parseContext,
                "uneditableClass": this.config.classNames.uneditableContainer,
                "clearInternals": clearInternals
            });
            if (typeof (htmlOrElement) === "object") {
                su.quirks.redraw(htmlOrElement);
            }
            return returnValue;
        };
        return Editor;
    }(su.lang.Dispatcher));
    su.Editor = Editor;
})(su || (su = {}));
var polyfills = function (win, doc) {
    var methods = {
        // Safary has a bug of not restoring selection after node.normalize correctly.
        // Detects the misbegaviour and patches it
        normalizeHasCaretError: function () {
            if ("createRange" in doc && "getSelection" in win) {
                var originalTarget, scrollTop = window.pageYOffset, scrollLeft = window.pageXOffset, e = doc.createElement('div'), t1 = doc.createTextNode('a'), t2 = doc.createTextNode('a'), t3 = doc.createTextNode('a'), r = doc.createRange(), s, ret;
                if (document.activeElement) {
                    if (document.activeElement.nodeType === 1 && ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].indexOf(document.activeElement.nodeName) > -1) {
                        originalTarget = {
                            type: 'form',
                            node: document.activeElement,
                            start: document.activeElement.selectionStart,
                            end: document.activeElement.selectionEnd
                        };
                    }
                    else {
                        s = win.getSelection();
                        if (s && s.anchorNode) {
                            originalTarget = {
                                type: 'range',
                                anchorNode: s.anchorNode,
                                anchorOffset: s.anchorOffset,
                                focusNode: s.focusNode,
                                focusOffset: s.focusOffset
                            };
                        }
                    }
                }
                e.setAttribute('contenteditable', 'true');
                e.appendChild(t1);
                e.appendChild(t2);
                e.appendChild(t3);
                doc.body.appendChild(e);
                r.setStart(t2, 1);
                r.setEnd(t2, 1);
                s = win.getSelection();
                s.removeAllRanges();
                s.addRange(r);
                e.normalize();
                s = win.getSelection();
                ret = (e.childNodes.length !== 1 || s.anchorNode !== e.firstChild || s.anchorOffset !== 2);
                e.parentNode.removeChild(e);
                s.removeAllRanges();
                if (originalTarget) {
                    if (originalTarget.type === 'form') {
                        // The selection parameters are not present for all form elements
                        if (typeof originalTarget.start !== 'undefined' && typeof originalTarget.end !== 'undefined') {
                            originalTarget.node.setSelectionRange(originalTarget.start, originalTarget.end);
                        }
                        originalTarget.node.focus();
                    }
                    else if (originalTarget.type === 'range') {
                        r = doc.createRange();
                        r.setStart(originalTarget.anchorNode, originalTarget.anchorOffset);
                        r.setEnd(originalTarget.focusNode, originalTarget.focusOffset);
                        s.addRange(r);
                    }
                }
                if (scrollTop !== window.pageYOffset || scrollLeft !== window.pageXOffset) {
                    win.scrollTo(scrollLeft, scrollTop);
                }
                return ret;
            }
        },
        apply: function () {
            // closest, matches, and remove polyfill
            // https://github.com/jonathantneal/closest
            (function (ELEMENT) {
                ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector || function matches(selector) {
                    var element = this, elements = (element.document || element.ownerDocument).querySelectorAll(selector), index = 0;
                    while (elements[index] && elements[index] !== element) {
                        ++index;
                    }
                    return elements[index] ? true : false;
                };
                ELEMENT.closest = ELEMENT.closest || function closest(selector) {
                    var element = this;
                    while (element) {
                        if (element.matches(selector)) {
                            break;
                        }
                        element = element.parentElement;
                    }
                    return element;
                };
                ELEMENT.remove = ELEMENT.remove || function remove() {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                };
            }(win.Element.prototype));
            if (!('classList' in doc.documentElement) && win.Object.defineProperty && typeof win.HTMLElement !== 'undefined') {
                win.Object.defineProperty(win.HTMLElement.prototype, 'classList', {
                    get: function () {
                        var self = this;
                        function update(fn) {
                            return function (value) {
                                var classes = self.className.split(/\s+/), index = classes.indexOf(value);
                                fn(classes, index, value);
                                self.className = classes.join(' ');
                            };
                        }
                        var ret = {
                            add: update(function (classes, index, value) {
                                ~index || classes.push(value);
                            }),
                            remove: update(function (classes, index) {
                                ~index && classes.splice(index, 1);
                            }),
                            toggle: update(function (classes, index, value) {
                                ~index ? classes.splice(index, 1) : classes.push(value);
                            }),
                            contains: function (value) {
                                return !!~self.className.split(/\s+/).indexOf(value);
                            },
                            item: function (i) {
                                return self.className.split(/\s+/)[i] || null;
                            }
                        };
                        win.Object.defineProperty(ret, 'length', {
                            get: function () {
                                return self.className.split(/\s+/).length;
                            }
                        });
                        return ret;
                    }
                });
            }
            var getTextNodes = function (node) {
                var all = [];
                for (node = node.firstChild; node; node = node.nextSibling) {
                    if (node.nodeType == 3) {
                        all.push(node);
                    }
                    else {
                        all = all.concat(getTextNodes(node));
                    }
                }
                return all;
            };
            var isInDom = function (node) {
                var doc = node.ownerDocument, n = node;
                do {
                    if (n === doc) {
                        return true;
                    }
                    n = n.parentNode;
                } while (n);
                return false;
            };
            var normalizeFix = function () {
                var f = win.Node.prototype.normalize;
                var nf = function () {
                    var texts = getTextNodes(this), s = this.ownerDocument.defaultView.getSelection(), anode = s.anchorNode, aoffset = s.anchorOffset, aelement = anode && anode.nodeType === 1 && anode.childNodes.length > 0 ? anode.childNodes[aoffset] : undefined, fnode = s.focusNode, foffset = s.focusOffset, felement = fnode && fnode.nodeType === 1 && foffset > 0 ? fnode.childNodes[foffset - 1] : undefined, r = this.ownerDocument.createRange(), prevTxt = texts.shift(), curText = prevTxt ? texts.shift() : null;
                    if (felement && felement.nodeType === 3) {
                        fnode = felement;
                        foffset = felement.nodeValue.length;
                        felement = undefined;
                    }
                    if (aelement && aelement.nodeType === 3) {
                        anode = aelement;
                        aoffset = 0;
                        aelement = undefined;
                    }
                    if ((anode === fnode && foffset < aoffset) || (anode !== fnode && (anode.compareDocumentPosition(fnode) & win.Node.DOCUMENT_POSITION_PRECEDING) && !(anode.compareDocumentPosition(fnode) & win.Node.DOCUMENT_POSITION_CONTAINS))) {
                        fnode = [anode, anode = fnode][0];
                        foffset = [aoffset, aoffset = foffset][0];
                    }
                    while (prevTxt && curText) {
                        if (curText.previousSibling && curText.previousSibling === prevTxt) {
                            if (anode === curText) {
                                anode = prevTxt;
                                aoffset = prevTxt.nodeValue.length + aoffset;
                            }
                            if (fnode === curText) {
                                fnode = prevTxt;
                                foffset = prevTxt.nodeValue.length + foffset;
                            }
                            prevTxt.nodeValue = prevTxt.nodeValue + curText.nodeValue;
                            curText.parentNode.removeChild(curText);
                            curText = texts.shift();
                        }
                        else {
                            prevTxt = curText;
                            curText = texts.shift();
                        }
                    }
                    if (felement) {
                        foffset = Array.prototype.indexOf.call(felement.parentNode.childNodes, felement) + 1;
                    }
                    if (aelement) {
                        aoffset = Array.prototype.indexOf.call(aelement.parentNode.childNodes, aelement);
                    }
                    if (isInDom(this) && anode && anode.parentNode && fnode && fnode.parentNode) {
                        r.setStart(anode, aoffset);
                        r.setEnd(fnode, foffset);
                        s.removeAllRanges();
                        s.addRange(r);
                    }
                };
                win.Node.prototype.normalize = nf;
            };
            var F = function () {
                win.removeEventListener("load", F);
                if ("Node" in win && "normalize" in win.Node.prototype && methods.normalizeHasCaretError()) {
                    normalizeFix();
                }
            };
            if (doc.readyState !== "complete") {
                win.addEventListener("load", F);
            }
            else {
                F();
            }
            // CustomEvent for ie9 and up
            function nativeCustomEventSupported() {
                try {
                    var p = new win.CustomEvent('cat', { detail: { foo: 'bar' } });
                    return 'cat' === p.type && 'bar' === p.detail.foo;
                }
                catch (e) { }
                return false;
            }
            // Polyfills CustomEvent object for IE9 and up
            (function () {
                if (!nativeCustomEventSupported() && "CustomEvent" in win) {
                    function CustomEvent(event, params) {
                        params = params || { bubbles: false, cancelable: false, detail: undefined };
                        var evt = doc.createEvent('CustomEvent');
                        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                        return evt;
                    }
                    CustomEvent.prototype = win.Event.prototype;
                    win.CustomEvent = CustomEvent;
                }
            })();
        }
    };
    return methods;
};
polyfills(window, document).apply();
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * 给元素绑定事件对象
         *
         * @example
         * dom.delegate(document.body,"#textarea",'click',function(e:Event){
         *       console.log((e.target as Element).tagName.toLowerCase())
         *   });
         */
        function delegate(container, selector, eventName, handler) {
            var callback = function (event) {
                var target = event.target, element = (target.nodeType === 3) ? target.parentNode : target, // IE has .contains only seeing elements not textnodes
                matches = container.querySelectorAll(selector);
                for (var i = 0, max = matches.length; i < max; i++) {
                    if (matches[i].contains(element)) {
                        handler.call(matches[i], event);
                    }
                }
            };
            container.addEventListener(eventName, callback, false);
            return {
                stop: function () {
                    container.removeEventListener(eventName, callback, false);
                }
            };
        }
        dom.delegate = delegate;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="../lang/array.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        function compareDocumentPosition(container, element) {
            var documentElement = document.documentElement;
            if (documentElement.compareDocumentPosition) {
                return function (container, element) {
                    return container.compareDocumentPosition(element);
                };
            }
            else {
                return function (container, element) {
                    // implementation borrowed from https://github.com/tmpvar/jsdom/blob/681a8524b663281a0f58348c6129c8c184efc62c/lib/jsdom/level3/core.js // MIT license
                    var thisOwner, otherOwner;
                    if (container.nodeType === 9)
                        thisOwner = container;
                    else
                        thisOwner = container.ownerDocument;
                    if (element.nodeType === 9)
                        otherOwner = element;
                    else
                        otherOwner = element.ownerDocument;
                    if (container === element)
                        return 0;
                    if (container === element.ownerDocument)
                        return 4 + 16; //Node.DOCUMENT_POSITION_FOLLOWING + Node.DOCUMENT_POSITION_CONTAINED_BY;
                    if (container.ownerDocument === element)
                        return 2 + 8; //Node.DOCUMENT_POSITION_PRECEDING + Node.DOCUMENT_POSITION_CONTAINS;
                    if (thisOwner !== otherOwner)
                        return 1; // Node.DOCUMENT_POSITION_DISCONNECTED;
                    // Text nodes for attributes does not have a _parentNode. So we need to find them as attribute child.
                    if (container.nodeType === 2 /*Node.ATTRIBUTE_NODE*/ && container.childNodes && su.lang.array(container.childNodes).indexOf(element) !== -1)
                        return 4 + 16; //Node.DOCUMENT_POSITION_FOLLOWING + Node.DOCUMENT_POSITION_CONTAINED_BY;
                    if (element.nodeType === 2 /*Node.ATTRIBUTE_NODE*/ && element.childNodes && su.lang.array(element.childNodes).indexOf(container) !== -1)
                        return 2 + 8; //Node.DOCUMENT_POSITION_PRECEDING + Node.DOCUMENT_POSITION_CONTAINS;
                    var point = container;
                    var parents = [];
                    var previous = null;
                    while (point) {
                        if (point == element)
                            return 2 + 8; //Node.DOCUMENT_POSITION_PRECEDING + Node.DOCUMENT_POSITION_CONTAINS;
                        parents.push(point);
                        point = point.parentNode;
                    }
                    point = element;
                    previous = null;
                    while (point) {
                        if (point == container)
                            return 4 + 16; //Node.DOCUMENT_POSITION_FOLLOWING + Node.DOCUMENT_POSITION_CONTAINED_BY;
                        var location_index = su.lang.array(parents).indexOf(point);
                        if (location_index !== -1) {
                            var smallest_common_ancestor = parents[location_index];
                            var this_index = su.lang.array(smallest_common_ancestor.childNodes).indexOf(parents[location_index - 1]); //smallest_common_ancestor.childNodes.toArray().indexOf( parents[location_index - 1] );
                            var other_index = su.lang.array(smallest_common_ancestor.childNodes).indexOf(previous); //smallest_common_ancestor.childNodes.toArray().indexOf( previous );
                            if (this_index > other_index) {
                                return 2; //Node.DOCUMENT_POSITION_PRECEDING;
                            }
                            else {
                                return 4; //Node.DOCUMENT_POSITION_FOLLOWING;
                            }
                        }
                        previous = point;
                        point = point.parentNode;
                    }
                    return 1; //Node.DOCUMENT_POSITION_DISCONNECTED;
                };
            }
        }
        dom.compareDocumentPosition = compareDocumentPosition;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * element的父元素是否是container
         * @param {HTMLElement} container
         * @param {Node|HTMLElement} element 被检查元素
         */
        function contains(container, element) {
            var documentElement = document.documentElement;
            if (documentElement.contains) {
                if (element.nodeType !== su.ELEMENT_NODE) {
                    if (element.parentNode === container) {
                        return true;
                    }
                    var parent = element.parentNode;
                }
                return container !== parent && container.contains(parent);
            }
            else if (documentElement.compareDocumentPosition) {
                // https://developer.mozilla.org/en/DOM/Node.compareDocumentPosition
                return !!(container.compareDocumentPosition(element) & 16);
            }
        }
        dom.contains = contains;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="../su.ts" />
/// <reference path="../browser.ts" />
/// <reference path="../lib/rangy.d.ts" />
/// <reference path="../dom/get_style.ts" />
/// <reference path="../dom/compare_document_position.ts" />
/// <reference path="../dom/contains.ts" />
var su;
(function (su) {
    function _getCumulativeOffsetTop(element) {
        var top = 0;
        if (element.parentNode) {
            do {
                top += element.offsetTop || 0;
                element = element.offsetParent;
            } while (element);
        }
        return top;
    }
    // Provides the depth of ``descendant`` relative to ``ancestor``
    function getDepth(ancestor, descendant) {
        var ret = 0;
        while (descendant !== ancestor) {
            ret++;
            descendant = descendant.parentNode;
            if (!descendant)
                throw new Error("not a descendant of ancestor!");
        }
        return ret;
    }
    function getRangeNode(node, offset) {
        if (node.nodeType === 3) {
            return node;
        }
        else {
            return node.childNodes[offset] || node;
        }
    }
    function getWebkitSelectionFixNode(container) {
        var blankNode = document.createElement('span');
        var placeholderRemover = function (event) {
            // Self-destructs the caret and keeps the text inserted into it by user
            var lastChild;
            container.removeEventListener('mouseup', placeholderRemover);
            container.removeEventListener('keydown', placeholderRemover);
            container.removeEventListener('touchstart', placeholderRemover);
            container.removeEventListener('focus', placeholderRemover);
            container.removeEventListener('blur', placeholderRemover);
            container.removeEventListener('paste', delayedPlaceholderRemover);
            container.removeEventListener('drop', delayedPlaceholderRemover);
            container.removeEventListener('beforepaste', delayedPlaceholderRemover);
            if (blankNode && blankNode.parentNode) {
                blankNode.parentNode.removeChild(blankNode);
            }
        }, delayedPlaceholderRemover = function (event) {
            if (blankNode && blankNode.parentNode) {
                setTimeout(placeholderRemover, 0);
            }
        };
        blankNode.appendChild(container.ownerDocument.createTextNode(su.INVISIBLE_SPACE));
        blankNode.className = '_wysihtml-temp-caret-fix';
        blankNode.style.display = 'block';
        blankNode.style.minWidth = '1px';
        blankNode.style.height = '0px';
        container.addEventListener('mouseup', placeholderRemover);
        container.addEventListener('keydown', placeholderRemover);
        container.addEventListener('touchstart', placeholderRemover);
        container.addEventListener('focus', placeholderRemover);
        container.addEventListener('blur', placeholderRemover);
        container.addEventListener('paste', delayedPlaceholderRemover);
        container.addEventListener('drop', delayedPlaceholderRemover);
        container.addEventListener('beforepaste', delayedPlaceholderRemover);
        return blankNode;
    }
    // Should fix the obtained ranges that cannot surrond contents normally to apply changes upon
    // Being considerate to firefox that sets range start start out of span and end inside on doubleclick initiated selection
    function expandRangeToSurround(range) {
        if (range.canSurroundContents())
            return;
        var common = range.commonAncestorContainer, start_depth = getDepth(common, range.startContainer), end_depth = getDepth(common, range.endContainer);
        while (!range.canSurroundContents()) {
            // In the following branches, we cannot just decrement the depth variables because the setStartBefore/setEndAfter may move the start or end of the range more than one level relative to ``common``. So we need to recompute the depth.
            if (start_depth > end_depth) {
                range.setStartBefore(range.startContainer);
                start_depth = getDepth(common, range.startContainer);
            }
            else {
                range.setEndAfter(range.endContainer);
                end_depth = getDepth(common, range.endContainer);
            }
        }
    }
    /**
     * 只在composer内使用
     */
    var Selection = (function () {
        function Selection(editor, contain, unselectableClass) {
            // Make sure that our external range library is initialized
            //rangy.init();
            console.log("seletion constructor");
            this.editor = editor;
            this.composer = editor.composer;
            this.doc = this.composer.doc;
            this.win = this.composer.win;
            // this.contain = contain;
            // this.element = this.composer.element;
            // this.unselectableClass = unselectableClass || false;
        }
        /**
         * Get the current selection as a bookmark to be able to later restore it
         *
         * @return {Object} An object that represents the current selection
         */
        // getBookmark() {
        //     var range = this.getRange();
        //     return range && range.cloneRange();
        // }
        // /**
        //  * Restore a selection retrieved via wysihtml.Selection.prototype.getBookmark
        //  *
        //  * @param {Object} bookmark An object that represents the current selection
        //  */
        // setBookmark(bookmark) {
        //     if (!bookmark) {
        //         return;
        //     }
        //     this.setSelection(bookmark);
        // }
        /**
         * Set the caret in front of the given node
         *
         * @param {Object} node The element or text node where to position the caret in front of
         * @example
         *    selection.setBefore(myElement);
         */
        Selection.prototype.setBefore = function (node) {
            var range = rangy.createRange(this.doc);
            range.setStartBefore(node);
            range.setEndBefore(node);
            return this.setSelection(range);
        };
        // // Constructs a self removing whitespace (ain absolute positioned span)
        // //  for placing selection caret when normal methods fail.
        // // Webkit has an issue with placing caret into places where there are no textnodes near by.
        // createTemporaryCaretSpaceAfter(node) {
        //     var caretPlaceholder = this.doc.createElement('span'),
        //         caretPlaceholderText = this.doc.createTextNode(su.INVISIBLE_SPACE),
        //         placeholderRemover = (function (event) {
        //             // Self-destructs the caret and keeps the text inserted into it by user
        //             var lastChild;
        //             this.contain.removeEventListener('mouseup', placeholderRemover);
        //             this.contain.removeEventListener('keydown', keyDownHandler);
        //             this.contain.removeEventListener('touchstart', placeholderRemover);
        //             this.contain.removeEventListener('focus', placeholderRemover);
        //             this.contain.removeEventListener('blur', placeholderRemover);
        //             this.contain.removeEventListener('paste', delayedPlaceholderRemover);
        //             this.contain.removeEventListener('drop', delayedPlaceholderRemover);
        //             this.contain.removeEventListener('beforepaste', delayedPlaceholderRemover);
        //             // If user inserted sth it is in the placeholder and sgould be unwrapped and stripped of invisible whitespace hack
        //             // Otherwise the wrapper can just be removed
        //             if (caretPlaceholder && caretPlaceholder.parentNode) {
        //                 caretPlaceholder.innerHTML = caretPlaceholder.innerHTML.replace(su.INVISIBLE_SPACE_REG_EXP, "");
        //                 if ((/[^\s]+/).test(caretPlaceholder.innerHTML)) {
        //                     lastChild = caretPlaceholder.lastChild;
        //                     dom.unwrap(caretPlaceholder);
        //                     this.setAfter(lastChild);
        //                 } else {
        //                     caretPlaceholder.parentNode.removeChild(caretPlaceholder);
        //                 }
        //             }
        //         }).bind(this),
        //         delayedPlaceholderRemover = function (event) {
        //             if (caretPlaceholder && caretPlaceholder.parentNode) {
        //                 setTimeout(placeholderRemover, 0);
        //             }
        //         },
        //         keyDownHandler = function (event) {
        //             if (event.which !== 8 && event.which !== 91 && event.which !== 17 && (event.which !== 86 || (!event.ctrlKey && !event.metaKey))) {
        //                 placeholderRemover();
        //             }
        //         };
        //     caretPlaceholder.className = '_wysihtml-temp-caret-fix';
        //     caretPlaceholder.style.position = 'absolute';
        //     caretPlaceholder.style.display = 'block';
        //     caretPlaceholder.style.minWidth = '1px';
        //     caretPlaceholder.style.zIndex = '99999';
        //     caretPlaceholder.appendChild(caretPlaceholderText);
        //     node.parentNode.insertBefore(caretPlaceholder, node.nextSibling);
        //     this.setBefore(caretPlaceholderText);
        //     // Remove the caret fix on any of the following events (some are delayed as content change happens after event)
        //     this.contain.addEventListener('mouseup', placeholderRemover);
        //     this.contain.addEventListener('keydown', keyDownHandler);
        //     this.contain.addEventListener('touchstart', placeholderRemover);
        //     this.contain.addEventListener('focus', placeholderRemover);
        //     this.contain.addEventListener('blur', placeholderRemover);
        //     this.contain.addEventListener('paste', delayedPlaceholderRemover);
        //     this.contain.addEventListener('drop', delayedPlaceholderRemover);
        //     this.contain.addEventListener('beforepaste', delayedPlaceholderRemover);
        //     return caretPlaceholder;
        // }
        /**
         * 将鼠标焦点放再node之后
         *
         * @param {Object} node The element or text node where to position the caret in front of
         * @example
         *    selection.setBefore(myElement);
         * callback is an optional parameter accepting a function to execute when selection ahs been set
         */
        Selection.prototype.setAfter = function (node, notVisual, callback) {
            var win = this.win, range = rangy.createRange(this.doc), fixWebkitSelection = function () {
                // Webkit fails to add selection if there are no textnodes in that region
                // (like an uneditable container at the end of content).
                var parent = node.parentNode, lastSibling = parent ? parent.childNodes[parent.childNodes.length - 1] : null;
                if (!sel || (lastSibling === node && node.nodeType === 1 && win.getComputedStyle(node).display === "block")) {
                    if (notVisual) {
                        // If setAfter is used as internal between actions, self-removing caretPlaceholder has simpler implementation
                        // and remove itself in call stack end instead on user interaction
                        var caretPlaceholder = this.doc.createTextNode(su.INVISIBLE_SPACE);
                        node.parentNode.insertBefore(caretPlaceholder, node.nextSibling);
                        this.selectNode(caretPlaceholder);
                        setTimeout(function () {
                            if (caretPlaceholder && caretPlaceholder.parentNode) {
                                caretPlaceholder.parentNode.removeChild(caretPlaceholder);
                            }
                        }, 0);
                    }
                    else {
                        this.createTemporaryCaretSpaceAfter(node);
                    }
                }
            }.bind(this), sel;
            range.setStartAfter(node);
            range.setEndAfter(node);
            // In IE contenteditable must be focused before we can set selection
            // thus setting the focus if activeElement is not this composer
            if (!document.activeElement || document.activeElement !== this.composer.element) {
                var scrollPos = this.composer.getScrollPos();
                this.composer.element.focus();
                this.composer.setScrollPos(scrollPos);
                setTimeout(function () {
                    sel = this.setSelection(range);
                    fixWebkitSelection();
                    if (callback) {
                        callback(sel);
                    }
                }.bind(this), 0);
            }
            else {
                sel = this.setSelection(range);
                fixWebkitSelection();
                if (callback) {
                    callback(sel);
                }
            }
        };
        /**
         * 选择中标记指定node
         *
         * @param {Element} node The node/element to select
         * @example
         *    selection.selectNode(document.getElementById("my-image"));
         */
        Selection.prototype.selectNode = function (node, avoidInvisibleSpace) {
            var range = rangy.createRange(this.doc), isElement = node.nodeType === su.ELEMENT_NODE, canHaveHTML = "canHaveHTML" in node ? node.canHaveHTML : (node.nodeName !== "IMG"), content = isElement ? node.innerHTML : node.data, isEmpty = (content === "" || content === su.INVISIBLE_SPACE), displayStyle = su.dom.getStyle("display").from(node), isBlockElement = (displayStyle === "block" || displayStyle === "list-item");
            if (isEmpty && isElement && canHaveHTML && !avoidInvisibleSpace) {
                // Make sure that caret is visible in node by inserting a zero width no breaking space
                try {
                    node.innerHTML = su.INVISIBLE_SPACE;
                }
                catch (e) { }
            }
            if (canHaveHTML) {
                range.selectNodeContents(node);
            }
            else {
                range.selectNode(node);
            }
            if (canHaveHTML && isEmpty && isElement) {
                range.collapse(isBlockElement);
            }
            else if (canHaveHTML && isEmpty) {
                range.setStartAfter(node);
                range.setEndAfter(node);
            }
            this.setSelection(range);
        };
        /**
         * 获取包含selcetion的node
         *
         * @param {Boolean} [controlRange] (only IE) Whether it should return the selected ControlRange element when the selection type is a "ControlRange"
         * @return {Object} The node that contains the caret
         * @example
         *    var nodeThatContainsCaret = selection.getSelectedNode();
         */
        Selection.prototype.getSelectedNode = function (controlRange) {
            var selection, range;
            if (controlRange && this.doc.selection && this.doc.selection.type === "Control") {
                range = this.doc.selection.createRange();
                if (range && range.length) {
                    return range.item(0);
                }
            }
            //selection = this.getSelection(this.doc);
            selection = this.getSelection();
            if (selection.focusNode === selection.anchorNode) {
                return selection.focusNode;
            }
            else {
                range = this.getRange(this.doc);
                return range ? range.commonAncestorContainer : this.doc.body;
            }
        };
        Selection.prototype.fixSelBorders = function () {
            var range = this.getRange();
            expandRangeToSurround(range);
            this.setSelection(range);
        };
        Selection.prototype.getSelectedOwnNodes = function (controlRange) {
            var selection, ranges = this.getOwnRanges(), ownNodes = [];
            for (var i = 0, maxi = ranges.length; i < maxi; i++) {
                ownNodes.push(ranges[i].commonAncestorContainer || this.doc.body);
            }
            return ownNodes;
        };
        // findNodesInSelection(nodeTypes) {
        //     var ranges = this.getOwnRanges(),
        //         nodes = [], curNodes;
        //     for (var i = 0, maxi = ranges.length; i < maxi; i++) {
        //         curNodes = ranges[i].getNodes([1], function (node) {
        //             return lang.array(nodeTypes).contains(node.nodeName);
        //         });
        //         nodes = nodes.concat(curNodes);
        //     }
        //     return nodes;
        // }
        // filterElements(filter) {
        //     var ranges = this.getOwnRanges(),
        //         nodes = [], curNodes;
        //     for (var i = 0, maxi = ranges.length; i < maxi; i++) {
        //         curNodes = ranges[i].getNodes([1], function (element) {
        //             return filter(element, ranges[i]);
        //         });
        //         nodes = nodes.concat(curNodes);
        //     }
        //     return nodes;
        // }
        // containsUneditable() {
        //     var uneditables = this.getOwnUneditables(),
        //         selection = this.getSelection();
        //     for (var i = 0, maxi = uneditables.length; i < maxi; i++) {
        //         if (selection.containsNode(uneditables[i])) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        // // Deletes selection contents making sure uneditables/unselectables are not partially deleted
        // // Triggers wysihtml:uneditable:delete custom event on all deleted uneditables if customevents suppoorted
        // deleteContents() {
        //     var range = this.getRange();
        //     this.deleteRangeContents(range);
        //     this.setSelection(range);
        // }
        // // Makes sure all uneditable sare notified before deleting contents
        // deleteRangeContents(range) {
        //     var startParent, endParent, uneditables, ev;
        //     if (this.unselectableClass) {
        //         if ((startParent = dom.getParentElement(range.startContainer, { query: "." + this.unselectableClass }, false, this.contain))) {
        //             range.setStartBefore(startParent);
        //         }
        //         if ((endParent = dom.getParentElement(range.endContainer, { query: "." + this.unselectableClass }, false, this.contain))) {
        //             range.setEndAfter(endParent);
        //         }
        //         // If customevents present notify uneditable elements of being deleted
        //         uneditables = range.getNodes([1], (function (node) {
        //             return dom.hasClass(node, this.unselectableClass);
        //         }).bind(this));
        //         for (var i = uneditables.length; i--;) {
        //             try {
        //                 ev = new CustomEvent("wysihtml:uneditable:delete");
        //                 uneditables[i].dispatchEvent(ev);
        //             } catch (err) { }
        //         }
        //     }
        //     range.deleteContents();
        // }
        /**
         * 返回插入光标（caret）所在Node
         */
        Selection.prototype.getCaretNode = function () {
            var selection = this.getSelection();
            return (selection && selection.anchorNode) ? getRangeNode(selection.anchorNode, selection.anchorOffset) : null;
        };
        Selection.prototype.getPreviousNode = function (node, ignoreEmpty) {
            var displayStyle;
            if (!node) {
                var selection = this.getSelection();
                node = (selection && selection.anchorNode) ? getRangeNode(selection.anchorNode, selection.anchorOffset) : null;
            }
            if (node === this.contain) {
                return false;
            }
            var ret = node.previousSibling, parent;
            if (ret === this.contain) {
                return false;
            }
            if (ret && ret.nodeType !== 3 && ret.nodeType !== 1) {
                // do not count comments and other node types
                ret = this.getPreviousNode(ret, ignoreEmpty);
            }
            else if (ret && ret.nodeType === 3 && (/^\s*$/).test(ret.textContent)) {
                // do not count empty textnodes as previous nodes
                ret = this.getPreviousNode(ret, ignoreEmpty);
            }
            else if (ignoreEmpty && ret && ret.nodeType === 1) {
                // Do not count empty nodes if param set.
                // Contenteditable tends to bypass and delete these silently when deleting with caret when element is inline-like
                displayStyle = su.dom.getStyle("display").from(ret);
                if (!su.lang.array(["BR", "HR", "IMG"]).contains(ret.nodeName) &&
                    !su.lang.array(["block", "inline-block", "flex", "list-item", "table"]).contains(displayStyle) &&
                    (/^[\s]*$/).test(ret.innerHTML)) {
                    ret = this.getPreviousNode(ret, ignoreEmpty);
                }
            }
            else if (!ret && node !== this.contain) {
                parent = node.parentNode;
                if (parent !== this.contain) {
                    ret = this.getPreviousNode(parent, ignoreEmpty);
                }
            }
            return (ret !== this.contain) ? ret : false;
        };
        // // Gather info about caret location (caret node, previous and next node)
        // getNodesNearCaret() {
        //     if (!this.isCollapsed()) {
        //         throw "Selection must be caret when using selection.getNodesNearCaret()";
        //     }
        //     var r = this.getOwnRanges(),
        //         caretNode, prevNode, nextNode, offset;
        //     if (r && r.length > 0) {
        //         if (r[0].startContainer.nodeType === 1) {
        //             caretNode = r[0].startContainer.childNodes[r[0].startOffset - 1];
        //             if (!caretNode && r[0].startOffset === 0) {
        //                 // Is first position before all nodes
        //                 nextNode = r[0].startContainer.childNodes[0];
        //             } else if (caretNode) {
        //                 prevNode = caretNode.previousSibling;
        //                 nextNode = caretNode.nextSibling;
        //             }
        //         } else {
        //             if (r[0].startOffset === 0 && r[0].startContainer.previousSibling) {
        //                 caretNode = r[0].startContainer.previousSibling;
        //                 if (caretNode.nodeType === 3) {
        //                     offset = caretNode.data.length;
        //                 }
        //             } else {
        //                 caretNode = r[0].startContainer;
        //                 offset = r[0].startOffset;
        //             }
        //             prevNode = caretNode.previousSibling;
        //             nextNode = caretNode.nextSibling;
        //         }
        //         return {
        //             "caretNode": caretNode,
        //             "prevNode": prevNode,
        //             "nextNode": nextNode,
        //             "textOffset": offset
        //         };
        //     }
        //     return null;
        // }
        Selection.prototype.getSelectionParentsByTag = function (tagName) {
            var nodes = this.getSelectedOwnNodes(), curEl, parents = [];
            for (var i = 0, maxi = nodes.length; i < maxi; i++) {
                curEl = (nodes[i].nodeName && nodes[i].nodeName === 'LI') ? nodes[i] : su.dom.getParentElement(nodes[i], { query: 'li' }, false, this.contain);
                if (curEl) {
                    parents.push(curEl);
                }
            }
            return (parents.length) ? parents : null;
        };
        Selection.prototype.getRangeToNodeEnd = function () {
            if (this.isCollapsed()) {
                var range = this.getRange(), sNode, pos, lastR;
                if (range) {
                    sNode = range.startContainer;
                    pos = range.startOffset;
                    lastR = rangy.createRange(this.doc);
                    lastR.selectNodeContents(sNode);
                    lastR.setStart(sNode, pos);
                    return lastR;
                }
            }
        };
        Selection.prototype.getRangeToNodeBeginning = function () {
            if (this.isCollapsed()) {
                var range = this.getRange(), sNode = range.startContainer, pos = range.startOffset, lastR = rangy.createRange(this.doc);
                lastR.selectNodeContents(sNode);
                lastR.setEnd(sNode, pos);
                return lastR;
            }
        };
        // This function returns if caret is last in a node (no textual visible content follows)
        Selection.prototype.caretIsInTheEndOfNode = function (ignoreIfSpaceIsBeforeCaret) {
            var r = rangy.createRange(this.doc), s = this.getSelection(), rangeToNodeEnd = this.getRangeToNodeEnd(), endc, endtxt, beginc, begintxt;
            if (rangeToNodeEnd) {
                endc = rangeToNodeEnd.cloneContents();
                endtxt = endc.textContent;
                if ((/^\s*$/).test(endtxt)) {
                    if (ignoreIfSpaceIsBeforeCaret) {
                        beginc = this.getRangeToNodeBeginning().cloneContents();
                        begintxt = beginc.textContent;
                        return !(/[\u00A0 ][\s\uFEFF]*$/).test(begintxt);
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Selection.prototype.caretIsFirstInSelection = function (includeLineBreaks) {
            var r = rangy.createRange(this.doc), s = this.getSelection(), range = this.getRange(), startNode = getRangeNode(range.startContainer, range.startOffset);
            if (startNode) {
                if (startNode.nodeType === su.TEXT_NODE) {
                    if (!startNode.parentNode) {
                        return false;
                    }
                    if (!this.isCollapsed() || (startNode.parentNode.firstChild !== startNode && !su.dom.domNode(startNode.previousSibling).is.block())) {
                        return false;
                    }
                    var ws = this.win.getComputedStyle(startNode.parentNode).whiteSpace;
                    return (ws === "pre" || ws === "pre-wrap") ? range.startOffset === 0 : (/^\s*$/).test(startNode.data.substr(0, range.startOffset));
                }
                else if (includeLineBreaks && su.dom.domNode(startNode).is.lineBreak()) {
                    return true;
                }
                else {
                    r.selectNodeContents(this.getRange().commonAncestorContainer);
                    r.collapse(true);
                    return (this.isCollapsed() && (r.startContainer === s.anchorNode || r.endContainer === s.anchorNode) && r.startOffset === s.anchorOffset);
                }
            }
        };
        // caretIsInTheBeginnig(ofNode) {
        //     var selection = this.getSelection(),
        //         node = selection.anchorNode,
        //         offset = selection.anchorOffset;
        //     if (ofNode && node) {
        //         return (offset === 0 && (node.nodeName && node.nodeName === ofNode.toUpperCase() || dom.getParentElement(node.parentNode, { query: ofNode }, 1)));
        //     } else if (node) {
        //         return (offset === 0 && !this.getPreviousNode(node, true));
        //     }
        // }
        // Returns object describing node/text before selection
        // If includePrevLeaves is true returns  also previous last leaf child if selection is in the beginning of current node
        Selection.prototype.getBeforeSelection = function (includePrevLeaves) {
            var sel = this.getSelection(), startNode = (sel.isBackwards()) ? sel.focusNode : sel.anchorNode, startOffset = (sel.isBackwards()) ? sel.focusOffset : sel.anchorOffset, rng = this.createRange(), endNode, inTmpCaret;
            // If start is textnode and all is whitespace before caret. Set start offset to 0
            if (startNode && startNode.nodeType === 3 && (/^\s*$/).test(startNode.data.slice(0, startOffset))) {
                startOffset = 0;
            }
            // Escape temproray helper nodes if selection in them
            inTmpCaret = su.dom.getParentElement(startNode, { query: '._wysihtml-temp-caret-fix' }, 1);
            if (inTmpCaret) {
                startNode = inTmpCaret.parentNode;
                startOffset = Array.prototype.indexOf.call(startNode.childNodes, inTmpCaret);
            }
            if (startNode) {
                if (startOffset > 0) {
                    if (startNode.nodeType === 3) {
                        rng.setStart(startNode, 0);
                        rng.setEnd(startNode, startOffset);
                        return {
                            type: "text",
                            range: rng,
                            offset: startOffset,
                            node: startNode
                        };
                    }
                    else {
                        rng.setStartBefore(startNode.childNodes[0]);
                        endNode = startNode.childNodes[startOffset - 1];
                        rng.setEndAfter(endNode);
                        return {
                            type: "element",
                            range: rng,
                            offset: startOffset,
                            node: endNode
                        };
                    }
                }
                else {
                    rng.setStartAndEnd(startNode, 0);
                    if (includePrevLeaves) {
                        var prevNode = this.getPreviousNode(startNode, true), prevLeaf = null;
                        if (prevNode) {
                            if (prevNode.nodeType === 1 && su.dom.hasClass(prevNode, this.unselectableClass)) {
                                prevLeaf = prevNode;
                            }
                            else {
                                prevLeaf = su.dom.domNode(prevNode).lastLeafNode();
                            }
                        }
                        if (prevLeaf) {
                            return {
                                type: "leafnode",
                                range: rng,
                                offset: startOffset,
                                node: prevLeaf
                            };
                        }
                    }
                    return {
                        type: "none",
                        range: rng,
                        offset: startOffset,
                        node: startNode
                    };
                }
            }
            return null;
        };
        // // TODO: Figure out a method from following 2 that would work universally
        // executeAndRestoreRangy(method, restoreScrollPosition) {
        //     var sel = rangy.saveSelection(this.win);
        //     if (!sel) {
        //         method();
        //     } else {
        //         try {
        //             method();
        //         } catch (e) {
        //             setTimeout(function () { throw e; }, 0);
        //         }
        //     }
        //     rangy.restoreSelection(sel);
        // }
        // // TODO: has problems in chrome 12. investigate block level and uneditable area inbetween
        // executeAndRestore(method, restoreScrollPosition) {
        //     var body = this.doc.body,
        //         oldScrollTop = restoreScrollPosition && body.scrollTop,
        //         oldScrollLeft = restoreScrollPosition && body.scrollLeft,
        //         className = "_wysihtml-temp-placeholder",
        //         placeholderHtml = '<span class="' + className + '">' + sulag.INVISIBLE_SPACE + '</span>',
        //         range = this.getRange(true),
        //         caretPlaceholder,
        //         newCaretPlaceholder,
        //         nextSibling, prevSibling,
        //         node, node2, range2,
        //         newRange;
        //     // Nothing selected, execute and say goodbye
        //     if (!range) {
        //         method(body, body);
        //         return;
        //     }
        //     if (!range.collapsed) {
        //         range2 = range.cloneRange();
        //         node2 = range2.createContextualFragment(placeholderHtml);
        //         range2.collapse(false);
        //         range2.insertNode(node2);
        //         range2.detach();
        //     }
        //     node = range.createContextualFragment(placeholderHtml);
        //     range.insertNode(node);
        //     if (node2) {
        //         caretPlaceholder = this.contain.querySelectorAll("." + className);
        //         range.setStartBefore(caretPlaceholder[0]);
        //         range.setEndAfter(caretPlaceholder[caretPlaceholder.length - 1]);
        //     }
        //     this.setSelection(range);
        //     // Make sure that a potential error doesn't cause our placeholder element to be left as a placeholder
        //     try {
        //         method(range.startContainer, range.endContainer);
        //     } catch (e) {
        //         setTimeout(function () { throw e; }, 0);
        //     }
        //     caretPlaceholder = this.contain.querySelectorAll("." + className);
        //     if (caretPlaceholder && caretPlaceholder.length) {
        //         newRange = rangy.createRange(this.doc);
        //         nextSibling = caretPlaceholder[0].nextSibling;
        //         if (caretPlaceholder.length > 1) {
        //             prevSibling = caretPlaceholder[caretPlaceholder.length - 1].previousSibling;
        //         }
        //         if (prevSibling && nextSibling) {
        //             newRange.setStartBefore(nextSibling);
        //             newRange.setEndAfter(prevSibling);
        //         } else {
        //             newCaretPlaceholder = this.doc.createTextNode(sulag.INVISIBLE_SPACE);
        //             dom.insert(newCaretPlaceholder).after(caretPlaceholder[0]);
        //             newRange.setStartBefore(newCaretPlaceholder);
        //             newRange.setEndAfter(newCaretPlaceholder);
        //         }
        //         this.setSelection(newRange);
        //         for (var i = caretPlaceholder.length; i--;) {
        //             caretPlaceholder[i].parentNode.removeChild(caretPlaceholder[i]);
        //         }
        //     } else {
        //         // fallback for when all hell breaks loose
        //         this.contain.focus();
        //     }
        //     if (restoreScrollPosition) {
        //         body.scrollTop = oldScrollTop;
        //         body.scrollLeft = oldScrollLeft;
        //     }
        //     // Remove it again, just to make sure that the placeholder is definitely out of the dom tree
        //     try {
        //         caretPlaceholder.parentNode.removeChild(caretPlaceholder);
        //     } catch (e2) { }
        // }
        // set(node, offset) {
        //     var newRange = rangy.createRange(this.doc);
        //     newRange.setStart(node, offset || 0);
        //     this.setSelection(newRange);
        // }
        // /**
        //  * Insert html at the caret or selection position and move the cursor after the inserted html
        //  * Replaces selection content if present
        //  *
        //  * @param {String} html HTML string to insert
        //  * @example
        //  *    selection.insertHTML("<p>foobar</p>");
        //  */
        // insertHTML(html) {
        //     var range = this.getRange(),
        //         node = this.doc.createElement('DIV'),
        //         fragment = this.doc.createDocumentFragment(),
        //         lastChild, lastEditorElement;
        //     if (range) {
        //         range.deleteContents();
        //         node.innerHTML = html;
        //         lastChild = node.lastChild;
        //         while (node.firstChild) {
        //             fragment.appendChild(node.firstChild);
        //         }
        //         range.insertNode(fragment);
        //         lastEditorElement = this.contain.lastChild;
        //         while (lastEditorElement && lastEditorElement.nodeType === 3 && lastEditorElement.previousSibling && (/^\s*$/).test(lastEditorElement.data)) {
        //             lastEditorElement = lastEditorElement.previousSibling;
        //         }
        //         if (lastChild) {
        //             // fixes some pad cases mostly on webkit where last nr is needed
        //             if (lastEditorElement && lastChild === lastEditorElement && lastChild.nodeType === 1) {
        //                 this.contain.appendChild(this.doc.createElement('br'));
        //             }
        //             this.setAfter(lastChild);
        //         }
        //     }
        // }
        // /**
        //  * Insert a node at the caret position and move the cursor behind it
        //  *
        //  * @param {Object} node HTML string to insert
        //  * @example
        //  *    selection.insertNode(document.createTextNode("foobar"));
        //  */
        // insertNode(node) {
        //     var range = this.getRange();
        //     if (range) {
        //         range.deleteContents();
        //         range.insertNode(node);
        //     }
        // }
        // canAppendChild(node) {
        //     var anchorNode, anchorNodeTagNameLower,
        //         voidElements = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"],
        //         range = this.getRange();
        //     anchorNode = node || range.startContainer;
        //     if (anchorNode) {
        //         anchorNodeTagNameLower = (anchorNode.tagName || anchorNode.nodeName).toLowerCase();
        //     }
        //     return voidElements.indexOf(anchorNodeTagNameLower) === -1;
        // }
        // splitElementAtCaret(element, insertNode) {
        //     var sel = this.getSelection(),
        //         range, contentAfterRangeStart,
        //         firstChild, lastChild, childNodes;
        //     if (sel.rangeCount > 0) {
        //         range = sel.getRangeAt(0).cloneRange(); // Create a copy of the selection range to work with
        //         range.setEndAfter(element); // Place the end of the range after the element
        //         contentAfterRangeStart = range.extractContents(); // Extract the contents of the element after the caret into a fragment
        //         childNodes = contentAfterRangeStart.childNodes;
        //         // Empty elements are cleaned up from extracted content
        //         for (var i = childNodes.length; i--;) {
        //             if (!dom.domNode(childNodes[i]).is.visible()) {
        //                 contentAfterRangeStart.removeChild(childNodes[i]);
        //             }
        //         }
        //         element.parentNode.insertBefore(contentAfterRangeStart, element.nextSibling);
        //         if (insertNode) {
        //             firstChild = insertNode.firstChild || insertNode;
        //             lastChild = insertNode.lastChild || insertNode;
        //             element.parentNode.insertBefore(insertNode, element.nextSibling);
        //             // Select inserted node contents
        //             if (firstChild && lastChild) {
        //                 range.setStartBefore(firstChild);
        //                 range.setEndAfter(lastChild);
        //                 this.setSelection(range);
        //             }
        //         } else {
        //             range.setStartAfter(element);
        //             range.setEndAfter(element);
        //         }
        //         if (!dom.domNode(element).is.visible()) {
        //             if (dom.getTextContent(element) === '') {
        //                 element.parentNode.removeChild(element);
        //             } else {
        //                 element.parentNode.replaceChild(this.doc.createTextNode(" "), element);
        //             }
        //         }
        //     }
        // }
        // /**
        //  * Wraps current selection with the given node
        //  *
        //  * @param {Object} node The node to surround the selected elements with
        //  */
        // surround(nodeOptions) {
        //     var ranges = this.getOwnRanges(),
        //         node, nodes = [];
        //     if (ranges.length == 0) {
        //         return nodes;
        //     }
        //     for (var i = ranges.length; i--;) {
        //         node = this.doc.createElement(nodeOptions.nodeName);
        //         nodes.push(node);
        //         if (nodeOptions.className) {
        //             node.className = nodeOptions.className;
        //         }
        //         if (nodeOptions.cssStyle) {
        //             node.setAttribute('style', nodeOptions.cssStyle);
        //         }
        //         try {
        //             // This only works when the range boundaries are not overlapping other elements
        //             ranges[i].surroundContents(node);
        //             this.selectNode(node);
        //         } catch (e) {
        //             // fallback
        //             node.appendChild(ranges[i].extractContents());
        //             ranges[i].insertNode(node);
        //         }
        //     }
        //     return nodes;
        // }
        // /**
        //  * Scroll the current caret position into the view
        //  * FIXME: This is a bit hacky, there might be a smarter way of doing this
        //  *
        //  * @example
        //  *    selection.scrollIntoView();
        //  */
        // scrollIntoView() {
        //     var doc = this.doc,
        //         tolerance = 5, // px
        //         hasScrollBars = doc.documentElement.scrollHeight > doc.documentElement.offsetHeight,
        //         tempElement = doc._wysihtmlScrollIntoViewElement = doc._wysihtmlScrollIntoViewElement || (function () {
        //             var element = doc.createElement("span");
        //             // The element needs content in order to be able to calculate it's position properly
        //             element.innerHTML = sulag.INVISIBLE_SPACE;
        //             return element;
        //         })(),
        //         offsetTop;
        //     if (hasScrollBars) {
        //         this.insertNode(tempElement);
        //         offsetTop = _getCumulativeOffsetTop(tempElement);
        //         tempElement.parentNode.removeChild(tempElement);
        //         if (offsetTop >= (doc.body.scrollTop + doc.documentElement.offsetHeight - tolerance)) {
        //             doc.body.scrollTop = offsetTop;
        //         }
        //     }
        // }
        /**
         * 选中光标所在行
         */
        Selection.prototype.selectLine = function () {
            var r = rangy.createRange();
            if (su.browser.supportsSelectionModify()) {
                this._selectLine_W3C();
            }
            else if (r.nativeRange && r.nativeRange.getBoundingClientRect) {
                // Range.getBoundingClientRect() 返回一个 ClientRect 对象，该对象限定了选定的文档对象的内容，
                // 该方法返回了一个矩形，这个矩形包围了该文档对象中所有元素的边界矩形集合
                // For IE Edge as it ditched the old api and did not fully implement the new one (as expected)
                this._selectLineUniversal();
            }
        };
        Selection.prototype.includeRangyRangeHelpers = function () {
            var s = this.getSelection(), r = s.getRangeAt(0), isHelperNode = function (node) {
                return (node && node.nodeType === 1 && node.classList.contains('rangySelectionBoundary'));
            }, getNodeLength = function (node) {
                if (node.nodeType === 1) {
                    return node.childNodes && node.childNodes.length || 0;
                }
                else {
                    return node.data && node.data.length || 0;
                }
            }, anode = s.anchorNode.nodeType === 1 ? s.anchorNode.childNodes[s.anchorOffset] : s.anchorNode, fnode = s.focusNode.nodeType === 1 ? s.focusNode.childNodes[s.focusOffset] : s.focusNode;
            if (fnode && s.focusOffset === getNodeLength(fnode) && fnode.nextSibling && isHelperNode(fnode.nextSibling)) {
                r.setEndAfter(fnode.nextSibling);
            }
            if (anode && s.anchorOffset === 0 && anode.previousSibling && isHelperNode(anode.previousSibling)) {
                r.setStartBefore(anode.previousSibling);
            }
            r.select();
        };
        /**
         * See https://developer.mozilla.org/en/DOM/Selection/modify
         */
        Selection.prototype._selectLine_W3C = function () {
            var selection = this.win.getSelection(), initialBoundry = [selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset];
            selection.modify("move", "left", "lineboundary");
            selection.modify("extend", "right", "lineboundary");
            // IF lineboundary extending did not change selection try universal fallback (FF fails sometimes without a reason)
            if (selection.anchorNode === initialBoundry[0] &&
                selection.anchorOffset === initialBoundry[1] &&
                selection.focusNode === initialBoundry[2] &&
                selection.focusOffset === initialBoundry[3]) {
                this._selectLineUniversal();
            }
            else {
                this.includeRangyRangeHelpers();
            }
        };
        // // collapses selection to current line beginning or end
        // toLineBoundary(location, collapse) {
        //     collapse = (typeof collapse === 'undefined') ? false : collapse;
        //     if (browser.supportsSelectionModify()) {
        //         var selection = this.win.getSelection();
        //         selection.modify("extend", location, "lineboundary");
        //         if (collapse) {
        //             if (location === "left") {
        //                 selection.collapseToStart();
        //             } else if (location === "right") {
        //                 selection.collapseToEnd();
        //             }
        //         }
        //     }
        // }
        // getRangeRect(r) {
        //     var textNode = this.doc.createTextNode("i"),
        //         testNode = this.doc.createTextNode("i"),
        //         rect, cr;
        //     /*testNode.style.visibility = "hidden";
        //     testNode.style.width = "0px";
        //     testNode.style.display = "inline-block";
        //     testNode.style.overflow = "hidden";
        //     testNode.appendChild(textNode);*/
        //     if (r.collapsed) {
        //         r.insertNode(testNode);
        //         r.selectNode(testNode);
        //         rect = r.nativeRange.getBoundingClientRect();
        //         r.deleteContents();
        //     } else {
        //         rect = r.nativeRange.getBoundingClientRect();
        //     }
        //     return rect;
        // }
        Selection.prototype._selectLineUniversal = function () {
            var s = this.getSelection(), r = s.getRangeAt(0), rect, startRange, endRange, testRange, count = 0, amount, testRect, found, that = this, isLineBreakingElement = function (el) {
                return el && el.nodeType === 1 && (that.win.getComputedStyle(el).display === "block" || su.lang.array(['BR', 'HR']).contains(el.nodeName));
            }, prevNode = function (node) {
                var pnode = node;
                if (pnode) {
                    while (pnode && ((pnode.nodeType === 1 && pnode.classList.contains('rangySelectionBoundary')) || (pnode.nodeType === 3 && (/^\s*$/).test(pnode.data)))) {
                        pnode = pnode.previousSibling;
                    }
                }
                return pnode;
            };
            startRange = r.cloneRange();
            endRange = r.cloneRange();
            if (r.collapsed) {
                // Collapsed state can not have a bounding rect. Thus need to expand it at least by 1 character first while not crossing line boundary
                // TODO: figure out a shorter and more readable way
                if (r.startContainer.nodeType === 3 && r.startOffset < (r.startContainer).data.length) {
                    r.moveEnd('character', 1);
                }
                else if (r.startContainer.nodeType === 1 && r.startContainer.childNodes[r.startOffset] && r.startContainer.childNodes[r.startOffset].nodeType === 3 && r.startContainer.childNodes[r.startOffset].data.length > 0) {
                    r.moveEnd('character', 1);
                }
                else if (r.startOffset > 0 &&
                    (r.startContainer.nodeType === 3 ||
                        (r.startContainer.nodeType === 1 &&
                            !isLineBreakingElement(prevNode(r.startContainer.childNodes[r.startOffset - 1]))))) {
                    r.moveStart('character', -1);
                }
            }
            if (!r.collapsed) {
                r.insertNode(this.doc.createTextNode(su.INVISIBLE_SPACE));
            }
            // Is probably just empty line as can not be expanded
            rect = r.nativeRange.getBoundingClientRect();
            // If startnode is not line break allready move the start position of range by -1 character until clientRect top changes;
            do {
                amount = r.moveStart('character', -1);
                testRect = r.nativeRange.getBoundingClientRect();
                if (!testRect || Math.floor(testRect.top) !== Math.floor(rect.top)) {
                    r.moveStart('character', 1);
                    found = true;
                }
                count++;
            } while (amount !== 0 && !found && count < 2000);
            count = 0;
            found = false;
            rect = r.nativeRange.getBoundingClientRect();
            if (r.endContainer !== this.contain || (this.contain.lastChild && this.contain.childNodes[r.endOffset] !== this.contain.lastChild)) {
                do {
                    amount = r.moveEnd('character', 1);
                    testRect = r.nativeRange.getBoundingClientRect();
                    if (!testRect || Math.floor(testRect.bottom) !== Math.floor(rect.bottom)) {
                        r.moveEnd('character', -1);
                        // Fix a IE line end marked by linebreak element although caret is before it
                        // If causes problems should be changed to be applied only to IE
                        if (r.endContainer && r.endContainer.nodeType === 1 && r.endContainer.childNodes[r.endOffset] && r.endContainer.childNodes[r.endOffset].nodeType === 1 && r.endContainer.childNodes[r.endOffset].nodeName === "BR" && r.endContainer.childNodes[r.endOffset].previousSibling) {
                            if (r.endContainer.childNodes[r.endOffset].previousSibling.nodeType === 1) {
                                r.setEnd(r.endContainer.childNodes[r.endOffset].previousSibling, r.endContainer.childNodes[r.endOffset].previousSibling.childNodes.length);
                            }
                            else if (r.endContainer.childNodes[r.endOffset].previousSibling.nodeType === 3) {
                                r.setEnd(r.endContainer.childNodes[r.endOffset].previousSibling, r.endContainer.childNodes[r.endOffset].previousSibling.data.length);
                            }
                        }
                        found = true;
                    }
                    count++;
                } while (amount !== 0 && !found && count < 2000);
            }
            r.select();
            this.includeRangyRangeHelpers();
        };
        /**
         * 以Text形式返回selection内容
         */
        Selection.prototype.getText = function () {
            var selection = this.getSelection();
            return selection ? selection.toString() : "";
        };
        /**
         * 返回包含filter条件的所有node节点的数组
         * @example
         * Seletion.getNodes([1,3],function(node){
         *   return  node.nodeType ==3;
         * }
         * // [text, text]
         */
        Selection.prototype.getNodes = function (nodeType, filter) {
            var range = this.getRange();
            if (range) {
                return range.getNodes(Array.isArray(nodeType) ? nodeType : [nodeType], filter);
            }
            else {
                return [];
            }
        };
        // // Gets all the elements in selection with nodeType
        // // Ignores the elements not belonging to current editable area
        // // If filter is defined nodes must pass the filter function with true to be included in list
        // getOwnNodes(nodeType, filter, splitBounds) {
        //     var ranges = this.getOwnRanges(),
        //         nodes = [];
        //     for (var r = 0, rmax = ranges.length; r < rmax; r++) {
        //         if (ranges[r]) {
        //             if (splitBounds) {
        //                 ranges[r].splitBoundaries();
        //             }
        //             nodes = nodes.concat(ranges[r].getNodes(Array.isArray(nodeType) ? nodeType : [nodeType], filter));
        //         }
        //     }
        //     return nodes;
        // }
        Selection.prototype.fixRangeOverflow = function (range) {
            if (this.contain && this.contain.firstChild && range) {
                var containment = range.compareNode(this.contain);
                if (containment !== 2) {
                    if (containment === 1) {
                        range.setStartBefore(this.contain.firstChild);
                    }
                    if (containment === 0) {
                        range.setEndAfter(this.contain.lastChild);
                    }
                    if (containment === 3) {
                        range.setStartBefore(this.contain.firstChild);
                        range.setEndAfter(this.contain.lastChild);
                    }
                }
                else if (this._detectInlineRangeProblems(range)) {
                    var previousElementSibling = range.endContainer.previousElementSibling;
                    if (previousElementSibling) {
                        range.setEnd(previousElementSibling, this._endOffsetForNode(previousElementSibling));
                    }
                }
            }
        };
        Selection.prototype._endOffsetForNode = function (node) {
            var range = document.createRange();
            range.selectNodeContents(node);
            return range.endOffset;
        };
        Selection.prototype._detectInlineRangeProblems = function (range) {
            var position = su.dom.compareDocumentPosition(range.startContainer, range.endContainer);
            return (range.endOffset == 0 &&
                position & 4 //Node.DOCUMENT_POSITION_FOLLOWING
            );
        };
        /**
         * 返回选中内容的Range对象
         */
        Selection.prototype.getRange = function (dontFix) {
            var selection = this.getSelection(), range = selection && selection.rangeCount && selection.getRangeAt(0);
            if (dontFix !== true) {
                this.fixRangeOverflow(range);
            }
            return range;
        };
        Selection.prototype.getOwnUneditables = function () {
            var allUneditables = su.dom.query(this.contain, '.' + this.unselectableClass), deepUneditables = su.dom.query(allUneditables, '.' + this.unselectableClass);
            return su.lang.array(allUneditables).without(deepUneditables);
        };
        // Returns an array of ranges that belong only to this editable
        // Needed as uneditable block in contenteditabel can split range into pieces
        // If manipulating content reverse loop is usually needed as manipulation can shift subsequent ranges
        Selection.prototype.getOwnRanges = function () {
            var ranges = [], r = this.getRange(), tmpRanges;
            if (r) {
                ranges.push(r);
            }
            if (this.unselectableClass && this.contain && r) {
                var uneditables = this.getOwnUneditables(), tmpRange;
                if (uneditables.length > 0) {
                    for (var i = 0, imax = uneditables.length; i < imax; i++) {
                        tmpRanges = [];
                        for (var j = 0, jmax = ranges.length; j < jmax; j++) {
                            if (ranges[j]) {
                                switch (ranges[j].compareNode(uneditables[i])) {
                                    case 2:
                                        // all selection inside uneditable. remove
                                        break;
                                    case 3:
                                        //section begins before and ends after uneditable. spilt
                                        tmpRange = ranges[j].cloneRange();
                                        tmpRange.setEndBefore(uneditables[i]);
                                        tmpRanges.push(tmpRange);
                                        tmpRange = ranges[j].cloneRange();
                                        tmpRange.setStartAfter(uneditables[i]);
                                        tmpRanges.push(tmpRange);
                                        break;
                                    default:
                                        // in all other cases uneditable does not touch selection. dont modify
                                        tmpRanges.push(ranges[j]);
                                }
                            }
                            ranges = tmpRanges;
                        }
                    }
                }
            }
            return ranges;
        };
        Selection.prototype.getSelection = function () {
            return rangy.getSelection(this.win);
        };
        // Sets selection in document to a given range
        // Set selection method detects if it fails to set any selection in document and returns null on fail
        // (especially needed in webkit where some ranges just can not create selection for no reason)
        Selection.prototype.setSelection = function (range) {
            var selection = rangy.getSelection(this.win);
            selection.setSingleRange(range);
            return (selection && selection.anchorNode && selection.focusNode) ? selection : null;
        };
        // Webkit has an ancient error of not selecting all contents when uneditable block element is first or last in editable area
        // selectAll() {
        //     var range = this.createRange(),
        //         composer = this.composer,
        //         that = this,
        //         blankEndNode = getWebkitSelectionFixNode(this.composer.element),
        //         blankStartNode = getWebkitSelectionFixNode(this.composer.element),
        //         s;
        //     var doSelect = function () {
        //         range.setStart(composer.element, 0);
        //         range.setEnd(composer.element, composer.element.childNodes.length);
        //         s = that.setSelection(range);
        //     };
        //     var notSelected = function () {
        //         return !s || (s.nativeSelection && s.nativeSelection.type && (s.nativeSelection.type === "Caret" || s.nativeSelection.type === "None"));
        //     }
        //     dom.removeInvisibleSpaces(this.composer.element);
        //     doSelect();
        //     if (this.composer.element.firstChild && notSelected()) {
        //         // Try fixing end
        //         this.composer.element.appendChild(blankEndNode);
        //         doSelect();
        //         if (notSelected()) {
        //             // Remove end fix
        //             blankEndNode.parentNode.removeChild(blankEndNode);
        //             // Try fixing beginning
        //             this.composer.element.insertBefore(blankStartNode, this.composer.element.firstChild);
        //             doSelect();
        //             if (notSelected()) {
        //                 // Try fixing both
        //                 this.composer.element.appendChild(blankEndNode);
        //                 doSelect();
        //             }
        //         }
        //     }
        // }
        /**
         * 创建Rang对象
         */
        Selection.prototype.createRange = function (doc) {
            return rangy.createRange(doc ? doc : this.doc);
        };
        /**
         * 是否在textarea、input、iframe等中
         */
        Selection.prototype.isCollapsed = function () {
            return this.getSelection().isCollapsed;
        };
        /**
         * 返回选择内容的html代码
         */
        Selection.prototype.getHtml = function () {
            return this.getSelection().toHtml();
        };
        /**
         * 返回纯文本
         */
        Selection.prototype.getPlainText = function () {
            return this.getSelection().toString();
        };
        // isEndToEndInNode(nodeNames) {
        //     var range = this.getRange(),
        //         parentElement = range.commonAncestorContainer,
        //         startNode = range.startContainer,
        //         endNode = range.endContainer;
        //     if (parentElement.nodeType === sulag.TEXT_NODE) {
        //         parentElement = parentElement.parentNode;
        //     }
        //     if (startNode.nodeType === sulag.TEXT_NODE && !(/^\s*$/).test(startNode.data.substr(range.startOffset))) {
        //         return false;
        //     }
        //     if (endNode.nodeType === sulag.TEXT_NODE && !(/^\s*$/).test(endNode.data.substr(range.endOffset))) {
        //         return false;
        //     }
        //     while (startNode && startNode !== parentElement) {
        //         if (startNode.nodeType !== sulag.TEXT_NODE && !dom.contains(parentElement, startNode)) {
        //             return false;
        //         }
        //         if (dom.domNode(startNode).prev({ ignoreBlankTexts: true })) {
        //             return false;
        //         }
        //         startNode = startNode.parentNode;
        //     }
        //     while (endNode && endNode !== parentElement) {
        //         if (endNode.nodeType !== sulag.TEXT_NODE && !dom.contains(parentElement, endNode)) {
        //             return false;
        //         }
        //         if (dom.domNode(endNode).next({ ignoreBlankTexts: true })) {
        //             return false;
        //         }
        //         endNode = endNode.parentNode;
        //     }
        //     return (lang.array(nodeNames).contains(parentElement.nodeName)) ? parentElement : false;
        // }
        /**
         * 判断鼠标焦点是否在可编辑区域内
         * @param {HTMLElement} this.element 可编辑区域
         */
        Selection.prototype.isInThisEditable = function () {
            var sel = this.getSelection(), fnode = sel.focusNode, anode = sel.anchorNode;
            // In IE node contains will not work for textnodes, thus taking parentNode
            if (fnode && fnode.nodeType !== 1) {
                fnode = fnode.parentNode;
            }
            if (anode && anode.nodeType !== 1) {
                anode = anode.parentNode;
            }
            return anode && fnode &&
                (su.dom.contains(this.element, fnode) || this.element === fnode) &&
                (su.dom.contains(this.element, anode) || this.element === anode);
        };
        Selection.prototype.deselect = function () {
            var sel = this.getSelection();
            sel && sel.removeAllRanges();
        };
        return Selection;
    }());
    su.Selection = Selection;
})(su || (su = {}));
/// <reference path="dom/delegate.ts" />
/// <reference path="selection/selection.ts" />
var h2 = document.getElementById("header");
var btn = document.getElementById("button");
// su.dom.delegate(document.body,"[data-wysihtml5-command],#textarea,h2",'click',function(e:Event){
//     e.preventDefault();
//     console.log('clicked:'+(e.target as Element).tagName.toLowerCase())
// });
//let slc = new su.Selection();
//let range = slc.createRange(h2);
// let sl = slc.setSelection(range)
// slc.setBefore(h2);
// test getNodes
// btn.onclick = function(){
//     console.log(slc.getNodes([1,3],function(node){
//         return  node.nodeType ==3;}));
// }
// test getLine
//let sb = new su.dom.Sandbox(function(){console.log("aaa")},{});
//let cmd = new su.Commands(new su.Editor("header",{}));
var editor = new su.Editor("editor", {});
var composer = editor.composer;
btn.onclick = function () {
    //editor.fire('change_view','textarea');
    //composer.commands.exec("bold");
    // console.log(slc.getNodes([1,3],function(node){
    //     return  node.nodeType ==3;}));
    console.log(composer.selection.getCaretNode().parentNode.id);
};
/// <reference path="../lang/array.ts" />
/// <reference path="../su.ts" />
/// <reference path="./class.ts" />
/// <reference path="./attribute.ts" />
/// <reference path="./text_content.ts" />
/// <reference path="./contains.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        // Finds parents of a node, returning the outermost node first in Array
        // if contain node is given parents search is stopped at the container
        function parents(node, container) {
            var nodes = [node], n = node;
            // iterate parents while parent exists and it is not container element
            while ((container && n && n !== container) || (!container && n)) {
                nodes.unshift(n);
                n = n.parentNode;
            }
            return nodes;
        }
        function domNode(node) {
            var defaultNodeTypes = [su.ELEMENT_NODE, su.TEXT_NODE];
            return {
                is: {
                    emptyTextNode: function (ignoreWhitespace) {
                        var regx = ignoreWhitespace ? (/^\s*$/g) : (/^[\r\n]*$/g);
                        return node && node.nodeType === su.TEXT_NODE && (regx).test(node.data);
                    },
                    // Returns if node is the rangy selection bookmark element (that must not be taken into account in most situatons and is removed on selection restoring)
                    rangyBookmark: function () {
                        return node && node.nodeType === 1 && node.classList.contains('rangySelectionBoundary');
                    },
                    visible: function () {
                        var isVisible = !(/^\s*$/g).test(dom.getTextContent(node));
                        if (!isVisible) {
                            if (node.nodeType === 1 && node.querySelector('img, br, hr, object, embed, canvas, input, textarea')) {
                                isVisible = true;
                            }
                        }
                        return isVisible;
                    },
                    lineBreak: function () {
                        return node && node.nodeType === 1 && node.nodeName === "BR";
                    },
                    block: function () {
                        return node && node.nodeType === 1 && node.ownerDocument.defaultView.getComputedStyle(node).display === "block";
                    },
                    // Void elements are elemens that can not have content
                    // In most cases browsers should solve the cases for you when you try to insert content into those,
                    //    but IE does not and it is not nice to do so anyway.
                    voidElement: function () {
                        return dom.domNode(node).test({
                            query: su.VOID_ELEMENTS
                        });
                    }
                },
                // var node = su.dom.domNode(element).prev({nodeTypes: [1,3], ignoreBlankTexts: true});
                prev: function (options) {
                    var prevNode = node.previousSibling, types = (options && options.nodeTypes) ? options.nodeTypes : defaultNodeTypes;
                    if (!prevNode) {
                        return null;
                    }
                    if (dom.domNode(prevNode).is.rangyBookmark() ||
                        (!su.lang.array(types).contains(prevNode.nodeType)) ||
                        (options && options.ignoreBlankTexts && dom.domNode(prevNode).is.emptyTextNode(true)) // Blank text nodes bypassed if set
                    ) {
                        return dom.domNode(prevNode).prev(options);
                    }
                    return prevNode;
                },
                // var node = su.dom.domNode(element).next({nodeTypes: [1,3], ignoreBlankTexts: true});
                next: function (options) {
                    var nextNode = node.nextSibling, types = (options && options.nodeTypes) ? options.nodeTypes : defaultNodeTypes;
                    if (!nextNode) {
                        return null;
                    }
                    if (dom.domNode(nextNode).is.rangyBookmark() ||
                        (!su.lang.array(types).contains(nextNode.nodeType)) ||
                        (options && options.ignoreBlankTexts && dom.domNode(nextNode).is.emptyTextNode(true)) // blank text nodes bypassed if set
                    ) {
                        return dom.domNode(nextNode).next(options);
                    }
                    return nextNode;
                },
                // Finds the common acnestor container of two nodes
                // If container given stops search at the container
                // If no common ancestor found returns null
                // var node = su.dom.domNode(element).commonAncestor(node2, container);
                commonAncestor: function (node2, container) {
                    var parents1 = parents(node, container), parents2 = parents(node2, container);
                    // Ensure we have found a common ancestor, which will be the first one if anything
                    if (parents1[0] != parents2[0]) {
                        return null;
                    }
                    // Traverse up the hierarchy of parents until we reach where they're no longer
                    // the same. Then return previous which was the common ancestor.
                    for (var i = 0; i < parents1.length; i++) {
                        if (parents1[i] != parents2[i]) {
                            return parents1[i - 1];
                        }
                    }
                    return null;
                },
                // Traverses a node for last children and their chidren (including itself), and finds the last node that has no children.
                // Array of classes for forced last-leaves (ex: uneditable-container) can be defined (options = {leafClasses: [...]})
                // Useful for finding the actually visible element before cursor
                lastLeafNode: function (options) {
                    var lastChild;
                    // Returns non-element nodes
                    if (node.nodeType !== 1) {
                        return node;
                    }
                    // Returns if element is leaf
                    lastChild = node.lastChild;
                    if (!lastChild) {
                        return node;
                    }
                    // Returns if element is of of options.leafClasses leaf
                    if (options && options.leafClasses) {
                        for (var i = options.leafClasses.length; i--;) {
                            if (dom.hasClass(node, options.leafClasses[i])) {
                                return node;
                            }
                        }
                    }
                    return dom.domNode(lastChild).lastLeafNode(options);
                },
                // Splits element at childnode and extracts the childNode out of the element context
                // Example:
                //   var node = su.dom.domNode(node).escapeParent(parentNode);
                escapeParent: function (element, newWrapper) {
                    var parent, split2, nodeWrap, curNode = node;
                    // Stop if node is not a descendant of element
                    if (!dom.contains(element, node)) {
                        throw new Error("Child is not a descendant of node.");
                    }
                    // Climb up the node tree untill node is reached
                    do {
                        // Get current parent of node
                        parent = curNode.parentNode;
                        // Move after nodes to new clone wrapper
                        split2 = parent.cloneNode(false);
                        while (parent.lastChild && parent.lastChild !== curNode) {
                            split2.insertBefore(parent.lastChild, split2.firstChild);
                        }
                        // Move node up a level. If parent is not yet the container to escape, clone the parent around node, so inner nodes are escaped out too
                        if (parent !== element) {
                            nodeWrap = parent.cloneNode(false);
                            nodeWrap.appendChild(curNode);
                            curNode = nodeWrap;
                        }
                        parent.parentNode.insertBefore(curNode, parent.nextSibling);
                        // Add after nodes (unless empty)
                        if (split2.innerHTML !== '') {
                            // if contents are empty insert without wrap
                            if ((/^\s+$/).test(split2.innerHTML)) {
                                while (split2.lastChild) {
                                    parent.parentNode.insertBefore(split2.lastChild, curNode.nextSibling);
                                }
                            }
                            else {
                                parent.parentNode.insertBefore(split2, curNode.nextSibling);
                            }
                        }
                        // If the node left behind before the split (parent) is now empty then remove
                        if (parent.innerHTML === '') {
                            parent.parentNode.removeChild(parent);
                        }
                        else if ((/^\s+$/).test(parent.innerHTML)) {
                            while (parent.firstChild) {
                                parent.parentNode.insertBefore(parent.firstChild, parent);
                            }
                            parent.parentNode.removeChild(parent);
                        }
                    } while (parent && parent !== element);
                    if (newWrapper && curNode) {
                        curNode.parentNode.insertBefore(newWrapper, curNode);
                        newWrapper.appendChild(curNode);
                    }
                },
                transferContentTo: function (targetNode, removeOldWrapper) {
                    if (node.nodeType === 1) {
                        if (dom.domNode(targetNode).is.voidElement() || targetNode.nodeType === 3) {
                            while (node.lastChild) {
                                targetNode.parentNode.insertBefore(node.lastChild, targetNode.nextSibling);
                            }
                        }
                        else {
                            while (node.firstChild) {
                                targetNode.appendChild(node.firstChild);
                            }
                        }
                        if (removeOldWrapper) {
                            node.parentNode.removeChild(node);
                        }
                    }
                    else if (node.nodeType === 3 || node.nodeType === 8) {
                        if (dom.domNode(targetNode).is.voidElement()) {
                            targetNode.parentNode.insertBefore(node, targetNode.nextSibling);
                        }
                        else {
                            targetNode.appendChild(node);
                        }
                    }
                },
                /*
                  Tests a node against properties, and returns true if matches.
                  Tests on principle that all properties defined must have at least one match.
                  styleValue parameter works in context of styleProperty and has no effect otherwise.
                  Returns true if element matches and false if it does not.
                  
                  Properties for filtering element:
                  {
                    query: selector string,
                    nodeName: string (uppercase),
                    className: string,
                    classRegExp: regex,
                    styleProperty: string or [],
                    styleValue: string, [] or regex
                  }
          
                  Example:
                  var node = su.dom.domNode(element).test({})
                */
                test: function (properties) {
                    var prop;
                    // return false if properties object is not defined
                    if (!properties) {
                        return false;
                    }
                    // Only element nodes can be tested for these properties
                    if (node.nodeType !== 1) {
                        return false;
                    }
                    if (properties.query) {
                        if (!node.matches(properties.query)) {
                            return false;
                        }
                    }
                    if (properties.nodeName && node.nodeName.toLowerCase() !== properties.nodeName.toLowerCase()) {
                        return false;
                    }
                    if (properties.className && !node.classList.contains(properties.className)) {
                        return false;
                    }
                    // classRegExp check (useful for classname begins with logic)
                    if (properties.classRegExp) {
                        var matches = (node.className || "").match(properties.classRegExp) || [];
                        if (matches.length === 0) {
                            return false;
                        }
                    }
                    // styleProperty check
                    if (properties.styleProperty && properties.styleProperty.length > 0) {
                        var hasOneStyle = false, styles = (Array.isArray(properties.styleProperty)) ? properties.styleProperty : [properties.styleProperty];
                        for (var j = 0, maxStyleP = styles.length; j < maxStyleP; j++) {
                            // Some old IE-s have different property name for cssFloat
                            prop = su.browser.fixStyleKey(styles[j]);
                            if (node.style[prop]) {
                                if (properties.styleValue) {
                                    // Style value as additional parameter
                                    if (properties.styleValue instanceof RegExp) {
                                        // style value as Regexp
                                        if (node.style[prop].trim().match(properties.styleValue).length > 0) {
                                            hasOneStyle = true;
                                            break;
                                        }
                                    }
                                    else if (Array.isArray(properties.styleValue)) {
                                        // style value as array
                                        if (properties.styleValue.indexOf(node.style[prop].trim())) {
                                            hasOneStyle = true;
                                            break;
                                        }
                                    }
                                    else {
                                        // style value as string
                                        if (properties.styleValue === node.style[prop].trim().replace(/, /g, ",")) {
                                            hasOneStyle = true;
                                            break;
                                        }
                                    }
                                }
                                else {
                                    hasOneStyle = true;
                                    break;
                                }
                            }
                            if (!hasOneStyle) {
                                return false;
                            }
                        }
                    }
                    if (properties.attribute) {
                        var attr = dom.getAttributes(node), attrList = [], hasOneAttribute = false;
                        if (Array.isArray(properties.attribute)) {
                            attrList = properties.attribute;
                        }
                        else {
                            attrList[properties.attribute] = properties.attributeValue;
                        }
                        for (var a in attrList) {
                            if (attrList.hasOwnProperty(a)) {
                                if (typeof attrList[a] === "undefined") {
                                    if (typeof attr[a] !== "undefined") {
                                        hasOneAttribute = true;
                                        break;
                                    }
                                }
                                else if (attr[a] === attrList[a]) {
                                    hasOneAttribute = true;
                                    break;
                                }
                            }
                        }
                        if (!hasOneAttribute) {
                            return false;
                        }
                    }
                    return true;
                }
            };
        }
        dom.domNode = domNode;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * Walks the dom tree from the given node up until it finds a match
         *
         * @param {Element} node The from which to check the parent nodes
         * @param {Object} matchingSet Object to match against, Properties for filtering element:
         *   {
         *     query: selector string,
         *     classRegExp: regex,
         *     styleProperty: string or [],
         *     styleValue: string, [] or regex
         *   }
         * @param {Number} [levels] How many parents should the function check up from the current node (defaults to 50)
         * @param {Element} Optional, defines the container that limits the search
         *
         * @return {null|Element} Returns the first element that matched the desiredNodeName(s)
        */
        dom.getParentElement = (function () {
            return function (node, properties, levels, container) {
                levels = levels || 50;
                while (levels-- && node && node.nodeName !== "BODY" && (!container || node !== container)) {
                    if (dom.domNode(node).test(properties)) {
                        return node;
                    }
                    node = node.parentNode;
                }
                return null;
            };
        })();
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        function insertCSS(rules) {
            rules = rules.join("\n");
            return {
                into: function (doc) {
                    var styleElement = doc.createElement("style");
                    styleElement.type = "text/css";
                    if (styleElement.styleSheet) {
                        styleElement.styleSheet.cssText = rules;
                    }
                    else {
                        styleElement.appendChild(doc.createTextNode(rules));
                    }
                    var link = doc.querySelector("head link");
                    if (link) {
                        link.parentNode.insertBefore(styleElement, link);
                        return;
                    }
                    else {
                        var head = doc.querySelector("head");
                        if (head) {
                            head.appendChild(styleElement);
                        }
                    }
                }
            };
        }
        dom.insertCSS = insertCSS;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
var su;
(function (su) {
    var dom;
    (function (dom) {
        // does a selector query on element or array of elements
        function query(elements, query) {
            var ret = [], q;
            if (elements.nodeType) {
                elements = [elements];
            }
            for (var e = 0, len = elements.length; e < len; e++) {
                q = elements[e].querySelectorAll(query);
                if (q) {
                    for (var i = q.length; i--; ret.unshift(q[i]))
                        ;
                }
            }
            return ret;
        }
        dom.query = query;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="../polyfills.ts" />
/// <reference path="../su.ts" />
/// <reference path="../browser.ts" />
/// <reference path="../lang/string.ts" />
/// <reference path="../lang/object.ts" />
/// <reference path="./attribute.ts" />
/// <reference path="./contains.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        var /**
           * Default configuration
           */ doc = document, 
        /**
         * Properties to unset/protect on the window object
         */
        windowProperties = [
            "parent", "top", "opener", "frameElement", "frames",
            "localStorage", "globalStorage", "sessionStorage", "indexedDB"
        ], 
        /**
         * Properties on the window object which are set to an empty function
         */
        windowProperties2 = [
            "open", "close", "openDialog", "showModalDialog",
            "alert", "confirm", "prompt",
            "openDatabase", "postMessage",
            "XMLHttpRequest", "XDomainRequest"
        ], 
        /**
         * Properties to unset/protect on the document object
         */
        documentProperties = [
            "referrer",
            "write", "open", "close"
        ];
        /**
            * 执行JavaScript沙箱，解析CSS样式，以安全的方式做的DOM操作
            *
            * 浏览器兼容性:
            *  - Secure in MSIE 6+, but only when the user hasn't made changes to his security level "restricted"
            *  - Partially secure in other browsers (Firefox, Opera, Safari, Chrome, ...)
            *
            * Please note that this class can't benefit from the HTML5 sandbox attribute for the following reasons:
            *    - sandboxing doesn't work correctly with inlined content (src="javascript:'<html>...</html>'")
            *    - sandboxing of physical documents causes that the dom isn't accessible anymore from the outside (iframe.contentWindow, ...)
            *    - setting the "allow-same-origin" flag would fix that, but then still javascript and dom events refuse to fire
            *    - therefore the "allow-scripts" flag is needed, which then would deactivate any security, as the js executed inside the iframe
            *      can do anything as if the sandbox attribute wasn't set
            *
            * @param {Function} [readyCallback] Method that gets invoked when the sandbox is ready
            * @param {Object} [config] Optional parameters
            *
            * @example
            *    new wysihtml.dom.Sandbox(function(sandbox) {
            *      sandbox.getWindow().document.body.innerHTML = '<img src=foo.gif onerror="alert(document.cookie)">';
            *    });
            */
        var Sandbox = (function () {
            function Sandbox(readyCallback, config) {
                this.callback = readyCallback || su.EMPTY_FUNCTION;
                this.config = su.lang.object({}).merge(config).get();
                if (!this.config.className) {
                    this.config.className = "wysihtml-sandbox";
                }
                this.editableArea = this._createIframe();
            }
            Sandbox.prototype.insertInto = function (element) {
                if (typeof (element) === "string") {
                    element = doc.getElementById(element);
                }
                element.appendChild(this.editableArea);
            };
            Sandbox.prototype.getIframe = function () {
                return this.editableArea;
            };
            Sandbox.prototype.getWindow = function () {
                this._readyError();
            };
            Sandbox.prototype.getDocument = function () {
                this._readyError();
            };
            Sandbox.prototype.destroy = function () {
                var iframe = this.getIframe();
                iframe.parentNode.removeChild(iframe);
            };
            Sandbox.prototype._readyError = function () {
                throw new Error("wysihtml.Sandbox: Sandbox iframe isn't loaded yet");
            };
            /**
             * Creates the sandbox iframe
             *
             * Some important notes:
             *  - We can't use HTML5 sandbox for now:
             *    setting it causes that the iframe's dom can't be accessed from the outside
             *    Therefore we need to set the "allow-same-origin" flag which enables accessing the iframe's dom
             *    But then there's another problem, DOM events (focus, blur, change, keypress, ...) aren't fired.
             *    In order to make this happen we need to set the "allow-scripts" flag.
             *    A combination of allow-scripts and allow-same-origin is almost the same as setting no sandbox attribute at all.
             *  - Chrome & Safari, doesn't seem to support sandboxing correctly when the iframe's html is inlined (no physical document)
             *  - IE needs to have the security="restricted" attribute set before the iframe is
             *    inserted into the dom tree
             *  - Believe it or not but in IE "security" in document.createElement("iframe") is false, even
             *    though it supports it
             *  - When an iframe has security="restricted", in IE eval() & execScript() don't work anymore
             *  - IE doesn't fire the onload event when the content is inlined in the src attribute, therefore we rely
             *    on the onreadystatechange event
             */
            Sandbox.prototype._createIframe = function () {
                var that = this, iframe = doc.createElement("iframe");
                iframe.className = this.config.className;
                dom.setAttributes({
                    "security": "restricted",
                    "allowtransparency": "true",
                    "frameborder": 0,
                    "width": 0,
                    "height": 0,
                    "marginwidth": 0,
                    "marginheight": 0
                }).on(iframe);
                // Setting the src like this prevents ssl warnings in IE6
                if (su.browser.throwsMixedContentWarningWhenIframeSrcIsEmpty()) {
                    iframe.src = "javascript:'<html></html>'";
                }
                iframe.onload = function () {
                    iframe.onreadystatechange = iframe.onload = null;
                    that._onLoadIframe(iframe);
                };
                iframe.onreadystatechange = function () {
                    if (/loaded|complete/.test(iframe.readyState)) {
                        iframe.onreadystatechange = iframe.onload = null;
                        that._onLoadIframe(iframe);
                    }
                };
                return iframe;
            };
            /**
             * Callback for when the iframe has finished loading
             */
            Sandbox.prototype._onLoadIframe = function (iframe) {
                var _this = this;
                // don't resume when the iframe got unloaded (eg. by removing it from the dom)
                if (!dom.contains(doc.documentElement, iframe)) {
                    return;
                }
                var iframeWindow = iframe.contentWindow, iframeDocument = iframe.contentWindow.document, charset = doc.characterSet || doc.charset || "utf-8", sandboxHtml = this._getHtml({
                    charset: charset,
                    stylesheets: this.config.stylesheets
                });
                // Create the basic dom tree including proper DOCTYPE and charset
                iframeDocument.open("text/html", "replace");
                iframeDocument.write(sandboxHtml);
                iframeDocument.close();
                this.getWindow = function () { return iframe.contentWindow; };
                this.getDocument = function () { return iframe.contentWindow.document; };
                // Catch js errors and pass them to the parent's onerror event
                // addEventListener("error") doesn't work properly in some browsers
                // TODO: apparently this doesn't work in IE9!
                iframeWindow.onerror = function (errorMessage, fileName, lineNumber) {
                    throw new Error("wysihtml.Sandbox: " + errorMessage + fileName + lineNumber);
                };
                if (!su.browser.supportsSandboxedIframes()) {
                    // Unset a bunch of sensitive variables
                    // Please note: This isn't hack safe!
                    // It more or less just takes care of basic attacks and prevents accidental theft of sensitive information
                    // IE is secure though, which is the most important thing, since IE is the only browser, who
                    // takes over scripts & styles into contentEditable elements when copied from external websites
                    // or applications (Microsoft Word, ...)
                    var i, length;
                    for (i = 0, length = windowProperties.length; i < length; i++) {
                        this._unset(iframeWindow, windowProperties[i]);
                    }
                    for (i = 0, length = windowProperties2.length; i < length; i++) {
                        this._unset(iframeWindow, windowProperties2[i], su.EMPTY_FUNCTION);
                    }
                    for (i = 0, length = documentProperties.length; i < length; i++) {
                        this._unset(iframeDocument, documentProperties[i]);
                    }
                    // This doesn't work in Safari 5
                    // See http://stackoverflow.com/questions/992461/is-it-possible-to-override-document-cookie-in-webkit
                    this._unset(iframeDocument, "cookie", "", true);
                }
                if (polyfills) {
                    polyfills(iframeWindow, iframeDocument).apply();
                }
                this.loaded = true;
                // Trigger the callback
                setTimeout(function () { _this.callback(_this); }, 0);
            };
            Sandbox.prototype._getHtml = function (templateVars) {
                var stylesheets = templateVars.stylesheets, html = "", i = 0, length;
                stylesheets = typeof (stylesheets) === "string" ? [stylesheets] : stylesheets;
                if (stylesheets) {
                    length = stylesheets.length;
                    for (; i < length; i++) {
                        html += '<link rel="stylesheet" href="' + stylesheets[i] + '">';
                    }
                }
                templateVars.stylesheets = html;
                return su.lang.string('<!DOCTYPE html><html><head>'
                    + '<meta charset="#{charset}">#{stylesheets}</head>'
                    + '<body></body></html>').interpolate(templateVars);
            };
            /**
             * Method to unset/override existing variables
             * @example
             *    // Make cookie unreadable and unwritable
             *    this._unset(document, "cookie", "", true);
             */
            Sandbox.prototype._unset = function (object, property, value, setter) {
                try {
                    object[property] = value;
                }
                catch (e) { }
                try {
                    object.__defineGetter__(property, function () { return value; });
                }
                catch (e) { }
                if (setter) {
                    try {
                        object.__defineSetter__(property, function () { });
                    }
                    catch (e) { }
                }
                if (!su.browser.crashesWhenDefineProperty(property)) {
                    try {
                        var config = {
                            get: function () { return value; }
                        };
                        if (setter) {
                            config.set = function () { };
                        }
                        Object.defineProperty(object, property, config);
                    }
                    catch (e) { }
                }
            };
            return Sandbox;
        }());
        dom.Sandbox = Sandbox;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
/// <reference path="../dom/class.ts" />
var su;
(function (su) {
    var quirks;
    (function (quirks) {
        /**
         * Force rerendering of a given element
         * Needed to fix display misbehaviors of IE
         *
         * @param {Element} element The element object which needs to be rerendered
         * @example
         *    wysihtml.quirks.redraw(document.body);
         */
        var CLASS_NAME = "wysihtml-quirks-redraw";
        function redraw(element) {
            su.dom.addClass(element, CLASS_NAME);
            su.dom.removeClass(element, CLASS_NAME);
            // Following hack is needed for firefox to make sure that image resize handles are properly removed
            try {
                var doc = element.ownerDocument;
                doc.execCommand("italic", false, null);
                doc.execCommand("italic", false, null);
            }
            catch (e) { }
        }
        quirks.redraw = redraw;
        ;
    })(quirks = su.quirks || (su.quirks = {}));
})(su || (su = {}));
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
        function handleDeleteKeyPress(event, composer) {
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
        }
        ;
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
        function handleKeyDown(event) {
            console.log("key down: " + event.keyCode);
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
        }
        ;
        function handleKeyPress(event) {
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
        }
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
/// <reference path="../browser.ts" />
/// <reference path="../dom/styles.ts" />
/// <reference path="../dom/get_style.ts" />
/// <reference path="../dom/insert_css.ts" />
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
        su.views.Composer.prototype.style = function () {
            var that = this, originalActiveElement = doc.querySelector(":focus"), textareaElement = this.textarea.element, hasPlaceholder = textareaElement.hasAttribute("placeholder"), originalPlaceholder = hasPlaceholder && textareaElement.getAttribute("placeholder"), originalDisplayValue = textareaElement.style.display, originalDisabled = textareaElement.disabled, displayValueForCopying;
            this.focusStylesHost = HOST_TEMPLATE.cloneNode(false);
            this.blurStylesHost = HOST_TEMPLATE.cloneNode(false);
            this.disabledStylesHost = HOST_TEMPLATE.cloneNode(false);
            // Remove placeholder before copying (as the placeholder has an affect on the computed style)
            if (hasPlaceholder) {
                textareaElement.removeAttribute("placeholder");
            }
            if (textareaElement === originalActiveElement) {
                textareaElement.blur();
            }
            // enable for copying styles
            textareaElement.disabled = false;
            // set textarea to display="none" to get cascaded styles via getComputedStyle
            textareaElement.style.display = displayValueForCopying = "none";
            if ((textareaElement.getAttribute("rows") && su.dom.getStyle("height").from(textareaElement) === "auto") ||
                (textareaElement.getAttribute("cols") && su.dom.getStyle("width").from(textareaElement) === "auto")) {
                textareaElement.style.display = displayValueForCopying = originalDisplayValue;
            }
            // --------- iframe styles (has to be set before editor styles, otherwise IE9 sets wrong fontFamily on blurStylesHost) ---------
            su.dom.copyStyles(BOX_FORMATTING).from(textareaElement).to(this.editableArea).andTo(this.blurStylesHost);
            // --------- editor styles ---------
            su.dom.copyStyles(TEXT_FORMATTING).from(textareaElement).to(this.element).andTo(this.blurStylesHost);
            // --------- apply standard rules ---------
            su.dom.insertCSS(ADDITIONAL_CSS_RULES).into(this.element.ownerDocument);
            // --------- :disabled styles ---------
            textareaElement.disabled = true;
            su.dom.copyStyles(BOX_FORMATTING).from(textareaElement).to(this.disabledStylesHost);
            su.dom.copyStyles(TEXT_FORMATTING).from(textareaElement).to(this.disabledStylesHost);
            textareaElement.disabled = originalDisabled;
            // --------- :focus styles ---------
            textareaElement.style.display = originalDisplayValue;
            focusWithoutScrolling(textareaElement);
            textareaElement.style.display = displayValueForCopying;
            su.dom.copyStyles(BOX_FORMATTING).from(textareaElement).to(this.focusStylesHost);
            su.dom.copyStyles(TEXT_FORMATTING).from(textareaElement).to(this.focusStylesHost);
            // reset textarea
            textareaElement.style.display = originalDisplayValue;
            su.dom.copyStyles(["display"]).from(textareaElement).to(this.editableArea);
            // Make sure that we don't change the display style of the iframe when copying styles oblur/onfocus
            // this is needed for when the change_view event is fired where the iframe is hidden and then
            // the blur event fires and re-displays it
            var boxFormattingStyles = su.lang.array(BOX_FORMATTING).without(["display"]);
            // --------- restore focus ---------
            if (originalActiveElement) {
                focusWithoutScrolling(originalActiveElement);
            }
            else {
                textareaElement.blur();
            }
            // --------- restore placeholder ---------
            if (hasPlaceholder) {
                textareaElement.setAttribute("placeholder", originalPlaceholder);
            }
            // --------- Sync focus/blur styles ---------
            this.parent.on("focus:composer", function () {
                su.dom.copyStyles(boxFormattingStyles).from(that.focusStylesHost).to(that.editableArea);
                su.dom.copyStyles(TEXT_FORMATTING).from(that.focusStylesHost).to(that.element);
            });
            this.parent.on("blur:composer", function () {
                su.dom.copyStyles(boxFormattingStyles).from(that.blurStylesHost).to(that.editableArea);
                su.dom.copyStyles(TEXT_FORMATTING).from(that.blurStylesHost).to(that.element);
            });
            this.parent.on("disable:composer", function () {
                su.dom.copyStyles(boxFormattingStyles).from(that.disabledStylesHost).to(that.editableArea);
                su.dom.copyStyles(TEXT_FORMATTING).from(that.disabledStylesHost).to(that.element);
            });
            this.parent.on("enable:composer", function () {
                su.dom.copyStyles(boxFormattingStyles).from(that.blurStylesHost).to(that.editableArea);
                su.dom.copyStyles(TEXT_FORMATTING).from(that.blurStylesHost).to(that.element);
            });
            return this;
        };
    })(views = su.views || (su.views = {}));
})(su || (su = {}));
