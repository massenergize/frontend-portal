import React from "react";
import RenderCheckboxes from "./RenderCheckboxes";
import RenderRadios from "./RenderRadios";

const CHECKBOX = "checkbox";
function RenderOptions({ options, userDefaults, settingsTabKey }) {
  const list = Object.entries(options);
  console.log("I think I am the user defaults", settingsTabKey);

  return (
    <div>
      {list.map(([settingItemKey, { text, live, type, values }], index) => {
        // if (!live) return <></>;
        const isCheckbox = type === CHECKBOX;
        return (
          <div key={settingItemKey} style={{ marginBottom: 25 }}>
            <p className="settings-p">
              {index + 1}. {text}
            </p>
            {isCheckbox ? (
              <RenderCheckboxes
                values={values}
                onItemSelected={(items) => console.log("FROM CHECKBOX", items)}
              />
            ) : (
              <RenderRadios
                values={values}
                onItemSelected={(items) =>
                  console.log("the tiem came from here ooo", items)
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
