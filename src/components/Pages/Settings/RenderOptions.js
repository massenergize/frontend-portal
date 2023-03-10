import React from "react";
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
            {isCheckbox ? (
              <RenderCheckboxes
                defaultFromUser={userDefaults[questionItemKey] || {}}
                values={values}
                onItemSelected={(objectOfSelectedItem) =>
                  whenSettingItemIsToggled(
                    objectOfSelectedItem,
                    questionItemKey
                  )
                }
              />
            ) : (
              <RenderRadios
                defaultFromUser={userDefaults[questionItemKey] || {}}
                values={values}
                onItemSelected={(objectOfSelectedItem) =>
                  whenSettingItemIsToggled(
                    objectOfSelectedItem,
                    questionItemKey
                  )
                }
                variant={"vertical"}
              />
            )}
          </div>
        );
      })}
      <Feature name={FLAGS.COMMUNICATION_PREFS}>
        {(user.is_super_admin || user.is_community_admin) && (
          <MEButton
          className="send-sample-report-button"
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
            Hi Admin: send yourself a sample email!
          </MEButton>
        )}
      </Feature>
    </div>
  );
}

export default RenderOptions;
