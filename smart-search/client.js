(function() {
function apply(context, template, render) {
    
    /* jshint shadow:true */

    /**
     * Evergage SmartSearch
     * Copyright (C) 2010-2016 Evergage, Inc.
     */

    ajq = $;

    if (Evergage.smartSearchInitialized && ajq("input[type='search'].eg-search")) {
        return false;
    }

    ajq(".suggestions-wrapper").remove();

    ajq.fn.smartSearch = function(options) {

        // The following are default settings that may be overridden
        var settings = ajq.extend({
            placeholder: "Search",
            minHeight: 100,
            maxHeight: 300,
            width: 400,
            sideBarWidth: 200,
            showSidebar: true,
            hideOnBlur: false,
            delay: 250,
            viewAllButton: true,
            viewAllText: "View All Recommendations",
            data: {},
            templateHtml: "<a href='{url}' class='evg-searchItemLink'><div class='evg-searchItemContainer'>" +
                "<div class='evg-searchItemImageWrapper'><span></span><img src='{imageUrl}'></div>" +
                "<div class='evg-searchItemText'>{name}</div></div></a>",
            templateHtmlNoImg: "<a href='{url}' class='evg-searchItemLink'><div class='evg-searchItemContainer'>" +
                "<div class='evg-searchItemText'>{name}</div></div></a>",
            overlay: false
        }, options);


        var ssPanel;
        var ssInputBox;
        var ssSideBarPanel;
        var ssResultsPanel;
        var ssResults;
        var ssSuggestions;
        var ssQuickLinks;
        var ssSeeAllRecommendations;
        var currentItemRecommendations = {};
        var currentlySelectedSuggestion = {};


        var reloadSuggestions = true;
        var mouseUpListenerBound = false;
        var hoverTimer;
        var loadTimer;


        function focus(evt) {
            if (ssInputBox.val() !== "") {
                showPanel();
            }
        }

        function blur(evt) {
            ajq(ssPanel).fadeOut();
        }


        function buildPanel() {

            ssPanel = ajq("<div id='evg-ssPanel'>");
            ajq(ssPanel).hide();

            ssSideBarPanel = ajq("<div id='evg-ssSidebarPanel'>");

            ssQuickLinks = ajq("<span id='evg-quickLinks'>Quick Links</span>");
            ssSuggestions = ajq("<ul id='evg-searchSuggestions'>");
            ssSideBarPanel.append(ssQuickLinks);
            ssSideBarPanel.append(ssSuggestions);

            ssPanel.append(ssSideBarPanel);

            ssResultsPanel = ajq("<div id='evg-ssResultsPanel'>");
            ssResults = ajq("<ul id='evg-searchResults'>");
            ssResultsPanel.append(ssResults);

            ssPanel.append(ssResultsPanel);

            if (settings.viewAllButton === true) {
                ssSeeAllRecommendations = ajq("<div id='evg-ssSeeAllRecommendationsWrapper'><a href='javascript:;'><div>" + settings.viewAllText + "</div></a></div>");
            } else if (settings.viewAllButton) {
                ssSeeAllRecommendations = ajq(settings.viewAllButton);
            }
            if (ssSeeAllRecommendations && typeof (settings.submitGlobalSearchForm) == "function") {
                ssSeeAllRecommendations.on("click", function() {
                    settings.submitGlobalSearchForm();
                });
                ssPanel.append(ssSeeAllRecommendations);
            }

            ssPanel.insertAfter(ssInputBox);

            if (settings.overlay) {
                buildOverlayDiv();
            }

        }

        function buildOverlayDiv() {
            ajq("body").append("<div class='evergageOverlayDiv'></div>");
            var overlayDivHeight = parseInt(ajq("body").css("height")) - parseInt(ajq("header").css("height"));
            ajq(".evergageOverlayDiv").css("height", overlayDivHeight + "px");
            ajq(".evergageOverlayDiv").css("top", ajq("header").css("height"));
        }

        function showOverlayDiv() {
            ajq(".evergageOverlayDiv").css("display", "inline");
        }

        function hideOverlayDiv() {
            ajq(".evergageOverlayDiv").css("display", "none");
        }

        // Show the search results panel
        function showPanel() {
            if (settings.overlay) {
                showOverlayDiv();
            }
            // position it at the bottom of the search input box
            if (settings.position == "absolute") {
                var pos = ajq(ssInputBox).offset();
                var eWidth = ajq(ssInputBox).outerWidth();
                var mWidth = ajq(ssPanel).outerWidth();
                var left = (pos.left + eWidth - mWidth) + "px";
                var top = pos.top + ajq(ssInputBox).outerHeight() + "px";
                ajq(ssPanel).css({
                    position: "absolute",
                    zIndex: 5000,
                    left: left,
                    top: top
                });
            } else {
                ajq(ssPanel).css({
                    position: "absolute",
                    zIndex: 5000,
                    right: 0
                });
            }

            // if it is not yet visible, display it
            if (!ssPanel.is(":visible")) {
                ajq(ssPanel).hide().fadeIn();
                listenForClicksOutside();
            }
        }

        // Whenever someone types, deletes, pastes in the search box, start a timer that will execute the search
        function searchInput(withDelay) {
            if (withDelay) {
                if (loadTimer) {
                    window.clearTimeout(loadTimer);
                }
                loadTimer = window.setTimeout(load, settings.delay);
            } else {
                load();
            }
        }

        // Execute the search request
        function load(suggestion) {
            var searchText = suggestion || ssInputBox.val();
            if (searchText) {
                reloadSuggestions = typeof suggestion == "undefined";
                var lowerCasedSearchText = searchText.toLowerCase();

                var requestUrl = settings.data.url + "&query=" + lowerCasedSearchText;

                // Notes on making requests: 

                // AJAX jsonp request
                // No more AJAX since ajq has been replaced by Evergage.cashDom, which does not contain request methods.
                // var data = ajq.extend(settings.data,
                //         {
                //             data: {
                //             userId: settings.userId,
                //             query: lowerCasedSearchText,
                //             maxResults: settings.maxItems
                //         },
                //             success: handleResults
                //         });
                // ajq.ajax(data);

                // XHR request won't work due to CORS error
                // window.myJsonpCallback = function(data) {
                //     handleResults;
                // };
                // var xhr = new XMLHttpRequest();
                // xhr.open('GET', requestUrl, true); // Initializes the request. Third argument: async=true
                // // xhr.onload = function() {
                // // handleResults;
                // // }
                // xhr.send(); // sends the request

                // jsonp request without ajax
                // This is a temporary solution that circumvents the CORS error. According to John Watts on 4/20/20, we will eventually need to "change the server to support CORS for these requests" 
                function jsonp(url, callback) {
                    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
                    window[callbackName] = function(data) {
                        delete window[callbackName];
                        document.body.removeChild(script);
                        callback(data);
                    };

                    var script = document.createElement('script');
                    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
                    document.body.appendChild(script);
                }

                jsonp(requestUrl, function(data) {
                    handleResults(data);
                });

            } else {
                hidePanel();
            }
        }

        // Search results have been returned from the sever
        function handleResults(response) {
            if ((response.suggestedTerms && response.suggestedTerms.length > 0) && (response.recommendedItems && response.recommendedItems.length > 0)) {
                showPanel();
                if (reloadSuggestions) {
                    sendSmartSearchPageLoadAction();
                    ssSuggestions.empty();
                    for (var i = 0; i < Math.min(settings.maxSuggestions, response.suggestedTerms.length); i++) {
                        var currentTerm = response.suggestedTerms[i];
                        if (currentTerm.termApproval === 'Blocked') {
                            ssSuggestions.append(ajq("<li>" + currentTerm.termId.toUpperCase() + "</li>").css("display", "none"));
                        } else {
                            ssSuggestions.append(ajq("<li>" + currentTerm.termId.toUpperCase() + "</li>"));
                        }
                    }
                    ajq(ssSuggestions).find('li').hover(function() {
                        var text = ajq(this).text();
                        clearTimeout(hoverTimer);
                        hoverTimer = setTimeout(function () {
                            selectSuggestion(text);
                        }, 500);

                    }).mouseout(function () {
                        clearTimeout(hoverTimer);
                    }).click(function () {
                        var text = ajq(this).text();
                        selectSuggestion(text);
                    });
                    highlightFirstSuggestion();
                }


                ssResults.empty();
                for (var j = 0; j < response.recommendedItems.length; j++) {
                    var item = response.recommendedItems[j];
                    if ((item.name && item.name !== "") && (item.url && item.url !== "")) {
                        var associatedTerm = currentlySelectedSuggestion;
                        var itemBlock = buildItemBlock(item, associatedTerm);
                        var li = ajq("<li>").append(itemBlock);
                        li.attr("data-evg-item-id", item._id);
                        li.attr("data-evg-item-type", item.type);
                        li.attr("data-evg-item-tagType", item.tagType);
                        li.attr("data-evg-item-term", associatedTerm);
                        ssResults.append(li);
                    }
                }
                updateCurrentRecommendedItems(response.recommendedItems);
                addSearchResultClickHandlers();
            } else {
                hidePanel();
            }
        }

        function sendSmartSearchPageLoadAction() {
            if (Evergage.util.setCurrentPageLoadAction) {
                var actionName = "Show Smart Search Results";
                Evergage.util.setCurrentPageLoadAction(actionName);
                _aaq.push(["trackAction", actionName, {".pv": true}, false, false]); //Send a pageView action across when we present search results.
            }
        }

        // When results are returned from an input box search, highlight (but do not search the top suggestion)
        function highlightFirstSuggestion() {
            ajq(ssSuggestions).find("li:first").attr("class", "selected");
            currentlySelectedSuggestion = ajq(ssSuggestions).find("li:first").text();
        }

        // When someone hovers or clicks a suggestion, we rerun search, but don't clear the suggestion options
        function selectSuggestion(selectedSuggestion) {
            if (selectedSuggestion !== currentlySelectedSuggestion) {
                var suggestion = ssSuggestions.find('li').filter(function(index) { return ajq(this).text() === selectedSuggestion; });
                ssSuggestions.find('li').attr('class', '');
                suggestion.attr('class', 'selected');
                currentlySelectedSuggestion = selectedSuggestion;
                load(selectedSuggestion);
            }
        }

        // Use a template dom element to build the display block for each item
        function buildItemBlock(item, associatedTerm) {
            if (item.loading) {
                return "";
            } else {
                var html = (item.imageUrl && item.imageUrl !== "")
                    ? settings.templateHtml
                    : settings.templateHtmlNoImg;

                return html.replace(/{[^{}]+}/g, function (key) {
                    var value = item[key.replace(/[{}]+/g, "")] || "";
                    if (key === "{price}" && value) {
                        value = "$" + Number(value).formatMoney(2);
                    } else if (key === "{associatedTerm}") {
                        value = associatedTerm || "";
                    } else if (/{custom\..+}/.test(key) && item.custom) {
                        var custom = key.replace(/[{}]+/g, "").split(".");
                        value = item[custom[0]][custom[1]];
                    }
                    return value;
                });
            }
        }

        function trackSmartSearchClickthrough(target) {
            Evergage.trackClickthrough(settings.messageId, target.attr("href") || window.location.href, target);
        }

        function listenForClicksOutside() {
            if (!mouseUpListenerBound) {
                ajq(document).mouseup(hidePanel);
                mouseUpListenerBound = true;
            }
        }

        function addSearchResultClickHandlers() {
            ajq("#evg-searchResults").find(".evg-searchItemLink").click(function(e) {
                trackSmartSearchClickthrough(ajq(this));
            });
        }

        function updateCurrentRecommendedItems(recommendations) {
            var newItems = {};
            for (var i = 0; i < recommendations.length; i++) {
                newItems[recommendations[i]._id] = recommendations[i];
            }
            currentItemRecommendations = newItems;
        }

        function hidePanel(e) {
            var container = ajq("#evg-ssPanel");

            if (typeof e == 'undefined' ||
                (!container.is(e.target) && container.has(e.target).length === 0) &&
                !ssInputBox.is(e.target)) {

                container.hide();
                if (settings.overlay && (typeof e === 'undefined' || e.target.name !== "q")) {
                    hideOverlayDiv();
                }
                ajq(document.removeEventListener('mouseup', hidePanel));
            }
        }


        function init(element) {
            if (!Evergage.smartSearchInitialized) {
                if (settings.css) {
                    ajq("head").append("<style>" + settings.css + "</style>");
                }
                ssInputBox = ajq(element);

                settings.data.url = generateSmartSearchUrl();

                buildPanel();

                ssInputBox.focus(focus);

                if (settings.hideOnBlur) {
                    ssInputBox.blur(blur);
                }
                ssInputBox.on("keydown", function() {
                    searchInput(true);
                });

                ssInputBox.on("click", function() {
                    searchInput(false);
                });

                focusSmartSearchAndBindArrows();

                Evergage.smartSearchInitialized = true;
            }
        }

        function generateBaseUrl() {
            var protocol = window.location.protocol === "http:" ? "http:" : "https:";
            var url = (settings.server ? settings.server : protocol + "//" + settings.account + ".evergage.com");
            url += "/api/dataset/" + settings.dataset + "/recommendations/";
            return url;
        }

        function generateSmartSearchUrl() {
            return generateBaseUrl() + settings.recipeId + "/smartSearch/?_ak=" + settings.account + "&userId=" + settings.userId + "&maxResults=" + settings.maxResults;
        }

        function focusSmartSearchAndBindArrows() {
            // if (!Evergage.meta.arrowKeysBound) {
                // Evergage.meta.arrowKeysBound = true;
                ssInputBox.keydown(bindArrows);
            // }
        }

        function bindArrows(event) {
            if (event.keyCode === 40 || event.keyCode === 38) {
                event.preventDefault();
                var isDown = event.keyCode === 40;
                selectNextTerm(isDown);
            }
        }

        function selectNextTerm(isDown) {
            var searchSuggestions = ajq("#evg-searchSuggestions");
            if (searchSuggestions.find(".selected").length === 1 && ssInputBox.val()) {
                for (var i = 0; i < searchSuggestions.find("li").length; i++) {
                    var currentTerm = searchSuggestions.find("li:eq(" + i + ")");
                    if (currentTerm.hasClass("selected")) {
                        if (isDown) {
                            if (i === searchSuggestions.find("li").length - 1) {
                                searchSuggestions.find("li:first").click();
                            } else {
                                searchSuggestions.find("li:eq(" + (i + 1) + ")").click();
                            }
                        } else {
                            if (i === 0) {
                                searchSuggestions.find("li:last").click();
                            } else {
                                searchSuggestions.find("li:eq(" + (i - 1) + ")").click();
                            }
                        }
                        return;
                    }
                }
            }
        }

        Number.prototype.formatMoney = function(c, d, t){
            var n = this,
                    c = isNaN(c = Math.abs(c)) ? 2 : c,
                    d = (d === undefined || d === null) ? "." : d,
                    t = (t === undefined || t === null) ? "," : t,
                    s = n < 0 ? "-" : "",
                    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                    j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };

        init(this);

        return this;
    };

    var inputBox = ajq("input[type='search']");
    inputBox.attr("autocomplete", "off");
    inputBox.on("focus keydown", function() {

        ajq(this).addClass("eg-search");
        ajq(".suggestions-wrapper").remove();
        // Evergage.util.runWhenReady( // todo
        //     function() { 
        //         return ajq('.autocomplete-suggestions').length > 0;
        //     },
        //     function() {
        //         ajq('.autocomplete-suggestions').remove();
        //     }
        // );
        // ajq('.autocomplete-suggestions').remove();
    });
    inputBox.smartSearch({ // following are "options" that are merged into "settings"
    account: "interactionstudio",
    dataset: "nto2",
    recipeId: context.recipeId, // GAUUm
    userId: context.userId,
    // position: "absolute",
    position: "relative",
    maxResults: context.maxItems,
    maxSuggestions: 10,
    //   account: "interactionstudio",
    //   dataset: "nto2",
    //   recipeId: context.recipeId, // GAUUm
    //   userId: context.userId,  
    //   // messageId: "FGHIJ",
    //   position: "relative",
    //   maxItems: context.maxItems,
        submitGlobalSearchForm: function(termToSearch) {
            if (typeof (termToSearch) !== "string") {
                termToSearch = ajq("#evg-ssPanel #evg-searchSuggestions").find("li.selected").text();
            }
            if (termToSearch) {
                ajq("#global_search_form input[type='text']").val(termToSearch.toLowerCase());
            }
            ajq("#global_search_form").submit();
        },
        css: ""    
    });

    // return Evergage.ExperienceJS && Evergage.ExperienceJS.DelayImpression;
    
}

function reset(context, template) {
    Evergage.cashDom("#evg-ssPanel").remove();
    Evergage.cashDom("input[type='search']").removeClass("eg-search");
    Evergage.smartSearchInitialized = false;
}

function control() {
    
}

registerTemplate({
    apply: apply,
    reset: reset,
    control: control
});

})();