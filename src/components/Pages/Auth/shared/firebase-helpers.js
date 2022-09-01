import firebase from "../../../../config/firebaseConfig";
import { translateFirebaseError } from "./utils";
const PROVIDERS = {
  PASSWORD: "password",
  GOOGLE: "google.com",
  FACEBOOK: "facebook.com",
  EMAIL_LINK: "emailLink",
};

export const PASSWORD_FREE_EMAIL = "password_free_email";
export const DIFFERENT_ENVIRONMENT = "different_environment";

export const Auth = firebase?.auth();
export const FirebaseEmailAuthProvider = firebase.auth.EmailAuthProvider;
export const FirebaseGoogleAuthProvider =
  new firebase.auth.GoogleAuthProvider();
export const FirebaseFacebookAuthProvider =
  new firebase.auth.FacebookAuthProvider();

export const fetchUserSignInMethods = (email, cb) => {
  Auth.fetchSignInMethodsForEmail(email)
    .then((methods) => {
      cb && cb(methods);
      return methods;
    })
    .catch((e) => {
      cb && cb(null, e?.toString());
      console.log("SIGN_IN_METHODS_ERROR :", e?.toString());
    });
};

export const usesGoogleProvider = (fireUser) => {
  fireUser = fireUser || Auth.currentUser;
  const providers = fireUser?.providerData || [];
  return providers[0]?.providerId === PROVIDERS.GOOGLE;
};
export const usesFacebookProvider = (fireUser) => {
  fireUser = fireUser || Auth.currentUser;
  const providers = fireUser?.providerData || [];
  return providers[0]?.providerId === PROVIDERS.FACEBOOK;
};
export const usesEmailProvider = (fireUser) => {
  fireUser = fireUser || Auth.currentUser;
  const providers = fireUser?.providerData || [];
  return providers[0]?.providerId === PROVIDERS.PASSWORD;
};

export const usesEmailLinkProvider = (fireUser, cb) => {
  fireUser = fireUser || Auth.currentUser;
  fetchUserSignInMethods(fireUser?.email, (methods, error) => {
    if (error) return cb && cb(false);
    methods = methods || [];
    if (methods?.includes(PROVIDERS.EMAIL_LINK)) return cb && cb(true);
    cb && cb(false);
  });
};

export const firebaseDeleteEmailPasswordAccount = (data, cb) => {
  const { isPasswordFree, password, email, emailLink } = data;
  var cred;

  try {
    if (isPasswordFree)
      cred = FirebaseEmailAuthProvider.credentialWithLink(email, emailLink);
    else cred = FirebaseEmailAuthProvider.credential(email, password);
  } catch (e) {
    cb && cb(null, e.toString());
  }

  Auth.currentUser
    .reauthenticateWithCredential(cred)
    .then(() => {
      Auth.currentUser.delete().then(() => cb && cb(true));
    })
    .catch((e) => {
      cb && cb(null, e?.toString());
      console.log("EMAIL_REAUTH_FOR_DELETE_ERROR:", e?.toString());
    });
};

export const firebaseDeleteGoogleAuthAccount = (cb) => {
  Auth.signInWithPopup(FirebaseGoogleAuthProvider).then(() => {
    Auth.currentUser
      .delete()
      .then(() => {
        cb && cb(true);
      })
      .catch((e) => {
        cb && cb(null, e?.toString());
        console.log("GOOGLE_AUTH_ACCOUNT_DELETION:", e?.toString());
      });
  });
};

export const firebaseDeleteFacebookAuthAccount = (cb) => {
  Auth.signInWithPopup(FirebaseFacebookAuthProvider).then(() => {
    Auth.currentUser
      .delete()
      .then(() => {
        cb && cb(true);
      })
      .catch((e) => {
        cb && cb(null, e?.toString());
        console.log("FACEBOOK_AUTH_ACCOUNT_DELETION:", e?.toString());
      });
  });
};

export const firebaseAuthenticationWithNoPassword = (email, cb, link) => {
  link = link || window.location.href;
  Auth.signInWithEmailLink(email, link)
    .then((response) => {
      cb && cb(response);
    })
    .catch((e) => {
      cb && cb(null, e?.toString());
      console.log("NO_PASSWORD_AUTH_FAILURE:", e?.toString());
    });
};

export const sendSignInLinkToEmail = (email, cb, url) => {
  var settings = {
    url: url || window.location.href,
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
  Auth.sendPasswordResetEmail(email, {
    url: window.location.href,
    handleCodeInApp: false,
  })
    .then(() => {
      cb && cb(true);
      console.log("Password reset Email sent!");
    })
    .catch((e) => {
      cb && cb(false,e?.toString());
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
  Auth.signInWithPopup(FirebaseGoogleAuthProvider)
    .then((response) => {
      if (cb) cb(response);
    })
    .catch((e) => {
      if (cb) cb(null, translateFirebaseError(e?.toString()));
      console.log("GOOGLE_AUTH:", e?.toString());
    });
};

export const firebaseAuthenticationWithFacebook = (cb) => {
  Auth.signInWithPopup(FirebaseFacebookAuthProvider)
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
