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
import { IS_PROD, IS_CANARY } from "./config";
import {
  ReportingObserver as ReportingObserverIntegration
} from "@sentry/integrations";
import URLS from "./api/urls";


//react redux firebase configure
const rrfConfig = { userProfile: "users", firebaseStateName: "firebase" };
//react redux firebase props
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};

const SENTRY_DSN =
  IS_PROD || IS_CANARY
    ? process.env.REACT_APP_SENTRY_PROD_DSN
    : process.env.REACT_APP_SENTRY_DEV_DSN;
Sentry.init({
  dsn: SENTRY_DSN,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({ stickySession: true }),
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
      tracePropagationTargets: [URLS["ROOT"]],
    }),
    new ReportingObserverIntegration(),
  ],
  tracesSampleRate: 1.0,
});

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
