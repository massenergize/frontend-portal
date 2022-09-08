import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";

import "./assets/css/style.css";
import App from "./App";
import ScrollToTop from "./ScrollToTop";
import * as serviceWorker from "./serviceWorker";

import store from "./redux/store";
import history from "./redux/history";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router/immutable";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import firebase from "./config/firebaseConfig";
import IS_PROD from "./config";
import IS_CANARY from "./config";

//react redux firebase configure
const rrfConfig = { userProfile: "users", firebaseStateName: "firebase" };
//react redux firebase props
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};

const SENTRY_DSN = IS_PROD || IS_CANARY
  ? "https://92581929e77e4312b27864e5b5c6a16e@o415460.ingest.sentry.io/5306611"
  : "https://987764a913714e0eba38e95c6d73fd52@o415460.ingest.sentry.io/5306642";
Sentry.init({ dsn: SENTRY_DSN });

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <ConnectedRouter history={history}>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </ConnectedRouter>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
