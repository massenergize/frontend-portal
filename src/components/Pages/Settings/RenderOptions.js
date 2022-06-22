import React from "react";
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
  const list = Object.entries(options);
  // console.log("I think I am the user defaults", settingsTabKey);
  // console.log("PREF", user?.preferences);

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
        // if (!live) return <></>;
        const isCheckbox = type === CHECKBOX;
        return (
          <div key={questionItemKey} style={{ marginBottom: 25 }}>
            <p className="settings-p">
              {index + 1}. {text}
            </p>
            {isCheckbox ? (
              <RenderCheckboxes
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
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default RenderOptions;
