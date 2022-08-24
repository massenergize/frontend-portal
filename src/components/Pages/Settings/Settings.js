import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../api/functions";
import { reduxLogin } from "../../../redux/actions/userActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import VerifyEmailBox from "../Auth/shared/components/VerifyEmailBox";
import { AUTH_STATES } from "../Auth/shared/utils";
import TabView from "../Widgets/METabView/METabView";
import RenderOptions from "./RenderOptions";

function Settings({
  user,
  settings,
  updateUserInRedux,
  links,
  fireAuth,
  authState,
}) {
  const [currentTab, setCurrentTab] = useState(null);

  const userIsNotAuthenticated =
    authState === AUTH_STATES.USER_IS_NOT_AUTHENTICATED;
  const appIsCheckingFirebase = authState === AUTH_STATES.CHECKING_FIREBASE;
  const appIsCheckingMassEnergize =
    authState === AUTH_STATES.CHECK_MASS_ENERGIZE;

  // -------------------------------------------------------------------
  if (userIsNotAuthenticated) return <Redirect to={links.signin}> </Redirect>;

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
        if (!response.success)
          return console.log("Error updating user settings: ", response.error);
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
        hideHeader:true,
        component: (
          <RenderOptions
            options={options}
            userDefaults={userDefaults[key]} // based on the setting question right now, this will hold the user's chosen value if available
            settingsTabKey={key}
            updateUser={updateSettingsForUser}
            user={user}
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
              <p style={{ color: "black" }}>
                You can set how often you receive notifications, and what topics
                to receive notifications on. Use the toggles below to manage the
                behavior of the application in the manner that best suits
                you.
              </p>
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
}

const mapStateToProps = (store) => {
  return {
    user: store.user.info,
    settings: store.page.settings,
    links: store.links,
    firebaseAuthSettings: store.firebaseAuthSettings,
    fireAuth: store.fireAuth,
    authState: store.authState,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateUserInRedux: reduxLogin }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
