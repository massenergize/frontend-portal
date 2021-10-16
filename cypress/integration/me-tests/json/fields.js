const DOMAIN = "http://localhost:3000/";
const COMMUNITY = "wayland";
const BASE_URL = DOMAIN + COMMUNITY + "/";

export default {
  emailToUse: "frimpong@kehillahglobal.com",
  passwordToUse: "Pongo123",
  urls: {
    login: BASE_URL + "signin",
    registration: BASE_URL + "signup",
    landing: DOMAIN,
    homepage: BASE_URL,
    actions: BASE_URL + "actions",
  },
  community: COMMUNITY,
};
