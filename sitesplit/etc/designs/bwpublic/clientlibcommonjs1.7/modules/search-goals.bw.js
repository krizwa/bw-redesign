(function (BW, $, undefined) {



    /* ==========================================================================
     10:         Search Goals
     Description: Homepage search goals

     Templates:  T101
     Components:
    ========================================================================== */
    BW.SearchGoals = (function () {
        var SG = function () {

            /* Positions of the suggestion boxes [[x,y],[x,y], etc...]
                 x positions are % (to enable easy resising)
                 y positions are px
                 this.createSuggestionList adds a z coord to each, and various functions
                 access this. */
            var suggestionPositions = [
                    [0,10],
                    [45,0],
                    [79,38],
                    [0,326],
                    [29,370],
                    [69,357]
            ];

            // Do we make the lines? Init sets this to true if this.container
            //  is descended from an element .home
            var makelines = false;

            // The maximum # of suggestions when not on home page
            var maxnothome = 4;

            /* This is for the lines
                    start is the starting goal #
                    finish is the ending goal # (both are 1-based)
                    line is the Raphael element */
            this.lines = [{ start : 1, finish : 2, line : null },
                { start : 2, finish : 3, line : null },
                { start : 3, finish : 4, line : null },
                { start : 4, finish : 5, line : null },
                { start : 5, finish : 6, line : null },
                { start : 1, finish : 6, line : null },
                { start : 2, finish : 6, line : null },
                { start : 3, finish : 6, line : null },
                { start : 1, finish : 4, line : null },
                { start : 2, finish : 4, line : null },
                { start : 2, finish : 5, line : null }];

             // Perspective fallback if one can't be read from element
            this.basePerspectiveFallback = 3000;


            // METHODS

            // Go get some suggestions
            this.getSuggestions = function (term) {
            var  suggestionsUrl = BW.GlobalPath + 'miscellaneous/lightbox.json.html?lang=' + BW.SiteLanguage+'&microSiteName='+$('#microSiteName').val();
                // hold on to the term as we'll need it for sorting
                this.term = term;

                if (!this.goalStatements) {
                    // Define a callback for when we've got something back
                    var s = this;
                    var callback = {
                        done : function () {
                            s.setSuggestions(arguments[0]);
                        },
                        fail : function () {
                            BW.helper.debug('FAIL');
                            BW.helper.debug(arguments[0]);
                        }
                    }

                    //console.log('AJAX GET STATEMENTS');
                    // Go get it

                    BW.helper.server.get({ data : term, url : suggestionsUrl}, callback);

                } else {
                    this.setSuggestions(this.goalStatements);

                }

            }

            // We have results!
            this.setSuggestions = function(results) {


                if (!this.goalStatements) {
                    // Parse the suggestions object
                    this.goalStatements = BW.helper.jsonParse(results, {"GoalStatements":{}}).GoalStatements;
                }

                var suggestions = this.goalStatements;

                if (!suggestions) { return; }

                // sort the list based on relevance to the term
                // suggestions = BW.helper.sortArrayByMatches(suggestions, this.term, true);
                suggestions = this.combGoalStatements(suggestions, this.term);

                // If they're already there, update them
                if (this.suggestions && this.suggestions.length) {
                    this.updateSuggestionList(suggestions, this.suggestions);
                    this.updateLines();

                } else {
                    this.defaultSuggestions = suggestions;
                    this.container.addClass('show');
                    this.suggestions = this.createSuggestionList(suggestions);

                }
            }

            // "AND" or "OR"
            this.searchOperator = "AND";

            this.combGoalStatements = function (o, term) {
                var statements = [];
                // Eliminate non-word characters
                term = term.replace(/[^A-Za-z0-9\s]/gi,' ')
                // Eliminate multiple and trailing spaces
                term = term.replace(/[\s]+/g,' ').replace(/\s$/,'');
                if (!term || term === '') {
                    for (var s in o) {
                        var item = o[s];
                        var d = {};
                        d = {
                            'id' : item['id'],
                            'title' : s
                        };
                        statements.push(d);

        } // nothing to match
                } else {
                    // An array of the terms we must match
                    var terms = [];

                    if (this.searchOperator === "AND") {
                        // If it's an AND operator, we have to match ALL of the words
                        terms = term.split(' ');
                    } else {
                        // If it's an OR operator, smush the terms together into one
                        //  Regexp string with an OR (|) inbetween the words
                        terms.push(term.replace(/\s/g, '|'));
                    }

                    for (s in o) {
                        var matches = []; // The total number of matches
                        for (var i = 0; i < terms.length; i++) {
                            var term = new RegExp(terms[i],'gi');
                            // We're matching the title, the search term and the category
                            // They currently all have equal weighting
                            var m = (s + ' ' + o[s].Keywords + ' ' + o[s].Category).match(term);

                            // If there are no matches, abort - as OR has only one item, and AND
                            //  requires all items to have matches
                            if (!m || !m.length) {
                                // make the length 0 so that this item is not added to statements
                                matches = [];
                                // no need to check any more.
                                break;
                            }

                            // Add the new matches on the end of the old ones
                            matches = matches.concat(m);
                        }

                        if (matches.length) {
                            statements.push([s, matches.length, o[s].id]);
                        }

                    }

                    statements.sort(function(a,b) {
                        //compare a[1] and b[1] and return -1, 0, or 1
                        var result = 1;
                        if (a[1] > b[1]) {
                                result = -1;
                        } else if (a[1] == b[1]) {
                                result = 0;
                        }
                        return result;
                    });

                    // Are there too few matches to make up all the suggestion boxes?
                    while (statements.length < this.suggestions.length) {
                        for (s in o) {
                            // need to filter this somehow so that we don't get multiple entries
                            statements.push([s,0]);
                        }
                    }

                }
                return statements;
            }

            // Create the suggesion list if there isn't one
            this.createSuggestionList = function(suggestions) {
                this.container.empty();
                var list = newSuggestionList(suggestions);
                var sg = this;
                list.children('li').each(function (i){
                    // makelines is also a handy reference as to are we on the homepage?
                    if (makelines) {
                        $(this).css({'left' : suggestionPositions[i][0]  + '%', 'top' : suggestionPositions[i][1] });
                    }
                    // All initial suggestions are not relevant yet
                    sg.suggestionRelevant.push(false);

                    /* Add the current xyz coordinates to the element - this is so that the
                         lines can be drawn without reading the positions using .css()
                         any CSS transition on the elements will cause the position to be read
                         before it's actually there, so the lines will be in the wrong places */

                    suggestionPositions[i].push(-200);

                });

                this.container.append(list);

                // No need to init Raphael or draw lines if makelines is false
                if (makelines) {
                    // Initialise Raphael
                    this.paper = Raphael(this.container.get(0), "100%", this.container.parent().height());  //container for connections canvas

                    // Draw some lines
                    for (var i = 0; i < this.lines.length; i++) {
                        var value = this.lines[i];
                        value.line = this.raphaelHelper.drawPath(list.children().get(value.start - 1), list.children().get(value.finish - 1));

                    }
                }

                // Correct perspective for IE
                if (makelines) {

                    list.children('li').each(function (){
                         sg.fallback($(this), -200, {}, false);
                    });
                }

                // return the suggestion elements
                return list.children();

            }

            // Make the markup for a new suggestion list
            var newSuggestionList = function(suggestions) {
                var o = ['<ol>'];
                var condition = makelines ? suggestions.length : maxnothome;
                for (var i = 0; (i < condition && i < suggestionPositions.length); i ++) {
                    // SJ - Added data-id and modified href for the right click to work
                    o.push('<li id="p' + (i + 1) + '" data-pos="' + i + '"><a data-id="' + suggestions[i].id + '" href="' + $('#searchResultPagePath').val() + "." + suggestions[i].id + ".html" + '" data-suggestion="' + suggestions[i].title + '" data-pos="">' + suggestions[i].title + '</a></li>')
                    //o.push('<li id="p' + (i + 1) + '" data-pos="' + i + '"><a href="think_about_saving_for_retirement" data-suggestion="' + suggestions[i][0] + '" data-pos="">' + suggestions[i][0] + '</a></li>')
                }
                o.push('</ol>');
                return $(o.join(''));
            }

            // There are new suggestions, update the list!
            this.updateSuggestionList = function(suggestions, list) {
                var sg = this;
                this.container.addClass('recommended');
                list.removeClass('relevant'); // reset all elements to irrelevant
                list.each(function(i){
                    $(this).children('a').text(suggestions[i][0]);
                    $(this).children('a').attr('data-suggestion', suggestions[i][0]);
                    // SJ - Added data-id and modified href for the right click to work
                    $(this).children('a').attr('data-id', suggestions[i][2]);
                    $(this).children('a').attr('href', $('#searchResultPagePath').val() + "." + suggestions[i][2] + ".html");

                    /*
                        Suggestion relevant will end up being a list like so:
                        [X, Y, Z, ... etc] where X is the number of matches
                            this way we can establish a relevance index
                            1 -> max are relevan
                            0 is no match
                    */
    //            var relevance = (suggestions[i].match(new RegExp(sg.term, 'gi')) || []).length;

                    var relevance = suggestions[i] ? suggestions[i][1] : 0;


                    if (relevance > 0) { // suggestion is relevant
                        $(this).addClass('relevant'); // change colour
                        var zi;
                        z = '0'; // bring it to the front
                        zi = '';
                    } else {
                        z = '-200px'; // push it to the back
                        zi = '-1';
                    }
                    $(this).css('transform', 'translateZ(' + z + ')'); // push it to the back
                    $(this).css('z-index', zi); // Make the Link un-clickable

                     //making goal statments non-clickable
                    $('#suggestions ol li').children().css('pointer-events', 'none');
                    //making relevant goal statments clickable
                    $('#suggestions.recommended ol li.relevant').children().css('pointer-events', 'auto');

                    z = parseInt(z);
                    sg.suggestionRelevant[i] = relevance;
                    // set the z coords based on relevance
                    suggestionPositions[i][2] = z;

                    // IE fallback
                    sg.fallback($(this), z, { 'opacity' : (relevance > 0 ? 1 : 1) });

                });
                // Anwar - Blocked this line of code for Fixing the accessibility defect
                // Always Search button should be enabled
                /* if (list.filter('.relevant').length) {
                    $('#search-go').removeClass('no-suggestions');
                } else {
                    $('#search-go').addClass('no-suggestions');
                } */

            }

            // Go back to the default suggestions (ie: search box has been cleared)
            this.updateToDefaultSuggestions = function() {
                var sg = this;
                var list = this.suggestions;
                if (!list || !list.length) { return; }
                this.container.removeClass('recommended');
                list.removeClass('relevant');
                list.each(function(i) {
                    // IE
                    var offset = ($(this).css('background-position') || '').match('100% 100%') ? $(this).height() : 0;
                    $(this).children('a').text(sg.defaultSuggestions[i].title);
                    $(this).children('a').attr('data-suggestion', sg.defaultSuggestions[i].title);
                    // SJ - Added data-id and modified href for the right click to work
                    $(this).children('a').attr('data-id', sg.defaultSuggestions[i].id);
                    $(this).children('a').attr('href', $('#searchResultPagePath').val() + "." + sg.defaultSuggestions[i].id + ".html");
                    $(this).css('transform', '');
                    $(this).css('z-index', '');

                    //making relevant goal statments clickable
                    $('#suggestions ol li').children().css('pointer-events', 'auto');
                    sg.suggestionRelevant[i] = 0;
                    // reset z coord
                    suggestionPositions[i][2] = -200;
                });
                this.updateLines();

            }

            // Update lines
            this.updateLines = function() {

                if (!this.suggestions) { return; }
                if (!makelines) { return false; }
                var sg = this;
                // max relevance of the current suggestions
                var max = Math.max.apply(this, this.suggestionRelevant);
                var perc = 100 / max;

                $.each(this.lines, function(i, l) {
                    var start = sg.suggestionRelevant[l.start - 1];
                    var finish = sg.suggestionRelevant[l.finish - 1];

                    // don't get the points from the elements - get where the elements *should* be
                    // that way we can use transitions

                    var sPos = sg.getAxisPointFrom3dTransform($(sg.suggestions[l.start-1]))
                    var fPos = sg.getAxisPointFrom3dTransform($(sg.suggestions[l.finish-1]))
                    // Raphael paths look like: "Mx1 y1Lx2 y2"
                    var path = "M" + sPos[0] + " "  + sPos[1] + "L" + fPos[0] + " " + fPos[1];

                    if (start && finish) { // blue line!
                        var multiplier = (start + finish) / 2 * perc / 100;
                        // More relevant connections have a higher opacity
                        var colour = "rgba(25,120,156," + multiplier + ")"
                        l.line.animate({ "path" : path, stroke: colour, 'stroke-opacity' : multiplier }, 400);

                         //making relevant goal statments clickable
                        $('#suggestions.recommended ol li.relevant').children().css('pointer-events', 'auto');

                    } else { // feint white line!
                        l.line.animate({ "path" : path, stroke: '#fff', 'stroke-opacity' : 0.1 }, 400);

                    }

                });
            }



            // Get the coords for the line to be drawn from, correcting for perspective
            this.getAxisPointFrom3dTransform = function(elem, calcOffset) {

                // calcOffset is true by default - do we calculate the background position offset?
                if (calcOffset === undefined) { calcOffset = true; }

                var base = this.container.children('ol');
                var bz = parseInt(base.css('perspective')) || this.basePerspectiveFallback; // fix
                var pos;

                // Get position of element
                var dataPos = suggestionPositions[parseInt(elem.attr('data-pos'))];

                // convert the x to pixels
                pos = [dataPos[0] * base.width()/100, dataPos[1], dataPos[2]];

                // offset x & y based on the transform-origin. This is NOT dynamic, it assumes 50% 50%
                pos[0] = pos[0] - base.width()/2;
                pos[1] = pos[1] - base.height()/2 + 5;

                if (calcOffset) {
                    // correct for background position, the line doesn't always come from 0,0
                    var offset = elem.css('background-position') ? elem.css('background-position').split(' ') : [elem.css('background-position-x'),elem.css('background-position-y')];

                    if (offset) {
                        pos[0] = pos[0] + (offset[0].match('100%|right') ? elem.width() - 5 : 0);
                        pos[1] = pos[1] + (offset[1].match('100%|bottom') ? elem.height() - 10 : 0);
                    }
                }

                var z = pos[2]
                // correct for perspective
                for (var i = 0; i < 2; i++) {
                    var ax = pos[i];
                    var bx = BW.helper.getAxisOffsetFrom3dTransform(ax, z, bz)
                    var x = bx + (i ? base.height() : base.width()) / 2;
                    pos[i] = Math.round(x);
                }
                return pos;

            }

            // Suggestion has been clicked
            this.suggested = function(e, term) {
                this.container.find('a').removeClass('active');
                e.addClass('active');
                // SJ - Added data-id and modified href for the right click to work
                var id = e.attr('data-id');
                BW.Search.suggested(term, id);
            }

            var s = this;
            this.raphaelHelper = {
                getElementCoord : function(elem) {
                 if (!elem) { return null; }
                 elem = $(elem);
                 return elem.position().left + ' ' + elem.position().top;
                },

                drawPath : function(a, b) {
                    var sPos = s.getAxisPointFrom3dTransform($(a))
                    var fPos = s.getAxisPointFrom3dTransform($(b))
                    var path = "M" + sPos[0] + " "  + sPos[1] + "L" + fPos[0] + " " + fPos[1];
                    var lineDefaults = {
                        stroke: '#fff',
                        'stroke-opacity' : 0.7,
                        'stroke-width': 2
                    };
                    return s.paper.path(path).attr(lineDefaults);
                }
            }

            // Tabbing through suggestions when using arrow keys
            this.tabThrough = function(e) {
                if (!e || !e.length) { e = this.suggestions.filter(':first-child'); }
                if (!e.is(':visible')) {
                    BW.Search.focus();
                } else {
                    e.children().focus();
                }
            }



            /* Does fallback translate & transitions for browsers that
                don't support Modernizr.csstransforms3d */

            this.fallback = function(element, z, additionalAnimations, animate) {
                if (Modernizr.csstransforms3d) { return; }

                element = $(element);
                if (animate === undefined) { animate = true; }

                if (makelines) {
                    additionalAnimations = this.fallbackTranslate(element, z, additionalAnimations);
                }

                // is this being animated?
                var fn = (animate) ? function () { element.animate(additionalAnimations, 800); } : function () { element.css(additionalAnimations); }

                // this is in a quick timeout because IE can't deal with doing it straight away
                setTimeout(fn, 100)

            }

            // Do the z offset calculations and add them to the css properties object
            this.fallbackTranslate = function(element, z, additionalAnimations) {
                if (Modernizr.csstransforms3d) { return; }
                var pos = this.getAxisPointFrom3dTransform(element, false);
                if (!additionalAnimations) { additionalAnimations = {}; }

                // really the other function was designed to be used for the lines, so there's some
                // automatic offset, which I'm taking a bit off here...
                additionalAnimations['left'] = pos[0];
                additionalAnimations['top'] = pos[1] - 5;

                return additionalAnimations;
            }

            this.kill = function () {
                this.paper.remove();
            }

            this.init = function () {

                // Setup things - these are all done here so that when SearchGoals
                // is re-Initialised, they all reset
                this.container = $('#suggestions'); // Element everything goes in
                // Holds the current search term to match
                this.term = '';

                /*  Holds the first returned array of suggestions as they will be the
                        default, client specified suggestions which will be shown whenever
                        there's no text in the search box */
                this.defaultSuggestions = null;

                // A whole array of true/false to check later if a particular suggestion is
                // relevant
                this.suggestionRelevant = []
                this.suggestions = null; // Collection of the suggestion elements

                makelines = (this.container.closest('.home').length);

                var sg = this;

                // suggestion clicks
                this.container.on('click', 'a', function(e) {
                    // SJ - Quick Fix for hiding the 'important information' info
                    $('.search-info').hide();
                    var siteCatJsonObj = {"intsearchphrase":$(this).attr('data-suggestion'),"goalstmtused":$(this).attr('data-suggestion'),"intsearchtype":"initial"};
                    var siteCatJsonStr = JSON.stringify(siteCatJsonObj);
                    getSiteCatContent('search',siteCatJsonStr);

                    // If you are the Home Page, remove the label copy text
                    if ($('#search-query').length > 0) {
                        var searchLabel = $('#searchLabel');
                                searchLabel.text('');
                    }

                    e.preventDefault();
                    // SJ - Added data-id and modified href for the right click to work
                    $('#search-form').attr('action',$(this).attr('data-id'));
                    sg.suggested($(this), $(this).attr('data-suggestion'));

                });

                this.container.on('keyup', 'li a', function (e) {
                    //BW.helper.debug(e.which);
                    switch (e.which) {
                        case 27 : // escape key
                            BW.Search.focus();
                            break;
                        default :
                            return;
                    }
                    return true;
                });

                this.container.on('keydown', 'li a', function (e) {
                    BW.helper.debug(e);
                    switch (e.which) {
                        /*
                        case 27: // escape key
                            BW.Search.focus();
                            break;

                        This needs to go on KeyUp because having it on keydown fires the keyup AFTER
                            the search box has focus, collapsing the search section

                        */
                        case 37:
                        case 38:
                            e.preventDefault();
                            sg.tabThrough($(this).parent().prev());
                            break;
                        case 39:
                        case 40 : // arrow keys
                            e.preventDefault();
                            sg.tabThrough($(this).parent().next());
                        default:
                    }
                });

                // Get initial suggestions - no real reason for timeout
                setTimeout(function () { sg.getSuggestions(''); }, 10);
            }
        }
        return new SG();
    }());

}(window.BW = window.BW || {}, jQuery));