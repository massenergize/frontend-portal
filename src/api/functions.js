import URLS from "./urls";
import { IS_PROD, IS_CANARY, IS_LOCAL } from "../config/config";
import { IS_SANDBOX } from "../../Utils";
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

  const is_sandbox = sessionStorage.getItem(IS_SANDBOX);
  // add some meta data for context in backend
  dataToSend = { 
    __is_prod: IS_PROD || IS_CANARY,
    __is_sandbox: is_sandbox,
    __community: _getCurrentCommunityContext(),
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
    const { community } = page || {}
    const { subdomain } = community || {}
    return subdomain
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
