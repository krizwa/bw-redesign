(function(BW, $, undefined) {

    /* =====================================================================
     - headerSearch
     Description: 
    ======================================================================= */

    BW.headerSearch = (function() {
        var headerSearch = function() {

            this.init = function(element, details) {

                this.toggleFormLayer(element, details);
                this.closeOnOutsideClick();
            }

            // toggle (show/hide) layer (with animation)
            this.toggleFormLayer = function() {

                var element = element ? element : ".header-search .search-toggle",
                    details = details ? details : ".header-search .search-fields";

                $(element).click(function() {

                    $(element).toggleClass("open");
                    $(details).animate({
                        height: "toggle",
                        width: "toggle"
                    }, 200, function() {
                        $(this).find('input[type=text]').filter(':visible:first').focus();
                    });
                });
            }

            // hide an element/container, when user clicks outside of it
            // - if the target of the click isn't the container... nor a descendant of the container...
            this.closeOnOutsideClick = function(container, target) {

                var container = container ? container : $(".header-search"),
                    element = element ? element : container.find(".search-toggle"),
                    target = target ? target : container.find(".search-fields");

                $(document).mouseup(function(e) {
                    if (!container.is(e.target) && container.has(e.target).length === 0 && target.is(":visible")) {
                        target.hide();
                        $(element).toggleClass("open");
                    }
                });
            }

        }
        return new headerSearch();
    }());

}(window.BW = window.BW || {}, jQuery));