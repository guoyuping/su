interface EventTarget {
    attachEvent(eventNameWithOn, callback): boolean;
    detachEvent(eventNameWithOn, callback): void;
}
module su.dom{
    /**
     * 给元素添加events的handler函数，可以通过handler函数的参数event的event.type来判断当前是哪个事件
     * Method to set dom events
     *
     * @example
     *    wysihtml.dom.observe(iframe.contentWindow.document.body, ["focus", "blur"], function(event) { ...event.type==="blur" });
     */

    export function observe(element: EventTarget, eventNames: string | string[], handler: EventListener) {
        eventNames = typeof (eventNames) === "string" ? [eventNames] : eventNames;

        var handlerWrapper,
            eventName,
            i = 0,
            length = eventNames.length;

        for (; i < length; i++) {
            eventName = eventNames[i];
            if (element.addEventListener) {
                element.addEventListener(eventName, handler, false);
            } else {
                handlerWrapper = function (event) {
                    if (!("target" in event)) {
                        event.target = event.srcElement;
                    }
                    event.preventDefault = event.preventDefault || function () {
                        this.returnValue = false;
                    };
                    event.stopPropagation = event.stopPropagation || function () {
                        this.cancelBubble = true;
                    };
                    handler.call(element, event);
                };
                element.attachEvent("on" + eventName, handlerWrapper);
            }
        }

        return {
            stop: function () {
                var eventName,
                    i = 0,
                    length = eventNames.length;
                for (; i < length; i++) {
                    eventName = eventNames[i];
                    if (element.removeEventListener) {
                        element.removeEventListener(eventName, handler, false);
                    } else {
                        element.detachEvent("on" + eventName, handlerWrapper);
                    }
                }
            }
        };
    };
}