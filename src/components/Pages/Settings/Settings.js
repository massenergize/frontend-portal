import React, {  useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { reduxLogin } from "../../../redux/actions/userActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TabView from "../Widgets/METabView/METabView";
import RenderOptions from "./RenderOptions";

function Settings({ user, settings, updateUser }) {
  // const settingsTabKey = useRef(null);
  const [currentTab, setCurrentTab] = useState(null);
  const userDefaults = user?.preferences?.user_nudge_settings || {};
  // console.log("PREFERENCES", user?.preferences);

  const updateSettingsForUser = (content) => {
    updateUser({
      ...user,
      preferences: {
        ...user.preferences,
        user_nudge_settings: { ...userDefaults, ...content },
      },
    });
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
            <div className="col-lg-9 col-md-9 col-12 offset-md-1">
              <h1>Settings</h1>
              <p style={{ color: "black" }}>
                Use the toggles below to manage the behaviour of the application
                in a any manner that best suits you. You can set how often you
                receive notifications, and what topics to receive notifications
                on, if you do want notifications.
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
