(function (BW, $, undefined) {

    /* ====================================================================
     21: Meet the Team
     Description: This component is used to add the team members to the team

     Templates: Generic Full Width
     Components: Meet the Team
    ====================================================================== */

    BW.MeetTheTeam = (function () {

        var MeetTheTeam = function () {

            $meetTeam = $('#meet-team');

            this.init = function () {
                var m = this,
                    curElem,
                    teamRow,
                    columnNo,
                    content;

                // Click and Focus Handler for Head to show the content
                $meetTeam.find('.head').on('click', function() {
                    m.memberDetails($(this));
                });

                $meetTeam.find('.head').on('keyup', function(e) {
                    if (e.which == 13) {
                        m.memberDetails($(this));
                    }
                });

                this.memberDetails = function (curElem) {

                    teamRow = curElem.parent().parent(),
                    columnNo = teamRow.find('.member').index(curElem.parent()) + 1, // Get the Column number
                    content = $('<div />', {
                        "class": "body member-col" + columnNo,
                        "html": curElem.parent().find('.body').html()
                    }),
                    isMemberContent = teamRow.find('.member-content-open').length;

                    // Profile Already Opened? Close it.
                    if (curElem.hasClass('profileOpen')) {
                        var $elem = curElem.parent().parent().find('.member-content');

                        // Does your browser support transition?
                        if (!Modernizr.csstransitions) {
                            $elem.animate({ 'height' : '' }, 500);
                        }

                        $elem.removeClass('member-content-open');
                        curElem.removeClass('profileOpen');
                        return;
                    }

                    $('.team-row').find('.head').removeClass('profileOpen');
                    // Class Indicator Added just for recognizing the state (Opened / Closed)
                    curElem.addClass('profileOpen');

                    var $teamRowContent = teamRow.find('.member-content'),
                        $meetTeamContent = $meetTeam.find('.member-content');

                    // Does your browser support transition?
                    if (Modernizr.csstransitions) {
                        // Is any of the member profile already opened?
                        if (isMemberContent > 0 ) {
                            // Get the contents of the member and put inside the member-content div
                            $teamRowContent.html(content).addClass('member-content-open');
                            // Add an active class for the row
                            //teamRow.addClass('active');
                        } else {
                            // Remove the previous row's classes
                            $meetTeamContent.removeClass('member-content-open');
                            //$meetTeam.find('.team-row').removeClass('active');

                            $teamRowContent.html(content).addClass('member-content-open');
                            //teamRow.addClass('active');
                        }
                    } else {
                    // For all the legendary boring browsers, let's use the jQuery animation
                        if (isMemberContent > 0 ) {
                            $teamRowContent.html(content);
                        } else {
                            // Remove the previous row's classes
                            $meetTeamContent
                                .removeClass('member-content-open')
                                .animate({ 'height' : '' }, 500);

                            $teamRowContent.animate({
                                'height': 274 + 'px'
                            }, 800);
                            $teamRowContent.html(content).addClass('member-content-open');
                        }
                    }
                }

                m.closeHandler();
            }

            this.closeHandler = function() {
                // Click Handler for Close Button
                $meetTeam.on('click', '.close', function(e){
                    var $elem = $(this).parent().parent();

                    // Does your browser support transition?
                    if (!Modernizr.csstransitions) {
                        $elem.animate({ 'height' : '' }, 500);
                    }

                    $elem.removeClass('member-content-open');

                    e.preventDefault();
                });
            }

            // If meet the team component exist?
            if ( $meetTeam ) {
                this.init();
            }
        }
        return new MeetTheTeam();
    }());

}(window.BW = window.BW || {}, jQuery));