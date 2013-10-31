// ==UserScript==
// @name        Feedly Colorful Listview
// @namespace   http://feedly.colorful.list.view
// @description Colorizes items headers based on their source
// @include     http*://feedly.com/*
// @include     http*://*.feedly.com/*
// @version     0.4
// @grant       GM_addStyle
// ==/UserScript==

;

var colors = {};

function $x(query, context) {
    return document.evaluate(query, (context || document), null, 
           XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function computeColor(title) {
    var h = 0;

    for each (var c in title) {
        h += c.charCodeAt(0);
    }
    h = h % 360;

    colors[title] = h;

    return h;
}

(function() {
    GM_addStyle(
        ".u0Entry { border-color: transparent !important; }" +
        ".u0Entry .lastModified { color: #444 !important; }" +
        "#timeline div.selectedEntry { border: 1px solid #444 !important; }");

    var timeline = document.getElementById("box");
    timeline.addEventListener("DOMNodeInserted", function() {
        try {
	        var uncolored = $x('//div[@class="u0Entry "][not(@colored)]', timeline);
	    
            if (uncolored == null) {return;};

            var titleH1 = $x("//h1[@id='feedlyTitleBar']/a", null);
            var titleA = $x("//div[@class='u0Entry '][not(@colored)]//span[@class='sourceTitle']/a", uncolored);
            if (!titleA && titleH1 && titleH1.textContent) {
                var title = titleH1.textContent;
            } else {
                titleA.setAttribute("style", "color: black;");
                var title = titleA.textContent;
            }
            title = title.replace(/\W/g, "-");

            uncolored.setAttribute("colored", title);

            if (colors[title] == undefined) {
                var color = computeColor(title);
                GM_addStyle(
                    "div[colored='" + title + "'] {" +
                    "   background: hsl(" + color + ",70%,80%) !important; }" +
                    "div[colored='" + title + "']:hover {" +
                    "   background: hsl(" + color + ",90%,85%) !important; }" +
                    "div[colored='" + title + "']//a[contains(@class, 'read')] {" +
                    "   background: hsl(" + color + ",70%,90%) !important; }" +
                   "div[colored='" + title + "']//a[contains(@class, 'read')]:hover {" +
                    "   background: hsl(" + color + ",90%,95%) !important; }");
            }

        } catch (e) {
        }

    }, false);

})();