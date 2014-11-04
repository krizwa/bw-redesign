(function (BW, $, undefined) {

/* ==================================================================
 17: Site Catalyst calls
 Description:

 Templates:
 Components:
 ==================================================================== */

    BW.SiteCatatlyst = (function () {
        var SiteCatatlyst = function () {

            var siteCatJsonObj,
                siteCatJsonStr = JSON.stringify(siteCatJsonObj),
                $body = $('body');

            this.init = function() {

                var metas = document.getElementsByTagName('meta'),
                    contentType,
                    contentName;

                for (var i in metas) {
                    if (metas[i].name == "adv-content-type") {
                        contentType = metas[i].content;
                    }
                    if (metas[i].name == "adv-content-name") {
                        contentName = metas[i].content;
                    }
                }

                this.eligibilityForm();

                this.footerIconsHandler();

                this.externalLinkHandler();

                this.addThisHandler();

                this.contactUsHandler();

                this.emailBrochureHandler();

                this.downloadBrochureHandler();

                this.printHandler();

                this.socialHandler();

            }

            this.eligibilityForm = function() {
                // site catalyst for online eligibility form
                if ($('#content-wrapper').hasClass('onlineform')) {
                    var metaFormStart = '<meta name="adv-form-start" content="{\'form-1\':\'1-eligibility\'}" />';
                    $('head').append(metaFormStart);
                }

                var onlineFormSubmit = $('#onlineFormSubmit').val();

                if (onlineFormSubmit == 'true') {
                    var metaFormSubmit = '<meta name="adv-form-complete" content="{\'form-1\':\'1-eligibility\'}" />';
                    $('head').append(metaFormSubmit);
                }
            }

            this.externalLinkHandler = function() {
                // on click of any external link in the website
                $('.external').on('click', function () {
                    var extservicename = $(this).text();

                    if (extservicename == '') {
                        extservicename = $(this).parent().attr('href');
                        extraLinkText = extservicename.replace(/^(http|https):\/\/(.){0,99}(\.com|\.net|\.org)/, '');
                        extservicename = extservicename.replace(extraLinkText, '').replace(/^(https|http):\/\//, '');
                    }

                    siteCatJsonObj = { "extservicename": extservicename };
                    getSiteCatContent('external', siteCatJsonStr);
                });
            }

            this.addThisHandler =  function() {
                // on click of any social share icons from add this plugin
                $body.on("click", ".addthis a", function(e) {

                    for (var i in metas) {
                        if (metas[i].name == "adv-content-type") {
                            contentType = metas[i].content;
                        }
                        if (metas[i].name == "adv-content-name") {
                            contentName = metas[i].content;
                        }
                    }

                    var shareClass = $(this).attr('class'),
                        shareType = null;

                    if (shareClass.indexOf("facebook") != -1) {
                        shareType = 'facebook';
                    } else if (shareClass.indexOf("twitter") != -1) {
                        shareType = 'twitter';
                    } else if (shareClass.indexOf("linkedin") != -1) {
                        shareType = 'linkedin';
                    } else if (shareClass.indexOf("google") != -1) {
                        shareType = 'google';
                    } else if (shareClass.indexOf("flickr") != -1) {
                        shareType = 'flickr';
                    } else if (shareClass.indexOf("vimeo") != -1) {
                        shareType = 'vimeo';
                    } else if (shareClass.indexOf("evernote") != -1) {
                        shareType = 'evernote';
                    } else if (shareClass.indexOf("stumbleupon") != -1) {
                        shareType = 'stumbleupon';
                    }

                    siteCatJsonObj = { "contenttype": contentType, "contentname": contentName, "sharetype": shareType };
                    getSiteCatContent('share', siteCatJsonStr);
                });
            }

            this.contactUsHandler = function() {
                $body.on('click','.contact-us a, .contact-us-wide a', function (e) {
                    var ctaType = null,
                        $microSiteName = $('#microSiteName');

                    if ($(this).attr('id') == '4-email-contact' || $(this).attr('id') == 'h4-email-contact') {
                        ctaType = '4-email-contact';
                    } else if ($(this).attr('id') == '3-online-contact' || $(this).attr('id') == 'h3-online-contact') {
                        ctaType = '3-online-contact';
                    } else if ($(this).attr('id') == '1-call-me-back' || $(this).attr('id') == 'h1-call-me-back') {
                        ctaType = '1-call-me-back';
                    } else if ($(this).attr('id') == '2-web-chat-request' || $(this).attr('id') == 'h2-web-chat-request') {
                        ctaType = '2-web-chat-request';
                    } else if ($(this).attr('id') == '4-email-contact-2nd' || $(this).attr('id') == 'h4-email-contact-2nd') {
                        if ($microSiteName.val() !== null &&  $microSiteName.val() !== "" && $microSiteName.val() === "bth") {
                            ctaType = '6-bth-apply';
                        } else {
                            ctaType = '9-int-apply';
                        }
                    } else if ($(this).attr('id') == 'cta-button-value' || $(this).attr('id') == 'h4-cta-button-value') {
                        if ($microSiteName.val() !== null &&  $microSiteName.val() !== "" && $microSiteName.val() === "bth") {
                            ctaType = '6-bth-apply';
                        } else {
                            ctaType = '9-int-apply';
                        }
                    } else if ($(this).attr('id') == 'cta-button2-value' || $(this).attr('id') == 'h4-cta-button2-value') {
                        if ($microSiteName.val() !== null &&  $microSiteName.val() !== "" && $microSiteName.val() === "bth") {
                            ctaType = '6-bth-apply';
                        } else {
                            ctaType = '9-int-apply';
                        }
                    }

                    siteCatJsonObj = { "ctatype": ctaType };

                    if (ctaType != null) {
                        getSiteCatContent('cta-click', siteCatJsonStr);
                    }
                });
            }

            this.footerIconsHandler = function() {
                // on click of social icons in footer and follow twitter link
                $('.footer-nav-icons a, .follow-twitter, .extnl, .jta-tweet-link, .share, #grid-blog a').on('click', function () {
                    var extservicename = $(this).text();

                    if (extservicename == '') {
                        extservicename = $(this).attr('href');
                        extraLinkText = extservicename.replace(/^(http|https):\/\/(.){0,99}(\.com|\.net|\.org)/, '');
                        extservicename = extservicename.replace(extraLinkText, '').replace(/^(https|http):\/\//, '');
                    }

                    siteCatJsonObj = { "extservicename": extservicename };
                    getSiteCatContent('external', siteCatJsonStr);

                });
            }

            this.emailBrochureHandler = function() {
                // Click on email Brochure link
                $('#dock-email').on('click', function(e) {
                    siteCatJsonObj = { "contenttype": contentType, "contentname": contentName, "interactiontype": "email" };
                    getSiteCatContent('content', siteCatJsonStr);
                });
            }

            this.downloadBrochureHandler = function() {
                // Click on download Brochure link
                $('#downloadBrochure').on('click', function(e) {
                    siteCatJsonObj = { "contenttype": contentType, "contentname": contentName, "interactiontype": "download" };
                    getSiteCatContent('content', siteCatJsonStr);
                });
            }

            this.printHandler = function() {
                // Click on print link
                $('.social-print a').on('click', function(e) {
                    siteCatJsonObj = { "contenttype": contentType, "contentname": contentName, "interactiontype": "print" };
                    getSiteCatContent('content', siteCatJsonStr);
                });
            }

            this.socialHandler = function() {
                // Click on social email link
                $('.social-email a').on('click', function(e) {
                    siteCatJsonObj = { "contenttype": contentType, "contentname": contentName, "interactiontype": "email" };
                    getSiteCatContent('content', siteCatJsonStr);
                });
            }

        }
        return new SiteCatatlyst();
    }());

} (window.BW = window.BW || {}, jQuery));