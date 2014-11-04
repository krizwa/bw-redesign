(function (BW, $, undefined) {

    /* ==========================================================================
     8:          Map
     Description: Dynamic map: takes json of all offices and clusters markers
                on the map. Has office detail popup with ajax call for office
                detail

     Templates:  T301, T302
     Components: C216
    ========================================================================== */
    BW.Map = (function () {
        var Map = function() {

            var m = this;

            //Create map
            this.init = function () {

                //If an office detail page - create map with one marker
                if ($('#content-wrapper').hasClass('office-detail')) {
                    //get the office location from page
                    var officeLocation = this.getOfficeLocation();
                    //create the map and add marker
                    this.createMap(officeLocation.lat,parseFloat(officeLocation.lng)+0.0065,BW.config.Map.zoomLevel['office']);
                    this.addMarker(officeLocation.street,officeLocation.lat,officeLocation.lng);
                }

                //all other pages - create map with all offices as markers
                else {
                //get map default position off canvas element
                    var c = $('#map-canvas'),
                        location;

                    //create map
                    //this.createMap(c.attr('data-lat'),c.attr('data-lng'),BW.config.Map.zoomLevel[c.attr('data-zoom-level')]);
                    //getting zoom level from content author as a string Fix for CR-1132 and CR-1174
                    this.createMap(c.attr('data-lat'),c.attr('data-lng'),parseInt(c.attr('data-zoom-level')));
                    // Get the Location Details from the hidden field
                    location = JSON.parse($('#location').attr('value'));
                    m.processOffices(location.Offices);




                    // Since we have moved the JSON into a hidden field in JSP, blocking the code below
                        //get offices from json
                        /*BW.helper.server.get({ url : '/etc/designs/bwpublic/offices.json.html' }, {
                            done : function () {
                                m.processOffices(BW.helper.jsonParse(arguments[0], {"Offices":{}}).Offices);
                            }
                        });

                    /* Get current map coords used for region setup
                    $('.page-header').on('click', 'h1', function(e) {
                    }); */

                }
            }

            /* create new map - optional center on office */
            this.createMap = function(lat, lng, zoom) {
                var mapOptions = BW.config.Map.defaultOptions;

                //center map and zoom level
                mapOptions.center = new google.maps.LatLng(lat,lng);
                mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                mapOptions.zoom = zoom;

                //level of detail based on zoom level
                if(zoom < 5) mapOptions.styles = BW.config.Map.outlineMapStyle;
                else if (zoom < 12) mapOptions.styles = BW.config.Map.simpleMapStyle;
                else mapOptions.styles = BW.config.Map.detailedMapStyle;

                //create map
                this.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                //set up map styles
                this.map.mapTypes.set('outline', new google.maps.StyledMapType(BW.config.Map.outlineMapStyle, {name: "Outline Map"}));
                this.map.mapTypes.set('simple', new google.maps.StyledMapType(BW.config.Map.simpleMapStyle, {name: "Simple Map"}));
                this.map.mapTypes.set('detailed', new google.maps.StyledMapType(BW.config.Map.detailedMapStyle, {name: "Detailed Map"}));

                //catch zoom change to increase or decrease map detail
                google.maps.event.addListener(this.map, 'zoom_changed', function() {
                    var zoomLevel = m.map.getZoom();
                    if(zoomLevel < 5) m.map.setMapTypeId('outline');
                    else if (zoomLevel < 12) m.map.setMapTypeId('simple');
                    else m.map.setMapTypeId('detailed');
                });

                var $mapZoomIn = $('#map-zoomin'),
                    $mapZoomOut = $('#map-zoomout');

                //zoom map with custom style buttons
                $mapZoomIn.on('click', function () { m.map.setZoom(m.map.getZoom() + 1); });
                $mapZoomOut.on('click', function () { m.map.setZoom(m.map.getZoom() - 1); });

                //zoom map with tab and enter key for accessibility
                $mapZoomIn.on('keyup', function(e) {
                    if (e.which == 13) {
                        $(this).trigger("click");
                    }
                });

                $mapZoomOut.on('keyup', function(e) {
                    if (e.which == 13) {
                        $(this).trigger("click");
                    }
                });
            }

            /* Add marker to map */
            this.addMarker = function (name, lat, lng) {
                var latlng = new google.maps.LatLng(lat,lng);
                this.marker = new google.maps.Marker({
                    icon: new google.maps.MarkerImage(BW.AuthMode + BW.config.Map.ImagePath.Marker,
                        new google.maps.Size(32,48),
                        new google.maps.Point(0,0),
                        new google.maps.Point(16,48)
                        ),
                    position: latlng,
                    shape: {  coord: [21,0,23,1,25,2,26,3,27,4,28,5,29,6,29,7,30,8,30,9,31,10,31,11,31,12,31,13,31,14,31,15,31,16,31,17,31,18,31,19,31,20,30,21,30,22,30,23,29,24,29,25,28,26,28,27,27,28,27,29,26,30,25,31,25,32,24,33,24,34,23,35,22,36,22,37,21,38,20,39,20,40,19,41,18,42,18,43,17,44,16,45,19,46,20,47,12,47,13,46,15,45,14,44,13,43,12,42,12,41,11,40,11,39,10,38,9,37,9,36,8,35,7,34,7,33,6,32,6,31,5,30,4,29,4,28,3,27,3,26,2,25,2,24,1,23,1,22,1,21,0,20,0,19,0,18,0,17,0,16,0,15,0,14,0,13,0,12,0,11,0,10,1,9,1,8,2,7,2,6,3,5,4,4,5,3,6,2,8,1,10,0,21,0],
                        type: 'poly' },
                    map: this.map,
                    title: name
                });
            }

            /* Get the office name and coords from HTML */
            this.getOfficeLocation = function () {
                var $locality = $('.locality');

                var officeLocation = {
                    street: $('.street-address').text(),
                    lat: $locality.attr('data-lat'),
                    lng: $locality.attr('data-lng')
                };
                return officeLocation;
            }

            /* add all office markers to map */
            this.processOffices = function(offices) {
                //array to store markers in
                var markers = [];

                // loop through office object and create marker for each office
                for (var o in offices) {
                    var office = offices[o],
                        title = o,
                        latlng = new google.maps.LatLng(office['latlng'][0], office['latlng'][1]);

                    var marker = new google.maps.Marker({
                        icon: new google.maps.MarkerImage(BW.AuthMode + BW.config.Map.ImagePath.Marker,
                            new google.maps.Size(32,48),
                            new google.maps.Point(0,0),
                            new google.maps.Point(16,48)
                        ),
                        position: latlng,
                        shape: { coord: [21,0,23,1,25,2,26,3,27,4,28,5,29,6,29,7,30,8,30,9,31,10,31,11,31,12,31,13,31,14,31,15,31,16,31,17,31,18,31,19,31,20,30,21,30,22,30,23,29,24,29,25,28,26,28,27,27,28,27,29,26,30,25,31,25,32,24,33,24,34,23,35,22,36,22,37,21,38,20,39,20,40,19,41,18,42,18,43,17,44,16,45,19,46,20,47,12,47,13,46,15,45,14,44,13,43,12,42,12,41,11,40,11,39,10,38,9,37,9,36,8,35,7,34,7,33,6,32,6,31,5,30,4,29,4,28,3,27,3,26,2,25,2,24,1,23,1,22,1,21,0,20,0,19,0,18,0,17,0,16,0,15,0,14,0,13,0,12,0,11,0,10,1,9,1,8,2,7,2,6,3,5,4,4,5,3,6,2,8,1,10,0,21,0],
                            type: 'poly' },
                        title: name,
                        url: office['url']
                    });
                    markers.push(marker);

                    //add click event listener to marker
                    google.maps.event.addListener(marker, 'click', function() {
                        m.processOfficeOverlay(this.url);
                    });
                }

                //add object to contain all office detail overlays
                this.officeOverlays = {};

                // style for marker cluster
                var clusterStyle = [{
                    url: BW.AuthMode + BW.config.Map.ImagePath.Cluster,
                    height: 51,
                    width: 53,
                    anchor: [0, 0],
                    textColor: '#007eb6',
                    textSize: 13
                }];
                // add markers to marker clusterer
                var markerCluster = new MarkerClusterer(this.map, markers,{gridSize: 30, maxZoom: 15, averageCenter: true, styles: clusterStyle});
            }

            /* redraw map at new location */
            this.updatelocation = function(lat, lng, zoom) {
                var latlng = new google.maps.LatLng(lat, lng);
                this.map.panTo(latlng);
                this.map.setZoom(BW.config.Map.zoomLevel[zoom]);
            }

            /* add office detail overlay to map triggered on marker click event */
            this.processOfficeOverlay = function(url) {

                // Close all the opened Office Overlay
                $('.office-overlay').addClass('hide');

                // if office overlay has already been created just display it
                if (this.officeOverlays[url]) {
                    this.officeOverlays[url].div.removeClass('hide');
                }

                // else get office data and create it
                else {
                    this.officeOverlays[url] = {};

                    // extract office details from office details page
                    var callback = {
                        done : function (response, o) {
                            response = $(response);
                            m.officeOverlays[url].header = response.find('.page-header h1').text();
                            m.officeOverlays[url].tel = response.find('#officeTelephone').val();
                            m.officeOverlays[url].addr = response.find('.vcard').html();
                            m.officeOverlays[url].img = response.find('.office-image').html();
                            // Title for the Details
                            m.officeOverlays[url].titleAddr = response.find('#titleAddress').val();
                            m.officeOverlays[url].titlePhone = response.find('#titleTelephone').val();
                            m.officeOverlays[url].titleDir = response.find('#titleDirection').val();
                            m.addOfficeOverlay(m.officeOverlays[url], url);
                        }
                    }
                    // Get the office detail page
                    BW.helper.server.get({ "url" : url }, callback);
                }
            }

            //create HTML for office overlay and append to contact page.
            this.addOfficeOverlay = function(o, url) {
                var e = $('<div />', { 'class': 'office-overlay', 'data-url': url });
                var close = $('<span />', { 'class': 'close', text:'x'});
                e.append(close);
                e.append('<h2>'+ o.header +'</h2>');
                e.append(o.img);

                // Check if the telephone field is empty
                if (o.tel != "" || o.tel.length > 0) {
                    e.append('<h3>'+ o.titlePhone + '</h3>');
                    e.append('<p>' + o.tel + '</p>');
                }

                e.append('<h3>' + o.titleAddr  +' </h3>');
                e.append(o.addr);
                e.append($("<a />", { href: url, text: o.titleDir }));

                $(close).click(function() {
                    e.addClass('hide');
                });

                $("#map-container").append(e);
                //store overlay so doesn't have to be reprocessed
                m.officeOverlays[url].div = e;
            }

        }
        return new Map();
    }());


}(window.BW = window.BW || {}, jQuery));