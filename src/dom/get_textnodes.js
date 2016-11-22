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
