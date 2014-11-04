function getSiteCatContent(type, siteCatJsonStr) {
  if ($('#cookiePerformance').val() == "true") {
		var siteCatJsonParse = JSON.parse(siteCatJsonStr);
		switch (type)
		{
		case 'cookies':
			adv.trackEvent(type,"","","","","","","","","","","",siteCatJsonParse.rejectedcookies);

			break;
		case 'external':
			adv.trackEvent(type,"","",siteCatJsonParse.extservicename,"","","","","","","","","");

			break;
		case 'search':
			adv.trackEvent(type,"","","","",siteCatJsonParse.intsearchphrase,"",siteCatJsonParse.intsearchtype,"","","",siteCatJsonParse.goalstmtused,"");

			break;
		case 'content':
			adv.trackEvent(type,siteCatJsonParse.contenttype,siteCatJsonParse.contentname,"","","","","",siteCatJsonParse.interactiontype,"","","","");

			break;
		case 'collection':
			adv.trackEvent(type,"","","","","","","","","","","","");

			break;
		case 'share':
			adv.trackEvent(type,siteCatJsonParse.contenttype,siteCatJsonParse.contentname,"","","","","","",siteCatJsonParse.sharetype,"","","");

			break;
		case 'cta-click':
			adv.trackEvent(type,"","","","","","","","","",siteCatJsonParse.ctatype,"","");

			break;
		case 'cta-submit':
			adv.trackEvent(type,"","","","","","","","","",siteCatJsonParse.ctatype,"","");

			break;
		default :
			break;
		}
	}
}