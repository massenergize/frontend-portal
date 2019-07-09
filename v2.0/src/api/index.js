import CONST from '../Components/Constants'
//import { homePageData } from './data/homePageData.js';
export const sendToBackEnd = (dataToSend, destinationUrl) => {
  fetch(`${CONST.URL.USER}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  }).then(response => response.json()).then(jsonResponse => {
    const { csrfToken } = jsonResponse.data;
    return fetch(destinationUrl, {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: dataToSend
    })
      .then(response => {
        console.log(response);
        return response.json();
      }).then(data => {
        console.log(data);
      });
  });
}