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
