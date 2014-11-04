(function (BW, $, undefined) {

    /* =======================================================================
     12:         Cookies
     Description: Shows the Cookie Settings / Warning in a lightbox

     Templates:
     Components: T101
    ======================================================================== */
    BW.CookieSettings = (function () {
        var CookieSettings = function () {

            var _container,
                _background,
                $cookieMessage = $('#cookieMessage'),
                $body = $('body'),
                $dockContainer = $('#dock-container'),
                $updateCookie = $('#update-cookie'),
                $websitePath = $('#website-path'),
                $microSiteName = $('#microSiteName'),
                l,
                section,
                sectionHeading,
                sectionBtnAccept,
                sectionBtnDeny,
                previousLink;

            this.init = function() {

                _background = $('.cookie-popup-background');
                _container = $('.cookie-popup');

                l = this;

                // Search Result Page
                if ($('#searchResultsCount').length > 0 ) {
                    adv_int_search_results = $('#searchResultsCount').val();
                }

                l.checkCookie();

                l.isCookieRequired();

                /** BEGIN Handlers **/

                l.cookieCloseHandler();

                l.saveCookieSettingsHandler();

                l.openCookieOverlay();

                l.acceptCookieHandler();

                l.denyCookieHandler();
                /** END Handlers **/

            }

            this.isCookieRequired = function() {
                 // Cookie Section Requied?
                if ($.trim($('#cookieSection').val()) == "true"  && $('.search-results').length != 1 ) {
                    section = $("meta[name=adv-site-section]").attr('content');

                    /* Get the Content from the Hidden Fields */
                    sectionHeading = $('#sectionHeading').val();
                    sectionBtnAccept = $('#sectionBtnAccept').val();
                    sectionBtnDeny = $('#sectionBtnDeny').val();

                    $.ajax({
                        url: $websitePath.val() + 'miscellaneous/lightbox.sectioncookie.html?section=' + section,
                        cache: false,
                        async: false,
                        success:function(data) {
                            if ($.trim(data) != "true") {
                                _container
                                    .empty()
                                    .append('<div class="cookie-settings update-cookie" id="update-cookie"><h2>' + sectionHeading + '</h2><div class="cookie-policy">' +
                                        data + '<a class="button" id="deny-complaince" href="#">' + sectionBtnDeny + '</a><a class="button" id="accept-complaince" href="#">' + sectionBtnAccept + '</a></div></div>');
                                $updateCookie.removeClass('show');
                                l.open($('.cookie-settings.update-cookie'));
                            }
                        }
                    });
                }
            }


            this.cookieCloseHandler = function() {
                // On click of the 'Close' button in the Cookie Policy Message
                $body.on('click', '#cookieAccepted', function (e) {
                    e.preventDefault();
                    l.checkCookie();
                    $cookieMessage.hide();
                    $dockContainer.removeClass('dock-cookie-overlay');
                });
            }

            this.saveCookieSettingsHandler = function() {
                 // Save Cookie Settings
                $body.on('click','#save-cookie-settings', function (e) {
                     var rejectedcookies = null;
                     e.preventDefault();

                    if ($('input:radio[name=performance]:checked').val() == 'disabled' ) {
                        rejectedcookies = 'performance';
                    }

                    if ($('input:radio[name=functionality]:checked').val() == 'disabled') {
                        if (rejectedcookies == null) {
                            rejectedcookies = 'functionality';
                        } else {
                            rejectedcookies = rejectedcookies + '|' + 'functionality';
                        }
                    }

                    if ($('input:radio[name=targeting]:checked').val() == 'disabled' ) {
                        if (rejectedcookies == null) {
                            rejectedcookies = 'targeting';
                        } else {
                            rejectedcookies = rejectedcookies + '|' + 'targeting';
                        }
                    }

                    var siteCatJsonObj = { "rejectedcookies" : rejectedcookies };
                    var siteCatJsonStr = JSON.stringify(siteCatJsonObj);
                    getSiteCatContent('cookies',siteCatJsonStr);

                    $.ajax({
                        url: $websitePath.val() + 'miscellaneous/lightbox.cookie.html',
                        cache: false,
                        data: {
                            'microSiteName': $microSiteName.val(),
                            'performance': $('input[name=performance]:checked').val(),
                            'functionality': $('input[name=functionality]:checked').val(),
                            'targeting': $('input[name=targeting]:checked').val()
                        },
                        success:function (data) {
                            l.updateCookie(data);
                        }
                    });

                     //not sure what we are supposed to do.
                    l.close();
                });
            }

            this.openCookieOverlay = function() {
                // Open the overlay to Update Cookie Settings on click of the link in Footer
                $body.on('click', 'a.change-cookie-setting, #footer-cookie-settings, #footer-cookie-settings-2', function (e) {
                    e.preventDefault();
                    $.ajax({
                        url: $websitePath.val() + 'miscellaneous/cookie-setting.lightbox.html',
                        cache: false,
                        type: 'GET',
                        success:function(data){
                            _container
                                .empty()
                                .append(data);

                            $updateCookie.removeClass('show');
                            l.showCookieSettings();
                        }
                    });

                    $('html, body').animate({ scrollTop: $('#cookie-setting-option') }, 0);
                    return false;
                });
            }

            this.acceptCookieHandler = function() {
                // Accept Section Cookie
                $body.on('click','#accept-complaince', function (e) {
                    l.close();
                    $.ajax({
                        url: $websitePath.val() + 'miscellaneous/lightbox.sectioncookie.html?section=' + section + '&cookieAccepted=true',
                        cache: false,
                        async: false
                    });

                    e.preventDefault();
                });
            }

            this.denyCookieHandler = function() {
                // Deny Section Cookie
                $body.on('click','#deny-complaince', function (e) {
                    previousLink = document.referrer;
                    if (previousLink !== "") {
                        window.location.href = previousLink;
                    } else {
                        window.location.href = BW.GlobalPath + "home.html";
                    }

                    e.preventDefault();
                });
            }

             // Cookie Available?
            this.checkCookie = function () {
                var l = this;

                $.ajax({
                    url: $websitePath.val() + 'miscellaneous/lightbox.cookie.html',
                    cache: false,
                    async: false,
                    data:{
                        'microSiteName': $microSiteName.val()
                    },
                    success: function(data) {
                        l.updateCookie(data);
                    }
                });

            }

            // Update the Cookies
            this.updateCookie = function (data) {
                var l = this,
                    getGuideTourDelay = $('#guideTourDelay').val(),
                    guideTourDelay = typeof (getGuideTourDelay) === 'number' ?  getGuideTourDelay : BW.config.Tour.delay,
                    data = jQuery.parseJSON(data),
                    cookieGlobal = (data.cookieSettings && data.cookieSettings.isMasterCookieAvailable) || false,
                    cookieFunctionality = (data.cookieSettings && data.cookieSettings.isFunctionalityCookieAllowed) || false,
                    cookiePerformance = (data.cookieSettings && data.cookieSettings.isPerformanceCookieAllowed) || false,
                    cookieTarget = (data.cookieSettings && data.cookieSettings.isTargetingCookieAllowed) || false,
                    cookieFirstTime = (data.cookieSettings && data.cookieSettings.isFirstTimeUser) || false,
                    micrositeComplianceTextRaw = data.micrositeComplianceText;

                //complaince popup for moving away from microsite BWP-1259
                $('a').on('click', function(e) {
                    var alink = $(this).attr('href');

                    if ( alink && alink.length > 0 ) {
                        var isExternal = ((alink.indexOf('//') == 0 || alink.indexOf('http') == 0) && alink.indexOf(location.host) == -1)
                        var isHash = alink.indexOf('#') == 0,
                            isJavaScript = alink.indexOf('javascript') == 0,
                            isDAMpdfLink = alink.indexOf('/content/dam/bwpublic/') != -1,
                            isOtherMicrosite = alink.indexOf($(websiteLanguage).val()) == -1,
                            complianceAvailable = $(micrositeComplianceTextRaw) && $.trim($(micrositeComplianceTextRaw).text()).length > 0;

                        if (complianceAvailable && !isHash && !isJavaScript && !isDAMpdfLink && (isExternal || (!isExternal && isOtherMicrosite ))) {
                            e.preventDefault();
                            _container.empty()
                                .append('<div class="cookie-settings update-cookie" id="update-cookie"><h2>' + 'Warning' + '</h2><div class="cookie-policy">' + micrositeComplianceTextRaw + '<a class="button" id="deny-microsite" href="#">' + 'deny' + '</a><a class="button" id="accept-microsite" href="' + this.href + '" target="' + this.target + '">' + 'accept' + '</a></div></div>');
                            $updateCookie.removeClass('show');
                            l.open($('.cookie-settings.update-cookie'));
                            $('html, body').animate({ scrollTop: $updateCookie },0);
                            return false;
                        }
                    }
                });

                $body.on('click', '#deny-microsite', function (e) {
                    l.close();
                });

                $body.on('click', '#accept-microsite', function (e) {
                    l.close();
                });

                // Demo Tour? - Yes, if the user is on the home page and first time
                if ($('#page-home').length !== 0 && cookieFirstTime === true) {
                    setTimeout(function() {
                        guiders.show('guideWelcome');
                    }, guideTourDelay);
                }

                 // First Time User?
                if (cookieFirstTime === true) {
                    // Show the Cookie Policy Message
                    $dockContainer.addClass('dock-cookie-overlay');
                    $cookieMessage.show();
                    // Attach this event on 'Add to Dock' to enable the Cookie
                } else {
                    // Hide the Cookie Policy Message
                    $dockContainer.removeClass('remove');
                    $cookieMessage.hide();
                }

                // Check if the Global Cookie is available?
                if (cookieGlobal === true) {
                    // Update the Cookie Value in the hidden fields
                    $('#cookieFunctionality').val(cookieFunctionality);
                    $('#cookiePerformance').val(cookiePerformance);
                    $('#cookieTarget').val(cookieTarget);
                    $('#cookieFirstTime').val(cookieFirstTime);
                    BW.cookiePerformance = cookiePerformance;
                }

                var $dockAlertCookie = $('.dock-alert-cookie'),
                    $dockMessageCookie = $('#dock-message-cookie'),
                    $guideWelcome = $('#guideWelcome'),
                    $guideSearch = $('#guideSearch'),
                    $guideAddItem = $('#guideAddItem'),
                    $guideCollection = $('#guideCollection'),
                    $guideDownload = $('#guideDownload');

                // Check Functionality Cookie Enabled?
                // Hide the Dock Alert message if the cookie is enabled
                if (cookieFunctionality === true) {
                    $dockContainer.removeClass('dock-cookie-overlay');
                    $dockMessageCookie.hide();
                    $dockAlertCookie.hide();

                    // Uncheck the Cookie Accept Checkbox
                    $('#fieldCookieMsg').attr('checked', false);
                    $('#fieldCookie').attr('checked', false);

                    $dockContainer.find('.dock-alert').removeClass('dock-alert-visible');

                    // SJ - Website Tour Content
                    // SJ - Change the contents of the Guiders
                    $guideWelcome.find('.guiders_title').html($('#guideWelcomeTitle').val());
                    $guideWelcome.find('.guiders_description').html($('#guideWelcomeDesc').val());

                    $guideSearch.find('.guiders_title').html($('#guideSearchTitle').val());
                    $guideSearch.find('.guiders_description').html($('#guideSearchDesc').val());

                    $guideAddItem.find('.guiders_title').html($('#guideAddItemTitle').val());
                    $guideAddItem.find('.guiders_description').html($('#guideAddItemDesc').val());

                    $guideCollection.find('.guiders_title').html($('#guideCollectionTitle').val());
                    $guideCollection.find('.guiders_description').html($('#guideCollectionDesc').val());

                    $guideDownload.find('.guiders_title').html($('#guideDownloadTitle').val());
                    $guideDownload.find('.guiders_description').html($('#guideDownloadDesc').val());

                    // Load Dock Items from Cookies, if exist
                    // Call the function from BW.Dock
                    BW.Dock.loadDockItems();
                } else {
                     // Empty the dock if it is already saved
                    BW.Dock.emptyDock();

                     // Hide the Cookie Message, if it is visible?
                     // SJ - Blocking Cookie Info
                     // $('#dock-message-info').hide();
                     // Hide the pop-up message for 'Add to Dock'
                    $('.dock-alert-info').hide();

                     // Hide the Cookie Policy Message
                    if (!cookieFirstTime === true) {
                        $cookieMessage.hide();
                        // Show the Functionality Cookie Alert Warning and Prepare the pop-up message with Alert Message
                        $dockContainer.addClass('dock-cookie-overlay');
                        $dockMessageCookie.show();
                        $dockAlertCookie.show();
                    }

                    // SJ - Website Tour Content
                    // SJ - Change the contents of the Guiders
                    $guideWelcome.find('.guiders_title').html($('#guideWelcomeTitleCookieDis').val());
                    $guideWelcome.find('.guiders_description').html($('#guideWelcomeDescCookieDis').val());

                    $guideSearch.find('.guiders_title').html($('#guideSearchTitleCookieDis').val());
                    $guideSearch.find('.guiders_description').html($('#guideSearchDescCookieDis').val());

                    $guideAddItem.find('.guiders_title').html($('#guideAddItemTitleCookieDis').val());
                    $guideAddItem.find('.guiders_description').html($('#guideAddItemDescCookieDis').val());

                    $guideCollection.find('.guiders_title').html($('#guideCollectionTitleCookieDis').val());
                    $guideCollection.find('.guiders_description').html($('#guideCollectionDescCookieDis').val());

                    $guideDownload.find('.guiders_title').html($('#guideDownloadTitleCookieDis').val());
                    $guideDownload.find('.guiders_description').html($('#guideDownloadDescCookieDis').val());
                }

                // Check Performance Cookie Enabled?
                if (cookiePerformance === true || cookieFirstTime === true) {

                    var liveChatScriptURL,
                        s_code,
                        sCodeScript;

                    // Load the s_code.js as this object was not found in IE after the Search Result AJAX call
                    if ($microSiteName.val() == null ||  $microSiteName.val() == "") {
                        sCodeScript = $.getScript(BW.AuthMode + BW.config.JSPath.sCode);
                    } else {
                        sCodeScript = $.getScript(BW.AuthMode + BW.config.MicroSiteJSPath.sCode);
                    }

                    sCodeScript.done(function(script, textStatus) {

                        //Enable automatic track
                        s.trackExternalLinks = true;
                        // Execute the Site Analytics Code
                        s_code = s.t();

                        if (s_code) {
                            document.write(s_code)
                        }
                        // Omniture Code wouldn't be working. The next line, makes IE go crazy. The page is blank, if the code is executed.
                        //if(navigator.appVersion.indexOf('MSIE')>=0)document.write(unescape('%3C')+'\!-'+'-');

                        // Live Chat Tracking
                        liveChatScriptURL = $('#liveChatScriptURL').val();

                        if (liveChatScriptURL !== '') {
                            $.getScript(liveChatScriptURL);
                        }
                    });
                } else {
                    //Disable automatic track
                    s.trackExternalLinks = false;
                }
            }

             // Open the Cookie Settings in a lightbox
            this.open = function (page) {
                // If the container's not visible, show it
                if (!_container.is(':visible')) {
                    _container.addClass('show');
                    _background.addClass('show');
                 }
                _container.children().removeClass('show');
                page.addClass('show');
            }

            // Open the Cookie Settings Overlay
            this.showCookieSettings = function () {
                this.open($('.cookie-settings.cookie-setting-option'));
            }

            // Close the Overlay
            this.close = function () {
                _container.removeClass('show');
                _background.removeClass('show');
            }
        }
        return new CookieSettings();
    }());

}(window.BW = window.BW || {}, jQuery));