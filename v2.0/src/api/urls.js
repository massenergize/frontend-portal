// Defining URLS object for manipulation...
import { IS_PROD, IS_CANARY, IS_LOCAL } from '../config'

let URLS = {}
if(IS_LOCAL){	
	URLS["ROOT"] = "http://localhost:8000"
} else if(IS_CANARY){
	URLS["ROOT"] =  "https://api-canary.massenergize.org"
}else if(IS_PROD) {
	URLS["ROOT"] =  "https://api.massenergize.org"
} else{
	URLS["ROOT"] =  "https://api-dev.massenergize.org"
}

/** 
 * These are all the api URLS, minus a few that need to have ids in the middle ie: v2/household/hid/actions
 * after any of the singlular request, you need to add a /<id> to the end of the url
 * after any of the plural requests you can specify filters to add by adding "?<model-variable-name>=<value>&<model-variable2-name>=<value2>..."
 *      this will return a list even if there is only one element in it
 *      need to use the actual model variable names, not the ones in the README.md
 *          @TODO fix the read me to make it correct for new url patterns and have the arg names match the model var names
 */
// ...and dependence on other defined URLS

// SAM - all these can be deleted, right?

//URLS["V2"] = URLS.ROOT + "/v2/"; 
//URLS["V3"] = URLS.ROOT + "/v3/";
//URLS["V3_COMMUNITIES"] = URLS.V3+"communities.list";
//URLS["COMMUNITY"] = URLS.V2 + "community/";
//URLS["V3_COMMUNITY"] = URLS.V3+"community/";
//URLS["V3_COMMUNITIES_STATS"] = "graphs.communities.impact";
//
//URLS["ACTIONS"] = URLS.V2 + "actions";
//URLS["ACTION"] = URLS.V2 + "action"; //add the id after this
//URLS["ACTION_PROPERTIES"] = URLS.V2 + "action-properties";
//URLS["ACTION_PROPERTY"] = URLS.V2 + "action-property"; //add the id after this
//URLS["BILLING_STATEMENTS"] = URLS.V2 + "billing-statements";
//URLS["BILLING_STATEMENT"] = URLS.V2 + "billing-statement"; //add the id after this
//URLS["COMMUNITIES"] = URLS.V2 + "communities";
//URLS["COMMUNITY_ADMINS"] = URLS.V2 + "community-admins";
//URLS["COMMUNITY_ADMIN_GROUP"] = URLS.V2 + "community-admin-group/"; //add the id after this
//URLS["COMMUNITIES_STATS"] = URLS.V2 + "communities/stats";
//URLS["DATA"] = URLS.V2 + "data"; //can add the id after this or not, either way
//URLS["EMAIL_CATEGORIES"] = URLS.V2 + "email-categories";
//URLS["EMAIL_CATEGORY"] = URLS.V2 + "email-category"; //add the id after this
//URLS["EVENTS"] = URLS.V2 + "events";
//URLS["EVENT"] = URLS.V2 + "event"; //add the id after this
//URLS["EVENT_ATTENDEES"] = URLS.V2 + "event-attendees";
//URLS["EVENT_ATTENDEE"] = URLS.V2 + "event-attendee"
//URLS["GOALS"] = URLS.V2 + "goals";
//URLS["GOAL"] = URLS.V2 + "goal"; //add the id after this
//URLS["GRAPHS"] = URLS.V2 + "graphs";
//URLS["GRAPH"] = URLS.V2 + "graph"; //add the id after this
//URLS["HOUSEHOLDS"] = URLS.V2 + "households";
//URLS["HOUSEHOLD"] = URLS.V2 + "household"; //add the id after this
//URLS["LOCATIONS"] = URLS.V2 + "locations";
//URLS["LOCATION"] = URLS.V2 + "location"; //add the id after this
//URLS["MEDIA"] = URLS.V2 + "media"; //can add the id after this or not, either way
//URLS["MENUS"] = URLS.V2 + "menus";
//URLS["MENU"] = URLS.V2 + "menu";
//URLS["PAGES"] = URLS.V2 + "pages";
//URLS["PAGE"] = URLS.V2 + "page";  //add the id after this
//URLS["PAGE_SECTIONS"] = URLS.V2 + "page-sections";
//URLS["PAGE_SECTION"] = URLS.V2 + "page-section";  //add the id after this
//URLS["PERMISSIONS"] = URLS.V2 + "permissions";
//URLS["PERMISSION"] = URLS.V2 + "permission";  //add the id after this
//URLS["POLICIES"] = URLS.V2 + "policies";
//URLS["POLICY"] = URLS.V2 + "policy";  //add the id after this
//URLS["ROLES"] = URLS.V2 + "roles";
//URLS["ROLE"] = URLS.V2 + "role";  //add the id after this
//URLS["SERVICES"] = URLS.V2 + "services";
//URLS["SERVICE"] = URLS.V2 + "service";  //add the id after this
//URLS["SLIDERS"] = URLS.V2 + "sliders";
//URLS["SLIDER"] = URLS.V2 + "slider";  //add the id after this
//URLS["SLIDER_IMAGES"] = URLS.V2 + "slider-images";
//URLS["SLIDER_IMAGE"] = URLS.V2 + "slider-image";  //add the id after this
//URLS["STATISTICS"] = URLS.V2 + "statistics";
//URLS["STATISTIC"] = URLS.V2 + "statistic";  //add the id after this
//URLS["STORIES"] = URLS.V2 + "stories";
//URLS["STORY"] = URLS.V2 + "story";  //add the id after this
//URLS["SUBSCRIBERS"] = URLS.V2 + "subscribers";
//URLS["SUBSCRIBER"] = URLS.V2 + "subscriber";  //add the id after this
//URLS["SUBSCRIBER_EMAIL_PREFS"] = URLS.V2 + "subscriber-email-preferences";
//URLS["SUBSCRIBER_EMAIL_PREF"] = URLS.V2 + "subscriber-email-preference";  //add the id after this
//URLS["TAGS"] = URLS.V2 + "tags";
//URLS["TAG"] = URLS.V2 + "tag";  //add the id after this
//URLS["TAG_COLLECTIONS"] = URLS.V2 + "tag-collections";
//URLS["TAG_COLLECTION"] = URLS.V2 + "tag-collection";  //add the id after this
//URLS["TEAMS"] = URLS.V2 + "teams";
//URLS["TEAM"] = URLS.V2 + "team"; //add the id after this
//URLS["LEAVE"] = "v3/teams.leave"; //add the id after this
//URLS["TEAMS_STATS"] = URLS.V2 + "teams/stats"; //need to specify community after this
//URLS["TESTIMONIALS"] = URLS.V2 + "testimonials";
//URLS["TESTIMONIAL"] = URLS.V2 + "testimonial"; //add the id after this
//URLS["USERS"] = URLS.V2 + "users";
//URLS["USER"] = URLS.V2 + "user"; //add the id after this
//URLS["USER_GROUPS"] = URLS.V2 + "user-groups";
//URLS["USER_GROUP"] = URLS.V2 + "user-group"; //add the id after this
//URLS["VENDORS"] = URLS.V2 + "vendors";
//URLS["VENDOR"] = URLS.V2 + "vendor"; //add the id after this
//URLS["VERIFY"] = URLS.V2 + "verify";

export default URLS;


