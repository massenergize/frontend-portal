// Defining CONSTANTS object for manipulation...
const CONSTANTS = {
    URL: {
        //ROOT: "http://api.massenergize.org"
        ROOT: "http://localhost:8000"
        //ROOT: "http://10.0.0.187:8000"
    }
}

// ...and dependence on other defined constants
CONSTANTS.URL["USER"] = CONSTANTS.URL.ROOT + "/user/";
CONSTANTS.URL["ACTIONS"] = CONSTANTS.URL.USER + "actions";
CONSTANTS.URL["SERVICES"] = CONSTANTS.URL.USER + "services";
CONSTANTS.URL["MENU"] = CONSTANTS.URL.USER + "menu";
CONSTANTS.URL["ABOUTUS"] = CONSTANTS.URL.USER + "aboutus"
CONSTANTS.URL["EVENTS"] = CONSTANTS.URL.USER + "events"
CONSTANTS.URL["STORIES"] = CONSTANTS.URL.USER + "stories"
CONSTANTS.URL["TEAMS"] = CONSTANTS.URL.USER + "teams"

export default CONSTANTS;