import firebase from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import { IS_PROD, IS_CANARY } from './config'

let firebaseConfig = {}

if(IS_PROD || IS_CANARY){
  firebaseConfig = {
    apiKey: "AIzaSyDgSkiZGtco0b8ntN9Yo7U-urRzXhQNOo8",
    authDomain: "massenergize-prod-auth.firebaseapp.com",
    databaseURL: "https://massenergize-prod-auth.firebaseio.com",
    projectId: "massenergize-prod-auth",
    storageBucket: "massenergize-prod-auth.appspot.com",
    messagingSenderId: "738582671182",
    appId: "1:738582671182:web:1cb9c3353cff73a4e3381f",
    measurementId: "G-4FPTY0R9S6"
  };
} else{
  firebaseConfig = {
    apiKey: "AIzaSyBjcwjC_0H1bgGKqPyqKnbWaGmAtzc4BJQ",
    authDomain: "massenergize-auth.firebaseapp.com",
    databaseURL: "https://massenergize-auth.firebaseio.com",
    projectId: "massenergize-auth",
    storageBucket: "massenergize-auth.appspot.com",
    messagingSenderId: "72842344535",
    appId: "1:72842344535:web:9b1517b1b3d2e818",
  }
}

const app = firebase.initializeApp(firebaseConfig);
// 10/28/21 addition which Google Analytics new SDK requires (Issue 743)
const analytics = getAnalytics(app);

export default firebase;
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();