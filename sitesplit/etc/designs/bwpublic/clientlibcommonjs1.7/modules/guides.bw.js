(function (BW, $, undefined) {

    /* ====================================================================
     21: Guide
     Description:

     Templates:
     Components: -
    ====================================================================== */

    BW.Guide = (function () {

        var Guide = function () {

            var $dockContainer = $('#dock-container'),
                $dockInfo = $('#dock-info'),
                $dockExtraBg = $('#dock-extra-bg');

            this.init = function() {

                this.guideWelcome();

                this.guideSearch();

                this.guideAddToDock();

                this.guideCollection();

                this.guideDownloadDock();

                // Links inside the dock item info de-activated
                $dockInfo.find('a').click(function(e) {
                    e.preventDefault();
                });

            }

            this.guideWelcome = function() {
                // Guide Welcome
                guiders.createGuider({
                    buttons: [{name: "Take the Tour", classString: "btn-next", onclick:
                        function () {
                            $dockContainer.removeClass('dock-open');
                            $dockExtraBg.removeClass('dock-extra-bg-open');
                            guiders.next();
                        }
                    },
                    { name: "No Thanks", classString: "btn-prev", onclick:
                        function() {
                            guiders.hideAll();
                        }
                    }],
                    id: "guideWelcome",
                    next: "guideSearch",
                    classString: "guide-welcome",
                    title: $('#guideWelcomeTitle').val(),
                    description: $('#guideWelcomeDesc').val(),
                    width: 310,
                    xButton: true,
                    onClose: function () {
                        BW.Guide.closeGuides();
                    },
                    closeOnEscape: true
                });
            }

            this.guideSearch = function() {
                // Guide Search
                guiders.createGuider({
                    attachTo: "#search-query",
                    buttons: [
                        { name: "Previous", classString: "btn-prev", onclick:
                        function () {
                            $dockContainer.removeClass('dock-open');
                            $dockExtraBg.removeClass('dock-extra-bg-open');
                            guiders.prev();
                        }
                    },
                    { name: "Next", classString: "btn-next", onclick:
                        function () {
                            $dockContainer.removeClass('dock-open');
                            $dockExtraBg.removeClass('dock-extra-bg-open');
                            guiders.next();
                        }
                    }],
                    id: "guideSearch",
                    next: "guideAddItem",
                    autoFocus: true,
                    position: 6,
                    title: $('#guideSearchTitle').val(),
                    description: $('#guideSearchDesc').val(),
                    width: 310,
                    offset: {
                        top: -27,
                        left: 0
                    },
                    xButton: true,
                    onClose: function () {
                        BW.Guide.closeGuides();
                    },
                    closeOnEscape: true
                });
            }

            this.guideAddToDock = function() {
                // Guide Add to Dock
                guiders.createGuider({
                    attachTo: ".home-carousel .carousel-container",
                    buttons: [{name: "Previous", classString: "btn-prev", onclick:
                        function () {
                            $dockContainer.removeClass('dock-open');
                            $dockExtraBg.removeClass('dock-extra-bg-open');
                            guiders.prev();
                        }
                    },
                    {name: "Next", classString: "btn-next",
                        onclick: function () {
                            guiders.hideAll();
                            if ($('#dock-collection').find('li').length === 0) {
                                $dockInfo.addClass('dock-info-tour');
                            }
                            $dockContainer.addClass('dock-open');
                            $dockExtraBg.addClass('dock-extra-bg-open');
                            //BW.Guide.CalculatePosition($('#dock-info li'), $('#guideCollection'));
                            setTimeout(function(){
                                guiders.next();
                            }, 450);
                        }
                    }],
                    id: "guideAddItem",
                    next: "guideCollection",
                    autoFocus: true,
                    position: 12,
                    width: 310,
                    offset: {
                        top: 12,
                        left: -331
                    },
                    title: $('#guideAddItemTitle').val(),
                    description: $('#guideAddItemDesc').val(),
                    xButton: true,
                    onClose: function () {
                        BW.Guide.closeGuides();
                    },
                    closeOnEscape: true
                });
            }

            this.guideCollection = function() {
                // Guide Collection
                guiders.createGuider({
                    attachTo: ".dock-content",
                    buttons: [{name: "Previous", classString: "btn-prev",
                        onclick: function () {
                            guiders.hideAll();
                            $dockContainer.removeClass('dock-open');
                            $dockExtraBg.removeClass('dock-extra-bg-open');
                            setTimeout(function(){
                                guiders.prev();
                            }, 400);
                        }
                    },
                    {name: "Next", classString: "btn-next", onclick: function() {
                            $dockContainer.addClass('dock-open');
                            $dockExtraBg.addClass('dock-extra-bg-open');
                            setTimeout(function(){
                                guiders.next();
                            }, 450);
                        }
                    }],
                    id: "guideCollection",
                    next: "guideDownload",
                    classString: "guide-collection",
                    width: 310,
                    offset: {
                        left: -820
                    },
                    position: 4,
                    autoFocus: true,
                    title: $('#guideCollectionTitle').val(),
                    description: $('#guideCollectionDesc').val(),
                    xButton: true,
                    onClose: function () {
                        BW.Guide.closeGuides();
                    },
                    closeOnEscape: true
                });
            }

            this.guideDownloadDock = function() {
                // Guide Download Dock
                guiders.createGuider({
                    attachTo: ".dock-collection-footer .email",
                    buttons: [{name: "Previous", classString: "btn-prev", onclick:  function() {
                            $dockContainer.addClass('dock-open');
                            $dockExtraBg.addClass('dock-extra-bg-open');
                            setTimeout(function(){
                                    guiders.prev();
                            }, 450);
                        }
                    },
                    { name: "Finish Tour", classString: "btn-next", onclick:
                        function () {
                            $dockContainer.removeClass('dock-open');
                            $dockExtraBg.removeClass('dock-extra-bg-open');
                            guiders.hideAll();
                        }
                    }],
                    id: "guideDownload",
                    classString: "guide-download",
                    autoFocus: true,
                    width: 310,
                    position: 12,
                    offset: {
                        left: -10
                    },
                    title: $('#guideDownloadTitle').val(),
                    description: $('#guideDownloadDesc').val(),
                    xButton: true,
                    onClose: function () {
                        BW.Guide.closeGuides();
                    },
                    closeOnEscape: true
                });
            }

            this.closeGuides = function() {
                $dockInfo.removeClass('dock-info-tour');
                $dockContainer.removeClass('dock-open');
                $dockExtraBg.removeClass('dock-extra-bg-open');
            }
        }
        return new Guide();
    }());


}(window.BW = window.BW || {}, jQuery));