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
