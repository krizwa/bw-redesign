(function(BW, $, undefined) {

    /* =====================================================================
     15: Columns Equal Height 
     Description: 
    ======================================================================= */

    BW.toggleSection = (function() {
        var toggleSection = function() {

            this.init = function(summary, details) {
                this.toggleBox(summary, details);
            }
            
            this.toggleBox = function() {
                var summary = summary ? summary : ".related-links h2",
                    details = details ? details : ".service-group-landing-manual-links";

                $(summary).click(function() {
                    $(summary).toggleClass("down");
                    $(details).slideToggle();
                });

            }
        }
        return new toggleSection();
    }());

}(window.BW = window.BW || {}, jQuery));