(function (BW, $, undefined) {

    /* ==========================================================================
     7:          MegaNav
     Description: Primary navigation drop down menu, adds hover intent
                functionality, no JS works with CSS only

     Templates:  Site Wide
     Components:
    ========================================================================== */
    BW.MegaNav = (function () {

        var MegaNav = function() {

            this.init = function () {
                var n = this;
                this.navigation = $('#navigation');
                this.container = this.navigation.parent();
                this.navigation.find('.with-meganav>ul').equalHeights();

                var timeout,
                    timeout1;

                    this.navigation.find('li').hover( function () {

                        var t = $(this);

                        if (!Modernizr.touch) {
                            // Extra Class being until the hover is persistent
                            t.addClass('added');
                            if (t.hasClass('with-meganav'))  {
                                t.addClass('hoverAdded');
                            }
                            timeout = setTimeout( function () {
                                // Check if the hover event is still persistent?
                                // There are cases when the user places the mouse on the menu for a
                                // moment and moves quickly. In such case, the drop down menu shouldn't be shown
                                if (t.hasClass('added')) {
                                    t.addClass('hover');
                                    if (t.hasClass('with-meganav'))  {
                                        n.container.addClass('hover');
                                    }
                                }
                            }, 300);
                        } else {
                            t.addClass('hover');
                            if (t.hasClass('with-meganav'))  {
                                n.container.addClass('hover');
                            }
                        }
                 }, function () {
                        var t = $(this),
                                u = t.parent();
                        if (!Modernizr.touch) {
                            t.removeClass('added hoverAdded');
                            timeout = setTimeout( function () {
                                t.removeClass('hover');
                                if (t.hasClass('with-meganav') && !u.find('li.hoverAdded').length) {
                                    n.container.removeClass('hover');
                                }
                            }, 250);
                        } else {
                            t.removeClass('hover');
                            if (t.hasClass('with-meganav')) {
                                n.container.removeClass('hover');
                            }
                        }
                 });

                 //opening the mega menu on focus
                this.navigation.find('li a').focus(function() {
                    var t = $(this).parent();
                    t.addClass('hover');
                 if (t.hasClass('with-meganav')) n.container.addClass('hover');
                }).blur(function() {
                    var t = $(this).parent();
                    t.removeClass('hover');
                    if (t.hasClass('with-meganav')) n.container.removeClass('hover');
                });

                //focus on inetrnal links
                this.navigation.find('.with-meganav>ul>li a').focus(function() {
                    var t = $(this).closest('.with-meganav');
                    t.addClass('hover');
                    if (t.hasClass('with-meganav')) n.container.addClass('hover');
                }).blur(function() {
                    var t = $(this).closest('.with-meganav');
                    t.removeClass('hover');
                    if (t.hasClass('with-meganav')) n.container.removeClass('hover');
                });

                //focus on login links
                this.navigation.find('.login>ul>li>ul>li a').focus(function() {
                    var t = $(this).closest('.login');
                    t.addClass('hover');
                    if (t.hasClass('login')) n.container.addClass('hover');
                }).blur(function() {
                    var t = $(this).closest('.login');
                    t.removeClass('hover');
                    if (t.hasClass('login')) n.container.removeClass('hover');
                });

                //fix for BWP-1198 ( adding extra nav items )
                this.navigation.find('.navigation-company').children().hover(function () {
                    var t = $(this),
                            currentposition = t.position().left - 30,
                            elemlevel = $('.navigation-company').children().length - t.index();

                            if(elemlevel > 2) {
                                t.children('ul').css({'left': currentposition , 'right':'auto'});
                            }

                 }, function () {
                     var t = $(this);

                });
            }

         this.init();

        }
        return new MegaNav();
    }());

}(window.BW = window.BW || {}, jQuery));