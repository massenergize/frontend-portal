import { AUTH_STATES } from "../../components/Pages/Auth/shared/utils";
import {
  AUTH_NOTIFICATION,
  SET_CURRENT_AUTH_STATE,
  SET_FIREBASE_SETTINGS,
  SET_FIREBASE_USER,
} from "../actions/authActions";

export const reducerForSettingAuthState = (
  state = AUTH_STATES.CHECKING_FIREBASE,
  action
) => {
  if (action.type === SET_CURRENT_AUTH_STATE) {
    return action.payload;
  }
  return state;
};
export const reducerforSettingAuthNotification = (state = null, action) => {
  if (action.type === AUTH_NOTIFICATION) {
    return action.payload;
  }
  return state;
};
export const reducerForSettingFirebaseUser = (state = null, action) => {
  if (action.type === SET_FIREBASE_USER) {
    return action.payload;
  }
  return state;
};
export const reducerForAddingFirebaseSettings = (state = null, action) => {
  if (action.type === SET_FIREBASE_SETTINGS) {
    return action.payload;
  }
  return state;
};
