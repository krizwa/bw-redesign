(function(BW, $, undefined) {

    /* =====================================================================
     - headerSearch
     Description: 
    ======================================================================= */

    BW.headerSearch = (function() {
        var headerSearch = function() {

            this.init = function(element, details) {

                var element = element ? element : ".header-search .search-toggle",
                    details = details ? details : ".header-search form";

                $(element).click(function() {

                    $(element).toggleClass("open");
                    $(details).animate({
                        height: "toggle",
                        width: "toggle"
                    }, 200, function() { });
                });
            }
        }
        return new headerSearch();
    }());

}(window.BW = window.BW || {}, jQuery));