(function (BW, $, undefined) {


    /* ========================================================================
     13:         Lightbox
     Description: Deals with Lightbox functionality

     Templates:
     Components:
    ======================================================================== */
    BW.Lightbox = (function () {

        // Lightbox implemented using PrettyPhoto
        //  (http://www.no-margin-for-errors.com/projects/prettyphoto-jquery-lightbox-clone/)

        var Lightbox = function () {

            var _size,
                    _customClass,
                    _callback,
                    _lightboxSettings;

            // Init prettyPhoto and get the required element sizes
            this.init = function() {
                var l,
                        temp;

                // className of lightbox content element
                _customClass = 'video-lightbox-hole';

                l = this;

                _lightboxSettings = {
                    deeplinking : false, // stops prettyPhoto from changing the url hash
                    show_title : false, // hides title
                    theme : 'dark_square',
                    social_tools : '', // gets rid of the default "tweet" and "share" buttons
                    custom_markup : '<div class="' + _customClass + '"></div>',
                    changepicturecallback : function () { l.change(); }, // callback on change
                    callback : function () { l.close(); } // callback on close
                };

                // This is to get the size of the video element required from the CSS - the size does not need to be declared here
                temp = $('<div style="display: none"><div class="' + _customClass + '"></div></div>');
                temp.appendTo($('body'));
                _size = {
                    width : parseInt(temp.children('div').css('width')),
                    height : parseInt(temp.children('div').css('height'))
                };
                temp.remove();
                temp = null;
            }

            // Open the lightbox
            this.open = function (suppliedCallback) {
                // if supplied, callback runs when the lightbox has finished opening
                _callback = (suppliedCallback) ? suppliedCallback : null;
                // code to open lightbox using the custom markup supplied
                $.prettyPhoto.open('?custom=true&width=' + _size.width + '&height=' + _size.height);
            }

            // change callback
            this.change = function () {
                BW.helper.debug('Lightbox open / change');
             if (_callback) { _callback.call(this, this.content()); }
                _callback = null;
            }

            // close callback
            this.close = function () {
                BW.helper.debug('Lightbox close');
            }

            // return the content element
            this.content = function () {
             return $('.' + _customClass);
            }

            // replace the contents of the content element
            this.replaceContent = function (htmlContent) {
                this.content().html(htmlContent);
                return this.content();
            }

            // Connect a link to the Lightbox
            this.connect = function(link) {
                //fixing BWP-1154 and 1249 vedio not playing the second time
                //link.prettyPhoto(_lightboxSettings);
                $(this).prettyPhoto(_lightboxSettings);
            }

            // returns the _size object
            this.size = function() {
                return { "width" : _size.width, "height" : _size.height };
            }

            this.init();

        }
        return new Lightbox();
    }());


}(window.BW = window.BW || {}, jQuery));