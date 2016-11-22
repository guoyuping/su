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
var su;
(function (su) {
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
