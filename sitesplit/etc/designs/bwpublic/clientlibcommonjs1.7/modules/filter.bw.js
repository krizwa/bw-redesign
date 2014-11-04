(function (BW, $, undefined) {

    /* ==========================================================================
     5:          Filters
     Description: General filtering functionlity

     Templates:
     Components:
    ========================================================================== */
    BW.Filter = (function () {

        var Filter = function () {
            // object properties
            this.currentFiltered = [];
            var currentFilter;

            // methods
            this.init = function(articleList, filterButtons, moreResults, maxArticlesPerPage, activate, expandParents) {

                this.articleList = articleList;
                this.filterButtons = filterButtons;
                this.moreResults = moreResults;
                this.maxArticlesPerPage = maxArticlesPerPage || (BW.config.Filter.maxArticlesPerPage || 8);
                this.currentFilterLength = this.maxArticlesPerPage;
                this.expandParents = (expandParents || false);

                this.callbacks = {
                    filter : function () {},
                    loadMore : function () {}
                }

                currentFilter = null;

                this.articleList.parent().addClass('filtering-enabled');

                var f = this;

                // event handler
                this.filterButtons.on("click", function(e) {
                    e.preventDefault();
                    f.activeFilter($(this).attr('data-filter') || $(this).val());
                });

                if (BW.config.Search.SearchPaginationCounter == 1) {
                    BW.config.Search.SearchPaginationCounter = 0;
                    this.moreResults.on("click", function(e) {
                        e.preventDefault();
                        f.increaseArticleCount();
                        f.showArticles(f.currentFiltered);
                        f.callbacks.loadMore();

                    // SJ- Search Result Module. Function to Limit the Max Search Result
                    /* if (activateMaxSearchResult) {
                        if ($('div.promo.show').length == BW.config.Search.SearchMaxResults) {
                            $('#load-more').addClass('disabled');
                        }
                    } */
                    });
                }

                if (activate) {
                    this.activeFilter();
                }

                if (expandParents) {
                    // This assumes that filter buttons will always be ul>li>a with the a being the clickable element
                    // The scipt will still work if this is not the case, but the expandParents relies on this and it will
                    // not work if this is not the case
                    this.filterButtons.closest('ul').parent().children('a').on("click", function (e) {
                        e.preventDefault();

                        $(this).closest('ul').find('.active').removeClass('active');
                        $(this).closest('ul').find('.clear-filter').children('a').addClass('active');
                        $(this).addClass('active');
                        //$(this).toggleClass('active'); //removed as one filter needs to open at one time

                        if($(this).hasClass('active')) {
                            $(this).parent().addClass('active');

                        } else {
                            $(this).parent().removeClass('active');
                        }

                        //de-activate the filter months which does not have any volume under it and off its click
                        $(this).parent().children('ul').children('li').each(function(){
                            var filterMonthYear = $(this).children('a').attr('data-filter');
                            if (!$('.in-page-navigation-volume-details>ul li').hasClass(filterMonthYear)  && !$('.in-page-navigation-articles>ul li').hasClass(filterMonthYear) && !$('.in-page-navigation-press>ul li').hasClass(filterMonthYear)) {
                                $(this).children('a').addClass('de-activate').attr('href','javascript:void(0)');
                                $(this).children('a.de-activate').off('click');
                            }
                        });
                    })
                }
            }

            this.activeFilter = function(filterName) {
                filterName = filterName || '';

                if (currentFilter === filterName) { return; }

                if (filterName == '' && currentFilter != '') {
                    this.filterButtons.closest('ul').children('li')
                        .removeClass('active')
                            .children('a').removeClass('active');
                }

                currentFilter = filterName;

                // pass class name of the button - used for filtering
                var filtered = this.filterList(filterName);

                // SJ - Reset Search Pagination only on Search Page
                // SJ- Get the container which holds the results
                _resultsContainer = $('#search-results-container');

                // SJ - Check if it is a Search Page?
                if (_resultsContainer) {
                    var searchResultCount = $('div.promo.show, div.quote.show').length;
                    $('.search-pagination p span.show-results').text(searchResultCount);
                    $('.search-pagination-bottom')
                        .empty()
                        .html($('.search-pagination-top').html());
                }

                // reset buttons
                this.filterButtons.removeClass('active');
                this.filterButtons.filter('[data-filter="' + filterName + '"]').addClass('active');

                var filterClass = filterName === '' ? '' : '.' + filterName;
                this.callbacks.filter(filtered, filterClass);
            }

            /* Currently the filter resets the visible count to maxPerPage on filter
            We should consider if that's the behaviour that we want,
            or we want the current visible items to remain visible */
            this.filterList = function(filterName) {
                // reset visibility
                this.articleList.removeClass('show');

                // reset visible number of articles
                this.resetArticleCount();
                // get all the articles that fit the filter criteria
                var filtered = (filterName == '') ? this.articleList : this.articleList.filter('.' + filterName);
                this.showArticles(filtered);
                return filtered;
            }

            this.showArticles = function(filtered) {
                this.currentFiltered = filtered;
                var activeArticles = filtered;
                //if the artciles are less than current filter length then do not show load more button
                if (activeArticles.length <= this.currentFilterLength) {
                    this.moreResults.addClass('disabled');
                }
                if (activeArticles.length > this.currentFilterLength) {
                    activeArticles = activeArticles.filter(':lt(' + this.currentFilterLength + ')');
                }
                activeArticles.addClass('show');

            }

            this.increaseArticleCount = function() {
                this.currentFilterLength += this.maxArticlesPerPage;
                if (this.currentFilterLength >= this.currentFiltered.length) {
                    this.moreResults.addClass('disabled');
                }
            }

            this.resetArticleCount = function() {
                this.currentFilterLength = this.maxArticlesPerPage;
                this.moreResults.removeClass('disabled');
            }

        }
        return new Filter();
    }());


}(window.BW = window.BW || {}, jQuery));