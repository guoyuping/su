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
