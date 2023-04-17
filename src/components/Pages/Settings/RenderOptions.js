import React, {useState} from "react";
import { apiCall } from "../../../api/functions";
import Feature from "../FeatureFlags/Feature";
import { FLAGS } from "../FeatureFlags/flags";
import MEButton from "../Widgets/MEButton";
import RenderCheckboxes from "./RenderCheckboxes";
import RenderRadios from "./RenderRadios";


const CHECKBOX = "checkbox";
function RenderOptions({
  options,
  userDefaults,
  settingsTabKey,
  updateUser,
  user,
  community_id,
  toggleToast,
}) {
  userDefaults = userDefaults || {};
  const list = Object.entries(options);
  const [toSend, setToSend] = useState({});

  const whenSettingItemIsToggled = (objectOfSelectedItem, questionItemKey) => {
    const settingsThatAlreadyExistForUser = userDefaults[settingsTabKey] || {};
    var readyToBeSaved = {
      ...settingsThatAlreadyExistForUser,
      [questionItemKey]: objectOfSelectedItem,
    };
    const newSettings = {
      [settingsTabKey]: { ...userDefaults, ...readyToBeSaved },
    };
    updateUser(newSettings);
  };
  return (
    <div>
      {list.map(([questionItemKey, { text, live, type, values }], index) => {
        if (!live) return <></>;
        const isCheckbox = type === CHECKBOX;
        return (
          <div key={questionItemKey} style={{ marginBottom: 25 }}>
            <p className="settings-p" style={{ marginBottom: 20 }}>
              {text}
              {/* {index + 1}. {text} */}
            </p>
            <div style={{ marginLeft: 30 }}>
              {isCheckbox ? (
                <RenderCheckboxes
                  defaultFromUser={userDefaults[questionItemKey] || {}}
                  values={values}
                  onItemSelected={(objectOfSelectedItem) =>
                    setToSend({ objectOfSelectedItem, questionItemKey })
                  }
                />
              ) : (
                <RenderRadios
                  defaultFromUser={userDefaults[questionItemKey] || {}}
                  values={values}
                  onItemSelected={(objectOfSelectedItem) =>
                    setToSend({ objectOfSelectedItem, questionItemKey })
                  }
                  variant={"vertical"}
                />
              )}
            </div>
          </div>
        );
      })}
      <MEButton
        className="send-sample-report-button"
        onClick={() => {
          const { questionItemKey, objectOfSelectedItem } = toSend;
          whenSettingItemIsToggled(objectOfSelectedItem, questionItemKey);
        }}
      >
        <small>Save Settings</small>
      </MEButton>

      <Feature name={FLAGS.COMMUNICATION_PREFS}>
        {(user.is_super_admin || user.is_community_admin) && (
          <MEButton
            onClick={() => {
              apiCall("/downloads.sample.user_report", { community_id }).then(
                (res) => {
                  if (res?.data) {
                    toggleToast({
                      open: true,
                      type: "success",
                      message: "Your request has been sent to your email.",
                    });
                  } else {
                    toggleToast({
                      type: "error",
                      open: true,
                      message:
                        "An error occurred while processing your request. Try again later.",
                    });
                  }
                }
              );
            }}
          >
            <small>Send yourself a sample email</small>
          </MEButton>
        )}
      </Feature>
    </div>
  );
}

export default RenderOptions;
