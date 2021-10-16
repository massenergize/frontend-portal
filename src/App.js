import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import "./assets/css/style.css";
import AppRouter from "./AppRouter";
import { connect, useDispatch, useSelector } from "react-redux";
import { apiCall } from "./api/functions";
import LoadingCircle from "./components/Shared/LoadingCircle";
import { getIsSandboxFromURL } from "./components/Utils";
import {
  LOAD_COMMUNITY_INFORMATION,
  SET_IS_CUSTOM_SITE,
  SET_IS_SANDBOX,
} from "./redux/actions/types";
import ErrorPage from "./components/Pages/Errors/ErrorPage";
import URLS from "./api/urls";

function App() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const community = useSelector((state) => state.page.community);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    // first let's determine if its a sandbox request
    const is_sandbox = getIsSandboxFromURL(window.location);
    if (is_sandbox) {
      console.log("Sandbox: ", is_sandbox);
    }

    dispatch({
      type: SET_IS_SANDBOX,
      payload: is_sandbox,
    });

    // Update the document title using the browser API
    if (!community) {
      const hostname = window.location.hostname;
      let body = {};
      if (URLS.NONE_CUSTOM_WEBSITE_LIST.has(hostname)) {
        const pathname = window.location.pathname;
        const slash = pathname.indexOf("/", 1);
        const subdomain =
          slash > 0 ? pathname.substring(1, slash) : pathname.substring(1);

        console.log(subdomain)
        if ([undefined, "", "/"].indexOf(subdomain)) {
          window.location.href = URLS.COMMUNITIES;
          return;
        }

        body = subdomain ? { subdomain: subdomain } : {};
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
          } else {
            setError(json.error);
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [community, dispatch]);

  if (error) {
    return (
      <ErrorPage
        invalidCommunity
      />
    );
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

export default connect(null, {})(App);
