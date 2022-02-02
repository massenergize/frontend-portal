import firebase, {
  facebookProvider,
  googleProvider,
} from "../../../../config/firebaseConfig";
import { translateFirebaseError } from "./utils";

const PASSWORD_FREE_EMAIL = "password_free_email";
export const Auth = firebase?.auth();
export const FirebaseEmailAuthProvider = firebase.auth.EmailAuthProvider;

export const DIFFERENT_ENVIRONMENT = "different_environment";
export const firebaseAuthenticationWithNoPassword = (email, cb, link) => {
  link = link || window.location.href;
  Auth.signInWithEmailLink(email, window.location.href)
    .then((response) => {
      cb && cb(response);
    })
    .catch((e) => {
      cb && cb(null, e?.toString());
      console.log("NO_PASSWORD_AUTH_FAILURE:", e?.toString());
    });
};
export const sendSignInLinkToEmail = (email, cb) => {
  var settings = {
    url: window.location.href,
    handleCodeInApp: true,
  };
  Auth.sendSignInLinkToEmail(email, settings)
    .then(() => {
      localStorage.setItem(PASSWORD_FREE_EMAIL, email);
      cb && cb();
    })
    .catch((e) => cb && cb(null, translateFirebaseError(e)));
};

export const checkForPasswordFreeAuth = (cb) => {
  if (Auth.isSignInWithEmailLink(window.location.href)) {
    const email = localStorage.getItem(PASSWORD_FREE_EMAIL);
    if (!email) {
      cb && cb(null, DIFFERENT_ENVIRONMENT);
      return;
    }
    cb && cb(email);
  }
};

export const sendPasswordResetEmail = (email, cb) => {
  Auth.sendPasswordResetEmail(email)
    .then(() => {
      cb && cb(true);
      console.log("Password reset Email sent!");
    })
    .catch((e) => {
      cb && cb(false);
      console.log("Could not send password reset email!", e?.toString());
    });
};

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
