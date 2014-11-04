/*!
* config.bw.js
* Configuration file containing site wide settings and variables
* 
* @project   Barclays Wealth
* @date      2012-09-19
* @authors   John Payne, SapientNitro <jpayne@sapient.com>
             Eesha Dabral, SapientNitro <edabral@sapient.com>
             Wayne Durack, SapientNitro <wdurack@sapient.com>
* @licensor  Barclays
* @site      Barclays Wealth
*
*/

(function (BW, undefined) {
  //namespace object
  var BWConfig = {
    //add config methods and properties here
    Search : {
      Container : '#search-container',
      Form : '#search-form',
      Query : '#search-query',
      SuggestionHole : '#suggestions',
      minCharsForSearch : 3,
      SearchPaginationCounter: 1
    },

    Filter : {
      maxArticlesPerPage : 5
    },

		Dock : {
			url: 'miscellaneous/lightbox.dockjson.html',
      removeDockItemsMsg: 'Do you want to remove all items from your dock?'
		},
		
		Tour: {
			delay: 3000
		},

    Map : {
      defaultOptions : {
        mapTypeControl: false,
        scrollwheel: false,
        streetViewControl: false,
        panControl: false,
        minZoom: 2,
        zoomControl: false
      },
      detailedMapStyle : [
        {
          "stylers": [
            { "saturation": -100 },
            { "visibility": "simplified" }
          ]
        },{
          "featureType": "landscape",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "administrative",
          "stylers": [
            { "visibility": "on" }
          ]
        },{
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road",
          "stylers": [
            { "visibility": "on" }
          ]
        },{
          "featureType": "transit",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "transit.station",
          "stylers": [
            { "visibility": "on" }
          ]
        }
      ],
      simpleMapStyle : [
        {
          "stylers": [
            { "saturation": -100 },
            { "visibility": "simplified" }
          ]
        },{
          "featureType": "landscape",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "administrative",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "administrative.country",
          "stylers": [
            { "visibility": "on" }
          ]
        },{
          "featureType": "administrative.province",
          "stylers": [
            { "visibility": "on" }
          ]
        },{
          "featureType": "administrative.locality",
          "stylers": [
            { "visibility": "on" }
          ]
        },{
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "transit",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ],
      outlineMapStyle : [
        {
          "stylers": [
            { "saturation": -100 },
            { "visibility": "simplified" }
          ]
        },{
          "featureType": "landscape",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "administrative",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "poi",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "transit",
          "stylers": [
            { "visibility": "off" }
          ]
        }
      ],
      zoomLevel : {
        world: 2,
        largeRegion: 3,
        smallRegion: 4,
        country: 7,
        city: 10,
        office: 15
      },
      ImagePath : {
        Marker: '/etc/designs/bwpublic/img/map-marker-office.png',
        Cluster: '/etc/designs/bwpublic/img/map-marker-cluster.png'
      }
    },

    JSPath : {
      sCode: '/etc/designs/bwpublic/js/s_code.js'
    },
	
	MicroSiteJSPath : {
	  sCode: '/etc/designs/bwpublic/js/bth/s_code.js'
	},

    Server : {
      /*url : 'T208-Search-Results.shtml',*/
      dataType : 'html',
      type : 'GET'
    },

    Video : {
      
      // These are the default developer testing credentials from:
      // http://developer.brightcove.com/en/articles/dynamically-loading-player-using-javascript
      // I'm assuming they'll need to be replaced by actual account information

      BrightcoveCredentials : {
        playerID : "2250788427001",
        playerKey : "AQ~~,AAABchwNdwE~,cGR7_6ohwTNSu4nHAGzF9OTBNUAhHfdv"
      }
    },

    ContactForm: {
      SelectCountryLbl: "Select Country",
      SelectServicesLbl: "Select Services"
    }
  };

  //expose the object to global scope.
  BW.config = BWConfig;

/**
 * Check to evaluate whether 'BW' exists in the global namespace - if not, assign window.BW an object literal.
 */
}(window.BW = window.BW || {}));