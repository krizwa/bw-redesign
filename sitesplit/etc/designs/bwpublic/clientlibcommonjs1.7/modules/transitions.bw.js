
(function (BW, $, undefined) {

    /* ==========================================================================
     11:         Transitions
     Description: Deals with page-to-page transitions

     Templates:
     Components: T101 to T208
    ========================================================================== */
    BW.Transitions = (function () {
        var Transitions = function () {

            this.isHome = false;

            this.HomeToSearch = new function() {

                this.init = function (isHome) {
                    this.pages = [];
                    this.pages.push($('[role="main"]'));
                    this.isHome = isHome;
                    if (isHome) {
                        var t = this;
                        if (Modernizr.touch) {
                            setTimeout(function () { t.fixAside(); }, 1000);
                        }
                        if (!Modernizr.touch) {
                            t.fixAside();
                        }
                    }
                }

                // Allow external forces to add
                this.addPage = function (url, transitionWhenLoaded, html, o) {
                    if (!html && !url) {
                        // still need to get the page
                        var t = this;
                        BW.helper.server.get(url, {
                            done : function (html, o) {
                                t.pages.push($(html));
                                // If we're just waiting for the loaded page to commence the transition - go
                                if (transitionWhenLoaded) { t.finish(o); }
                            }
                        });
                    } else {
                        this.pages.push($(html));
                        if (transitionWhenLoaded) { this.finish(o) }
                    }
                }

                this.fixAside = function () {
                    var aside = $('.content-aside-search');
                    if (!aside.length) { return; }
                    var h = 0;
                    var l = aside.children().position().left;
                    aside.children().each(function () {
                        var p = $(this).prev();
                        var t = p.css('top');
                        t = (parseInt(t) || 0) + (p.height() || 0)
                        t += parseInt(p.css('padding-top') || 0) + parseInt(p.css('padding-bottom') || 0);

                        if (t) { t = t + 'px'; }
                        $(this).css({ 'top' : t, 'left' : 0 });
                        $(this).addClass('fixed');
                        h += $(this).height();
                    })
                    aside.css({
                        'right' : l + 'px',
                        'top' : 0,
                        'height' : h + 42 + 'px',
                        'width' : aside.children().width() + 'px'
                    });
                    aside.addClass('fixed');
                }

                this.done = {
                    go : false,
                    middle : false,
                    finish : false
                }

                // Animation helpers
                this.animate = (Modernizr.csstransitions) ?
                    function(e,c) { e.css(c); } :
                    function(e,c,t) { e.animate(c,t); };

                /*  These are to add or remove class and support animation
                        when csstransitions are not supported

                        e : the element which needs to animate
                        c : the class name which will be added or removed
                        o : the css which will be animated if the browser does not support csstransitions
                        t : the length of the animation
                */
                this.addClass = function(e,c,o,t) {
                    this.animateClass('addClass', $(e), c, o, t);
                }

                this.removeClass = function(e,c,o,t) {
                    this.animateClass('removeClass', $(e), c, o, t);
                }

                // arguments are the same as above, except "m" which is the method to use
                this.animateClass = (Modernizr.csstransitions) ?
                    /* css transitions are supported, so just add the class */
                    function (m,e,c) { e[m](c); } :
                    /* css transitions are not supported */
                    function (m,e,c,o,t) {
                        // animate the element with the supplied css (o)
                        e.animate(o,t);
                        // set all values in the css object to nothing so the inline css can be reset
                        for (s in o) { o = ''; }
                        // if we're removing the class, do it now
                        if (m === 'removeClass') { e[m](c); }
                        // wait for the animation to end,
                        setTimeout(function () {
                            // if we're adding the class, do it now.
                            if (m === 'addClass') { e[m](c); }
                            // and reset the inline css
                            e.css(o);
                        }, t);
                    };

                // Pre-new content loaded
                this.go = function () {
                    // Stop/Kill any things that we need to kill before transitioning
                    BW.Carousel.kill();
                    BW.SearchGoals.kill();

                    var t = this;

                    // Wrap the content
                    var transition = $(document.createElement('div')).addClass('transition');
                    this.pages[0].wrap(transition);

                    // Wait a bit to transition
                    setTimeout(function () { t.middle(); }, 250);

                    // Flag go as complete
                    this.done.go = true;

                }

                this.middle = function () {

                    if (!this.done.go) {
                        // Go has not run
                        BW.helper.debug('Go not complete');
                        return;
                    }

                    var transition = this.pages[0].parent();
                    var t = this;

                    // Fade out or disappear all the other unnecessary things
                    var bye = $('#suggestions, label[for="search-query"], #search-go, .search-fields a.close, .search-info');
                    var aside = $('.content-aside-search');

                    this.addClass(aside, 'out', { 'height' : '1px', 'top' : '-1px' }, 300);
                    this.animate(bye, { 'opacity' : '0' }, 300);

                    // Clean up
                    setTimeout(function () {
                        bye.remove();
                        aside.remove();
                    }, 350)

                    // Get the search box
                    var Query = BW.Search.Query;

                    // Get the search box value and save it
                    this.term = Query.val();

                    // Move the search box up to the top of the page
                    Query.addClass('fix');
                    setTimeout(function () {
                        // Remember the 8px discrepancy
                        t.animate(Query, { 'top' : '35px', 'left' : '9px' }, 400);
                    });

                    $('#header').css('margin-bottom', '0');

                    // Set up the structure and positioning of the non-search content so we can
                    //  slide it off the stage
                    var slideOut = $(document.createElement('div'))
                    var quinks = $('.search-quinks-container');
                    quinks.after(slideOut.append(quinks.nextAll()));

                    slideOut.css({
                        'top' : slideOut.position().top + 'px',
                        'height' : ($(window).height() - slideOut.position().top) + 'px',
                        'width' : $(document).width() + 'px'
                    })


                    // Add the class for transitions
                    setTimeout(function () {
                        slideOut.addClass('slideOut');
                    }, 30);

                    // Slide the non-search content off the page
                    setTimeout(function () {
                        t.animate(slideOut, { 'top' : ($(window).height() + 100) + 'px' }, 500);
                    }, 50);

                    // Clean up again
                    setTimeout(function () {
                        slideOut.remove()
                    }, 700);

                    // Call finish
                    setTimeout(function () {
                        t.pages[0].addClass('fix');
                        t.finish()
                    }, 1000);

                    // Get ready to fade the background image out;
                    this.pages[0].find('#bg-home').addClass('fade');

                    // Flag that go has finished running
                    this.done.middle = true;

                }

                // Post-new content loaded
                this.finish = function (o) {

                    var transition = this.pages[0].parent();
                    var t = this;

                    if (o) { this.url = o.url }

                    if (this.pages.length < 2 || !this.done.middle) {
                        // Finish was called before this.middle has finished OR
                        //  before the new content has loaded -- so abort.
                        //  Whichever one is outstanding will call finish when it's done.
                        BW.helper.debug("Can't finish", this.pages.length, this.done.go);
                        return;
                    }

                    if (this.done.finish) {
                        // Finish has already run once - there's been some timeout overlaps
                        BW.helper.debug("Already finished");
                        return;
                    }

                    this.addClass(this.pages[0], 'out', {'opacity' : '0'}, 500);

                    // Remove the image that was just showing in the search area
                    $('#page-home').css('background', 'none');
                    $('#bg-home').remove();

                    // Get the new background image
                    var bg = this.pages[1].filter('#bg').children();
                    bg.hide().appendTo($('#bg')).load(function () {
                        $(this).fadeIn('slow');
                        t.animate(BW.Search.Query, { 'background' : 'none' }, 800);
                    });

                    if (this.url) {
                        BW.helper.history.push(null, this.pages[1].filter('title').text(), this.url);
                    }

                    // Style the new content so that it is hidden when it is appended
                    this.pages[1] = this.pages[1].filter('.page-wrapper').children('[role="main"]');
                    this.pages[1].find('input[name="search-query"]').hide();

                    // Append the new content to the document
                    var newQuery = this.pages[1].find('#search-container');
                    newQuery.addClass('no-transition').hide().css({ 'top' : '-220px' });

                    var newContent = this.pages[1].find('.search-results-wrapper');
                    newContent.hide().css({ 'top' : $(window).height() });
                    this.pages[1].find('input[name="search-query"]').hide();

                    // Append the new content to the document
                    var newQuery = this.pages[1].find('#search-container');
                    newQuery.addClass('no-transition').hide().css({ 'top' : '-220px' });

                    var newContent = this.pages[1].find('.search-results-wrapper');
                    newContent.hide().css({ 'top' : $(window).height() });

                    // Slide the new content onto the document
                    setTimeout(function () {
                        newQuery.addClass('fix');
                        newContent.addClass('fix newContent');
                    }, 20);

                    setTimeout(function () {
                        transition.append(t.pages[1]);
                    }, 600);

                    setTimeout(function () {
                        newQuery.show().removeClass('no-transition');
                        newContent.show();
                    }, 900);

                    setTimeout(function () {
                        t.animate(newContent, { 'top' : '8px' }, 500);
                        t.animate(newQuery, { 'top' : 0 }, 500);
                    }, 950);


                    // Set the new search box value to the old search box value;
                    this.pages[1].find('input[name="search-query"]').val(this.term);
                    // Get rid of the existing search box and swap it for the new search box
                    setTimeout(function () {
                        $('.page-wrapper').attr('id', '');
                        $('#content-wrapper').attr('class', 'search-results');
                        transition.after(t.pages[1]);
                        t.pages[1].find('input[name="search-query"]').show();
                        transition.remove();
                    }, 1800)

                    setTimeout(function () { t.reset(); }, 2000)

                    // Flag that finish has finished running
                    this.done.finish = true;
                }

                // Call other classes Inits again
                this.reset = function () {
                    // The other functions have not finished yet
                    if (!this.done.go || !this.done.finish) { return; }
                    this.done = { go : false, finish : false };

                    // Re-run inits
                    BW.Layout.init();
                    BW.Search.init();
                    BW.SearchGoals.init();
                    BW.Transitions.init();
                    BW.CookieSettings.init();
                }

            }();

            this.SearchToSearch = new function () {
                /*this.finish = function () {
                    this.pages[1] = this.pages[1].filter('.page-wrapper').children('[role="main"]');
                }*/
            }();

            this.SearchToDetail = function () {
                // We're on the homepage
                if (this.isHome) { return; }
            }
            this.init = function () {
            	if($('#search-form').length>0){
	                this.isHome = BW.Search.isHome;
	                this.HomeToSearch.init(this.isHome);
            	}
            }
            this.init();
        }
        return new Transitions();
    }());


}(window.BW = window.BW || {}, jQuery));