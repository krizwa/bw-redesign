(function (BW, $, undefined) {

    /* ====================================================================
     16:         Dock
     Description: Stores the user's collection

     Templates: All the templates
     Components: C105
    ====================================================================== */
    BW.Dock = (function () {
        var Dock = function () {

            var d = this,
                _carouselContainer,
                _carouselOn,
                _count,
                _countElement,
                _dock = $('#dock-collection'),
                _dockContainer  = $('#dock-container'),
                _dockDefaultInfo = $('#dock-info'),
                _isDockItemsSaved,
                _dockFooter = $('.dock-collection-footer'),
                _okToClickAddToDock = true,
                $dockCollectionHeader = $('.dock-collection-header'),
                $microSiteName = $('#microSiteName'),
                $websitePath = $('#website-path');

            this.init = function() {

                //init count at 0 and carousel off
                _countElement = _dockContainer.find('.dock-count');
                _count = 0;
                _carouselOn = false;

                /***** All user click handlers *****/

                d.dockBtnMainHandler();

                d.dockToggle();

                d.focusHandler();

                d.keyupAccessibility();

                _dockContainer.on("click", ".dock-contact", function(e) {
                    e.stopPropagation();
                });

                d.relatedContentToggle();

                // Deactivate the click when clicked on the active link in Footer links
                _dockContainer.on('click', '.active', function(e) {
                    e.preventDefault();
                });

                d.removeAll();

                d.addCollection();

                d.switchPanelContent();

                d.dockCookieMessage();

                d.dockFilters();

                d.alertMessage();

                d.emailBrochureLink();

                d.downloadBrochureLink();

                // SJ - Blocking Cookie Info
                // Click Handler for closing 'First Time Message'
                /* _dockContainer.on('click', '#dock-message-info .close', function() {
                    $('#dock-message-info').hide();
                });*/
                /***** End all user click handlers *****/

                // Do not show the Dock Cookie Message if the dock cookie is disabled
                /*if ($('#cookieFunctionality').val() == "false") {
                    // Hide the Dock messages in the Notification Bar and the Dock Info Bar
                    $('#dock-message-cookie').show();
                    $('.dock-alert-cookie').show();
                }*/
            }

            this.dockBtnMainHandler = function() {
                // Click handler for all add to dock buttons across the site
                $('body').on("click", ".add-to-dock", function(e) {
                    e.preventDefault();

                    if (_okToClickAddToDock === true) {
                        _okToClickAddToDock = false;
                        // Code for Site Catalist
                        var docUrl = $(this).attr('data-dock-url'),
                            contentName = docUrl.substring(docUrl.lastIndexOf("/") + 1, docUrl.lastIndexOf(".html")),
                            contentType = $(this).attr('data-dock-type'),
                            siteCatJsonObj = { "contenttype": contentType, "contentname": contentName, "interactiontype": "add-to-collection" },
                            siteCatJsonStr = JSON.stringify(siteCatJsonObj);

                        getSiteCatContent('content',siteCatJsonStr);

                        // First Time User? If Yes, enable the Cookies
                        if ($('#cookieFirstTime').val() === "true") {
                            BW.CookieSettings.checkCookie();1
                        }

                        // Dock Cookie Enabled?
                        if ($('#cookieFunctionality').val() == "true") {
                            a = $(this),
                            generateURL = "";
                            if (a.hasClass('add-to-dock-added')) {
                                //update add to dock link on page, send 1 if already added
                                d.updateAddToDockLink(a, 1);
                                //remove item from dock
                                d.removeItemFromDock(a.attr('data-dock-id'), a.attr('data-dock-url'), 1);
                            }
                            else {
                                //update add to dock link on page, send 0 if not added
                                d.updateAddToDockLink(a, 0);

                                // Filters Applied? Remove it!
                                _dockContainer.find('.dock-carousel-container li').show();
                                // Remove the Filter active class
                                $('.dock-filters a').removeClass('filterActive');

                                //add item to dock
                                processedLink = d.processDockLink(a);
                                if (d.checkDuplicity(processedLink) === 0){
                                    d.addItemToDock(processedLink, 1, true, true);
                                }

                                //get the servlet URL prefix
                                //_internalLinkPrefix = $('#internalLinkPrefix').val();
                                generateURL = generateURL + BW.GlobalPath + BW.config.Dock.url + '?urls=' + a.attr("data-dock-url") + '|^|unread|^^|&addStatus=add&content=related&microSiteName=' + $microSiteName.val();
                            }
                        } else {
                            // Show Cookie Enable Message
                            d.cookieMessage();
                        }
                    }
                    setTimeout(function() { _okToClickAddToDock = true; }, 200);
                });
            }
            
            function checkCollectionPanel() {
                    if (!$("#dock-container").hasClass("dock-open")) {
                        $(".dock-content a").attr("tabindex","-1");
                    } else {
                        $(".dock-content a").attr("tabindex","0");
                    }
                }
            
            this.focusHandler = function() {
                // Focus Handler - Do not let the tab get inside the dock
                // Anwar's Fix
                $(".dock-handle").on("focus", checkCollectionPanel);

                $(window).on("focus", checkCollectionPanel);

                
            }

            this.dockToggle = function() {
                //click handler for opening and closing the dock
                _dockContainer.on("click", ".dock-handle", function(e) {
                    var siteCatJsonObj = {},
                        siteCatJsonStr = JSON.stringify(siteCatJsonObj);

                    getSiteCatContent('collection', siteCatJsonStr);

                    _dockContainer.toggleClass('dock-open');

                    $('#dock-extra-bg').toggleClass('dock-extra-bg-open');
                    $('.dock-alert-visible').removeClass('dock-alert-visible');  // todo need set a flag when this is displayed so class is only removed if there

                    checkCollectionPanel();

                    e.preventDefault();
                });
            }

            this.keyupAccessibility = function() {
                //Keyup Handler to handle accessibility
                _dockContainer.on("keyup", ".dock-handle", function(e) {
                    if (e.which == 13) {
                        $(".dock-handle").trigger("click");
                    }
                });
            }

            this.relatedContentToggle = function() {
                //click handler for opening and closing the related content panel
                _dockContainer.on("click", ".dock-recommended-handle", function(e) {
                    e.preventDefault();
                    var d = $(this);

                    d.parent('.dock-recommended').toggleClass('dock-recommended-open');
                    // Show the extra links based on the state
                    $('.dock-recommended-footer').toggleClass('dock-footer-alternative');
                });
            }

            this.removeAll = function() {
                //click handler to remove all elements from dock
                _dockContainer.on("click", ".dock-remove-all", function(e) {
                    e.preventDefault();
                    // If the Header is disabled, the filter should be disabled
                    if($(this).parent().hasClass('dock-collection-header-disabled')) {
                        return true;
                    };
                    // Has the user comfirmed?
                    if (confirm(BW.config.Dock.removeDockItemsMsg)) {
                        d.emptyDock();
                    }
                });

                //click handler to remove element from dock - this element is on the actual dock element
                _dock.on("click", ".remove-from-dock", function(e) {
                    e.preventDefault();
                    var id = $(this).parent().attr('data-dock-id');
                    var url = $(this).parent().find('.content').attr('href');
                    d.removeItemFromDock(id, url);
                });
            }

            this.addCollection = function() {
                //click handler for adding collection to dock
                _dockContainer.on("click", ".add-collection-to-dock", function(e) {
                    // First Time User? If Yes, enable the Cookies
                    if ($('#cookieFirstTime').val() === "true") {
                        BW.CookieSettings.checkCookie();
                    }
                    if ($('#cookieFunctionality').val() == "true") {
                        e.preventDefault();
                        var $this = $(this);

                        // Get collection from json present in articles field
                        collection = $this.parent().find($('.articles')).val();
                        d.addCollectionToDock(
                            d.processJson(BW.helper.jsonParse(collection, { "Collection":{} }).Collection), true, true
                        );

                        //remove collection when added
                        $this.parent('li').remove();
                    } else {
                        // Show Cookie Enable Message
                        d.cookieMessage();
                    }
                });
            }

            this.switchPanelContent = function() {
                //click handler for switching recommneded panel content
                _dockContainer.on("click", ".dock-recommended-switch", function(e) {
                    e.preventDefault();
                    var $this = $(this);
                    $this.parents('.dock-recommended-content').hide();
                    _dockContainer.find($this.attr('href')).show();
                });
            }

            this.dockCookieMessage = function() {
                // Dock Cookie Messages
                _dockContainer.on("change", ".fieldCookie", function(e) {
                    $.ajax({
                        url: $websitePath.val() + 'miscellaneous/lightbox.cookie.html',
                        data:{
                            'microSiteName': $microSiteName.val(),
                            'performance': $('#cookiePerformance').val(),
                            'functionality': true,
                            'targeting': $('#cookieTarget').val()
                        },
                        success:function(data) {
                            BW.CookieSettings.updateCookie(data);
                        }
                    });
                });
            }

            this.dockFilters = function() {
                // Filters
                _dockContainer.on("click", ".dock-filters a", function(e) {
                    e.preventDefault();
                    // If the Header is disabled, the filter should be disabled
                    if ($(this).parent().parent().parent().hasClass('dock-collection-header-disabled')) {
                        return true;
                    };
                    var $this = $(this),
                            filter = $this.attr('data-filter').toLowerCase(),
                            dockFilters = $this.parent().parent(),
                            dockItemsList = _dockContainer.find('.dock-carousel-container li'),
                            contentType = _dockContainer.find('.dock-carousel-container .content-type'),
                            curItem;

                    // Un Hide all the dock list before filtering
                    dockItemsList.show();

                    // Remove the active class
                    dockFilters.find('a').removeClass('filterActive');

                    // Make the selected filter as active
                    $this.addClass('filterActive');

                    // Filter for all the options except 'All' and 'Read'
                    if (filter !== "all" && filter !== "unread") {
                        for (var i = 0; i < contentType.length; i = i + 1) {
                            curItem = $(contentType[i]);
                            curItemCat = curItem.attr('filter').toLowerCase();

                            // Assign the Sub Categories to Category
                            // Insight
                            if (curItemCat === "article" || curItemCat === "volume") {
                                curItemCat = "insight";
                            }
                            // Product
                            if (curItemCat === "product") {
                                curItemCat = "product";
                            }
                            // Support
                            if (curItemCat === "guide" || curItemCat === "tutorial") {
                                curItemCat = "support";
                            }
                            // Profiles
                            if (curItemCat === "profile" || curItemCat === "story") {
                                curItemCat = "profiles";
                            }

                            // Filter the Category
                            if (curItemCat === filter) {
                                curItem.parent().parent().show();
                            } else {
                                curItem.parent().parent().hide();
                            }
                        }
                    }

                    // Check if the category is unread
                    if (filter === "unread") {
                        for (var i = 0; i < contentType.length; i = i + 1) {
                            curItem = $(contentType[i]),
                            //curItemCat = curItem.attr('filter').toLowerCase();
                            curItemCat = "unread";

                            // Check Read Status
                            if (!curItem.parent().parent().find('a.unread').length > 0) {
                                curItemCat = "read";
                            }

                            // Filter the Category
                            if (curItemCat === filter) {
                                curItem.parent().parent().show();
                            } else {
                                curItem.parent().parent().hide();
                            }
                        }
                    }

                    // Count the Carousel Items. Enable / Disable the navigation
                    var filterCount = $('#dock-collection').find('li:visible').length;

                    if (filterCount <= 4) {
                        var c = _dockContainer.find('.dock-carousel-container');
                        BW.Carousel.init(c, 4, null);
                        c.addClass('carousel-disabled');
                    } else {
                        var c = _dockContainer.find('.dock-carousel-container');
                        BW.Carousel.init(c, 4, null);
                        c.removeClass('carousel-disabled');
                    }
                });
            }

            this.alertMessage = function() {
                // Click handler for Alert Message
                $('.dock-alert .close').on('click', function(e) {
                    $(this).parent().removeClass('dock-alert-visible');

                    e.preventDefault();
                });
            }

            this.emailBrochureLink = function() {
                // Click on email Brochure link for sending the Brochure via mail
                $('a.email').on('click', function(e) {
                    // If Button enabled?
                    if (!$(this).hasClass('button-gray-dark')) {
                        $.ajax({
                            url: $websitePath.val() + 'miscellaneous/lightbox.emaildock.html?microSiteName=' + $microSiteName.val(),
                            success: function (data) {
                                window.location.href = data;
                            }
                        });
                    }

                    e.preventDefault();
                });
            }

            this.downloadBrochureLink = function() {
                // Click on download Brochure link
                $('#downloadBrochure').on('click', function(e) {
                    // If Button enabled?
                    if (!$(this).hasClass('button-gray-dark')) {
                        //window.location.href = BW.GlobalPath +'miscellaneous/lightbox.pdfgen.html';
                        //Fix for BWP-1013
                        window.open(BW.GlobalPath + 'miscellaneous/lightbox.pdfgen.html?microSiteName=' + $microSiteName.val(),'_blank');
                    }

                    e.preventDefault();
                });
            }

            // Load the Dock items
            this.loadDockItems = function () {
                var l = this;

                //get collection from json
                BW.helper.server.get({ url : $websitePath.val() + BW.config.Dock.url + '?urls=' + window.location.pathname + '|^|read|^^|&addStatus=modify&content=dock&microSiteName=' + $microSiteName.val(), cache: false}, {
                    done : function () {
                        var items = d.processJson(BW.helper.jsonParse(arguments[0], {"Collection":{}}).Collection);
                        // SJ - Blocking Cookie Info
                        /*if (items.length === 0) {
                            l.firtTimeMessage();
                        }*/
                        d.addCollectionToDock(items, false, false);
                    }
                });
            }

            // Show Cookie Alert Message
            this.cookieMessage = function (item) {
                var da = _dockContainer.find('.dock-alert');
                $('.dock-alert-info').hide();
                $('.dock-alert-cookie').show();
                da.addClass('dock-alert-visible');
            },

            // Show First Time User Message
            /* this.firtTimeMessage = function (item) {
                $('#dock-message-info').show();
            } */

            // Check for duplicate Item
            this.checkDuplicity = function (item) {
                 var contentIds = _dockContainer.find('.dock-carousel-container li'),
                            curItemId,
                            count = 0;

                    // Compare the dock item's filter with the seleted filter
                    for (var i = 0; i < contentIds.length; i = i + 1) {
                        curItemId = $(contentIds[i]).attr('data-dock-id');
                        if (curItemId === item.id) {
                            count = count + 1;
                         }
                    }
                    return count;
            }

            // Add item to dock
            this.addItemToDock = function(de, f, countColor, isAlertInfo) {
                var generateURL;

                // Hide the Default Info Panel if it is shown
                // Enable the Download Buttons and Dock Header Links
                if (_count === 0) {
                    _dockDefaultInfo.hide();
                    _dockFooter.find('a').removeClass('button-gray-dark').addClass('button-gray-light2');
                    $dockCollectionHeader.removeClass('dock-collection-header-disabled');
                }

                //dock link element
                var a = $('<a/>', {
                    'class': 'content',
                    'href': de.url
                }).append(
                    //dock link content
                    $('<span/>', {
                        'class': 'content-type',
                        'text': de.type
                    }).attr('filter', de.type),
                    $('<h3/>', {
                        'text': BW.helper.trimContent(de.title, 38, '..')
                    }),
                    $('<p/>', {
                        'text': BW.helper.trimContent(de.copy, 50, '..')
                    })
                );

                //remove button
                var remove = $('<a/>', {
                    'class' : 'remove-from-dock',
                    'text' : 'x'
                });

                // unread button
                var unread = $('<a/>', {
                    'class' : 'unread',
                    'href' : '#'
                }).append(
                    // Add a span for presentation
                    $('<span />', {
                        'text': 'Unread'
                    })
                );


                // To-Do: Set a flag where unread button is read
                var isUnread = de.isRead,
                    li;

                //dock list element
                if (isUnread) {
                    li = $('<li />', {'data-dock-id' : de.id}).append(a, remove);
                } else {
                    li = $('<li />', {'data-dock-id' : de.id}).append(a, remove, unread);
                }

                //if first item added display message and switch recommended content to related not new.
                if (_dock.children().length === 0 & isAlertInfo) {
                    var da = _dockContainer.find('.dock-alert');
                    // Don't show alert message of dock items are already saved in the cookie. This means the user is already familiar in using dock
                    //if (_isDockItemsSaved !== "true") {
                    $('.dock-alert-info').show();
                    $('.dock-alert-cookie').hide();
                    $('.dock-alert').addClass('dock-alert-visible');


                    //}

                    //switch panel
                    _dockContainer.find('#dock-recommended-new').hide();
                    _dockContainer.find('#dock-recommended-related').show();
                }

                //increase dock count
                _count++;

                // Bring some color change to the count.
                // When adding a collection, do this only for the last item.
                if (countColor == true) {
                    _countElement.fadeOut(100);
                    _countElement.text(_count);

                    _countElement.css({
                        'color':'#007eb6'
                    });

                    _countElement.fadeIn(500, function() {
                        setTimeout(function(){
                            _countElement.css({
                                'color':'#999999'
                            });
                        }, 1500);
                    });
                } else {
                    _countElement.text(_count);
                }

                //add to dock
                _dock.prepend(li);

                /* The reason for this flag is that if a add is tiggered from the link element on the page
                we trigger the change of link state on that element.
                If the add was from the dock then we need to find the link element on the page (if present)
                and change it's state*/
                if (!f) {
                    d.updateAddToDockLink($('#content-wrapper .add-to-dock[data-dock-id=' + de.id + ']'), 0);
                }

                //init carousel if over three and not already init
                if (_count > 4) {

                    var c = _dockContainer.find('.dock-carousel-container');
                    BW.Carousel.init(c, 4, null);
                    c.removeClass('carousel-disabled');

                    $('.jcarousel-pagination').find('a:first').click();
                }

                // Get the Related Content if the contents are added from the page and not from a collection
                if (f === 1) {
                    //get the servlet URL prefix
                    //_internalLinkPrefix = $('#internalLinkPrefix').val();
                    generateURL = BW.GlobalPath + BW.config.Dock.url + '?urls=' + de.url + '|^|unread|^^|&addStatus=add&content=related&microSiteName=' + $microSiteName.val();
                    this.getRelatedContent(generateURL);
                }
            }

            //add collection to dock
            this.addCollectionToDock = function(a, reverseOrder, isAlertInfo) {
                //get the servlet URL prefix
                //_internalLinkPrefix = $('#internalLinkPrefix').val();
                var duplicateItemCount,
                    generateURL = BW.GlobalPath + BW.config.Dock.url + "?urls=", urls = "",
                    intialValue,
                    increment,
                    i,
                    j,
                    readStatus;

                // Filters Applied? Remove it!
                _dockContainer.find('.dock-carousel-container li').show();
                // Remove the Filter active class
                $('.dock-filters a').removeClass('filterActive');

                if (reverseOrder) {
                    intialValue = a.length - 1;
                    increment = -1;
                } else {
                    intialValue = 0;
                    increment = 1;
                }

                //loop through array of items
                for (i = 0, j = intialValue; i < a.length; i++, j = j + increment) {
                    // Check for duplicate dock items
                    duplicateItemCount = this.checkDuplicity(a[j]);

                    if (duplicateItemCount === 0){
                        if (i === a.length - 1) {
                            this.addItemToDock(a[j], 0, true, isAlertInfo);
                        } else {
                            this.addItemToDock(a[j], 0, false, isAlertInfo);
                        }

                    }

                    // Find the Status of the Dock Item
                    readStatus = "unread";
                    if (a[j].isRead) {
                        readStatus = "read";
                    }

                    // Create the URL for Related Contents.
                    //The URLs for each dock item is grabed from the collection object and concatenated in the below format
                    urls = urls + a[j].url + '|^|' + readStatus + '|^^|';
                }

                // Add the parameters to the query string
                generateURL = generateURL + urls + '&addStatus=add&content=related&microSiteName=' + $microSiteName.val();
                // Update the Related Content for the collection
                this.getRelatedContent(generateURL);
            }

            //remove item from dock
            this.removeItemFromDock = function(deId, url, f) {
                var c = _dockContainer.find('.dock-carousel-container'),
                    generateURL = "",
                    d = this;

                //remove dock list element
                _dock.children('li[data-dock-id=' + deId + ']').remove();

                //reduce counter
                _count--;
                _countElement.text(_count);

                //De-activate carousel if less than 4
                if (_count <= 4) {
                    c.addClass('carousel-disabled');
                } else {
                    // Re-calculate the number of Slides
                    BW.Carousel.init(c, 4, null);
                }

                /* The reason for this flag is that if a remove is tiggered from the link element on the page
                we trigger the change of link state on that element.
                If the remove was from the dock then we need to find the link element on the page (if present)
                and change it's state*/
                if (!f) {
                    d.updateAddToDockLink($('#content-wrapper .add-to-dock[data-dock-id=' + deId + ']'),1);
                }

                // Show the Default Info if the dock is empty
                if (_count === 0) {
                    _dockDefaultInfo.show();
                    // Enable the Download Buttons
                    _dockFooter.find('a').removeClass('button-gray-light2').addClass('button-gray-dark');
                    // Enable the Header Links
                    $dockCollectionHeader.addClass('dock-collection-header-disabled');


                    //swith panel back to not sure where to start - this switch could be in a funtion doing a few places now.
                    _dockContainer.find('#dock-recommended-new').show();
                    _dockContainer.find('#dock-recommended-related').hide();

                    // SJ - Blocking Cookie Info
                    // Show the first time User Message
                    /* d.firtTimeMessage(); */
                }
                //get the servlet URL prefix
                //_internalLinkPrefix = $('#internalLinkPrefix').val();
                // Create the URL for Related Contents
                //The URLs for each dock item is grabed from the collection object
                generateURL = BW.GlobalPath + BW.config.Dock.url + '?urls=' + url + '|^|unread|^^|&addStatus=remove&content=related&microSiteName=' + $microSiteName.val();
                this.getRelatedContent(generateURL);
            }

            // Remove all items from dock
            this.emptyDock = function() {
                var generateURL = "";
                //get the servlet URL prefix
                //_internalLinkPrefix = $('#internalLinkPrefix').val();
                // Update the Cookie
                // Create the URL for Related Contents
                //The URLs for each dock item is grabed from the collection object
                generateURL = BW.GlobalPath + BW.config.Dock.url + '?addStatus=removeall&microSiteName=' + $microSiteName.val();
                this.getRelatedContent(generateURL);

                //De-activate carousel if less than 4 and aleardy init
                // T0-Do Add a flag to check if the carousel exist
                var c = _dockContainer.find('.dock-carousel-container');
                c.addClass('carousel-disabled');
                //_carouselOn = false;

                //remove all html elements
                _dock.children().remove();

                // if the carousel is activated, move the left position of the carousel to zero.
                // This will ensure that when new item is added it is visible
                _dock.css({
                    left: 0
                });

                // Show the Default Info Panel if it is open
                _dockDefaultInfo.show();

                // SJ - Blocking Cookie Info
                // Show the first time User Message
                /* d.firtTimeMessage(); */

                // Disable the Download Buttons
                _dockFooter.find('a').removeClass('button-gray-light2').addClass('button-gray-dark');
                // Disable the Header Links
                $dockCollectionHeader.addClass('dock-collection-header-disabled');

                //reset counter
                _count = 0;
                _countElement.text(0);

                //reset all add to dock links on the page
                $('#content-wrapper .add-to-dock-added').each(function() {
                    d.updateAddToDockLink($(this),1);
                });

                //swith panel back to not sure where to start - this switch could be in a funtion doing a few places now.
                _dockContainer.find('#dock-recommended-new').show();
                _dockContainer.find('#dock-recommended-related').hide();

                // Reset the active class for the fiters
                $('.dock-filters').find('a').removeClass('filterActive');
            }

            //requested related content from server based on ID of content sent
            this.getRelatedContent = function(deId) {
                /* todo need to liase with dev on how to get the related content. This demo has it all stored in dock-related.json */
                //get related from json
                BW.helper.server.get({ url : deId, cache: false}, {
                    done : function () {
                        d.addRelatedContentToPanel(
                            d.processJson(BW.helper.jsonParse(arguments[0], {"Related":{}}).Related)
                        );
                    }
                });
            }

            //add related content to side panel
            this.addRelatedContentToPanel = function(rc) {

                var list = $('<ul/>', {
                    'id':'dock-related'
                });

                //loop through array of items
                for (var i = rc.length - 1; i >= 0; i--) {
                    //details of each item
                    var de = rc[i];
                    //create li elememt
                    var li = $('<li/>').append(
                        $('<a/>', {
                            'class':'add-to-dock',
                            'data-dock-id':de.id,
                            'data-dock-type':de.type,
                            'data-dock-title':de.title,
                            'data-dock-copy':de.copy,
                            'data-dock-url':de.url,
                            'href': 'dock-collection.json'
                        }),
                        $('<h4/>', {
                            'text': BW.helper.trimContent(de.title, 25, '..')
                        }),
                        $('<p/>', {
                            'text': BW.helper.trimContent(de.copy, 130, '..')
                        })
                    );
                    list.prepend(li);
                }

                //add related content list to dock
                _dockContainer.find('#dock-related').replaceWith(list);

            }

            //process json - expects parsed json object of related content or collection of content
            //and returns array of objects
            this.processJson = function(collection) {
                var items = [];
                for (var c in collection) {
                    var item = collection[c];
                    var d = {};
                    d = {
                        'id' : c,
                        'type' : item['type'],
                        'title' : item['title'],
                        'copy' : item['copy'],
                        'url' : item['url'],
                        'isRead' : item['isRead']
                    };
                    items.push(d);
                }
                return items;
            }

            //get data from dock link and add to object
            this.processDockLink = function (a) {
                //dock element
                var d = {};
                d = {
                    'id' : a.attr('data-dock-id'),
                    'type' : a.attr('data-dock-type'),
                    'title' : a.attr('data-dock-title'),
                    'copy' : a.attr('data-dock-copy'),
                    'url' : a.attr('data-dock-url')
                };
                return(d);
            }

            //update add to dock link expects the html element
            this.updateAddToDockLink = function (a, added) {
                if (added) {
                    a.removeClass('add-to-dock-added');
                    a.html('Add to my collection');
                }
                else {
                    a.addClass('add-to-dock-added');
                    a.html('Remove from my collection');
                }
            }

            this.init();
        }
        return new Dock();
    }());


}(window.BW = window.BW || {}, jQuery));