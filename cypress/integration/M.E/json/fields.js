const DOMAIN = "http://localhost:3000/";
const COMMUNITY = "wayland";
const BASE_URL = DOMAIN + COMMUNITY + "/";
// const urlParams = "?tour=false"; // useful, dont remove
const urlParams = "";
export default {
  emailToUse: "mrfimpong+30@gmail.com",
  passwordToUse: "123456",
  urls: {
    login: BASE_URL + "signin",
    registration: BASE_URL + "signup",
    landing: DOMAIN,
    homepage: BASE_URL,
    actions: BASE_URL + "actions" + urlParams,
    services: BASE_URL + "services" + urlParams,
    testimonials: BASE_URL + "testimonials" + urlParams,
    teams: BASE_URL + "teams" + urlParams,
    events: BASE_URL + "events" + urlParams,
    contactus: BASE_URL + "contactus+urlParams",
  },
  community: COMMUNITY,
};
