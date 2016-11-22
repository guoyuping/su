module su.dom {
    /**
     * 给元素绑定事件对象
     *
     * @example
     * dom.delegate(document.body,"#textarea",'click',function(e:Event){
     *       console.log((e.target as Element).tagName.toLowerCase())
     *   });
     */
    export function delegate(container:HTMLElement, selector, eventName, handler) {
        var callback = function (event) {
            var target = event.target,
                element = (target.nodeType === 3) ? target.parentNode : target, // IE has .contains only seeing elements not textnodes
                matches = container.querySelectorAll(selector);

            for (var i = 0, max = matches.length; i < max; i++) {
                if (matches[i].contains(element)) {
                    handler.call(matches[i], event);
                }
            }
        };

        container.addEventListener(eventName, callback, false);
        return {
            stop: function () {
                container.removeEventListener(eventName, callback, false);
            }
        };
    };
}