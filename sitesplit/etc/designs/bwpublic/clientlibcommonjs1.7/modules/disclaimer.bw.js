(function (BW, $, undefined) {

    /* ==========================================================================
              RESPONSIVE TABS
     Description: In desktop, it functions as a tab, in tablet/mobile as an accordion
                    Also 'Read All' functionality for mobile devices

     Templates:  All
     Components: zeyin's commment
    ======================================================================= */

    BW.disclaimer = {

        init: function() {

            var self = this;

            // Cache elements

            this.setDefaults();

            // Check device
            enquire.register("screen and (max-width: 480px)", {

                match: function() {
                    self.cookieDisclaimer();
                },

                unmatch: function() {
                    $.magnificPopup.close();
                }
            });

        },

        setDefaults: function() {
            // Set lightbox default
            $.extend(true, $.magnificPopup.defaults, {
                type: 'ajax',
                showCloseBtn: false,
                enableEscapeKey: false,
                closeOnBgClick: false
            });
        },

        cookieDisclaimer: function() {

            if ( $('.service-category').length > 0 ) {

                $.magnificPopup.open({
                    items: [
                        {
                            src: '/includes/modules/disclaimer-text.html',
                            type: 'ajax'
                        }
                    ],
                    callbacks: {
                        ajaxContentAdded: function() {

                            if ( this.probablyMobile === true ) {
                                var viewportHeight = $(window).height();

                                this.wrap.addClass('mfp-align-top');
                                this.contentContainer.css('max-height', viewportHeight);
                            }

                            $('.disclaimer-box__cancel').on('click touchstart', function(e) {
                                $.magnificPopup.close();

                                e.preventDefault();
                            });

                            $('.disclaimer-box__accept').on('click touchstart', function(e) {
                                $.magnificPopup.close();

                                e.preventDefault();
                            });
                        }
                    }
                }, 0);
            }
        }

    };

    BW.disclaimer.init();

}(window.BW = window.BW || {}, jQuery));