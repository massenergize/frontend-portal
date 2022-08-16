import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../api/functions";
import { reduxLogin } from "../../../redux/actions/userActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ProfileSettings from "../ProfilePage/ProfileSettings";
import TabView from "../Widgets/METabView/METabView";
import RenderOptions from "./RenderOptions";

function Settings({
  user,
  settings,
  updateUserInRedux,
  links,
  fireAuth,
  firebaseAuthSettings,
}) {
  const [currentTab, setCurrentTab] = useState(null);
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
  TABS = [
    {
      key: "profile",
      name: "Profile",
      component: (
        <ProfileSettings
          user={user}
          fireAuth={fireAuth}
          firebaseAuthSettings={firebaseAuthSettings}
          links = {links}
        />
      ),
    },
    ...TABS,
  ];

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
              <h1>Preferences</h1>
              {/*  TODO: The text here is just a placeholder. Text description from Kaat or Brad will be used here... */}
              <p style={{ color: "black" }}>
                You can set how often you receive notifications, and what topics
                to receive notifications on. Use the toggles below to manage the
                behaviour of the application in a any manner that best suits
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateUserInRedux: reduxLogin }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
