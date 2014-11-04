(function (BW, $, undefined) {


    /* =====================================================================
     15:         Expert Panel
     Description: Set up tooltip position and init carousel if needed

     Templates:
     Components: C222
    ======================================================================= */
    BW.ExpertPanel = (function () {
        var ExpertPanel = function () {

            var ep = this;

            this.init = function() {

                this.container = $('.expert-panel-container');
                var n = this.container.find('li').length; // number of profiles
                 //set up tooltip close handler
                this.container.on('click', 'a.close', function (e) {
                    e.preventDefault();
                    $(this).parent('.expert-panel-tooltip').hide();
                });

                this.container.find('li').hover( function () {
                    $('.expert-panel-tooltip').removeAttr('style');
                });

                //Making the tooltip appear on left after the middle of first row (7th child) and start of the next row (11th child)          // tooltip
                this.container.find('li:nth-child(n+6)').children('.expert-panel-tooltip').addClass('left');

                //if more than 11 profiles set up carousel
                if ( n > 11 ) {
                    this.container.removeClass('carousel-disabled');
                    var c = BW.Carousel.init(this.container, 10, null, true);
                }
            }
        }
        return new ExpertPanel();
    }());

}(window.BW = window.BW || {}, jQuery));