module su.dom{
    export function getTextNodes(node:Node, ingoreEmpty?) {
        var all = [];
        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType == 3) {
                if (!ingoreEmpty || !(/^\s*$/).test((node as HTMLElement).innerText || node.textContent)) {
                    all.push(node);
                }
            } else {
                all = all.concat(dom.getTextNodes(node, ingoreEmpty));
            }
        }
        return all;
    };
}