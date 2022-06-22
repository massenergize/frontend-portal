import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apiCall } from "../../../api/functions";
import { reduxLogin } from "../../../redux/actions/userActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TabView from "../Widgets/METabView/METabView";
import RenderOptions from "./RenderOptions";

function Settings({ user, settings, updateUser }) {
  const [currentTab, setCurrentTab] = useState(null);
  const userDefaults = user?.preferences?.user_portal_settings || {};

  const updateSettingsForUser = (content) => {
    const preferences = {
      ...(user?.preferences || {}),
      user_portal_settings: { ...userDefaults, ...content },
    };
    updateUser({
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
  const TABS = Object.entries(settings).map(([key, { name, options }]) => ({
    key,
    name,
    component: (
      <RenderOptions
        options={options}
        userDefaults={userDefaults[key]}
        settingsTabKey={key}
        updateUser={updateSettingsForUser}
        user={user}
      />
    ),
  }));

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
              <h1>Settings</h1>
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
  return { user: store.user.info, settings: store.page.settings };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateUser: reduxLogin }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
