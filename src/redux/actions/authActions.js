import { apiCall } from "../../api/functions";
import {
  checkFirebaseAuthenticationState,
  deleteAccountFromFirebase,
  fetchUserSignInMethods,
  firebaseAuthenticationWithFacebook,
  firebaseAuthenticationWithGoogle,
  firebaseAuthenticationWithNoPassword,
  FirebaseEmailAuthProvider,
  PASSWORD_FREE_EMAIL,
  registerWithEmailAndPassword,
  signOutOfFirebase,
  withEmailAndPassword,
} from "../../components/Pages/Auth/shared/firebase-helpers";
import {
  AUTH_STATES,
  GUEST_USER_KEY,
} from "../../components/Pages/Auth/shared/utils";
import { getTakeTourFromURL } from "../../components/Utils";
import { celebrateWithConfetti, reduxSetTourState } from "./pageActions";
import { LOGIN } from "./types";
import { reduxLoadDone, reduxLoadTodo, reduxLogin } from "./userActions";

export const AUTH_NOTIFICATION = "AUTH_ERROR";
export const SET_CURRENT_AUTH_STATE = "SET_AUTH_STATE";
export const SET_FIREBASE_USER = "SET_FIREBASE_USER";
export const SET_MASSENERGIZE_USER = "SET_MASSENERGIZE_USER";
export const SET_FIREBASE_SETTINGS = "SET_FIREBASE_SETTINGS";

export const setFirebaseSettings = (settings = {}) => {
  return { type: SET_FIREBASE_SETTINGS, payload: settings };
};

export const completeUserDeletion = (user_id, cb) => (dispatch) => {
  apiCall("users.delete", { user_id })
    .then((response) => {
      if (response.success) return dispatch(signMeOut());
      else cb && cb(false, response.error);
    })
    .catch((e) => {
      cb && cb(false, e?.toString());
      console.log("DELETING_ME_USER_FAILED:", e?.toString());
    });
};

export const finaliseNoPasswordAuthentication = (email, cb) => (dispatch) => {
  firebaseAuthenticationWithNoPassword(email, async (response, error) => {
    if (error) {
      cb && cb(null, error);
      dispatch(setAuthNotification(makeError(error)));
    }
    let _fbToken = await response?.user?.getIdTokenResult();
    fetchTokenFromMassEnergize(_fbToken.token, cb);
  });
};

export const fetchUserContent = (email) => async (dispatch) => {
  try {
    const done = await apiCall("users.actions.completed.list", { email });
    const todo = await apiCall("users.actions.todo.list", { email });
    dispatch(reduxLoadTodo(todo?.data || []));
    dispatch(reduxLoadDone(done?.data || []));
    dispatch(setAuthStateAction(AUTH_STATES.USER_IS_AUTHENTICATED));
  } catch (e) {
    console.log("LOADIN_USER_CONTENT_ERROR:", e.toString());
  }
};

export const completeUserRegistration = (body, cb) => (dispatch, getState) => {
  const auth = getState().fireAuth;
  apiCall("users.create", body)
    .then(async (response) => {
      if (response?.success && response?.data) {
        let _fbToken = await auth?.getIdTokenResult();
        return dispatch(
          fetchTokenFromMassEnergize(
            _fbToken.token,
            (response) => cb && cb(response),
            { userIsNew: response.data?.is_new }
          )
        );
      } else cb && cb(null, response.error);
      console.log(
        "CREATING_ME_USER_ERROR: Sorry, something happened couldnt create user",
        response.error
      );
    })
    .catch((error) => {
      if (cb) cb(null, error?.toString());
      dispatch(setAuthNotification(makeError(error)));
      console.log("CREATING_ME_USER_ERROR:", error?.toString());
    });
};

const signGuestOut = () => {
  localStorage.removeItem(GUEST_USER_KEY);
};
export const signMeOut = () => (dispatch) => {
  signGuestOut();
  signOutOfFirebase();
  dispatch(setFirebaseUser(null));
  dispatch(setMassEnergizeUser(null));
  dispatch(setAuthStateAction(AUTH_STATES.USER_IS_NOT_AUTHENTICATED));
};

export const cancelMyRegistration = (cb) => (dispatch) => {
  deleteAccountFromFirebase(() => {
    cb && cb();
    dispatch(signMeOut());
  });
};

export const fetchTokenFromMassEnergize =
  (lat, cb, moreInfo, justFromGoogleAuth) => (dispatch) => {
    if (!lat) return console.log("Include user _lat to fetch token from ME...");
    apiCall("auth.login", { idToken: lat })
      .then((response) => {
        const error = response.error;
        const massUser = { ...response.data, ...(moreInfo || moreInfo) };
        cb && cb(massUser);
        if (!error) {
          if (massUser?.userIsNew)
            dispatch(celebrateWithConfetti({ show: true, duration: 10000 }));

          dispatch(fetchUserContent(massUser?.email));
          dispatch(setAuthStateAction(AUTH_STATES.CHECK_MASS_ENERGIZE));
          return dispatch(reduxLogin(massUser));
        }
        if (error === AUTH_STATES.NEEDS_REGISTRATION) {
          return dispatch(
            setAuthStateAction(
              justFromGoogleAuth
                ? AUTH_STATES.NEEDS_REGISTRATION +
                    "::" +
                    AUTH_STATES.JUST_FROM_GOOGLE_AUTH
                : AUTH_STATES.NEEDS_REGISTRATION
            )
          );
        }

        cb && cb(null, error);
        dispatch(setAuthStateAction(AUTH_STATES.USER_IS_NOT_AUTHENTICATED));
      })
      .catch((error) => {
        if (cb) cb(null, error?.toString());
        dispatch(setAuthNotification(makeError(error)));
        dispatch(setAuthStateAction(AUTH_STATES.USER_IS_NOT_AUTHENTICATED));
        console.log("AUTH_LOGIN_ERROR", error?.toString());
      });
  };

export const authenticateWithGoogle = (cb) => (dispatch) => {
  firebaseAuthenticationWithGoogle(async (response, error) => {
    const user = response?.user;
    if (error) return dispatch(setAuthNotification(makeError(error)));
    cb && cb(user);
    let _fbToken = await user?.getIdTokenResult();
    dispatch(fetchTokenFromMassEnergize(_fbToken.token, null, null, true));
    dispatch(setFirebaseUser(user));
  });
};
export const authenticateWithFacebook = (cb) => (dispatch) => {
  firebaseAuthenticationWithFacebook(async (user, error) => {
    if (error) return dispatch(setAuthNotification(makeError(error)));
    cb && cb(user);
    let _fbToken = await user?.getIdTokenResult();
    dispatch(fetchTokenFromMassEnergize(_fbToken?.token));
    dispatch(setFirebaseUser(user));
  });
};

/**
 * The function collects guest email from local storage and tries to authenticate as guest
 * It is called only if there if no firebase user. Meaning: user is not authenticated
 * @returns
 */
export const authenticateAsGuest = () => async (dispatch) => {
  const guestEmail = localStorage.getItem(GUEST_USER_KEY);
  if (!guestEmail) return; // User has not signed in as guest before in the particular  browser.
  try {
    const response = await apiCall("auth.signinasguest", { email: guestEmail });
    if (!response || !response?.success) {
      return console.log("COULD NOT AUTHENTICATE AS GUEST :", response?.error);
    }
    dispatch(reduxLogin(response.data));
    dispatch(fetchUserContent(response.data?.email));
  } catch (e) {
    console.log("GUEST_AUTH_ERROR", e?.toString());
  }
};
export const subscribeToFirebaseAuthChanges = () => (dispatch) => {
  const tour = getTakeTourFromURL();
  checkFirebaseAuthenticationState(async (user) => {
    if (!user) {
      dispatch(setAuthStateAction(AUTH_STATES.USER_IS_NOT_AUTHENTICATED));
      // If a guest is trying to become a valid user, but a passwordless one, this value will be set
      // so hold off on reauthenticating as guest after the reload
      const inGuestToPasswordlessTransition =
        localStorage.getItem(PASSWORD_FREE_EMAIL);
      if (inGuestToPasswordlessTransition) return;
      // now we know user is not a authenticated user, try and see if user can be signed in as a guest
      return dispatch(authenticateAsGuest());
    }

    // ------------------------------------------------
    // Never show tour when user is signed. Overwrite tour state to false.
    // Unless tour value is set via url params -- dont do anything here. Leave things to prior logic  implemented in AppRouter
    if (!tour) dispatch(reduxSetTourState(false));
    // ------------------------------------------------
    let _fbToken = await user?.getIdTokenResult();
    dispatch(setFirebaseUser(user));
    dispatch(fetchTokenFromMassEnergize(_fbToken?.token));
    dispatch(breakdownFirebaseSettings(user));
  });
};

export const breakdownFirebaseSettings = (user) => (dispatch) => {
  fetchUserSignInMethods(user.email, (methods) => {
    const isPasswordless = methods.includes(
      FirebaseEmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
    );
    const usesOnlyPasswordless = methods?.length === 1 && isPasswordless;
    const usesEmailAndPassword = methods.includes(
      FirebaseEmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
    );

    const settings = {
      usesOnlyPasswordless,
      isPasswordless,
      usesEmailAndPassword,
    };
    dispatch(setFirebaseSettings({ signInConfig: settings }));
  });
};

export const firebaseLogin = (data, cb) => (dispatch) => {
  withEmailAndPassword(data.email, data.password, async (auth, error) => {
    if (cb) cb(auth);
    if (error) return dispatch(setAuthNotification(makeError(error)));
    let _fbToken = await auth.user?.getIdTokenResult();
    dispatch(fetchTokenFromMassEnergize(_fbToken.token));
    dispatch(setFirebaseUser(auth?.user));
  });
};

export const firebaseRegistration = (data, cb) => (dispatch) => {
  registerWithEmailAndPassword(
    data.email,
    data.password,
    async (auth, error) => {
      if (cb) cb(auth);
      if (error) return dispatch(setAuthNotification(makeError(error)));
      let _fbToken = await auth.user?.getIdTokenResult();
      dispatch(sendVerificationEmail(auth?.user));
      dispatch(fetchTokenFromMassEnergize(_fbToken.token));
      dispatch(setFirebaseUser(auth?.user));
    }
  );
};

export const sendVerificationEmail = (fireAuth, cb) => (dispatch, getState) => {
  if (!fireAuth) {
    cb && cb(false);
    return console.log("Could not send verification email1");
  }
  const is_sandbox = getState().__is_sandbox;
  var str = window.location.href;
  var n = str.lastIndexOf("/");
  const suffix = is_sandbox ? "?sandbox=true" : "";
  var redirect = str.substring(0, n) + "/signin" + suffix;
  var actionCodeSettings = {
    url: redirect,
  };
  fireAuth
    .sendEmailVerification(actionCodeSettings)
    .then((_) => {
      cb && cb(true);
      console.log("Verification Email Sent!");
    })
    .catch((e) => console.log("Failed sending verification email"));
};

export const setAuthStateAction = (state) => {
  return { type: SET_CURRENT_AUTH_STATE, payload: state };
};

export const setAuthNotification = (notification) => {
  return { type: AUTH_NOTIFICATION, payload: notification };
};

export const setMassEnergizeUser = (user) => {
  return { type: LOGIN, payload: user };
};
export const setFirebaseUser = (user) => {
  return { type: SET_FIREBASE_USER, payload: user };
};

const makeError = (message) => {
  return { good: false, message };
};

export const onReCaptchaChange = (value, cb) => {
  if (!value) return cb && cb(false);
  apiCall("auth.verifyCaptcha", { captchaString: value }).then((response) => {
    if (response && response.data && response.data.success) cb && cb(true);
  });
};
