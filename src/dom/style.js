/// <reference path="../lang/array.ts" />
/// <reference path="../su.ts" />
var dom;
(function (dom) {
    /**
     * Get element's style for a specific css property
     *
     * @param {Element} element The element on which to retrieve the style
     * @param {String} property The CSS property to retrieve ("float", "display", "text-align", ...)
     *
     * @example
     *    wysihtml.dom.getStyle("display").from(document.body);
     *    // => "block"
     */
    dom.getStyle = (function getStyle() {
        var stylePropertyMapping = {
            "float": ("styleFloat" in document.createElement("div").style) ? "styleFloat" : "cssFloat"
        }, REG_EXP_CAMELIZE = /\-[a-z]/g;
        function camelize(str) {
            return str.replace(REG_EXP_CAMELIZE, function (match) {
                return match.charAt(1).toUpperCase();
            });
        }
        return function (property) {
            return {
                from: function (element) {
                    if (element.nodeType !== su.ELEMENT_NODE) {
                        return;
                    }
                    var doc = element.ownerDocument, camelizedProperty = stylePropertyMapping[property] || camelize(property), style = element.style, currentStyle = element.currentStyle, styleValue = style[camelizedProperty];
                    if (styleValue) {
                        return styleValue;
                    }
                    // currentStyle is no standard and only supported by Opera and IE but it has one important advantage over the standard-compliant
                    // window.getComputedStyle, since it returns css property values in their original unit:
                    // If you set an elements width to "50%", window.getComputedStyle will give you it's current width in px while currentStyle
                    // gives you the original "50%".
                    // Opera supports both, currentStyle and window.getComputedStyle, that's why checking for currentStyle should have higher prio
                    if (currentStyle) {
                        try {
                            return currentStyle[camelizedProperty];
                        }
                        catch (e) {
                        }
                    }
                    var win = doc.defaultView || doc.parentWindow, needsOverflowReset = (property === "height" || property === "width") && element.nodeName === "TEXTAREA", originalOverflow, returnValue;
                    if (win.getComputedStyle) {
                        // Chrome and Safari both calculate a wrong width and height for textareas when they have scroll bars
                        // therfore we remove and restore the scrollbar and calculate the value in between
                        if (needsOverflowReset) {
                            originalOverflow = style.overflow;
                            style.overflow = "hidden";
                        }
                        returnValue = win.getComputedStyle(element, null).getPropertyValue(property);
                        if (needsOverflowReset) {
                            style.overflow = originalOverflow || "";
                        }
                        return returnValue;
                    }
                }
            };
        };
    })();
    function setStyles(styles) {
        return {
            on: function (element) {
                var style = element.style;
                if (typeof (styles) === "string") {
                    style.cssText += ";" + styles;
                    return;
                }
                for (var i in styles) {
                    if (i === "float") {
                        style.cssFloat = styles[i];
                        style.styleFloat = styles[i];
                    }
                    else {
                        style[i] = styles[i];
                    }
                }
            }
        };
    }
    dom.setStyles = setStyles;
    ;
    /**
     * Mozilla, WebKit and Opera recalculate the computed width when box-sizing: boder-box; is set
     * So if an element has "width: 200px; -moz-box-sizing: border-box; border: 1px;" then
     * its computed css width will be 198px
     *
     * See https://bugzilla.mozilla.org/show_bug.cgi?id=520992
     */
    var BOX_SIZING_PROPERTIES = ["-webkit-box-sizing", "-moz-box-sizing", "-ms-box-sizing", "box-sizing"];
    var shouldIgnoreBoxSizingBorderBox = function (element) {
        if (hasBoxSizingBorderBox(element)) {
            return parseInt(dom.getStyle("width").from(element), 10) < element.offsetWidth;
        }
        return false;
    };
    var hasBoxSizingBorderBox = function (element) {
        var i = 0, length = BOX_SIZING_PROPERTIES.length;
        for (; i < length; i++) {
            if (dom.getStyle(BOX_SIZING_PROPERTIES[i]).from(element) === "border-box") {
                return BOX_SIZING_PROPERTIES[i];
            }
        }
    };
    /**
     * Copy a set of styles from one element to another
     * Please note that this only works properly across browsers when the element from which to copy the styles
     * is in the dom
     *
     * Interesting article on how to copy styles
     *
     * @param {Array} stylesToCopy List of styles which should be copied
     * @return {Object} Returns an object which offers the "from" method which can be invoked with the element where to
     *    copy the styles from., this again returns an object which provides a method named "to" which can be invoked
     *    with the element where to copy the styles to (see example)
     *
     * @example
     *    var textarea    = document.querySelector("textarea"),
     *        div         = document.querySelector("div[contenteditable=true]"),
     *        anotherDiv  = document.querySelector("div.preview");
     *    wysihtml.dom.copyStyles(["overflow-y", "width", "height"]).from(textarea).to(div).andTo(anotherDiv);
     *
     */
    function copyStyles(stylesToCopy) {
        return {
            from: function (element) {
                if (shouldIgnoreBoxSizingBorderBox(element)) {
                    stylesToCopy = su.lang.array(stylesToCopy).without(BOX_SIZING_PROPERTIES);
                }
                var cssText = "", length = stylesToCopy.length, i = 0, property;
                for (; i < length; i++) {
                    property = stylesToCopy[i];
                    cssText += property + ":" + dom.getStyle(property).from(element) + ";";
                }
                return {
                    to: function pasteStylesTo(element) {
                        setStyles(cssText).on(element);
                        return { andTo: pasteStylesTo };
                    }
                };
            }
        };
    }
    dom.copyStyles = copyStyles;
    ;
})(dom || (dom = {}));
