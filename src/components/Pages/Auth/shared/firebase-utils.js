import firebase from "./../../../../config/firebaseConfig";
import { translateFirebaseError } from "./utils";

const Auth = firebase?.auth();
export const withEmailAndPassword = async (email, password, cb) => {
  Auth.signInWithEmailAndPassword(email, password)
    .then((response) => {
      if (cb) cb(response);
    })
    .catch((e) => {
      if (cb) cb(null, translateFirebaseError(e?.toString()));
      console.log("SIGN_IN_ERROR:", e?.toString());
    });
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
