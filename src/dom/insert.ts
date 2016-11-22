module su.dom{
    /**
     * 插入节点
     * @param {HTMLElement} elementToInsert 插入的节点
     * @param {HTMLElement} element 参照节点
     */
    export function insert(elementToInsert) {
        return {
            after: function (element) {
                element.parentNode.insertBefore(elementToInsert, element.nextSibling);
            },

            before: function (element) {
                element.parentNode.insertBefore(elementToInsert, element);
            },

            into: function (element) {
                element.appendChild(elementToInsert);
            }
        };
    };
}