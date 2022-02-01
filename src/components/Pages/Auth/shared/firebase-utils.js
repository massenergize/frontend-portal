import firebase from "./../../../../config/firebaseConfig";
import { translateFirebaseError } from "./utils";

const Auth = firebase?.auth();
export const withEmailAndPassword = async (email, password, cb) => {
  try {
    const response = Auth.signInWithEmailAndPassword(email, password);
    if (cb) cb(response);
    return response;
  } catch (e) {
    if (cb) cb(null, translateFirebaseError(e?.toString()));
    console.log("SIGN_IN_ERROR:", e?.toString());
  }
};

export const checkFirebaseAuthenticationState = async (cb) => {
  try {
    const firebseUser = Auth.onAuthStateChanged();
    if (cb) cb(firebseUser);
  } catch (e) {
    if (cb) cb(null, translateFirebaseError(e?.toString()));
    console.log("ON_AUTH_CHANGE", e?.toString());
  }
};
