var apiurl = 'http://localhost:8000/user/'
//import { homePageData } from './data/homePageData.js';
export function getHomePageData(){
  return fetch(apiurl).then(data => {
    return data.json()
  })
  .then(myJson => {
    console.log(myJson.homePageData);
    return myJson.homePageData;
  }).catch(error => {
    console.log(error);
    return {};
  });
}
// function getIconBoxesData(){
//   getHomePageData().then(response => {
//     return response.iconBoxesData;
//   }).catch(error=>{
//     console.log(error);
//   })
// }
// function getNavLinks(){
//   getHomePageData().then(response => {
//     return response.navLinks;
//   }).catch(error=>{
//     console.log(error);
//   })
// }
// function getGraphsData(){
//   console.log(getHomePageData());
//   return getHomePageData().graphsData;
// }
// function getWelcomeImagesData(){
//   return getHomePageData().welcomeImages;
// }
// function getEventsData(){
//   return getHomePageData().eventsData;
// }
// function getFooterData(){
//   return getHomePageData().footerData;
// }

// export {
//   getHomePageData
// }