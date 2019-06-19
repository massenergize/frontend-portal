import { navLinks } from './data/navLinks'
import { homePageIconBoxes } from './data/IconBoxes';
import { graphsData } from './data/graphsData.js';
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
function getGraphsData(){
  return graphsData;
}

export {
  getHomePageData,
  getHomePageIconBoxes,
  getNavLinks,
  getGraphsData
}