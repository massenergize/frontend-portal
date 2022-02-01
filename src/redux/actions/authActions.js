import { apiCall } from "../../api/functions";
import {
  checkFirebaseAuthenticationState,
  firebaseAuthenticationWithFacebook,
  firebaseAuthenticationWithGoogle,
  registerWithEmailAndPassword,
  withEmailAndPassword,
} from "../../components/Pages/Auth/shared/firebase-helpers";
import { AUTH_STATES } from "../../components/Pages/Auth/shared/utils";
import { reduxLogin } from "./userActions";

export const AUTH_NOTIFICATION = "AUTH_ERROR";
export const SET_CURRENT_AUTH_STATE = "SET_AUTH_STATE";
export const SET_FIREBASE_USER = "SET_FIREBASE_USER";
export const SET_MASSENERGIZE_USER = "SET_MASSENERGIZE_USER";

export const fetchTokenFromMassEnergize = (lat, cb) => (dispatch) => {
  if (!lat) return console.log("Include user _lat to fetch token from ME...");
  apiCall("auth.login", { idToken: lat })
    .then((response) => {
      if (cb) cb(response);
      const error = response.error;
      if (!error) return dispatch(reduxLogin(response.data));
      if (error === AUTH_STATES.NEEDS_REGISTRATION)
        return dispatch(setAuthStateAction(AUTH_STATES.NEEDS_REGISTRATION));
    })
    .catch((error) => {
      if (cb) cb(null, error?.toString());
      dispatch(setAuthNotification(makeError(error)));
      console.log("WHOAMI_ERROR", error?.toString());
    });
};
export const authenticateWithGoogle = () => (dispatch) => {
  firebaseAuthenticationWithGoogle((user, error) => {
    if (error) return dispatch(setAuthNotification(makeError(error)));
    dispatch(fetchTokenFromMassEnergize(user?._lat));
    dispatch(setFirebaseUser(user));
  });
};
export const authenticateWithFacebook = () => (dispatch) => {
  firebaseAuthenticationWithFacebook((user, error) => {
    if (error) return dispatch(setAuthNotification(makeError(error)));
    dispatch(fetchTokenFromMassEnergize(user?._lat));
    dispatch(setFirebaseUser(user));
  });
};
export const subscribeToFirebaseAuthChanges = () => (dispatch) => {
  checkFirebaseAuthenticationState((user, error) => {
    if (error) return dispatch(setAuthNotification(makeError(error)));
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
    dispatch(fetchTokenFromMassEnergize(auth?.user?._lat));
    dispatch(setFirebaseUser(auth?.user));
  });
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
