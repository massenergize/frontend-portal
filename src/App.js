import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import * as Sentry from "@sentry/react";

import "./assets/css/style.css";
import AppRouter from "./AppRouter";
import { connect, useDispatch, useSelector } from "react-redux";
import { apiCall } from "./api/functions";
import LoadingCircle from "./components/Shared/LoadingCircle";
import {
  changeToProperURL,
  domainsAreTheSame,
  getIsSandboxFromURL,
  getSubdomainFromURL,
} from "./components/Utils";
import {
  LOAD_COMMUNITY_INFORMATION,
  SET_IS_CUSTOM_SITE,
  SET_IS_SANDBOX,
} from "./redux/actions/types";
import ErrorPage from "./components/Pages/Errors/ErrorPage";
import URLS, { DEV_URL } from "./api/urls";
import { IS_LOCAL, IS_PROD, IS_CANARY } from "./config";

const IS_DEV = !IS_LOCAL && !IS_PROD && !IS_CANARY;
const IS_SANDBOX = "IS_SANDBOX";

function App() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const community = useSelector((state) => state.page.community);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // first let's determine if its a sandbox request
    const is_sandbox =
      getIsSandboxFromURL(window.location) ||
      Boolean(window.sessionStorage.getItem(IS_SANDBOX));

    if (is_sandbox) {
      console.log("Sandbox: ", is_sandbox);
      window.sessionStorage.setItem(IS_SANDBOX, true);
    }

    dispatch({
      type: SET_IS_SANDBOX,
      payload: is_sandbox,
    });

    if (!community) {
      const hostname = window.location.hostname;
      const subdomain = getSubdomainFromURL(window.location.href);
      let body = {};
      const isAMassenergizeDomain = URLS.NONE_CUSTOM_WEBSITE_LIST.has(hostname);

      if (isAMassenergizeDomain) {
        // if no subdomain found, redirect to all communities page (NB: The all communities page does not exist on this side of the application. It is a page on the backend)
        const thereIsNoSubdomain = [undefined, "", "/"].indexOf(subdomain) > -1;

        if (thereIsNoSubdomain) {
          window.location.href = IS_DEV ? DEV_URL : URLS.COMMUNITIES;
          return;
        }

        body = subdomain ? { subdomain } : {};
        dispatch({
          type: SET_IS_CUSTOM_SITE,
          payload: false,
        });
      }

      apiCall("communities.info", body)
        .then((json) => {
          if (json.success) {
            dispatch({
              type: LOAD_COMMUNITY_INFORMATION,
              payload: json.data,
            });

            const customDomain = json?.data?.website;

            if (customDomain) {
              dispatch({
                type: SET_IS_CUSTOM_SITE,
                payload: true,
              });

              const userIsNotAlreadyOnCustomDomain = !domainsAreTheSame(customDomain, window.location.href);
              // Only redirect to custom domain if a community has one, and the user is not already on the custom domain
              if (userIsNotAlreadyOnCustomDomain && !IS_LOCAL)
                window.location.href = changeToProperURL(customDomain);
            }
          } else {
            setError(json.error);
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [community, dispatch]);

  if (error) {
    return <ErrorPage invalidCommunity />;
  }

  if (!community) {
    return <LoadingCircle />;
  }

  return (
    <Switch>
      <Route community={community} user={user} component={AppRouter} />
    </Switch>
  );
}
const sentryWrapped = Sentry.withProfiler(App);

export default connect(null, {})(sentryWrapped);
