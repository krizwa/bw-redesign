(function (BW, $, undefined) {

    /* ==========================================================================
              RESPONSIVE TABS
     Description: In desktop, it functions as a tab, in tablet/mobile as an accordion
                    Also 'Read All' functionality for mobile devices

     Templates:  All
     Components:
    ======================================================================= */

    BW.cookieDisclaimer = {

        init: function() {

            var self = this;

            $('.cookie-disclaimer__close').on('click', function(e) {

                $('.cookie-disclaimer').addClass('cookie__close');

                e.preventDefault();
            });
        }

    };

    BW.cookieDisclaimer.init();

}(window.BW = window.BW || {}, jQuery));