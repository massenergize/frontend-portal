import URLS from "./urls";
import qs from "qs";
import { IS_SANDBOX, IS_PROD } from "../config/config";


export const getJson = async url => {
  try {
    const data = await fetch(url, {
      method: "GET",
      credentials: "include"
    });
    const myJson = await data.json();
    return myJson;
  } catch (error) {
    console.log(error);
    return null;
  }
};


export async function apiCallNoToken(
  destinationUrl,
  dataToSend = {},
  relocationPage = null
) {
  //Differentiate between dev deployment and real deployment

  
  dataToSend = { is_dev: !IS_PROD, is_sandbox: IS_SANDBOX, ...dataToSend };

  var params = {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: qs.stringify(dataToSend)
  };

  const response = await fetch(`${URLS.ROOT}/v3/${destinationUrl}`, params);

  try {
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    }
    return json;
  } catch (error) {
    return { success: false, error };
  }
}
export async function rawCall(
  destinationUrl,
  dataToSend = {},
  relocationPage = null
) {
  const idToken = localStorage.getItem("idToken");
  var params = {};
  if (idToken) {
    params = {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${idToken}`
      },
      body: qs.stringify(dataToSend)
    };
  } else {
    params = {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: qs.stringify(dataToSend)
    };
  }

  const response = await fetch(`${URLS.ROOT}/${destinationUrl}`, params);

  try {
    const json = await response.json();
    if (relocationPage && json && json.success) {
      window.location.href = relocationPage;
    }
    return json;
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

//** Posts a body to a url and then returns the json of the response */
export const postJson = async (url, body) => {
  try {
    const csrfResponse = await getJson(`${URLS.ROOT}/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    const response = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken
      },
      body: JSON.stringify(body)
    });
    const myJson = await response.json();
    return myJson;
  } catch (err) {
    console.log(err);
    return null;
  }
};


//THIS FUNCTION IS USED FOR ALL BASIC ROUTES IN THE APP
export async function apiCall(
  destinationUrl,
  dataToSend = {},
  relocationPage = null
) {

  dataToSend = { is_prod: IS_PROD, is_sandbox: IS_SANDBOX, ...dataToSend };

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


export const deleteJson = async url => {
  try {
    const data = await fetch(url, {
      method: "DELETE",
      credentials: "include"
    });
    const myJson = await data.json();
    return myJson;
  } catch (error) {
    console.log(error);
    return null;
  }
};




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
