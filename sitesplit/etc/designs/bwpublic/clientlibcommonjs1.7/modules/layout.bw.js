(function (BW, $, undefined) {

    /* ==========================================================================
     6:          Layout
     Description: Deals with Isotope and the layout of the search results grid

     Templates:  T208
     Components:
    ========================================================================== */
    BW.Layout = (function () {
        var Layout = function () {

            var _resultsContainer,
                _state,
                _showMore = null,
                setFlag = false,
                $resultsWrapper = $('.search-results-wrapper'),
                $searchPagination = $('.search-pagination');

            this.init = function () {

                // Set the initial state of the results
                //SJ - Removed this as re-binding this function, reset the _state's value.
                // _state = 'grid';

                // Get the container which holds the results
                _resultsContainer = $('#search-results-container');
                // Abort if it doesn't exist
                if (!_resultsContainer.length) { return; }

                // Abort if there are no results inside the container
                if (!_resultsContainer.children('.promo, .quote').length) { return; }

                this.toggleViewChange();

                this.filterHandler();

                /*
                    So the supporting content is identical to the results,
                    it's designed to show certain non-list-viewable promo boxes
                    in the side panel when the user is looking at the results in list view
                */

                // Create the supporting content container
                var supporting = $('<div class="search-results-container supporting"></div>');
                // Clone the content into the supporting container and replace quote wide class with quote medium

                supporting.append(_resultsContainer.children('.promo, .quote').clone().removeClass('quote-wide').addClass('quote-medium'));

                // Append it to the side panel
                _resultsContainer.children('.content-aside').append(supporting);

                // Promo box links handler -- do they need any special functionality?
                _resultsContainer.on('click', 'a', function(e) {
                    //e.preventDefault();
                });

                // Prepare the filtering mechanism
                BW.Filter.init(_resultsContainer.children('.promo, .quote'), $('ul.filters a'), $('#load-more'), 10, true, null);
                // The filters have to hook into Isotope/BW.Layout - so give them some callbacks
                this.setFilterCallbacks();

                // Lay it all out
                this.create();

                this.searchPagination();

                this.setTabIndex();

                this.accessibilityFix();
            }

            // Replace the results
            this.replaceResults = function (html, searchResultsAvailable) {
                // Un-Isotope the results
                this.destroy();

                // Get the new description out of the returned results
                // SJ - Added Else condition to handle the UI
                if (html.filter('.description').length) {
                    //$('#search-results-container .description').text(html.filter('.description').text());
                    $('.description').html(html.filter('.description').html()).show();
                } else {
                    $('.description').hide();
                }

                // Filter everything except the results out
                if (html.filter('#search-results-container').length) {
                    html = html.filter('#search-results-container').children();
                }

                // Empty the results container and stick the new results in
                _resultsContainer.empty().append(html);

                if (searchResultsAvailable == "true") {
                    _resultsContainer.addClass('filtering-enabled');
                    $resultsWrapper.removeClass('no-results');
                    if (_showMore !== null) {
                        $resultsWrapper.append(showMore);
                        _showMore = null;
                    }
                    //$('#search-container').addClass('open');
                    $searchPagination.show();
                } else {
                    _resultsContainer.removeClass('filtering-enabled');
                    $resultsWrapper.addClass('no-results');
                    //show more results is detached so screen readers do not read it
                    /* if ($('#load-more').length > 0) {
                        _showMore = $("#load-more").detach();
                    } */
                    $('#search-container').removeClass('open');
                    $searchPagination.hide();
                    //Anwar's code for fixing focus for no serach results page
                    $(".search-tips.error").find("li").attr("tabindex", "0");
                }
                // Re initialise BW.Layout
                this.init();
            }

            this.searchPagination = function() {
                // SJ - Search Pagination & Set Max Result Number
                var searchResultCount = $('div.promo.show, div.quote.show').length;
                        //searchTotalCount = $('div.promo').length;

                /* if (searchTotalCount > BW.config.Search.SearchMaxResults) {
                    searchTotalCount = BW.config.Search.SearchMaxResults;
                }*/

                if (searchResultCount > 0) {
                    $('.search-pagination p span.show-results').text(searchResultCount);
                    //$('.search-pagination p span').eq(2).text(searchTotalCount);
                    $('.search-pagination-bottom')
                        .empty()
                        .html($('.search-pagination-top').html());
                }
            }

            // These are for the BW.Filter functions to call when they're done
            this.setFilterCallbacks = function() {
                BW.Filter.callbacks.loadMore = function () {
                    // Reset the Isotope filter
                    BW.Layout.filter('');
                }
                BW.Filter.callbacks.filter = function () {
                    // Set the Isotope filter
                    BW.Layout.filter(arguments[1]);
                }
            }

            // Toggles between "grid" and "list" view
            this.toggleState = function(newState) {
                // SJ - Find is faster.
                _state = $('.toggle-view').find('li.on').find('a').attr('data-state');

                // Abort if the new state is the same as the old one
                if (newState === _state) { return; }
                // Set the current state to the new state

                //_state = newState;
                // Un-Isotope the results
                this.destroy();
                // Add the new state class to the results container -- this changes their appearance
                _resultsContainer.removeClass('grid list').addClass(newState);

                // Set the correct button to on // ??
                $('.filter .toggle-view li').removeClass('on');
                $('.filter .toggle-view .' + newState).addClass('on');


                // If we're switching to grid view,
                if (newState === 'grid') {

                    // Web Kit Browsers are creating issues on Isotype re-alignment. Reason? It requires a width.
                    // Hence added a hack just to make it work. Have a better solution? Please change it.
                    if (navigator.userAgent.match(/AppleWebKit/) || navigator.userAgent.match(/Chrome/)) {
                        var promoCollection = $('.promo');
                        for (i = 0; i <= promoCollection.length; i++) {
                            $(promoCollection[i]).width($(promoCollection[i]).width);
                        }
                    }
                    // Re-lay it all out
                    // This was originally waiting for a transition to finish - it still may need time
                    //  if there are issues with reflowing content into a grid - check this.
                    this.create();
                }
            }


            /* Isotope methods */

            // Check to see if the element has isotope on it
            // this is so we don't call isotope methods prior to initialisation
            this.isotopeIsActive = function() {
                return (!!_resultsContainer.data('isotope'));
            }

            // Set up Isotope on the results
            this.create = function() {
                // Remove the preload class, it's used to hide the results
                if (_resultsContainer.parent('.preload').length) { _resultsContainer.parent().removeClass('preload'); }

                // Disable Isotope if it's already active
                this.destroy();

                var o = {
                    itemSelector: $(_resultsContainer.children('.promo,.quote')),
                    isAnimated: !Modernizr.csstransitions,
                    masonry: { // Make the Isotoped elements wrap around the side bar
                        cornerStampSelector: '.content-aside'
                    }
                }

                // Initialise Isotope
                _resultsContainer.isotope(o);

                // Default setting is to filter nothing out
                this.filter('');

            }

            // Remove Isotope from the results
            this.destroy = function() {
                // cannot call methods on isotope prior to initialisation
                if (!this.isotopeIsActive()) { return; }
                // Call Isotope's "destroy" method to deactivate
                _resultsContainer.isotope('destroy');
            }

            // Use Isotope to filter the results
            this.filter = function (filterClass) {

                var $focusResult = $('.focus-result');

                if ($focusResult.length > 1) {
                    $focusResult.removeClass('focus-result');
                }

                if (!this.isotopeIsActive()) { return; } // Do nothing if there's no Isotope
                // set the focus on the first isotope hidden element that will be displayed (for screen readers)
                // $('.isotope-hidden').first().prev().find('a').focus();
                var linkFocus =  $('.isotope-hidden').first().prev().find('a');
                // Call Isotope's "filter" method
                _resultsContainer.isotope({ filter: filterClass + '.show' });

                //showing.focus();
                $('.filters').on ('click', 'a', function (e) {
                    e.preventDefault();
                    $('html, body').animate({ scrollTop: $('#search-results-container') },0);
                    return false;
                });

                linkFocus.addClass('focus-result');
                //Removed for fixing BWP-1259
                //$('#load-more').attr('href','#');
            }

            this.toggleViewChange = function() {
                // Event handler for toggle view change
                $('.page-wrapper').on('click', '.filter a[data-state]', function (e) {
                    BW.Layout.toggleState($(this).attr('data-state'));

                    e.preventDefault();
                });
            }

            this.filterHandler = function() {
                $('.page-wrapper .filters').on('click', 'a[data-filter]', function (e) {

                    var refinmentType = $(this).attr('data-filter'),
                        refinment;

                    if (refinmentType === 'product') {
                        refinment = 'products';
                    } else if (refinmentType === 'article-volume') {
                        refinment = 'articles';
                    } else {
                        refinment = 'all';
                    }
                    if (BW.Layout.setFlag == false) {
                        var siteCatJsonObj = { "int-search-phrase": $('#search-query').val(), "intsearchtype":"refinement|" + refinment, "goalstmtused": null },
                            siteCatJsonStr = JSON.stringify(siteCatJsonObj);

                        getSiteCatContent('search',siteCatJsonStr);
                    } else {
                        var siteCatJsonObj = { "int-search-phrase": null, "intsearchtype": "refinement|" + refinment, "goalstmtused": $('#search-query').val() },
                            siteCatJsonStr = JSON.stringify(siteCatJsonObj);

                        getSiteCatContent('search',siteCatJsonStr);
                    }

                    e.preventDefault();
                });
            }

            this.setTabIndex = function() {
                // Fix by Anwar
                // Setting the tab index. Do not make the focus on the hidden search items
                $('#search-results-container').on("focus"," > div", function() {

                    var visibleItem = $(".search-pagination-top .show-results").text(),
                        total = $("#search-results-container > div").length - 3,
                        index = $("#search-results-container > div").index($(this)) - 2,
                        x = jQuery(this).css("opacity");

                    if (x == 0 && index <= visibleItem) {
                        $("#load-more").focus();
                    }
                    else if(x == 0 && index == total) {
                        $("#search-results-container > div:nth-child(" + (parseInt(visibleItem) + 2 ) + ")").children("a:first").focus();
                    }

                });
            }

            this.accessibilityFix = function() {
                // SJ - Accessibility Issue Fix: Hidden Search Result should not be tabbed through
                var promoDivs = $('.promo'),
                    i,
                    curElem;

                $('.filters').on('click', 'a', function() {
                    $('html, body').animate({ scrollTop: $resultsWrapper }, 0);
                    return false;
                    setTimeout(function() {
                        for (i = 0; i <= promoDivs.length; i = i + 1) {
                            curElem = $(promoDivs[i]);
                            if(curElem.css('opacity') == 0) {
                                curElem
                                    .attr('tabindex', '-1')
                                    .find('a').attr('tabindex', '-1');
                            } else {
                                curElem
                                    .attr('tabindex', '0')
                                    .find('a').attr('tabindex', '0');
                            }
                        }
                    }, 500);

                });
            }

            this.init();
        }
        return new Layout();
    }());


}(window.BW = window.BW || {}, jQuery));