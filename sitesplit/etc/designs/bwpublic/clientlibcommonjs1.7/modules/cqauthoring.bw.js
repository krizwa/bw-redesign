(function (BW, $, undefined) {

    /* =====================================================================
     20: CQ and Authoring
     Description: All the JS related to CQ and Authoring

     Templates:  CQ CMS and Authoring
     Components: -
    ==================================================================== */

    BW.CQAuthoring = (function () {
        var CQAuthoring = function () {
            this.init = function() {
                // CQ Impression
                if ($('#cqImpressionTrack').val() == "true") {
                    window.setTimeout(function() {
                        $.getScript($('#trackingURL').val() + ".js?path=" + $('#currentPagePath').val());
                    }, 1);
                }
            }
        }
        return new CQAuthoring();
    }());


}(window.BW = window.BW || {}, jQuery));