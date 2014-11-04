(function (BW, $, undefined) {


    /* ==========================================================================
         4:          Contact Page
         Description:

         Templates:
         Components:
    ========================================================================== */
    BW.Contact = (function () {

        var Contact = function () {

            var c = this,
                state = 'list', // initial page state
                mapContainer = null;

            //methods
            this.init = function() {

                // map expand and collapes
                var mapContainer = $('#map-container');

                // if not a touch device default to the map view
                if (!Modernizr.touch) c.toggleMapState('map', mapContainer);
                setTimeout(function () { mapContainer.addClass('animate'); }, 20); // poc don't want animation on load

                // Toggle map view
                $('#map-container .toggle-view').on('click', 'a', function (e) {
                    e.preventDefault();
                    var state = $(this).attr('data-state');
                    if ( !state ) { return; }
                        c.toggleMapState(state, mapContainer);
                });

                // Hide / show regions
                var regionsList = $('#contact-regions');
                this.regionContainers = {};

                //store all the regional containers
                regionsList.find('a').each(function(index) {
                    r = $(this);
                    c.regionContainers[r.attr('href')] = $(r.attr('href'));
                });

                //update map on region click
                regionsList.on("click", "a", function(event){
                    var r = $(this),
                        curElem = $(this);

                    curElem.parent().parent().find('a').removeClass('active');
                    curElem.addClass('active');

                    c.updateRegionList( r.attr('href') );
                    BW.Map.updatelocation( r.attr('data-lat'), r.attr('data-lng'), r.attr('data-zoom-level') );
                    return false;
                });

                //toggle multiple city regions
                $('.has-children').on('click', 'span', function () {
                    $(this).parent().toggleClass('open');
                });
            }

            // Open / close map
            this.toggleMapState = function(newState, mapContainer) {
                if (newState === state) { return; }
                state = newState;
                if (newState === 'map') mapContainer.removeClass('collapsed');
                else mapContainer.addClass('collapsed');
                $('#map-container .toggle-view li').removeClass('on');
                $('#map-container .toggle-view .' + newState).addClass('on');
            }

            // Hide / show regions
            this.updateRegionList = function(region) {
                if (region === "#global") {
                    for (r in this.regionContainers) {
                        this.regionContainers[r].show();
                    }
                }
                else {
                    for (r in this.regionContainers) {
                        if (r == region) {
                            this.regionContainers[r].show();
                        }
                        else {
                            this.regionContainers[r].hide();
                        }
                    }
                }
            }

        }
        return new Contact();
    }());


}(window.BW = window.BW || {}, jQuery));