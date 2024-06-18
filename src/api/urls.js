// Defining URLS object for manipulation...
import { IS_PROD, IS_CANARY, IS_LOCAL } from "../config";
export const LOCAL_URL = "http://localhost:8000";
export const MASSENERGIZE_PRODUCTION_URL = "https://community.massenergize.org";
export const DEV_URL =   "https://communities.massenergize.dev";

export const REDIRECT_URL = IS_LOCAL ? LOCAL_URL : IS_PROD ? MASSENERGIZE_PRODUCTION_URL : DEV_URL;

let URLS = {};

if (IS_LOCAL) {
  URLS["ROOT"] = "http://massenergize.test:8000";
  URLS["COMMUNITIES"] = "http://communities.massenergize.test:8000";
  URLS["SHARE"] = "http://share.massenergize.test:8000";
} else if (IS_CANARY) {
  URLS["ROOT"] = "https://api-canary.massenergize.org";
  URLS["COMMUNITIES"] = "https://communities-canary.massenergize.org";
  URLS["SHARE"] = "https://share-canary.massenergize.org";
} else if (IS_PROD) {
  URLS["ROOT"] = "https://api.massenergize.org";
  URLS["COMMUNITIES"] = "https://communities.massenergize.org";
  URLS["SHARE"] = "https://share.massenergize.org";
} else {
  URLS["ROOT"] = "https://api.massenergize.dev";
  URLS["COMMUNITIES"] = "https://community.massenergize.dev";
  URLS["SHARE"] = "https://share.massenergize.dev";
}

URLS["NONE_CUSTOM_WEBSITE_LIST"] = new Set([
  "community.massenergize.org",
  "communities.massenergize.org",
  "community.massenergize.dev",
  "communities.massenergize.dev",
  "community-dev.massenergize.org",
  "community-canary.massenergize.org",
  "community-canary.massenergize.dev",
  "community.massenergize.test",
  "massenergize.test",
  "localhost",
]);
export default URLS;

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
