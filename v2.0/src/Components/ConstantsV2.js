// Defining CONSTANTS object for manipulation...
const CONSTANTS = {
    URL: {
        //ROOT: "http://api.massenergize.org"
        ROOT: "http://localhost:8000"
        //ROOT: "http://10.0.0.187:8000"
    }
}

/**
 * These are all the api constants, minus a few that need to have ids in the middle ie: v2/household/hid/actions
 * after any of the singlular request, you need to add a /<id> to the end of the url
 * after any of the plural requests you can specify filters to add by adding "?<model-variable-name>=<value>&<model-variable2-name>=<value2>..."
 *      this will return a list even if there is only one element in it
 *      need to use the actual model variable names, not the ones in the README.md
 *          @TODO fix the read me to make it correct for new url patterns and have the arg names match the model var names
 */
// ...and dependence on other defined constants
CONSTANTS.URL["V2"] = CONSTANTS.URL.ROOT + "/v2/";
CONSTANTS.URL["ACTIONS"] = CONSTANTS.URL.V2 + "actions";
CONSTANTS.URL["ACTION"] = CONSTANTS.URL.V2 + "action"; //add the id after this
CONSTANTS.URL["ACTION-PROPERTIES"] = CONSTANTS.URL.V2 + "action-properties";
CONSTANTS.URL["ACTION-PROPERTY"] = CONSTANTS.URL.V2 + "action-property"; //add the id after this
CONSTANTS.URL["BILLING-STATEMENTS"] = CONSTANTS.URL.V2 + "billing-statements";
CONSTANTS.URL["BILLING-STATEMENT"] = CONSTANTS.URL.V2 + "billing-statement"; //add the id after this
CONSTANTS.URL["COMMUNITIES"] = CONSTANTS.URL.V2 + "communities";
CONSTANTS.URL["COMMUNITY"] = CONSTANTS.URL.V2 + "community"; //add the id after this
CONSTANTS.URL["COMMUNITY-ADMINS"] = CONSTANTS.URL.V2 + "community-admins";
CONSTANTS.URL["COMMUNITY-ADMIN"] = CONSTANTS.URL.V2 + "community-admin"; //add the id after this
CONSTANTS.URL["DATA"] = CONSTANTS.URL.V2 + "data"; //can add the id after this or not, either way
CONSTANTS.URL["EMAIL-CATEGORIES"] = CONSTANTS.URL.V2 + "email-categories";
CONSTANTS.URL["EMAIL-CATEGORY"] = CONSTANTS.URL.V2 + "email-category"; //add the id after this
CONSTANTS.URL["EVENTS"] = CONSTANTS.URL.V2 + "events";
CONSTANTS.URL["EVENT"] = CONSTANTS.URL.V2 + "event"; //add the id after this
CONSTANTS.URL["EVENT-ATTENDEES"] = CONSTANTS.URL.V2 + "event-attendees";
CONSTANTS.URL["GOALS"] = CONSTANTS.URL.V2 + "goals";
CONSTANTS.URL["GOAL"] = CONSTANTS.URL.V2 + "goal"; //add the id after this
CONSTANTS.URL["GRAPHS"] = CONSTANTS.URL.V2 + "graphs";
CONSTANTS.URL["GRAPH"] = CONSTANTS.URL.V2 + "graph"; //add the id after this
CONSTANTS.URL["HOUSEHOLDS"] = CONSTANTS.URL.V2 + "households";
CONSTANTS.URL["HOUSEHOLD"] = CONSTANTS.URL.V2 + "household"; //add the id after this
CONSTANTS.URL["LOCATIONS"] = CONSTANTS.URL.V2 + "locations";
CONSTANTS.URL["LOCATION"] = CONSTANTS.URL.V2 + "location"; //add the id after this
CONSTANTS.URL["MEDIA"] = CONSTANTS.URL.V2 + "media"; //can add the id after this or not, either way
CONSTANTS.URL["MENU"] = CONSTANTS.URL.V2 + "menu"; //can add the id after this or not, either way
CONSTANTS.URL["PAGES"] = CONSTANTS.URL.V2 + "pages";
CONSTANTS.URL["PAGE"] = CONSTANTS.URL.V2 + "page";  //add the id after this
CONSTANTS.URL["PAGE-SECTIONS"] = CONSTANTS.URL.V2 + "page-sections";
CONSTANTS.URL["PAGE-SECTION"] = CONSTANTS.URL.V2 + "page-section";  //add the id after this
CONSTANTS.URL["PERMISSIONS"] = CONSTANTS.URL.V2 + "permissions";
CONSTANTS.URL["PERMISSION"] = CONSTANTS.URL.V2 + "permission";  //add the id after this
CONSTANTS.URL["POLICIES"] = CONSTANTS.URL.V2 + "policies";
CONSTANTS.URL["POLICY"] = CONSTANTS.URL.V2 + "policy";  //add the id after this
CONSTANTS.URL["ROLES"] = CONSTANTS.URL.V2 + "roles";
CONSTANTS.URL["ROLE"] = CONSTANTS.URL.V2 + "role";  //add the id after this
CONSTANTS.URL["SERVICES"] = CONSTANTS.URL.V2 + "services";
CONSTANTS.URL["SERVICE"] = CONSTANTS.URL.V2 + "service";  //add the id after this
CONSTANTS.URL["SLIDERS"] = CONSTANTS.URL.V2 + "sliders";
CONSTANTS.URL["SLIDER"] = CONSTANTS.URL.V2 + "slider";  //add the id after this
CONSTANTS.URL["SLIDER-IMAGES"] = CONSTANTS.URL.V2 + "slider-images";
CONSTANTS.URL["SLIDER-IMAGE"] = CONSTANTS.URL.V2 + "slider-image";  //add the id after this
CONSTANTS.URL["STATISTICS"] = CONSTANTS.URL.V2 + "statistics";
CONSTANTS.URL["STATISTIC"] = CONSTANTS.URL.V2 + "statistic";  //add the id after this
CONSTANTS.URL["STORIES"] = CONSTANTS.URL.V2 + "stories";
CONSTANTS.URL["STORY"] = CONSTANTS.URL.V2 + "story";  //add the id after this
CONSTANTS.URL["SUBSCRIBERS"] = CONSTANTS.URL.V2 + "subscribers";
CONSTANTS.URL["SUBSCRIBER"] = CONSTANTS.URL.V2 + "subscriber";  //add the id after this
CONSTANTS.URL["SUBSCRIBER-EMAIL-PREFS"] = CONSTANTS.URL.V2 + "subscriber-email-preferences";
CONSTANTS.URL["SUBSCRIBER-EMAIL-PREF"] = CONSTANTS.URL.V2 + "subscriber-email-preference";  //add the id after this
CONSTANTS.URL["TAGS"] = CONSTANTS.URL.V2 + "tags";
CONSTANTS.URL["TAG"] = CONSTANTS.URL.V2 + "tag";  //add the id after this
CONSTANTS.URL["TAG-COLLECTIONS"] = CONSTANTS.URL.V2 + "tag-collections";
CONSTANTS.URL["TAG-COLLECTION"] = CONSTANTS.URL.V2 + "tag-collection";  //add the id after this
CONSTANTS.URL["TEAMS"] = CONSTANTS.URL.V2 + "teams";
CONSTANTS.URL["TEAM"] = CONSTANTS.URL.V2 + "team"; //add the id after this
CONSTANTS.URL["TESTIMONIALS"] = CONSTANTS.URL.V2 + "testimonials";
CONSTANTS.URL["TESTIMONIAL"] = CONSTANTS.URL.V2 + "testimonial"; //add the id after this
CONSTANTS.URL["USERS"] = CONSTANTS.URL.V2 + "users";
CONSTANTS.URL["USER"] = CONSTANTS.URL.V2 + "user"; //add the id after this
CONSTANTS.URL["USER-GROUPS"] = CONSTANTS.URL.V2 + "user-groups";
CONSTANTS.URL["USER-GROUP"] = CONSTANTS.URL.V2 + "user-group"; //add the id after this
CONSTANTS.URL["VENDORS"] = CONSTANTS.URL.V2 + "vendors";
CONSTANTS.URL["VENDOR"] = CONSTANTS.URL.V2 + "vendor"; //add the id after this

export default CONSTANTS;