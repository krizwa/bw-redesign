(function (BW, $, undefined) {

    /* ==========================================================================
         9:          Search
         Description: Deals with the search box, and the expansion/collapse of the search area
                    STILL NEED TO FINISH REFACTORING
         Templates:  T208
         Components:
    ========================================================================== */
    BW.Search = (function () {
        var Search = function () {

            var Query = null,
                $home = $('.home'),
                $searchQuery = $('#search-query'),
                $contentAside = $('.content-aside-search'),
                $searchForm = $('#search-form');

            this.getResults = function (term, url) {

                // Flag search as beginning so blur doesn't collapse the search area
                searched = true;

                //SJ: Blocking the BW.Search.Results condition and added a new one as the object is returning undefined
                //if (!this.isHome && typeof(BW.Search.Results) === 'string') { window.location = url; }
                //SJ Code is modified to support the change of the URL in the window
                //if (!this.isHome) {BW.helper.history.push(null, null, url);}

                if (!this.isHome && $('.search-results-wrapper .description').length == 0 ) { window.location = url; }

                // Change the title of the page based on the Query String or the Goal Statement
                $(document).attr('title', term);

                // Define a callback for when we've got something back
                var s = this;

                var callback = {
                    done : function () {
                        adv_int_search_results = $(arguments[0]).filter('#searchResultsCount').val();

                        if (s.isHome) {
                            BW.Transitions.HomeToSearch.addPage(url, true, arguments[0], arguments[1]);
                        } else {
                            // move the control for this into transitions?
                            var o = $(arguments[0]),
                                    searchResultsAvailable;
                            if (o.filter('#searchResultsAvailable').length) {
                                searchResultsAvailable = o.filter('#searchResultsAvailable').val();
                            }

                            //code for url change should go here.

                            //if (o.filter('.searchResultsAvailable').length) {}
                            if (o.filter('.page-wrapper').length) {
                                o = o.filter('.page-wrapper').find('.search-results-wrapper').children(':not(.filter)');
                            }
                            BW.Layout.replaceResults(o, searchResultsAvailable);

                            // Check if the cookie exist?
                            BW.CookieSettings.init();
                        }
                    }
                }

                // Go ask the server for some results
                BW.helper.server.get({ 'url' : url }, callback);

                // Collapse and begin the transition
                this.searched = true;
                if (this.isHome) {
                    BW.Transitions.HomeToSearch.go();
                } else {
                    this.collapse();
                }

            }

            // Anything that needs to be done to the search on the homepage
            this.homify = function () {
                var s = this;

                if (!this.Container.closest('.home').length) { return; }

                this.isHome = true;
                // we don't want the user collapsing the search field before a search happens
                searched = false;

                // We're not using attr[autofocus] because we don't always want the element to autofocus
                //this.Query.focus();
                //this.expand();

                // SJ - Search input field blur. Moved from outside
                $home.on('blur', '#search-query', function (e) {
                    var curElem = $(this),
                        curLabel = curElem.val();

                    //SJ - If text box is empty, retain the default text
                    if (curLabel   === '') {
                        curElem.val(curElem.attr('data-content'));
                    }

                    setTimeout(function () {
                        // If nothing else has set okToCollape to false - collapse
                        if (s.okToCollapse) {
                            s.collapse();
                        }
                    }, 20); // Wait a bit for the other even handlers to work
                });

                // SJ - Search Input filed on Focus
                $home.on('focus', '#search-query', function (e) {
                    var curElem = $(this),
                        curLabel = curElem.val();

                    //SJ - If text box is empty, retain the default text
                    if (curLabel   === curElem.attr('data-content')) {
                        curElem.val('');
                    }
                });

                // SJ - get the focus to the Search Box in the Home Page
                $searchQuery.focus();

                // Remove the Search Copy text when a key is pressed down.
                $searchQuery.keydown(function (e) {
                    // Key down event will give the count as zero when the first char is type.
                    // Clear the text if the key entered is not spl keys like 'enter', 'escape' etc..
                    var searchLabel = $('#searchLabel');
                    switch (e.which) {
                        case 13: // enter
                            break;

                        case 37: // left & right arrow keys
                        case 39:
                            break;

                        case 38: // up & down arrow keys
                        case 40:
                            break;

                        case 16, 17, 18, 91: // control or modifier keys
                            break;

                        case 27: // escape key
                            break;

                        case 8: // backspace or delete
                            break;

                        case 9: //tab
                            break;

                        case 46:
                            break;

                        default:
                        searchLabel.text('');
                    }
                });
            }

            this.isExpanded = function () {
                if (!this.Container.hasClass('open')) { return false; }
                // SJ - Remove Transition on the Home Page
                if (this.isHome && !this.Container.closest('.wide').length) { return false; }
                return true;
            }

            this.expand = function () {
                // SJ - Remove Transition on the Home Page

                 if (this.isHome && !this.Container.closest('.wide').length) {
                    if (Modernizr.csstransitions) {
                        this.Container.closest('.home').addClass('wide');

                        var os = (function() {
                            var ua = navigator.userAgent.toLowerCase();
                            return {
                                isXP: /windows nt 5.1/.test(ua)
                            };
                        }());

                        if(os.isXP) {
                            this.iePositioning();
                        }


                    } else {
                        $contentAside.attr('data-original-height', $contentAside.css('height'));
                        $contentAside.animate({ 'height' : '25px' }, 300);
                        this.Container.css('width', '980px');
                        this.Form.animate({ 'width' : '980px' }, 380);
                        this.Query.animate({ 'width' : '862px' }, 380);
                        $('#search-go').animate({ 'left' : '902px' }, 380);
                        $('#suggestions').animate({ 'width' : '980px' }, 380);
                        var s = this;
                        setTimeout(function () { s.Container.closest('.home').addClass('wide'); }, 390)

                        // IE needs some cure for it's rare disease
                        this.iePositioning();
                    }
                    // Change the text of the Header in the collapsed mode
                    var homeExplore = $('#hmeExplore span');
                    homeExplore.text(homeExplore.attr('datacollapsed'));
                    // Redraw
                    setTimeout(function () { BW.SearchGoals.updateLines(); }, 400);
                }

                if (this.Container.hasClass('open')) { return; }
                if (Modernizr.csstransitions) {
                    this.Container.addClass('open');
                } else {
                    var currentH = (this.Container.height() || 1);
                    this.Container.css('height', currentH + 'px');
                    this.Container.addClass('open');
                    var h = this.isHome ? this.Container.parent().height() : 175;
                    var o = this.Container;
                    this.Container.animate({ 'height' : h + 'px' }, 1600, function () {
                        // IE says the arguments of the callback are undefined
                        o.css('height', '');
                    });
                }
                if (this.checkLength()) { this.getSuggestions(this.Query.val()); }

            }

            this.collapse = function () {
                //if (!searched) { return; }
                // SJ - Remove Transition on the Home Page
                 if (this.isHome && this.Container.closest('.wide').length) {
                    if (!this.Container.next().length) { return; } // no quick links
                    if (Modernizr.csstransitions) {
                        this.Container.closest('.home').removeClass('wide');
                        //this.Container.removeClass('open');
                        var os = (function() {
                            var ua = navigator.userAgent.toLowerCase();
                            return {
                                isXP: /windows nt 5.1/.test(ua)
                            };
                        }());

                        if(os.isXP) {
                            this.iePositioning();
                        }

                    } else {
                        this.Form.animate({ 'width' : '740px' }, 380);
                        this.Query.animate({ 'width' : '622px' }, 380);
                        $('#search-go').animate({ 'left' : '662px' }, 380);
                        $('#suggestions').animate({ 'width' : '780px' }, 380);
                        $contentAside.animate({ 'height' : $contentAside.attr('data-original-height') }, 300);
                        var s = this;
                        setTimeout(function () {
                            s.Container.css('width', '770px');
                        }, 380)

                        // IE needs some cure for it's rare disease
                        this.iePositioning();

                        setTimeout(function () {
                            s.Container.closest('.home').removeClass('wide');
                            //s.Container.removeClass('open');
                        }, 390)
                    }
                    // Change the text of the Header when it is collapsed
                    var homeExplore = $('#hmeExplore span');
                    homeExplore.text(homeExplore.attr('datadefault'));
                    // Redraw

                    setTimeout(function () { BW.SearchGoals.updateLines(); }, 400);
                    return;
                }

                // SJ - Home Page? No, then remove the classes
                if (!$home.length) {
                    if (Modernizr.csstransitions) {
                        this.Container.removeClass('open');
                    } else {
                        var h = this.Container.closest('.search-results').length ? 110 : 1;
                        var o = this.Container;
                        this.Container.animate({ 'height' : h + 'px' }, 600, function () {
                        // IE says the arguments of the callback are undefined
                            o.removeClass('open');
                            o.css('height', '');
                        });
                    }
                }

                if (this.Query.is(':focus')) { this.Query.blur(); }
            }

            this.iePositioning = function() {
                $('#suggestions #p2').css('left', '45%');
                $('#suggestions #p3').css('left', '79%');
                //$('#suggestions #p4').css('left', '0%');
                $('#suggestions #p5').css('left', '29%');
                $('#suggestions #p6').css('left', '69%');
            }

            this.checkLength = function () {
                return (this.Query.val().length >= this.minCharsForSearch);
            }

            this.getSuggestions = function (term) {
                BW.SearchGoals.getSuggestions(term);
            }

            // A suggestion was clicked
            this.suggested = function(term, id) {
                BW.Layout.setFlag = true;
                this.okToCollapse = false;
                var delay = 1;
                // Set value
                this.Query.val(term); // stop this from causing events?
                if (!this.isExpanded()) {
                    // Make the search box wide if it's not already
                    BW.Search.expand();
                    delay = 800;
                }
                var s = this;

                //$searchForm.attr('action', this.queryResult + "." + id + ".html");
                $searchForm.attr('action', $('#searchResultPagePath').val() + "." + id + ".html");

                setTimeout(function () { s.Form.submit(); }, delay);
            }

            this.focus = function() {
                this.Query.focus();
            }

            this.needToClear = function () {
                if (!this.isHome) {
                    this.Query.attr('data-old-val', this.Query.val());
                    this.Query.val('');
                    BW.SearchGoals.updateToDefaultSuggestions();
                }
            }

            this.needToRestore = function () {
                var val = this.Query.attr('data-old-val');
                if (!this.isHome && val) {
                    this.Query.val(val);
                    this.getSuggestions(val);
                 }
            }

            // Check if the Search box has more than one character?
            // Yes, expand the box and remove the default text
            this.checkStatus = function () {
                // We are not on the Home Page
                if (!this.isHome) {return;}

                var searchLabel = $('#searchLabel');
                if (Query.val().length >= 1) {
                    searchLabel.text('');
                    if (!this.isExpanded()) {this.expand();}
                }
                // If the Search box value is empty, show the default text
                if (Query.val().length == 0) {
                    searchLabel.text(searchLabel.attr('data-content'));
                }
            }

            this.init = function () {
                // these only matter on the home page - so they default to true
                this.isHome = false;
                //this.queryResult = '/content/bwpublic/en_gb/search-results';
                var searched = true;

                // Grab any Search settings from the config.bw file
                for (x in BW.config.Search) {
                    this[x] = BW.config.Search[x];
                    if (typeof(this[x]) == 'string' && $(this[x]).length) {
                        this[x] = $(this[x]);
                    }
                }

                Query = this.Query;

                var s = this,
                    currentTarget = null;

                this.okToCollapse = true;

                // SJ - Search Pagination & Set Max Result Number
                var searchResultCount = $('div.promo.show, div.quote.show').length;
                        //searchTotalCount = $('div.promo').length;

                /*if (searchTotalCount > BW.config.Search.SearchMaxResults) {
                    searchTotalCount = BW.config.Search.SearchMaxResults;
                }*/

                var $pagiShowResults = $('.search-pagination p span.show-results'),
                    $contentWrapper = $('#content-wrapper'),
                    $searchResults = $('.search-results'),
                    $searchContainer = $('#search-container');

                if (searchResultCount > 0) {
                    $pagiShowResults.text(searchResultCount);
                    //$('.search-pagination p span').eq(2).text(searchTotalCount);
                    $('.search-pagination-bottom')
                        .empty()
                        .html($('.search-pagination-top').html());
                }

                $('#load-more').on('click', function () {

                    searchResultCount = $('div.promo.show, div.quote.show').length;
                    $pagiShowResults
                        .empty()
                        .append(searchResultCount);
                    // Adding to flush the cache for preventing from cutting off the results on searching 2nd time
                    if ($searchResults.length > 0) {
                        $('.focus-result').focus();
                    }

                });

                $(document).on('click', '#search-go', function (e) {

                    //s.needToRestore();
                    s.okToCollapse = false;
                    var test = (s.isHome) ? $contentWrapper.hasClass('wide') || $contentWrapper.hasClass('home') : $searchContainer.hasClass('open');
                    if (!test) {
                        e.preventDefault();
                        // If this isn't a Search Result Page, then on click of the Search button, focus the text box
                        if(!$searchResults.length > 0) {
                            s.focus();
                        }

                    } else if (test && s.Query.val().length) {
                        //$searchForm.attr('action', this.queryResult + ".html?q=" + s.Query.val());
                        var siteCatJsonObj = { "intsearchphrase":s.Query.val(), "intsearchtype":"initial", "goalstmtused":null };
                        var siteCatJsonStr = JSON.stringify(siteCatJsonObj);
                        getSiteCatContent('search',siteCatJsonStr);
                        $searchForm.attr('action', $('#searchResultPagePath').val() + ".html?q=" + encodeURIComponent($('#search-query').val()));
                        BW.Layout.setFlag = false;
                        s.Form.submit();
                    } else {
                        s.okToCollapse = true;
                    }
                });

                $(document).on('click', '#search-container a.close', function(e) {
                    s.okToCollapse = true;
                    e.preventDefault();
                    s.collapse();
                    s.needToRestore();
                });

                // SJ - Quick Fix for Internet Explorer 8
                // SJ - This code needs refactoring and needs to be grouped
                $searchQuery.keydown(function(e) {
                    if (e.keyCode == 13) {
                        var siteCatJsonObj = { "intsearchphrase": s.Query.val(), "intsearchtype": "initial", "goalstmtused": null };
                        var siteCatJsonStr = JSON.stringify(siteCatJsonObj);
                        getSiteCatContent('search',siteCatJsonStr);
                        //s.needToRestore();
                        s.okToCollapse = false;
                        var test = (s.isHome) ? $contentWrapper.hasClass('wide') : $searchContainer.hasClass('open');
                        if (!test) {
                            e.preventDefault();
                            // If this isn't a Search Result Page, then on click of the Search button, focus the text box
                            if(!$searchResults.length > 0) {
                                s.focus();
                            }

                        } else if (test && s.Query.val().length) {
                            //$searchForm.attr('action', this.queryResult + ".html?q=" + s.Query.val());
                            $searchForm.attr('action', $('#searchResultPagePath').val() + ".html?q=" + encodeURIComponent($('#search-query').val()));
                            BW.Layout.setFlag = false;
                            s.Form.submit();
                        } else {
                            s.okToCollapse = true;
                        }
                    }
                });
               if($('#search-form').length>0){
                this.Form.submit(function(e) {

                    //hide webtour on search results page
                    guiders.hideAll();
                    if ($.trim(s.Query.val()).length > 0) {
                        s.getResults(s.Query.val(), $searchForm.attr('action'));
                    }

                    // stop the form from submitting
                    e.preventDefault();
                });

                this.Query.focus(function (e) {
                    s.needToClear();
                    if (s.isHome) {
                        s.checkStatus();
                    } else {
                        s.expand();
                    }
                });

                // character entry handling
                this.Query.keyup(function(e) {
                    s.checkStatus();
                    clearTimeout(s.suggestionPause);

                    // Get the search string
                    var searchValue = $(this).val().toLowerCase();

                    /* Check the character? If it's a control character or
                     an arrow or something we don't want to make a request */

                    //BW.helper.debug(e.which);

                    switch (e.which) {
                        case 13 : // enter
                            break;
                        case 37 : // arrow keys
                        case 39 :
                            break;
                        case 38 : // up & down arrow keys
                        case 40 :
                            $(this).blur();
                            BW.SearchGoals.tabThrough()
                            break;
                        case 16, 17, 18, 91 : // control / modifier keys
                            break;
                        case 27 : // escape key
                            if (!s.isHome) { $(this).val(''); }
                            if (searched && !s.isHome) { s.collapse(); }
                            break;

                        case 8 :
                        case 46 : // backspace / delete
                            if (!s.checkLength()) {
                                BW.SearchGoals.updateToDefaultSuggestions();
                                break;
                            }
                        default :
                            // Only update suggestions if the search string is above a certain length
                            if (s.checkLength()) {
                                s.suggestionPause = setTimeout(function () { s.getSuggestions(searchValue); }, 100);
                            }
                            // What about clearing?
                    }

                });
              

                // Temporary search based on query string pre-transition decision
                if (document.location.search) {
                    //this.Query.val(decodeURIComponent(document.location.search).replace(/\?term\=/, ''));
                }

                //Anwar's code for fixing focus for no serach results page
                $(".search-tips.error").find("li").attr("tabindex", "0");

                this.homify();
               }
            }

            this.init();

            // Focus and Blur Handler for the Search Field in Subpages
         /* $(document).on('focus','.subpage-search-query',function() {
                $(this).addClass("active");
            });
            $(document).on('blur','.subpage-search-query',function() {
                $(this).removeClass("active");
            });*/
        }
        return new Search();
    }());

}(window.BW = window.BW || {}, jQuery));