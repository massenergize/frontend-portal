import {homePageData} from './demo-data/homePage'
import { homePageIconBoxes } from './demo-data/actions';
function getHomePageData(){

  //for demo use this
  return homePageData;

  //for actual deployment, make an api call
  //TODO
}
function getHomePageIconBoxes(){
  return homePageIconBoxes;
}

export {
  getHomePageData,
  getHomePageIconBoxes
}