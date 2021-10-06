import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import "./assets/css/style.css";
import AppRouter from "./AppRouter";
import { connect, useDispatch, useSelector } from "react-redux";
import { apiCall } from "./api/functions";
import LoadingCircle from "./components/Shared/LoadingCircle";

function App() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const community = useSelector((state) => state.page.community);
  const user = useSelector((state) => state.user);
  useEffect(() => {
    // Update the document title using the browser API
    if (!community) {
      const hostname = window.location.hostname;
      const hostList = [
        'community.massenergize.org',
        'communities.massenergize.org',
        'community.massenergize.dev',
        'communities.massenergize.dev',
        'community-canary.massenergize.org',
        'localhost',
      ];
      let body = {};
      if (hostList.indexOf(hostname)>-1) {
        const pathname = window.location.pathname; 
        // pathname is like '/Wayland/Events/222/etc'
        const slash = pathname.indexOf('/',1);
        const subdomain = (slash > 0) ? pathname.substring(1, slash-1) : pathname.substring(1);
        body = subdomain ? { subdomain: subdomain } : {}
      }
            
      apiCall("communities.info", body)
        .then((json) => {
          if (json.success) {
            dispatch({
              type: "LOAD_COMMUNITY_INFORMATION",
              payload: json.data,
            });
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [community, dispatch]);

  if (error) {
    return <p className="text-center text-danger"> {error} </p>;
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
