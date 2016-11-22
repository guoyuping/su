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
