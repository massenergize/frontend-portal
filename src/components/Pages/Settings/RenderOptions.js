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
}) {
  userDefaults = userDefaults || {};

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
      {Object.entries(options).map(
        ([questionItemKey, { text, live, type, values }], index) => {
          if (!live) return <></>;
          const isCheckbox = type === CHECKBOX;
          return (
            <div key={questionItemKey} style={{ marginBottom: 25 }}>
              <p className="settings-p">
                {index + 1}. {text}
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
        }
      )}
      <Feature name={FLAGS.COMMUNICATION_PREFS}>
        {(user.is_super_admin || user.is_community_admin) && (
          <MEButton
            onClick={() => {
              apiCall("/downloads.sample.user_report").then((res) => {
                // TODO: show a toast
                console.log("=== res ===", res);
              });
            }}
          >
            Send A Sample To Your Email
          </MEButton>
        )}
      </Feature>
    </div>
  );
}

export default RenderOptions;
