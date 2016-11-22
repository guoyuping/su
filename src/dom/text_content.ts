module su.dom {
    var documentElement = document.documentElement;
    export function setTextContent(element, text) {
        if ("textContent" in documentElement) {
            element.textContent = text;
        } else if ("innerText" in documentElement) {
            element.innerText = text;
        } else {
            element.nodeValue = text;
        }
    };
    export function getTextContent(element) {
        if ("textContent" in documentElement) {
            return element.textContent;
        } else if ("innerText" in documentElement) {
            return element.innerText;
        } else {
            return element.nodeValue;
        }
    }
}