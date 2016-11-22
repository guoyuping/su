module su.dom{
    // does a selector query on element or array of elements
    export function query(elements, query) {
        var ret = [],
            q;

        if (elements.nodeType) {
            elements = [elements];
        }

        for (var e = 0, len = elements.length; e < len; e++) {
            q = elements[e].querySelectorAll(query);
            if (q) {
                for (var i = q.length; i--; ret.unshift(q[i]));
            }
        }
        return ret;
    };
}