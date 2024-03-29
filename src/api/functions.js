import URLS from "./urls";
import store from "../redux/store";
import Cookies from "universal-cookie";
import { AUTH_TOKEN } from "../components/Pages/Auth/shared/utils";
import * as Sentry from "@sentry/react";
import { IS_CANARY, IS_LOCAL, IS_PROD } from "../config";


/**
 * Handles making a POST request to the backend as a form submission
 * It also adds meta data for the BE to get context on the request coming in.
 *
 * @param { String } destinationUrl
 * @param { String } dataToSend
 * @param { String } relocationPage
 */
export async function apiCall(
  destinationUrl,
  dataToSend = {},
  relocationPage = null
  ,options = {}
) {
  // add some meta data for context in backend
  dataToSend = {
    __is_prod: IS_PROD || IS_CANARY,
    ..._getCurrentCommunityContext(),
    ...dataToSend,
  };

  // make leading '/' optional
  if (destinationUrl.charAt(0) === "/") {
    destinationUrl = destinationUrl.substring(1);
  }

  if (IS_LOCAL) {
    destinationUrl = "api/" + destinationUrl;
  }

  const authToken = get_cookie(new Cookies(), "token"); // This is needed because in tests, cypress doesnt pass the token directly in the headers
  const authTokenInLocalStorage = localStorage.getItem(AUTH_TOKEN); // This is also only used in test. Its a fallback method to retrieve token
  const formData = new FormData();

  Object.keys(dataToSend).map((k) => formData.append(k, dataToSend[k]));
  if (authToken)
    formData.append("__token", authToken || authTokenInLocalStorage || null);

  const response = await fetch(`${URLS.ROOT}/${destinationUrl}`, {
    credentials: "include",
    method: "POST",
    body: formData,
    ...(options || {})
  });
  try {
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    } else if (!json.success) {
      if (json.error === "session_expired") {
        window.location.href = window.location;
      } else {
        console.log(destinationUrl, json.error);
      }
    }
    return json;
  } catch (error) {
    const errorText = error.toString();
    if (errorText.search("JSON")>-1) {
      const errorMessage = "Invalid response to "+destinationUrl+" Data: "+JSON.stringify(dataToSend);
      // this will send message to Sentry Slack channel
      Sentry.captureMessage(errorMessage);
      return { success: false, error: errorMessage };
    }
    else {
      Sentry.captureException(error);
      return { success: false, error: error.toString() };
    }
  }
}

/**
 * Gets the current community domain we are on
 */
function _getCurrentCommunityContext() {
  const { page } = store.getState() || {};
  const { community, __is_sandbox } = page || {};
  const { subdomain } = community || {};
  return { __community: subdomain, __is_sandbox };
}

const getCommunityID = () => {
  const { page } = store.getState() || {};
  const { community } = page || {};
  return community?.id;
}

export function set_cookie(cookies, key, value) {
  cookies.set(key, value, { path: "/" });
}

export const setCookieInAPi = (cookies) => {
    let community_id = getCommunityID();
    log_device(cookies, community_id, true);
}

export function get_cookie(cookies, key) {
  let cookie = cookies.get(key);
  return cookie;
}

function log_device(cookies, community_id, acceptCookies=false) {
  // TODO: Get IP address and other info
  let device = get_cookie(cookies, "device");
  let body;
  let response;
  if (device === undefined) {
    body = acceptCookies ? { has_accepted_cookies: true } : {};
  } else {
    body = acceptCookies? { id: device, has_accepted_cookies: acceptCookies }: {id: device,};
  }
  if (community_id) {
    body = { ...body, community_id: community_id };
  }

  response = apiCall("/device.log", body).then(
    function (result) {
      try {
        if (result.data) {
          // David: do we want to set_cookie again if get_cookie indicated already was a cookie?

          // if the user has already accepted cookies but on a new window don't show banner
          if (result?.data?.has_accepted_cookies) {
            set_cookie(cookies, "acceptsCookies", 1);
          }
            if (!device || device === undefined)
              set_cookie(cookies, "device", result.data.id);


        }
      } catch (error) {
        console.log(error); // Debug
        return { success: false, error };
      }
    },
    function (error) {
      // console.log(error);
    }
  );
  return response;
}

export async function device_checkin(cookies, community_id = null) {
  log_device(cookies, community_id);
}

/**
 * Takes out the section that matches with the name given
 * @param {JSONObject | JSONArray} json : the json object of either the page data or the json array of the sections
 * @param {String} section : the name of the section to extract
 * @param {Boolean} sectionOnly : specifying if the json provided is json array of sections or page data
 */
export const section = (json, section, sectionOnly) => {
  let sections = sectionOnly ? json : json.sections;
  return sections.filter((x) => x.name === section)[0];
};
