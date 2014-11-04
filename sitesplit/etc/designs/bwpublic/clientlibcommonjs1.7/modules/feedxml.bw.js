(function (BW, $, undefined) {

    /* =====================================================================
     19:  XML Feed for insight landing grid
     Description:

     Templates:  T104 Insight landing template
     Components: C214-Research-landing-grid
    ====================================================================== */

    BW.FeedXML = (function () {

        var FeedXML = function () {

            this.init = function() {

                if ($('.blog-link').length) {
                    $('#grid-blog').FeedEk({
                        FeedUrl : $('.blog-link').val(),
                        SpecificItem: 2,
                        ShowDesc : true,
                        ShowPubDate:true
                    });
                }

                if ($('.blog-link-2').length) {
                    $('#grid-blog-2').FeedEk({
                        FeedUrl : $('.blog-link-2').val(),
                        MaxCount : 1,
                        ShowDesc : true,
                        ShowPubDate:true
                    });
                }

                 $('#footer-news-blog').FeedEk({
                    FeedUrl : $('.footer-news').val(),
                    MaxCount : 1,
                    ShowDesc : true,
                    ShowPubDate:true,
                    FooterItem: true
                });

                 $("div[id^='rss-conten']").each(function(i) {
                     var rssCnt =  $('#rsscount').val();

                     if( rssCnt>3){
                         rssCnt = 3;
                     }

                     $(this).attr('id', "rss-content-" + (i + 1));
                     $(this).children().attr('class', "service-landing-blog-link-" + (i + 1));

                     $('#rss-content-'+ (i + 1)).FeedEk({
                         FeedUrl : $('.service-landing-blog-link-' + (i + 1)).val(),
                         MaxCount :rssCnt,
                         ShowDesc : true,
                         ShowPubDate:true,
                         TitleLinkTarget:'_blank',
                         ServiceLandingRss: true
                     });

                });

            }
        }
        return new FeedXML();
    }());


}(window.BW = window.BW || {}, jQuery));