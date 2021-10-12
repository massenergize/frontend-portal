const DOMAIN = "http://localhost:3000/";
const COMMUNITY = "wayland";
const BASE_URL = DOMAIN + COMMUNITY + "/";

export default {
  emailToUse: "frimpong@kehillahglobal.com",
  passwordToUse: "Pongo123",
  urls: {
    login: DOMAIN + "signin",
    registration: DOMAIN + "signup",
    landing: DOMAIN,
    homepage: BASE_URL,
    actions: DOMAIN + "actions",
  },
  community: COMMUNITY,
};
