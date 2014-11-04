(function (BW, $, undefined) {

    /* ========================================================================
     14:         Video
     Description: Deals with loading and playing videos

     Templates:
     Components:
    ======================================================================== */
    BW.Video = (function () {
        var Video = function () {

            var _playerData,
                        _videoPlayerKey = BW.config.Video.BrightcoveCredentials.playerKey,
                        _videoPlayerId = BW.config.Video.BrightcoveCredentials.playerID;

            //plays video inline inside an article
            this.init = function () {
                var v,
                        inlineVideo,
                        videoID;

                // Get ID information for Brightcove
                _playerData = BW.config.Video.BrightcoveCredentials;

                var inlineVideo = $('div[data-video-id]'); // assumes max 1 Inline video per page
                if (inlineVideo.length) {
                    var videoID = inlineVideo.attr('data-video-id');
                    inlineVideo.append($(this.templateInline(videoID, inlineVideo)));
                }

                v = this;

                // Handle video links
                $('.page-wrapper').on('click', '[data-video-id]', function (e) {
                        var curVideoPlayerKey = $(this).attr('data-video-player-key'),
                                curVideoPlayerId = $(this).attr('data-video-player-id');
                        // if Video Player Key is content authored and available?
                    if (curVideoPlayerKey !== "" || curVideoPlayerKey !== null || curVideoPlayerKey !== undefined) {
                        _videoPlayerKey = curVideoPlayerKey;
                    }

                    // if Video Player Id is content authored and available?
                    if (curVideoPlayerId !== "" || curVideoPlayerId !== null || curVideoPlayerId !== undefined) {
                        _videoPlayerId = curVideoPlayerId;
                    }

                    if (!$(this).attr('data-video-id')) { return true; }
                    e.preventDefault();
                    v.OpenLightbox($(this).attr('data-video-id'), $(this));
                    var lightboxtop = $('.pp_pic_holder').css('top').replace('px','') - 200;
                    $('.pp_pic_holder').css('top',lightboxtop+'px');
                });
            }

            // Open the Lightbox and load the supplied VideoID
            this.OpenLightbox = function (videoID, link) {
                var c,
                        v;

                if (!videoID) { return; }

                c = this.templateLightbox(videoID);
                v = this;
                BW.Lightbox.connect(link);

                BW.Lightbox.open(function (o) {
                    BW.Lightbox.replaceContent(c);
                    v.Go(o);
                });
            }

            // Brightcove template information from:
            // http://developer.brightcove.com/en/articles/dynamically-loading-player-using-javascript
            // The width/height and credentials are subbed in, as well as the video ID
            this.templateLightbox = function (videoID) {
                var size = BW.Lightbox.size();
                return this.template(videoID, size.width, size.height, true);
            }

             this.templateInline = function (videoID, element) {
                return this.template(videoID, Math.ceil($(element).width()), Math.ceil($(element).height()), false);
            }

            this.template = function (videoID, width, height, autoplay) {
                return '<div style="display:none"></div><object id="myExperience' + videoID + '" class="BrightcoveExperience" ><param name="bgcolor" value="#64AAB2" /><param name="width" value="' + width + '" /><param name="height" value="' + height + '" /><param name="secureConnections" value="true" /><param name="playerID" value="' + _videoPlayerId + '" /><param name="playerKey" value="' + _videoPlayerKey + '" /><param name="isVid" value="true" /><param name="isUI" value="true" /><param name="dynamicStreaming" value="true" /><param name="@videoPlayer" value="' + videoID + '" /><param name="templateLoadHandler" value="BCL.onTemplateLoaded"/><param name="autoStart" value="' + autoplay + '" /></object>';
            }

            // Make video happen!
            this.Go = function () {
                brightcove.createExperiences();
            }

            $(document).ready(function () { BW.Video.init(); })

        }
        return new Video();
    }());


}(window.BW = window.BW || {}, jQuery));