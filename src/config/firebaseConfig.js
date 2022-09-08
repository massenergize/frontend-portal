import firebase from 'firebase/app';
import 'firebase/auth';
import IS_PROD from './config'
import IS_CANARY from './config'

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
    storageBucket: "",
    messagingSenderId: "72842344535",
    appId: "1:72842344535:web:9b1517b1b3d2e818",
  }
}

firebase.initializeApp(firebaseConfig);

export default firebase;
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const emailProvider = new firebase.auth.EmailAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();