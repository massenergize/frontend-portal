import {
  checkFirebaseAuthenticationState,
  registerWithEmailAndPassword,
  withEmailAndPassword,
} from "../../components/Pages/Auth/shared/firebase-helpers";

export const AUTH_NOTIFICATION = "AUTH_ERROR";
export const SET_CURRENT_AUTH_STATE = "SET_AUTH_STATE";
export const SET_FIREBASE_USER = "SET_FIREBASE_USER";

export const subscribeToFirebaseAuthChanges = () => (dispatch) => {
  checkFirebaseAuthenticationState((user, error) => {
    if (error) return dispatch(setAuthNotification(makeError(error)));
    console.log("I AM ALREADY SIGNED IN BRO", user);
    dispatch(setFirebaseUser(user));
  });
};

export const firebaseLogin = (data, cb) => (dispatch) => {
  withEmailAndPassword(data.email, data.password, (auth, error) => {
    if (cb) cb(auth);
    if (error) return dispatch(setAuthNotification(makeError(error)));
    dispatch(setFirebaseUser(auth?.user));
  });
};

export const firebaseRegistration = (data, cb) => (dispatch) => {
  registerWithEmailAndPassword(data.email, data.password, (auth, error) => {
    if (cb) cb(auth);
    if (error) return dispatch(setAuthNotification(makeError(error)));
    dispatch(setFirebaseUser(auth?.user));
  });
};

export const setAuthStateAction = (state) => {
  return { type: SET_CURRENT_AUTH_STATE, payload: state };
};

export const setAuthNotification = (notification) => {
  return { type: AUTH_NOTIFICATION, payload: notification };
};

export const setFirebaseUser = (user) => {
  return { type: SET_FIREBASE_USER, payload: user };
};

const makeError = (message) => {
  return { good: false, message };
};
