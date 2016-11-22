/// <reference path="../lang/array.ts" />
/// <reference path="../browser.ts" />
var su;
(function (su) {
    var dom;
    (function (dom) {
        /**
         * Copy a set of attributes from one element to another
         *
         * @param {Array} attributesToCopy List of attributes which should be copied
         * @return {Object} Returns an object which offers the "from" method which can be invoked with the element where to
         *    copy the attributes from., this again returns an object which provides a method named "to" which can be invoked
         *    with the element where to copy the attributes to (see example)
         *
         * @example
         *    var textarea    = document.querySelector("textarea"),
         *        div         = document.querySelector("div[contenteditable=true]"),
         *        anotherDiv  = document.querySelector("div.preview");
         *    wysihtml.dom.copyAttributes(["spellcheck", "value", "placeholder"]).from(textarea).to(div).andTo(anotherDiv);
         *
         */
        function copyAttributes(attributesToCopy) {
            return {
                from: function (elementToCopyFrom) {
                    return {
                        to: function pasteElementAttributesTo(elementToCopyTo) {
                            var attribute, i = 0, length = attributesToCopy.length;
                            for (; i < length; i++) {
                                attribute = attributesToCopy[i];
                                if (typeof (elementToCopyFrom[attribute]) !== "undefined" && elementToCopyFrom[attribute] !== "") {
                                    elementToCopyTo[attribute] = elementToCopyFrom[attribute];
                                }
                            }
                            return { andTo: pasteElementAttributesTo };
                        }
                    };
                }
            };
        }
        dom.copyAttributes = copyAttributes;
        /**
        * 获得一个element的attribute
        *
        * IE gives wrong results for hasAttribute/getAttribute, for example:
        *    var td = document.createElement("td");
        *    td.getAttribute("rowspan"); // => "1" in IE
        *
        * Therefore we have to check the element's outerHTML for the attribute
        */
        function getAttribute(node, attributeName) {
            var HAS_GET_ATTRIBUTE_BUG = !su.browser.supportsGetAttributeCorrectly();
            attributeName = attributeName.toLowerCase();
            var nodeName = node.nodeName;
            if (nodeName == "IMG" && attributeName == "src" && dom.isLoadedImage(node) === true) {
                // Get 'src' attribute value via object property since this will always contain the
                // full absolute url (http://...)
                // this fixes a very annoying bug in firefox (ver 3.6 & 4) and IE 8 where images copied from the same host
                // will have relative paths, which the sanitizer strips out (see attributeCheckMethods.url)
                return node.src;
            }
            else if (HAS_GET_ATTRIBUTE_BUG && "outerHTML" in node) {
                // Don't trust getAttribute/hasAttribute in IE 6-8, instead check the element's outerHTML
                var outerHTML = node.outerHTML.toLowerCase(), 
                // TODO: This might not work for attributes without value: <input disabled>
                hasAttribute = outerHTML.indexOf(" " + attributeName + "=") != -1;
                return hasAttribute ? node.getAttribute(attributeName) : null;
            }
            else {
                return node.getAttribute(attributeName);
            }
        }
        dom.getAttribute = getAttribute;
        ;
        /**
         * Get all attributes of an element
         *
         * IE gives wrong results for hasAttribute/getAttribute, for example:
         *    var td = document.createElement("td");
         *    td.getAttribute("rowspan"); // => "1" in IE
         *
         * Therefore we have to check the element's outerHTML for the attribute
        */
        function getAttributes(node) {
            var HAS_GET_ATTRIBUTE_BUG = !su.browser.supportsGetAttributeCorrectly(), nodeName = node.nodeName, attributes = [], attr;
            for (attr in node.attributes) {
                if ((node.attributes.hasOwnProperty && node.attributes.hasOwnProperty(attr)) || (!node.attributes.hasOwnProperty && Object.prototype.hasOwnProperty.call(node.attributes, attr))) {
                    if (node.attributes[attr].specified) {
                        if (nodeName == "IMG" && node.attributes[attr].name.toLowerCase() == "src" && dom.isLoadedImage(node) === true) {
                            attributes['src'] = node.src;
                        }
                        else if (su.lang.array(['rowspan', 'colspan']).contains(node.attributes[attr].name.toLowerCase()) && HAS_GET_ATTRIBUTE_BUG) {
                            if (node.attributes[attr].value !== 1) {
                                attributes[node.attributes[attr].name] = node.attributes[attr].value;
                            }
                        }
                        else {
                            attributes[node.attributes[attr].name] = node.attributes[attr].value;
                        }
                    }
                }
            }
            return attributes;
        }
        dom.getAttributes = getAttributes;
        ;
        var mapping = {
            "className": "class"
        };
        function setAttributes(attributes) {
            return {
                on: function (element) {
                    for (var i in attributes) {
                        element.setAttribute(mapping[i] || i, attributes[i]);
                    }
                }
            };
        }
        dom.setAttributes = setAttributes;
        ;
        /**
         *
         * Check whether the given node is a proper loaded image
         * FIXME: Returns undefined when unknown (Chrome, Safari)
         */
        function isLoadedImage(node) {
            try {
                return node.complete && !node.mozMatchesSelector(":-moz-broken");
            }
            catch (e) {
                if (node.complete && node.readyState === "complete") {
                    return true;
                }
            }
        }
        dom.isLoadedImage = isLoadedImage;
        ;
    })(dom = su.dom || (su.dom = {}));
})(su || (su = {}));
