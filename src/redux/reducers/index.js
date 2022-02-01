import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import history from "../history";

import userReducer from "./userReducer";
import pageReducer from "./pageReducer";
import linkReducer from "./linkReducer";
import {
  reducerforSettingAuthNotification,
  reducerForSettingAuthState,
  reducerForSettingFirebaseUser,
} from "./authReducer";

export default combineReducers({
  user: userReducer,
  page: pageReducer,
  links: linkReducer,
  router: connectRouter(history),
  fireAuth: reducerForSettingFirebaseUser,
  authNotification: reducerforSettingAuthNotification,
  authState: reducerForSettingAuthState,
  // firebase: firebaseReducer
});

// export default rootReducer;
