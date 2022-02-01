import { withEmailAndPassword } from "../../components/Pages/Auth/shared/firebase-utils";

export const AUTH_NOTIFICATION = "AUTH_ERROR";
export const SET_CURRENT_AUTH_STATE = "SET_AUTH_STATE";
export const SET_FIREBASE_USER = "SET_FIREBASE_USER";

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
export const firebaseLogin = (data, cb) => (dispatch) => {
  withEmailAndPassword(data?.email, data?.password, (auth, error) => {
    if (cb) cb();
    if (error) return dispatch(setAuthNotification(makeError(error)));
    console.log("I am the AUTH BRO", auth);
  });
};
