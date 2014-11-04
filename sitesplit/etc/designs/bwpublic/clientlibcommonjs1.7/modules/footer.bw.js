(function (BW, $, undefined) {

    /* ==========================================================================
     18:         Footer
     Description: Footer content changes to accordion on mobile

     Templates:  All
     Components: C106-Footer
    ======================================================================= */

    BW.footer = {

        contactContainer: $('.footer-nav-contact'),
        privacyContainer: $('.footer-nav-privacy'),

        init: function() {

            var self = this;

            enquire.register("screen and (max-width: 480px)", {

                // if mobile, set inital state and attach handlers
                match: function() {
                    self.setState();
                    self.bindHandlers();
                },

                // if not mobile, clean up mobile code
                unmatch: function() {
                    self.nonMobile();
                }
            });
        },

        setState: function() {
            this.contactContainer.find('ul').hide();
            this.privacyContainer.find('ul').hide();
        },

        bindHandlers: function() {
            var self = this;

            this.contactContainer.find('.footer-navs').on('click', function() {
                //self.togglePanels();
                self.toggleContact();
            });

            this.privacyContainer.find('.footer-navs').on('click', function(e) {
                //self.togglePanels();
                self.togglePrivacy();

                e.preventDefault();
            });
        },

        toggleContact: function() {
            this.contactContainer.find('ul').slideToggle('fast');
        },

        togglePrivacy: function() {
            this.privacyContainer.find('ul').slideToggle('fast');
        },

        togglePanels: function() {

            this.contactContainer.find('ul').toggle();
            this.privacyContainer.find('ul').toggle();
        },

        nonMobile: function() {
            this.contactContainer.find('ul').show();
            this.privacyContainer.find('ul').show();

            this.contactContainer.find('.footer-navs').off('click');
            this.privacyContainer.find('.footer-navs').off('click');
        }

    };

    BW.footer.init();

}(window.BW = window.BW || {}, jQuery));