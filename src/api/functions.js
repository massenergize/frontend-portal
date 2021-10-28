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

function set_cookie(cookies, key, value) {
  cookies.set(key, value, { path: '/' });
}

function get_cookie(cookies, key) {
  let cookie = cookies.get(key);
  return cookie;
}

function log_device(cookies) {
  // TODO: Get IP address and other info
  let device = get_cookie(cookies, "device");
  let body;
  let apiFunction;
  let response;
  if (device == undefined) {
    body = {};
    apiFunction = 'create'
  } else {
    body = { id: device };
    apiFunction = 'log'
  }

  response = apiCall('/device.' + apiFunction, body).then(function(result) {
    try {
      set_cookie(cookies, "device", result.data.id)
    } catch (error) {
      console.log(error); // Debug
      return { success: false, error };
    }
  }, function(error) {
    // console.log(error);
  });
  return response;
}

function log_user(cookies) {
  // TODO: Check for device cookie
  //       get device info
  //       save new device to database
  //       Attach new device to user
  //       Attach user to new device
  //       save device id to cookie
}

export function device_checkin(cookies) {
  log_device(cookies);  
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
