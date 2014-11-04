/*!
* helper.bw.js
* Helper functions
* 
* @project   Barclays Wealth
* @date      2012-09-19
* @authors   John Payne, SapientNitro <jpayne@sapient.com>
             Eesha Dabral, SapientNitro <edabral@sapient.com>
* @licensor  Barclays
* @site      Barclays Wealth
*
*/

(function (BW, $, undefined) {
	/*
     * Singletons serve as a namespace provider which isolate implementation code
     * from the global namespace so as to provide a single point of access for functions,
     * this is useful for organizing code into logical sections.
     * It is possible to put parentheses around this structure to instantiate it immediately after it's parsed.
     * This way it's always present when the script is executed and doesn't have to be instantiated separately.
	*/
    BW.helper = (function () {
			function _helper() {
				/*
				* Object of the current object
				*/
				var _this = this;
	
				//add helper functions here
				
				// Abstracted out the ajax functions to here
				this.server = (function () {
  				var server = function () {
  				  this.connSettings = function (options) {
              $.ajaxSetup(options || (BW.config.Server || {}));
            }
            this.get = function (data, callback) {
              var c = {
                done : (function () {}),
                fail : (function () {}),
                always : (function () {})
              }
            
              if (callback && callback.apply) {
                c.done = callback;
              } else if (callback && !callback.apply) {
                for (f in c) {
                  if (callback[f]) { c[f] = callback[f] }
                }
              }
              
              if (typeof(data) == "string") { data = { "data" : data }; }
            
              var jqxhr = $.ajax(data)
                .done(function() {
                  c.done(arguments[0], this);
                })
                .fail(function() {
                  BW.helper.debug("Server request fail", arguments);
                  c.fail(arguments[0]);
                })
                .always(function() { c.always(arguments[0]) });
            }       
            this.connSettings();    				
  				}
  				return new server();
				}());
				
				this.jsonParse = function(json, fallback) {
  				var result = fallback;
  				try {
    				result = JSON.parse(json);
  				} catch(e) {
    				BW.helper.debug('jsonParse error', e);
  				}
  				return result;
				}
	
				// This is to get the computedStyle of an element
				this.getStyle = function(oElm, strCssRule){
          var strValue = '';
          if (document.defaultView && document.defaultView.getComputedStyle) {
            // !IE     
            return document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
          } else if (oElm.currentStyle) {
            // IE
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
              return p1.toUpperCase();
            });
            return oElm.currentStyle[strCssRule];
          }
        }
        
        // This converts a js camelCase style to a CSS version, with prefixes if supplied
        this.jsStyleToCSSStyle = function(s) {
          s = s.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
          return s;
        }
        
        /*
          Helper function checks an element to find the length of a CSS transition
          assigned to it, then calls the callback with or without a timeout
        */
        this.cssDelayCallback = function(element, callback) {
          var delay;
          if (Modernizr.csstransitions) {
            var term = Modernizr.prefixed('transition-duration') || 'transition-duration';
            var transitionDuration = BW.helper.jsStyleToCSSStyle(term);
            var cssDelay = BW.helper.getStyle(element, transitionDuration);
            delay = (!!parseFloat(cssDelay)) ? parseInt(parseFloat(cssDelay) * 1000) : 0;   
          }
          
          if (delay) {
            var l = this;
            setTimeout(function () { callback(); }, delay);
          } else {
            callback();
          }
        }
        
        /*
          This will sort an array based on s.match(term). term is a string, but is
          put into a new regexp before running, so you could supply a more complicated
          regexp in string form.
          Strings with more matches get pushed to the front of the array, lower ones to the end.
          If alphaFallback, it will sort the array alphabetically first.
        */        
        this.sortArrayByMatches = function(s, term, alphaFallback) {
          // sort into alphabetical order as a fallback
          if (alphaFallback) { s = s.sort(); }
              
          // we should increase the complexity of this - maybe allow a regexp or array as well as just a string
          var r = new RegExp(term,'gi')
          return s.sort(function(a,b) {
            //compare a and b and return -1, 0, or 1
            var am = (a.match(r) || []).length;
            var bm = (b.match(r) || []).length;
  
            if (am > bm) {
                return -1;           
            } else if (am == bm) {
                return 0;
            } else {
                return 1;
            }
          });
        }

        /* Functionality: Strip HTML and Trim Content */
        this.trimContent = function(text, count, marker) {
			var curElem,
				counter,
				strippedText,
				strippedTextSize,
				trimmedText;

			// Strip Down :-P
			strippedText = text;
			strippedTextSize = strippedText.length;
			if (strippedTextSize > count) {
				trimmedText = strippedText.substring(0, count).split(" ").slice(0, -1).join(" ");
				strippedText = trimmedText + ' ' + ' ' + marker;
			} 
			return(strippedText);
		}

        this.history = (function () {
          var H = function () {
          
            this.init = function () {
              var h = this;
              if (Modernizr.history) {
                $(window).bind("popstate", function (e) { return h.pop(); });
              }
            }
          
            this.push = function (state, title, url) {
              if (Modernizr.history && history.pushState) {
                history.pushState(state, title, url);
              }
            }
            
            this.pop = function () {
              return (history.location || document.location).href
            }

            this.init();
            
          }
          return new H();
        }());
        
        /*
          This function can be used to find the x/y offset of an element once it's moved
          along the Z axis using translateZ
          
          eg:
            the element (e) has a top relative to the parent's transform-origin point of -500px (ax = -500)
            e's parent has a perspective of 1000px (bz = 1000)
            e has been pushed to -600px on the Z axis (z = -600)
          
            az is then bz + z * -1, in this case: 1000 + (-600 * -1) = 1600
            the function will return -312.5 (-500 * 1000 / 1600 = -312.5)

            The element appears to be offset vertically -312.5px from the origin,
            whereas originally it was offset -500px, the difference between the two number
            is what you'll need to add to the old top value to get the equivalent new value.
          
          As this is 3d, X and Y can be used interchangeably
          I will refer to only X in the comments
        */
        this.getAxisOffsetFrom3dTransform = function(ax, z, bz) {
          var az,
              bx;
          // ax is the original distance of the object from the transform origin point on the x-axis
          // z is the translateZ distance
          // bz is the perspective distance
          // az is the perspective distance + the negative of the z-tranform distance
          az = bz + z * -1;
          
          bx = ax * bz / az;
          
          return bx;     
        }
        
        // Contingency debug function if you want to use it instead of console.log
        // so it doesn't trigger errors in browsers without console & you can always
        // set a flag to disable console.log in the production version
        this.debug = function () {
          try {
            console.log(arguments);
          } catch(e) { }
        }

        // These are just to introduce a delay into the get
        this.server.debugGet = this.server.get;
        this.server.get = function (data, callback) {
          var x = this;
          var delay = 1;
          if (this.delay) { delay = this.delay; }
          try {
          if (data && data.data) { delay = 1; }
          } catch(e) {}
          setTimeout(function () { x.debugGet(data, callback) }, delay)
        }
        
        this.server.delay = 300;
        
        
        
				this.init = function () {
					return this; /*returning this from a method is a common way to allow "chaining" of methods together*/
				};
	
				return this.init(); /*this refer to BW.helper.init()*/
			}

		return new _helper(); /*creating a new object of helper rather then a funtion*/
    }());

/**
 * Check to evaluate whether 'BW' exists in the global namespace - if not, assign window.BW an object literal
 */
}(window.BW = window.BW || {}, jQuery));



/* Sapient helper functions
	 Add to above as requires
 */
				/*
							 * Replace multiple value in a single string.
							 * Accept two parameters str, hash
							 *		str : String on which replace operation is to be performed
							 *		hash : JSON object contain string to be replaced with there replaced value
							 * Return the new string at the end.
				*
				this.multiReplace = function (str, hash) {
					var key;
					for (key in hash) {
						if (Object.prototype.hasOwnProperty.call(hash, key)) {
							str = str.replace(new RegExp(key, 'g'), hash[key]);
						}
					}
					return str;
				};
	
				/* 
							 * Return the URI of site
							 * Return protocol, hostname and port if found
							 *
				*
				this.getDomain = function () {
					var port = "",
						url = "";
	
					if (window.location.port) {
						port = ":" + window.location.port;
					}
					url = window.location.protocol + "//" + window.location.hostname + port + "/";
					return url;
				};
	
				/*
							 * This method will return the query string from the URL of the website
							 * Accept two parameters key, default_
							 *		key : The name of the key who's value need to be fetch
							 *		default_ : The default value which will return when nothing will found or key does not exists.
							 *          If not pass anything then it will return blank value.
				*
				this.getQueryString = function (key, default_) {
					if (default_ === null) {
						default_ = "";
					}
	
					key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
					var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
						qs = regex.exec(window.location.href);
	
					if (qs === null) {
						return default_;
					} else {
						return qs[1];
					}
				};
	
				/*
							 * This method will check for blank value in the provided string
							 * This will return true if provided string contain blank value and false if not
				*
				this.isBlank = function (string) {
					var isNonblank_re    = /\S/;
					return String(string).search(isNonblank_re) === -1;
				};
	
	
				/*
							 * Store information in a cookie
							 * Accept three param name, value, days
				*
				var setCookie = function (name, value, days) {
					if (days) {
						var date = new Date();
						date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
						var expires = "; expires=" + date.toGMTString();
					} else {
						var expires = "";
					}
					document.cookie = name + "=" + value + expires + "; path=/";
				};
	
				/*
							 * Get cookie from user machine
							 * Accept one parameters name
							 *		name : name of the cookie
				*
				var getCookie = function (name) {
					var nameEQ = name + "=",
						i,
						ca = document.cookie.split(';');
					for (i = 0; i < ca.length; i += 1) {
						var c = ca[i];
						while (c.charAt(0) === ' ') {
							c = c.substring(1, c.length);
						}
						if (c.indexOf(nameEQ) === 0) {
							return c.substring(nameEQ.length, c.length);
						}
					}
					return null;
				};
	
	
				/*
							 * Erase or delete cookie from user machine
							 * Accept one parameters name
							 *		name : name of the cookie
				*
				var removeCookie = function (name) {
					setCookie(name, "", -1);
				};
	
				/*
							 * Store information to client machine
							 * Accept two parameters name, value
							 *		name : name of the localStorage
							 *		value : value for the localStorage
							 * Store information in HTML5 localstorage if available
							 * else store information in cookie
				*
				this.setInfo = function (name, value) {
					if (typeof window.localStorage !== 'undefined') {
						localStorage.setItem(name, value);
					} else {
						setCookie(name, value);
					}
				};
	
				/*
							 * Get information from client machine
							 * Accept two parameters name, checkCookie
							 *  name : name of the localstorage
							 *		checkCookie : This will either be true or false.
							 *            If set to true then scan cookie even if user system support localStorage
							 * Get information for HTML5 localstorage if available
							 * else get information from cookie
				*
				this.getInfo = function (name, checkCookie) {
					var value = "";
					if (typeof window.localStorage !== 'undefined') {
						value = localStorage.getItem(name);
					} else {
						value = getCookie(name);
					}
	
					if (checkCookie === true) {
						value = getCookie(name);
					}
					return value;
				};
	
				/*
							 * Remove information from client machine
							 * Accept two parameters name, checkCookie
							 *		name : name of the localstorage for removing it permanently
							 *		checkCookie : This will either be true or false.
							 *           If set to true then scan cookie and remove if found even if user system support localStorage
							 * Remove information for HTML5 localstorage if available
							 * else remove information from cookie
				*
				this.removeInfo = function (name, checkCookie) {
					if (typeof window.localStorage !== 'undefined') {
						localStorage.removeItem(name);
					} else {
						removeCookie(name);
					}
					if (checkCookie === true) {
						removeCookie(name);
					}
				};
			*/