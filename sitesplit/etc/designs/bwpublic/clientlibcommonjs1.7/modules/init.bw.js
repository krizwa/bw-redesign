(function (BW, $, undefined) {

    /* ==========================================================================
         1:          Initialisation
         Desription: Switch set up to load only JS required for each template.
                    Component based JS currently checks if DOM element present,
                    may be a more efficient method for this in CQ check when
                    integrated with dev.
         Templates:
         Components:
    ========================================================================== */

    BW.init = (function () {
        var init = function () {

            var $contentWrapper = $('#content-wrapper');

            //Dynamic Global Variable
            this.setGlobalVars = function() {
                BW.GlobalPath = $('#website-path').val();
                BW.SiteLanguage = $('#websiteLanguage').val();
                BW.AuthMode = $('#websiteAuthMode').val();
            }

            this.inPageNav = function() {
                var $listArchiveFilters = $(".list-archives-filters a[data-filter]"),
                    $loadMore = $('a#load-more'),
                    $maxArticle = $('#maxArticle'),
                    $inPageDetails = $('.in-page-navigation-volume-details > ul'),
                    $inPageArticles = $('.in-page-navigation-articles > ul'),
                    $inPagePress = $('.in-page-navigation-press > ul');

                // C205 In Page Navigation
                if ( $inPageDetails.length && $listArchiveFilters.length && $loadMore.length ) {
                    BW.Filter.init($inPageDetails.children(), $listArchiveFilters, $loadMore, parseInt($maxArticle.val()), true, true);
                }

                if ( $inPageArticles.length && $listArchiveFilters.length && $loadMore.length ) {
                    BW.Filter.init($inPageArticles.children(), $listArchiveFilters, $loadMore, parseInt($maxArticle.val()), true, true);
                }

                if ( $inPagePress.length && $listArchiveFilters.length && $loadMore.length ) {
                    BW.Filter.init($inPagePress.children(), $listArchiveFilters, $loadMore, parseInt($maxArticle.val()), true, true);
                }
            }

            this.carousels = function() {
                // C217 Carousel
                var $carouselContainer = $('.carousel-container');

                if ( $carouselContainer.length ) {
                    $carouselContainer.each(function() {
                        BW.Carousel.init($(this));
                    });
                }

                // auto carousel
                var $autoCarousels = $('.carousel-container-auto');

                if ( $autoCarousels.length ) {
                    $autoCarousels.each(function() {
                        BW.CarouselAuto($(this));
                    });
                }
            }

            this.lightbox = function() {
                // C218 Image lightbox
                $('.image-lightbox a').prettyPhoto({
                    deeplinking : false, // stops prettyPhoto from changing the url hash
                    show_title : false, // hides title
                    theme : 'dark_square',
                    social_tools : '' // gets rid of the default "tweet" and "share" buttons
                });
            }

            this.printPage = function() {
                // C305 Social Share
                // Print Page
                var $printPage = $('.print-page');

                if ( $printPage.length ) {
                    $printPage.click(function() {
                        window.print();
                        return false;
                    });
                }
            }

            this.skipNav = function() {
                //site wide skip nav
                $("a[href^='#']").click(function() {
                    // get the href attribute of the internal link
                    // then strip the first character off it (#)
                    // leaving the corresponding id attribute
                    $("#" + $(this).attr("href").slice(1) + "")
                        // give that id focus (for browsers that didn't already do so)
                        .focus()
                        // add a highlight effect to that id (comment out if not using)
                        .effect({}, {}, 3000);
                });
            }

            this.removeBrs = function() {
                if ( $('#tabs').length ) {
                    if ( $('.product-detail-module .copy ul li br').length > 0 || $('.product-detail-module .copy ul li h3 br').length > 0 ) {
                        $('.product-detail-module .copy ul li').find('br').remove();
                        $('.product-detail-module .copy ul li h3').find('br').remove();
                    }
                }
            }

            this.videoOverlay = function() {
                var $videoOverlay = $('.video-overlay');

                if ( $videoOverlay.length ) {

                    var videoHt = [],
                        videoWth = [];

                    for ( i=0; i< $videoOverlay.length ; i++ ) {
                        videoHt[i] = parseInt( $videoOverlay.eq(i).height() ) || 0;
                        videoWth[i] = parseInt( $videoOverlay.eq(i).width() ) || 0;
                        $('a.video').eq(i).css({'left': ((videoWth[i] - 94)/2) + 'px' , 'top': ((videoHt[i] - 72)/2) + 'px' });
                    }

                }
            }

            //adding code to remove scroll bar from the iframe when coming in service landing temaplate
            this.hideIframeScrollBar = function() {

                if ( $('.service-promo-container, .generic-content').length ) {

                    var $iFrame = $('iframe'),
                        $bwiFrame = $('#bwiframe'),
                        bwiframesrc = $bwiFrame.attr('src'),
                        $storyID = $('#storyid');

                    if ( $iFrame.length ) {
                        $iFrame.attr('scrolling', 'no');
                    }

                    if ( $storyID.val() != 'null' && $storyID.val() != '' && $storyID.val() != 'NULL' && bwiframesrc.indexOf("action=news_data") != -1 ) {
                        $bwiFrame.attr('src', bwiframesrc + "&story_id=" + $storyID.val());
                    }
                }
            }

            //hack to ensure /content/bwpublic is present in the path for post processing
            this.eligibilityQuestionnaire = function() {

                var $eligibilityQuestionnaire = $('.eligibility-questionnaire');

                if ( $eligibilityQuestionnaire.length ) {
                    var formAction = $eligibilityQuestionnaire.attr('action');

                    if ( formAction.indexOf('content/bwpublic') == -1 ) {
                        formAction =  '/content/bwpublic' + formAction;
                        $eligibilityQuestionnaire.attr('action', formAction);
                    }
                }
            }

            this.init = function () {

                this.setGlobalVars();

                // Homepage
                if ( $('#page-home').length !== 0 ) {
                    BW.Guide.init();
                }

                // Template JS
                // T207 Story
                if ( $contentWrapper.hasClass('story') ) {
                    BW.Story.init();
                }

                // T301 Contact Landing
                if ( $contentWrapper.hasClass('contact-landing') ) {
                    BW.Contact.init();
                }

                // Component JS

                //C106 footer twitter feed js
                /*  $('#tweetFeed').jTweetsAnywhere({
                        username: 'barclayswealth',
                        count: 1,
                        showTweetFeed: {
                                showProfileImages: false,
                                showUserScreenNames: false,
                                showUserFullNames: false,
                                showActionReply: false,
                                showActionRetweet: false,
                                showActionFavorite: false
                        }
                }); */

                // C203 Product detail  changes made for some changes in CQ
                
                if ( $('#wcmmode').attr('value') != 'edit' ) {
                    if ( $('#tabs').length ) $("#tabs").tabs({
                        //Anwar's changes for fixing BWP-992
                         create: function( event, ui ) {
                            $(this).find("li").attr("tabindex", "0");
                         }
                    });
                }

                if ( $('#notab').attr('value') == 'true' && $('#wcmmode').attr('value') != 'edit' ) {
                    $('.tab-list').hide();
                }

                //coloring odd rows in product detail table
                if ( $('.copy table').length ) $("tr:odd").addClass("odd");

                this.inPageNav();

                // to make the height equal for each column in a row
                if ( $('.promoRow').length ) {
                     BW.columnEqualHeight.init();
                }
                // to make the height equal for each column in a row
                if ( $('.service-group-landing-manual-links').length ) {
                     BW.columnEqualHeight.init('.service-group-landing-manual-links', '.basic-links-list');
                }

                // to make the height equal for each column in a row
                if ( $('.related-links h2').length ) {
                     BW.toggleSection.init();
                }

                // to make the height equal for each column in a row
                if ( $('.header-search').length ) {
                     BW.headerSearch.init();
                }

                //C214 - Insight landing grid  in T104 Reserach landing Template
                if ( $('.research-grid').length ) {
                     BW.FeedXML.init();
                }

                if ( $('#footer').length ) {
                     BW.FeedXML.init();
                }

                if ( $('.service-group-rss').length ) {
                    BW.FeedXML.init();
                }

                // C216 Dynamic Map
                if ( $('#map-canvas').length ) BW.Map.init();

                this.carousels();

                this.lightbox();

                // C222 Expert Panel
                if ( $('.expert-panel-container').length ) BW.ExpertPanel.init();

                BW.init.printPage();

                //T204 Expert profile, change margin when no copy inside
                if ( !$('.temp-cms-twocol .copy').length ) {
                    $('.temp-cms-twocol').css('margin','0');
                }

                this.skipNav();

                this.removeBrs();

                this.videoOverlay();

                this.hideIframeScrollBar();

                this.eligibilityQuestionnaire();



                //Site Wide
                BW.CookieSettings.init();
                BW.SiteCatatlyst.init();
                BW.CQAuthoring.init();
            }

            // Call init on document ready
            $(document).ready(function() { BW.init.init(); });

        }
        return new init();
    }());

}(window.BW = window.BW || {}, jQuery));