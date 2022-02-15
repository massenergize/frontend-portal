import { apiCall } from "../../api/functions";
import {
  checkFirebaseAuthenticationState,
  deleteAccountFromFirebase,
  firebaseAuthenticationWithFacebook,
  firebaseAuthenticationWithGoogle,
  firebaseAuthenticationWithNoPassword,
  registerWithEmailAndPassword,
  signOutOfFirebase,
  withEmailAndPassword,
} from "../../components/Pages/Auth/shared/firebase-helpers";
import { AUTH_STATES } from "../../components/Pages/Auth/shared/utils";
import { getTakeTourFromURL } from "../../components/Utils";
import { reduxSetTourState } from "./pageActions";
import { reduxLoadDone, reduxLoadTodo, reduxLogin } from "./userActions";

export const AUTH_NOTIFICATION = "AUTH_ERROR";
export const SET_CURRENT_AUTH_STATE = "SET_AUTH_STATE";
export const SET_FIREBASE_USER = "SET_FIREBASE_USER";
export const SET_MASSENERGIZE_USER = "SET_MASSENERGIZE_USER";

export const completeUserDeletion = (user_id, cb) => (dispatch) => {
  apiCall("users.delete", { user_id })
    .then(() => {
      cb && cb(true);
      dispatch(signMeOut);
    })
    .catch((e) => {
      cb && cb(false);
      console.log("DELETING_ME_USER_FAILED:", e?.toString());
    });
};

export const finaliseNoPasswordAuthentication = (email, cb) => (dispatch) => {
  firebaseAuthenticationWithNoPassword(email, (response, error) => {
    if (error) {
      cb && cb(null, error);
      dispatch(setAuthNotification(makeError(error)));
    }

    const user = response?.user;
    fetchTokenFromMassEnergize(user?._lat, cb);
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
    .then((response) => {
      if (response?.success && response?.data)
        return dispatch(
          fetchTokenFromMassEnergize(
            auth._lat,
            (response) => cb && cb(response)
          )
        );
      console.log(
        "CREATING_ME_USER_ERROR: Sorry, something happened couldnt create user"
      );
    })
    .catch((error) => {
      if (cb) cb(null, error?.toString());
      dispatch(setAuthNotification(makeError(error)));
      console.log("CREATING_ME_USER_ERROR:", error?.toString());
    });
};

export const signMeOut = () => (dispatch) => {
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

export const fetchTokenFromMassEnergize = (lat, cb) => (dispatch) => {
  if (!lat) return console.log("Include user _lat to fetch token from ME...");
  apiCall("auth.login", { idToken: lat })
    .then((response) => {
      const error = response.error;
      const massUser = response.data;
      cb && cb(massUser);
      if (!error) {
        dispatch(fetchUserContent(massUser?.email));
        dispatch(setAuthStateAction(AUTH_STATES.CHECK_MASS_ENERGIZE));
        return dispatch(reduxLogin(massUser));
      }
      if (error === AUTH_STATES.NEEDS_REGISTRATION)
        return dispatch(setAuthStateAction(AUTH_STATES.NEEDS_REGISTRATION));

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
  firebaseAuthenticationWithGoogle((response, error) => {
    const user = response?.user;
    if (error) return dispatch(setAuthNotification(makeError(error)));
    cb && cb(user);
    dispatch(fetchTokenFromMassEnergize(user?._lat));
    dispatch(setFirebaseUser(user));
  });
};
export const authenticateWithFacebook = (cb) => (dispatch) => {
  firebaseAuthenticationWithFacebook((user, error) => {
    if (error) return dispatch(setAuthNotification(makeError(error)));
    cb && cb(user);
    dispatch(fetchTokenFromMassEnergize(user?._lat));
    dispatch(setFirebaseUser(user));
  });
};
export const subscribeToFirebaseAuthChanges = () => (dispatch) => {
  const tour = getTakeTourFromURL();
  checkFirebaseAuthenticationState((user) => {
    if (!user)
      return dispatch(
        setAuthStateAction(AUTH_STATES.USER_IS_NOT_AUTHENTICATED)
      );

    // ------------------------------------------------
    // Never show tour when user is signed. Overwrite tour state to false.
    // Unless tour value is set via url params -- dont do anything here. Leave things to prior logic  implemented in AppRouter
    if (!tour) dispatch(reduxSetTourState(false));
    // ------------------------------------------------
    dispatch(fetchTokenFromMassEnergize(user?._lat));
    dispatch(setFirebaseUser(user));
  });
};

export const firebaseLogin = (data, cb) => (dispatch) => {
  withEmailAndPassword(data.email, data.password, (auth, error) => {
    if (cb) cb(auth);
    if (error) return dispatch(setAuthNotification(makeError(error)));
    dispatch(fetchTokenFromMassEnergize(auth?.user?._lat));
    dispatch(setFirebaseUser(auth?.user));
  });
};

export const firebaseRegistration = (data, cb) => (dispatch) => {
  registerWithEmailAndPassword(data.email, data.password, (auth, error) => {
    if (cb) cb(auth);
    if (error) return dispatch(setAuthNotification(makeError(error)));
    dispatch(sendVerificationEmail(auth?.user));
    dispatch(fetchTokenFromMassEnergize(auth?.user?._lat));
    dispatch(setFirebaseUser(auth?.user));
  });
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
  return { type: SET_FIREBASE_USER, payload: user };
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
