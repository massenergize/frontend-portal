import firebase from 'firebase/app';
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBjcwjC_0H1bgGKqPyqKnbWaGmAtzc4BJQ",
  authDomain: "massenergize-auth.firebaseapp.com",
  databaseURL: "https://massenergize-auth.firebaseio.com",
  projectId: "massenergize-auth",
  storageBucket: "",
  messagingSenderId: "72842344535",
  appId: "1:72842344535:web:9b1517b1b3d2e818"
}

firebase.initializeApp(firebaseConfig);
export default firebase;

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();