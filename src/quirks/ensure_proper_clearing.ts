/// <reference path="../dom/observe.ts" />

module su.quirks{
    /**
     * IE and Opera leave an empty paragraph in the contentEditable element after clearing it
     *
     * @param {Object} contentEditableElement The contentEditable element to observe for clearing events
     * @exaple
     *    wysihtml.quirks.ensureProperClearing(myContentEditableElement);
     */
    export let ensureProperClearing = (function () {
        var clearIfNecessary = function () {
            var element = this;
            setTimeout(function () {
                var innerHTML = element.innerHTML.toLowerCase();
                if (innerHTML == "<p>&nbsp;</p>" ||
                    innerHTML == "<p>&nbsp;</p><p>&nbsp;</p>") {
                    element.innerHTML = "";
                }
            }, 0);
        };

        return function (composer) {
            dom.observe(composer.element, ["cut", "keydown"], clearIfNecessary);
        };
    })();
}