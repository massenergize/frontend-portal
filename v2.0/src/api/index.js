import { navLinks } from './data/navLinks'
import { homePageIconBoxes } from './data/IconBoxes';
function getHomePageData(){
  //for actual deployment, make an api call
  //TODO
}
function getHomePageIconBoxes(){
  return homePageIconBoxes;
}
function getNavLinks(){
  return navLinks;
}

export {
  getHomePageData,
  getHomePageIconBoxes,
  getNavLinks
}