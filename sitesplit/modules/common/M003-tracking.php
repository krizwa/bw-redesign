
<script type="text/javascript" src="etc/designs/bwpublic/js/wt_capi.js"></script>
<script type="text/javascript" src="etc/designs/bwpublic/js/webtrends_additional.js"></script>
<script type="text/javascript">
    if (window.WTOptimize) {
        WTOptimize.setup({
            s_pageMode: 'head',
            s_pageDisplayMode: 'shift'
        });
    }
    var _tag = new WebTrends();
    _tag.dcsGetId();
    // Add custom parameters here.
    //_tag.DCSext.param_name=param_value;
    _tag.dcsCollect();
</script>
<!-- Whether CQ Impression Required? -->
<input id="cqImpressionTrack" type="hidden" value="false" />
<!-- Get the URLs for CQ Impression Tracking -->
<input id="trackingURL" type="hidden" value="http://localhost:4502/libs/wcm/stats/tracker" />
<input id="currentPagePath" type="hidden" value="/content/bwpublic/en_gb/home/wealth-management" />
<script type="text/javascript">
    function trackMVTImpression() {}
</script>

<input id="websiteAuthMode" type="hidden" value="" />
<input id="storyid" type="hidden" value="null" />
