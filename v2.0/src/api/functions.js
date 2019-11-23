import URLS from './urls'
import qs from 'qs';

export const getJson = async (url) => {
	try {
		const data = await fetch(url, {
			method: 'GET',
			credentials: 'include',
		  });
		const myJson = await data.json();
		return myJson;
	}
	catch (error) {
		console.log(error);
		return null;
	}
}

//** Posts a body to a url and then returns the json of the response */
export const postJson = async (url, body) => {
	try {
	
		const csrfResponse = await getJson(`${URLS.ROOT}/auth/csrf`);
		const csrfToken = csrfResponse.data.csrfToken;
		const response = await fetch(url, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			  },
			body: JSON.stringify(body)
		});
		const myJson =  await response.json();
		return myJson;
	}
	catch (err) {
		console.log(err);
		return null;
	}
}


/**
 *
 * @param {object} destinationUrl
 * @param {object} dataToSend
 * @param {string} relocationPage
 * This function handles sending data to the backend.  It takes advantage of
 * being a SimpleRequest hence no preflight checks will be done saving some
 * band-with and being faster in general while avoiding CORS issues.
 */
export async function apiCall(destinationUrl, dataToSend = {}, relocationPage = null) {
	const idToken = localStorage.getItem("idToken");
	var params = {}
	//Differentiate between dev deployment and real deployment
		dataToSend = { is_dev:true, ...dataToSend};
		if (idToken) {
			params = {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Bearer ${idToken}`
				},
				body: qs.stringify(dataToSend)
			}
		} else {
			params = {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: qs.stringify(dataToSend)
			}
		}
	const response = await fetch(`${URLS.ROOT}/v3/${destinationUrl}`,params);

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
export const deleteJson = async (url) => {
	try {
		const data = await fetch(url, {
			method: 'DELETE',
			credentials: 'include',
		  });
		const myJson = await data.json();
		return myJson;
	}
	catch (error) {
		console.log(error);
		return null;
	}
}

export async function rawCall(destinationUrl, dataToSend = {}, relocationPage = null) {
  const idToken = localStorage.getItem("idToken");
  var params = {};
  if (idToken) {
    params = {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${idToken}`
      },
      body: qs.stringify(dataToSend)
    }
  } else {
    params = {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(dataToSend)
    }
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
/**
 * Takes out the section that matches with the name given
 * @param {JSONObject | JSONArray} json : the json object of either the page data or the json array of the sections
 * @param {String} section : the name of the section to extract
 * @param {Boolean} sectionOnly : specifying if the json provided is json array of sections or page data
 */
export const section = (json, section, sectionOnly) => {
	let sections = (sectionOnly) ? json : json.sections;
	return sections.filter(x => x.name === section)[0];
}
