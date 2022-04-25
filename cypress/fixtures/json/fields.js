import URLS from "../../../src/api/urls";
var DOMAIN = "http://localhost:3000/";

var COMMUNITY = "wayland"; // Change this to a community that exists in your DB
const BASE_URL = DOMAIN + COMMUNITY + "/";
const urlParams = "?tour=false"; // useful, dont remove
const API_ROOT = URLS["ROOT"] + "/api/";
export default {
  api: {
    root: API_ROOT,
    urls: {
      authenticate: API_ROOT + "auth.login.testmode",
      fetchActions: API_ROOT + "actions.list",
      fetchEvents: API_ROOT + "events.list",
      fetchTeams: API_ROOT + "teams.list",
      fetchTestimonials: API_ROOT + "testimonials.list",
    },
  },
  subdomain: COMMUNITY,
  emailToUse: "mrfimpong+30@gmail.com",
  passwordToUse: "123456",
  params: urlParams,
  urls: {
    login: BASE_URL + "signin",
    registration: BASE_URL + "signup",
    landing: DOMAIN,
    homepage: { withParams: BASE_URL + urlParams, raw: BASE_URL },
    actions: {
      withParams: BASE_URL + "actions" + urlParams,
      raw: BASE_URL + "actions",
    },
    services: {
      withParams: BASE_URL + "services" + urlParams,
      raw: BASE_URL + "services",
    },
    testimonials: {
      withParams: BASE_URL + "testimonials" + urlParams,
      raw: BASE_URL + "testimonials",
    },
    teams: {
      withParams: BASE_URL + "teams" + urlParams,
      raw: BASE_URL + "teams",
    },
    events: {
      withParams: BASE_URL + "events" + urlParams,
      raw: BASE_URL + "events",
    },
    contactus: {
      withParams: BASE_URL + "contactus" + urlParams,
      raw: BASE_URL + "contactus",
    },
  },
  community: COMMUNITY,
};
