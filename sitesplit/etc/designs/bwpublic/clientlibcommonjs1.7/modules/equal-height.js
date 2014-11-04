(function(BW, $, undefined) {

    /* =====================================================================
     15: Columns Equal Height 
     Description: 
    ======================================================================= */

    BW.columnEqualHeight = (function() {
        var columnEqualHeight = function() {

            this.init = function(container, box) {
                
                var container = container ? container : ".promoRow",
                    box = box ? box : ".copy-wrapper";

                $(container).each(function() {
                    var highestBox = 0;
                    $(box, this).each(function() {
                        if ($(this).height() > highestBox)
                            highestBox = $(this).height();
                    });

                    $(box, this).height(highestBox);

                });
            }
        }
        return new columnEqualHeight();
    }());

}(window.BW = window.BW || {}, jQuery));