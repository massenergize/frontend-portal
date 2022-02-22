const DOMAIN = "http://localhost:3000/";
const COMMUNITY = "wayland";
const BASE_URL = DOMAIN + COMMUNITY + "/";
const urlParams = "?tour=false"; // useful, dont remove

export default {
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
