import firebase from "../../../../config/firebaseConfig";
import { translateFirebaseError } from "./utils";

const Auth = firebase?.auth();
export const withEmailAndPassword = (email, password, cb) => {
  Auth.signInWithEmailAndPassword(email, password)
    .then((response) => {
      if (cb) cb(response);
    })
    .catch((e) => {
      if (cb) cb(null, translateFirebaseError(e?.toString()));
      console.log("FIREBASE_SIGN_IN_ERROR:", e?.toString());
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

export const registerWithEmailAndPassword = (email, password, cb) => {
  Auth.createUserWithEmailAndPassword(email, password)
    .then((response) => {
      if (cb) cb(response);
    })
    .catch((e) => {
      if (cb) cb(null, translateFirebaseError(e?.toString()));
      console.log("FIREBASE_REG_ERROR:", e?.toString());
    });
};
