import URLS from './urls'
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
	}
}

// Takes out the section that matches with the name given
export const section = (json, section) => {
	let sections = json.data[0].sections;
	return sections.filter(x => x.name == section)[0];
}
