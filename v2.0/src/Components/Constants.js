// Defining CONSTANTS object for manipulation...
const CONSTANTS = {
    URL: {
        ROOT: "http://api.massenergize.org"
    }
}

// ...and dependence on other defined constants
CONSTANTS.URL["USER"] = CONSTANTS.URL.ROOT + "/user";
CONSTANTS.URL["ACTIONS"] = CONSTANTS.URL.USER + "/actions";

export default CONSTANTS;