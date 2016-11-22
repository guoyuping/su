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
