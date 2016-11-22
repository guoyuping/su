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
