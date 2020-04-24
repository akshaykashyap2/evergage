(function() {
    function apply(context, template, render) {

        /* jshint shadow:true */

        /**
         * Evergage SmartSearch
         * Copyright (C) 2010-2016 Evergage, Inc.
         */

        if (Evergage.smartSearchInitialized && Evergage.cashDom("input[type='search'].eg-search")) {
            return false;
        }

        Evergage.cashDom(".suggestions-wrapper").remove();

        Evergage.cashDom.fn.smartSearch = function(options) {

            // The following are default settings that may be overridden
            var settings = Evergage.cashDom.extend({
                placeholder: "Search",
                position: "absolute",
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
                Evergage.cashDom(ssPanel).hide();
            }


            function buildPanel() {

                ssPanel = Evergage.cashDom("<div id='evg-ssPanel'>");
                Evergage.cashDom(ssPanel).hide();

                ssSideBarPanel = Evergage.cashDom("<div id='evg-ssSidebarPanel'>");

                ssQuickLinks = Evergage.cashDom("<span id='evg-quickLinks'>Quick Links</span>");
                ssSuggestions = Evergage.cashDom("<ul id='evg-searchSuggestions'>");
                ssSideBarPanel.append(ssQuickLinks);
                ssSideBarPanel.append(ssSuggestions);

                ssPanel.append(ssSideBarPanel);

                ssResultsPanel = Evergage.cashDom("<div id='evg-ssResultsPanel'>");
                ssResults = Evergage.cashDom("<ul id='evg-searchResults'>");
                ssResultsPanel.append(ssResults);

                ssPanel.append(ssResultsPanel);

                if (settings.viewAllButton === true) {
                    ssSeeAllRecommendations = Evergage.cashDom("<div id='evg-ssSeeAllRecommendationsWrapper'><a href='javascript:;'><div>" + settings.viewAllText + "</div></a></div>");
                } else if (settings.viewAllButton) {
                    ssSeeAllRecommendations = Evergage.cashDom(settings.viewAllButton);
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
                Evergage.cashDom("body").append("<div class='evergageOverlayDiv'></div>");
                var overlayDivHeight = parseInt(Evergage.cashDom("body").css("height")) - parseInt(Evergage.cashDom("header").css("height"));
                Evergage.cashDom(".evergageOverlayDiv").css("height", overlayDivHeight + "px");
                Evergage.cashDom(".evergageOverlayDiv").css("top", Evergage.cashDom("header").css("height"));
            }

            function showOverlayDiv() {
                Evergage.cashDom(".evergageOverlayDiv").css("display", "inline");
            }

            function hideOverlayDiv() {
                Evergage.cashDom(".evergageOverlayDiv").css("display", "none");
            }

            // Show the search results panel
            function showPanel() {
                if (settings.overlay) {
                    showOverlayDiv();
                }
                // position it at the bottom of the search input box
                if (settings.position == "absolute") {
                    var pos = Evergage.cashDom(ssInputBox).offset();
                    var eWidth = Evergage.cashDom(ssInputBox).outerWidth();
                    var mWidth = Evergage.cashDom(ssPanel).outerWidth();
                    var left = (pos.left + eWidth - mWidth) + "px";
                    var top = pos.top + Evergage.cashDom(ssInputBox).outerHeight() + "px";
                    Evergage.cashDom(ssPanel).css({
                        position: "absolute",
                        zIndex: 5000,
                        left: left,
                        top: top
                    });
                } else {
                    Evergage.cashDom(ssPanel).css({
                        position: "absolute",
                        zIndex: 5000,
                        right: 0
                    });
                }

                // if it is not yet visible, display it
                if (ssPanel.outerWidth() === 0 && ssPanel.outerHeight() === 0) {
                    Evergage.cashDom(ssPanel).hide().show();
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
                                ssSuggestions.append(Evergage.cashDom("<li>" + currentTerm.termId.toUpperCase() + "</li>").css("display", "none"));
                            } else {
                                ssSuggestions.append(Evergage.cashDom("<li>" + currentTerm.termId.toUpperCase() + "</li>"));
                            }
                        }
                        Evergage.cashDom(ssSuggestions).find('li').on("mouseenter mouseleave", function() {
                            var text = Evergage.cashDom(this).text();
                            clearTimeout(hoverTimer);
                            hoverTimer = setTimeout(function () {
                                selectSuggestion(text);
                            }, 500);

                        }).on("mouseout", function () {
                            clearTimeout(hoverTimer);
                        }).on("click", function () {
                            var text = Evergage.cashDom(this).text();
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
                            var li = Evergage.cashDom("<li>").append(itemBlock);
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
                Evergage.cashDom(ssSuggestions).find("li").first().attr("class", "selected");
                currentlySelectedSuggestion = Evergage.cashDom(ssSuggestions).find("li").first().text();
            }

            // When someone hovers or clicks a suggestion, we rerun search, but don't clear the suggestion options
            function selectSuggestion(selectedSuggestion) {
                if (selectedSuggestion !== currentlySelectedSuggestion) {
                    var suggestion = ssSuggestions.find('li').filter(function(index) { return Evergage.cashDom(this).text() === selectedSuggestion; });
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
                    Evergage.cashDom(document).on("mouseup", hidePanel);
                    mouseUpListenerBound = true;
                }
            }

            function addSearchResultClickHandlers() {
                Evergage.cashDom("#evg-searchResults").find(".evg-searchItemLink").on("click", function(e) {
                    trackSmartSearchClickthrough(Evergage.cashDom(this));
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
                var container = Evergage.cashDom("#evg-ssPanel");

                if (typeof e == 'undefined' ||
                    (!container.is(e.target) && container.has(e.target).length === 0) &&
                    !ssInputBox.is(e.target)) {

                    container.hide();
                    if (settings.overlay && (typeof e === 'undefined' || e.target.name !== "q")) {
                        hideOverlayDiv();
                    }
                    Evergage.cashDom(document.removeEventListener('mouseup', hidePanel));
                }
            }

            function init(element) {
                if (!Evergage.smartSearchInitialized) {

                    ssInputBox = Evergage.cashDom(element);

                    settings.data.url = generateSmartSearchUrl();

                    buildPanel();

                    ssInputBox.on("focus", focus);

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
                Evergage.meta = false;
                if (!Evergage.meta.arrowKeysBound) {
                    Evergage.meta.arrowKeysBound = true;
                    ssInputBox.on("keydown", bindArrows);
                }
            }

            function bindArrows(event) {
                if (event.keyCode === 40 || event.keyCode === 38) {
                    event.preventDefault();
                    var isDown = event.keyCode === 40;
                    selectNextTerm(isDown);
                }
            }

            function selectNextTerm(isDown) {
                var searchSuggestions = Evergage.cashDom("#evg-searchSuggestions");
                if (searchSuggestions.find(".selected").length === 1 && ssInputBox.val()) {
                    for (var i = 0; i < searchSuggestions.find("li").length; i++) {
                        var currentTerm = searchSuggestions.find("li").eq(i);
                        if (currentTerm.hasClass("selected")) {
                            if (isDown) {
                                if (i === searchSuggestions.find("li").length - 1) {
                                    searchSuggestions.find("li").first().trigger("click");
                                } else {
                                    searchSuggestions.find("li").eq(i + 1).trigger("click");
                                }
                            } else {
                                if (i === 0) {
                                    searchSuggestions.find("li").last().trigger("click");
                                } else {
                                    searchSuggestions.find("li").eq(i - 1).trigger("click");
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

        var inputBox = Evergage.cashDom("input[type='search']");
        inputBox.attr("autocomplete", "off");
        inputBox.on("focus keydown", function() {
            Evergage.cashDom(this).addClass("eg-search");
        });
        inputBox.smartSearch({ // following are "options" that are merged into "settings"
        account: "interactionstudio",
        dataset: "nto2",
        recipeId: context.recipeId,
        userId: context.userId,
        position: "relative",
        maxResults: context.maxItems,
        maxSuggestions: 10,
            submitGlobalSearchForm: function(termToSearch) {
                if (typeof (termToSearch) !== "string") {
                    termToSearch = Evergage.cashDom("#evg-ssPanel #evg-searchSuggestions").find("li.selected").text();
                }
                if (termToSearch) {
                    Evergage.cashDom("#global_search_form input[type='text']").val(termToSearch.toLowerCase());
                }
                Evergage.cashDom("#global_search_form").submit();
            }   
        });

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