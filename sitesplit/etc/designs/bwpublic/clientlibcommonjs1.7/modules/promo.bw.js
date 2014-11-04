(function (BW, $, undefined) {

    /* ==========================================================================
     18:         Promo
     Description: Dynamically chnages height on hover on and hover off

     Templates:  All
     Components: C201-Promo
    ======================================================================= */

    BW.Promo = (function () {
        var Promo = function () {

            this.init = function() {
                /* Adjust the height of the promo boxes in the landing pages to the height of
                the lengthiest box. */
                $('.promoRow').equalPromoHeights();


                $('.article .promos').equalHeights();
            }
            this.init();
        }
        return new Promo();
    }());


}(window.BW = window.BW || {}, jQuery));