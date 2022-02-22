import URLS from "./urls";
import { IS_PROD, IS_CANARY, IS_LOCAL } from "../config/config";
import store from '../redux/store';


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
) {

  // add some meta data for context in backend
  dataToSend = { 
    __is_prod: IS_PROD || IS_CANARY,
    ..._getCurrentCommunityContext(),
    ...dataToSend 
  };

  // make leading '/' optional
  if (destinationUrl.charAt(0) === '/') {
    destinationUrl = destinationUrl.substring(1);
  }
    
  if (IS_LOCAL) {
    destinationUrl = "api/" + destinationUrl;
  }
  
  const formData = new FormData();
  Object.keys(dataToSend).map(k => (formData.append(k, dataToSend[k])));

  const response = await fetch(`${URLS.ROOT}/${destinationUrl}`, {
    credentials: 'include',
    method: 'POST',
    body: formData
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
    return { success: false, error };
  }
}

/**
 * Gets the current community domain we are on
 */
function _getCurrentCommunityContext(){
    const { page } = store.getState() || {}
    const { community, __is_sandbox } = page || {}
    const { subdomain } = community || {}
    return { __community: subdomain, __is_sandbox }
}

export function set_cookie(cookies, key, value) {
  cookies.set(key, value, { path: '/' });
}

export function get_cookie(cookies, key) {
  let cookie = cookies.get(key);
  return cookie;
}

function log_device(cookies, community_id) {
  // TODO: Get IP address and other info
  let device = get_cookie(cookies, "device");
  let body;
  let response;
  if (device === undefined) {
    body = {};
  } else {
    body = { id: device };
  }
  if (community_id) {
    body = { ...body, community_id:community_id };
  }

  response = apiCall('/device.log', body).then(function(result) {
    try {
      if (result.data) {
        // David: do we want to set_cookie again if get_cookie indicated already was a cookie?
        if (!device || device === undefined) set_cookie(cookies, "device", result.data.id);
      }
    } catch (error) {
      console.log(error); // Debug
      return { success: false, error };
    }
  }, function(error) {
    // console.log(error);
  });
  return response;
}

export async function device_checkin(cookies, community_id=null) {
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
  return sections.filter(x => x.name === section)[0];
};
