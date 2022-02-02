import firebase, {
  facebookProvider,
  googleProvider,
} from "../../../../config/firebaseConfig";
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

export const usesOnlyPasswordAuth = (fireAuth) => {
  if (!fireAuth) return false;
  const providers = fireAuth.providerData || [];
  if (providers.length !== 1) return false;
  if (providers[0]?.providerId === "password") return true;
  return false;
};

export const checkFirebaseAuthenticationState = (cb) => {
  if (!Auth) return;
  Auth.onAuthStateChanged((user) => {
    if (cb) cb(user);
  });
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

export const firebaseAuthenticationWithGoogle = (cb) => {
  Auth.signInWithPopup(googleProvider)
    .then((response) => {
      if (cb) cb(response);
    })
    .catch((e) => {
      if (cb) cb(null, translateFirebaseError(e?.toString()));
      console.log("GOOGLE_AUTH:", e?.toString());
    });
};

export const firebaseAuthenticationWithFacebook = (cb) => {
  Auth.signInWithPopup(facebookProvider)
    .then((response) => {
      if (cb) cb(response);
    })
    .catch((e) => {
      if (cb) cb(null, translateFirebaseError(e?.toString()));
      console.log("FACEBOOK_AUTH:", e?.toString());
    });
};
export const signOutOfFirebase = () => {
  Auth.signOut();
};

export const deleteAccountFromFirebase = (cb) => {
  // signOutOfFirebase();
  Auth.currentUser.delete();
  cb && cb();
};
