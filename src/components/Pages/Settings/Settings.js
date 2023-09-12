import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../api/functions";
import { reduxToggleUniversalToastAction } from "../../../redux/actions/pageActions";
import { reduxLogin } from "../../../redux/actions/userActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import VerifyEmailBox from "../Auth/shared/components/VerifyEmailBox";
import { AUTH_STATES } from "../Auth/shared/utils";
import TabView from "../Widgets/METabView/METabView";
import RenderOptions from "./RenderOptions";
import Seo from "../../Shared/Seo";
import { signMeOut } from "../../../redux/actions/authActions";
import { fetchParamsFromURL } from "../../Utils";

function Settings({
  user,
  settings,
  updateUserInRedux,
  links,
  fireAuth,
  authState,
  community,
  toggleToast,
  signMeOut,
  history,
}) {
  const [currentTab, setCurrentTab] = useState(null);
  const [urlData, setURLData] = useState(null);

  const userIsNotAuthenticated =
    authState === AUTH_STATES.USER_IS_NOT_AUTHENTICATED;
  const appIsCheckingFirebase = authState === AUTH_STATES.CHECKING_FIREBASE;
  const appIsCheckingMassEnergize =
    authState === AUTH_STATES.CHECK_MASS_ENERGIZE;

  useEffect(() => {
     const urlUserCred = fetchParamsFromURL(window.location, "cred")?.cred;
    if (urlUserCred) {
      let decodedData = JSON.parse(atob(urlUserCred));
      setURLData(decodedData);
    }
    if (user && urlUserCred) {
      handleEmailAndAccountCheck(urlUserCred);
    }
    return;
    // eslint-disable-next-line
  }, [user]);

  // -------------------------------------------------------------------
  let redirectURL = urlData?.login_method === "email-only" ? `${links.signin}?noPassword=true` : links.signin;
  if (userIsNotAuthenticated) return <Redirect to={redirectURL}> </Redirect>;

  if (appIsCheckingFirebase || appIsCheckingMassEnergize)
    return <LoadingCircle />;

  if (fireAuth && !fireAuth.emailVerified) return <VerifyEmailBox />;
  // -------------------------------------------------------------------
  const userDefaults = user?.preferences?.user_portal_settings || {};

  const updateSettingsForUser = (content) => {
    const preferences = {
      ...(user?.preferences || {}),
      user_portal_settings: { ...userDefaults, ...content },
    };
    updateUserInRedux({
      ...user,
      preferences,
    });
    apiCall("/users.update", {
      id: user?.id,
      preferences: JSON.stringify(preferences),
    })
      .then((response) => {
        if (response?.success) {
          toggleToast({
            open: true,
            type: "success",
            message: "Settings updated successfully.",
          });
        } else {
          toggleToast({
            type: "error",
            open: true,
            message:
              "An error occurred while updating user settings. Try again later.",
          });
          return console.log("Error updating user settings: ", response.error);
        }
      })
      .catch((e) =>
        console.log("Error updating user settings: ", e.toString())
      );
  };

  var TABS = Object.entries(settings).map(([key, { name, live, options }]) => {
    if (live)
      return {
        key,
        name,
        hideHeader: true,
        component: (
          <RenderOptions
            options={options}
            userDefaults={userDefaults[key]} // based on the setting question right now, this will hold the user's chosen value if available
            settingsTabKey={key}
            updateUser={updateSettingsForUser}
            user={user}
            community_id={community?.id}
            toggleToast={toggleToast}
          />
        ),
      };
    return null;
  });
  // TABS = [
  //   {
  //     key: "profile",
  //     name: "Profile",
  //     component: (
  //       <ProfileSettings
  //         user={user}
  //         fireAuth={fireAuth}
  //         firebaseAuthSettings={firebaseAuthSettings}
  //         links={links}
  //       />
  //     ),
  //   },
  //   ...TABS,
  // ];

  return (
    <div>
      {Seo({
        title: "User Settings",
        description: "",
        url: `${window.location.pathname}`,
        site_name: community?.name,
      })}
      <div
        className="boxed_wrapper"
        style={{ minHeight: window.screen.height - 100 }}
        id="profile-page-component"
      >
        <BreadCrumbBar links={[{ name: "Settings" }]} />
        <div className="container">
          <div
            className="row"
            style={{ paddingRight: "0px", marginRight: "0px" }}
          >
            <div className="col-lg-9 col-md-9 col-12 offset-md-1 settings-wrapper">
              <h1>Communication Preferences</h1>
              {/*  TODO: The text here is just a placeholder. Text description from Kaat or Brad will be used here... */}
              {/* <p style={{ color: "black" }}>
                You can set how often you receive notifications, and what topics
                to receive notifications on. Use the toggles below to manage the
                behavior of the application in the manner that best suits
                you.
              </p> */}
              <TabView
                onChange={(tabKey) => setCurrentTab(tabKey)}
                tabs={TABS}
                defaultTab={currentTab}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function handleEmailAndAccountCheck(param) {
    if (!user) return;
    let decodedData = JSON.parse(atob(param));
    if (user?.email !== decodedData?.email) {
      let confirm = window.confirm(
        `Hey there! It looks like you're currently logged in with a different email address (${user?.email}). Want to switch and update your communication preferences for ${decodedData?.email} ?`
      );
      if (confirm) {
        apiCall("auth.logout", {}).then((res) => {
          if (res?.success) {
            signMeOut();
            if (decodedData?.login_method === "email-only")  return <Redirect to={`${links?.signin}?noPassword=true`} />;
            return <Redirect to={links?.signin}> </Redirect>;
          }
        });
      } else {
        history.push(links.home);
      }
    }
  }
}

const mapStateToProps = (store) => {
  return {
    user: store.user.info,
    settings: store.page.settings,
    links: store.links,
    firebaseAuthSettings: store.firebaseAuthSettings,
    fireAuth: store.fireAuth,
    authState: store.authState,
    community: store.page.community,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateUserInRedux: reduxLogin,
      toggleToast: reduxToggleUniversalToastAction,
      signMeOut: signMeOut,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
