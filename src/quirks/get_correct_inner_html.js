/// <reference path="../lang/string.ts" />
var su;
(function (su) {
    var quirks;
    (function (quirks) {
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=664398
        //
        // In Firefox this:
        //      var d = document.createElement("div");
        //      d.innerHTML ='<a href="~"></a>';
        //      d.innerHTML;
        // will result in:
        //      <a href="%7E"></a>
        // which is wrong
        var TILDE_ESCAPED = "%7E";
        function getCorrectInnerHTML(element) {
            var innerHTML = element.innerHTML;
            if (innerHTML.indexOf(TILDE_ESCAPED) === -1) {
                return innerHTML;
            }
            var elementsWithTilde = element.querySelectorAll("[href*='~'], [src*='~']"), url, urlToSearch, length, i;
            for (i = 0, length = elementsWithTilde.length; i < length; i++) {
                url = elementsWithTilde[i].href || elementsWithTilde[i].src;
                urlToSearch = su.lang.string(url).replace("~").by(TILDE_ESCAPED);
                innerHTML = su.lang.string(innerHTML).replace(urlToSearch).by(url);
            }
            return innerHTML;
        }
        quirks.getCorrectInnerHTML = getCorrectInnerHTML;
        ;
    })(quirks = su.quirks || (su.quirks = {}));
})(su || (su = {}));
