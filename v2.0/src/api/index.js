import CONST from '../Components/Constants'
//import { homePageData } from './data/homePageData.js';
export const sendToBackEnd = (dataToSend, destinationUrl) => {
  fetch(`${CONST.URL.ROOT}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  }).then(response => response.json()).then(jsonResponse => {
    const { csrfToken } = jsonResponse.data;
    console.log("csrf iis " + csrfToken)
    return fetch(destinationUrl, {
      credentials: 'include',
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify(dataToSend)
    })
      .then(response => {
        console.log(response);
        return response.json();
      }).then(data => {
        console.log(data);
      });
  });
}