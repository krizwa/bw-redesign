(function (BW, $, undefined) {

    /* ==========================================================================
              RESPONSIVE TABS
     Description: In desktop, it functions as a tab, in tablet/mobile as an accordion
                    Also 'Read All' functionality for mobile devices

     Templates:  All
     Components:
    ======================================================================= */

    BW.responsiveTab = {

        tabContainer: $('.responsive-tab'),

        init: function() {

            var self = this;

            // Cache elements
            self.tabItem = self.tabContainer.find('.responsive-tab__item');
            self.tabHeading = self.tabContainer.find('.responsive-tab__heading');
            self.tabContent = self.tabContainer.find('.responsive-tab__content');
            self.mobile = false;

            // Check device
            enquire.register("screen and (max-width: 769px)", {

                match: function() {
                    self.mobile = true;
                    self.resetState();
                    self.readMore();
                    self.readMoreHandler(self);
                },

                unmatch: function() {
                    self.mobile = false;
                    self.removeReadMore();
                    self.resetState();
                }
            });

            self.setState();
            self.bindHandlers(self);

        },

        setState: function() {
            this.tabContent.hide();

            this.tabHeading.first().addClass('active');
            this.tabContent.first().addClass('is-open').show();

            if ( this.mobile == false ) {
                var contentHeight = this.tabContent.first().height();
                this.tabContainer.css('height', contentHeight);
            }
        },

        resetState: function() {
            if ( this.mobile == true ) {
                this.tabContainer.css('height', 'auto');
            } else if ( this.mobile == false ) {
                var contentHeight = this.tabContent.filter('.is-open').height();
                this.tabContainer.css('height', contentHeight);
            }
        },

        bindHandlers: function(self) {
            this.tabHeading.on('click', function(e) {
                self.togglePanels(this);

                e.preventDefault();
            })
        },

        togglePanels: function(clicked) {

            if ( $(clicked).hasClass('active') && this.mobile == true ) {
                $(clicked)
                    .removeClass('active')
                    .next().removeClass('is-open').hide();
            } else {
                this.tabHeading.removeClass('active');
                this.tabContent.removeClass('is-open').hide();

                $(clicked)
                    .addClass('active')
                    .next().addClass('is-open').show();
            }

            if ( this.mobile == false ) {
                var contentHeight = $(clicked).next().height();
                this.tabContainer.css('height', contentHeight);
            }

            if ( this.mobile == true ) {
                var pos = $(clicked).offset().top;
                $('html, body').animate({ scrollTop: pos }, 'slow');
            }
        },

        readMore: function() {
            var readMore = '<div class="read-all"><a href="#">Read all</a></a>';

            if ( !$('.read-all').length > 0 ) {
                this.tabContent.append(readMore);
            } else {
                $('.read-all').show();
            }

            this.tabContent.find('.product-detail-module').hide();
            this.tabContent.find('.product-benefits-module').hide();

        },

        readMoreHandler: function(self) {
            $('.read-all').on('click', function(e) {
                $(this).hide();

                $(this).parent().find('.product-detail-module').show();
                $(this).parent().find('.product-benefits-module').show();

                self.resetState();
                e.preventDefault();
            })
        },

        removeReadMore: function() {
            $('.read-all').hide();

            this.tabContent.find('.product-detail-module').show();
            this.tabContent.find('.product-benefits-module').show();
        }

    };

    BW.responsiveTab.init();

}(window.BW = window.BW || {}, jQuery));