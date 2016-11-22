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
