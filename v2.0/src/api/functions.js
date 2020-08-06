import URLS from "./urls";
import { IS_SANDBOX, IS_PROD } from "../config/config";


//THIS FUNCTION IS USED FOR ALL BASIC ROUTES IN THE APP
export async function apiCall(
  destinationUrl,
  dataToSend = {},
  relocationPage = null
) {

  const { subdomain } = this.props.match.params;
  
  // add some meta data for context in backend
  dataToSend = { 
    __is_prod: IS_PROD,
    __is_sandbox: IS_SANDBOX,
    __community: subdomain,
    ...dataToSend 
  };

  const formData = new FormData();
  Object.keys(dataToSend).map(k => (formData.append(k, dataToSend[k])));

  const response = await fetch(`${URLS.ROOT}/v3/${destinationUrl}`, {
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
 * Takes out the section that matches with the name given
 * @param {JSONObject | JSONArray} json : the json object of either the page data or the json array of the sections
 * @param {String} section : the name of the section to extract
 * @param {Boolean} sectionOnly : specifying if the json provided is json array of sections or page data
 */
export const section = (json, section, sectionOnly) => {
  let sections = sectionOnly ? json : json.sections;
  return sections.filter(x => x.name === section)[0];
};
