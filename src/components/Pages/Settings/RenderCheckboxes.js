import React from "react";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";

function RenderCheckboxes({ values, onItemSelected, defaultFromUser }) {
  // console.log("DEFAULTS", defaultFromUser);
  var userCurrentDefault = Object.entries(defaultFromUser || {}).map(
    ([key]) => key
  );

  values = Object.entries(values).map(([key, items]) => ({ ...items, key }));
  // console.log("user curreent default", userCurrentDefault, values);
  const transfer = (items) => {
    var selectedOptions = items.map((option) => [option, { value: true }]);
    selectedOptions = Object.fromEntries(selectedOptions);
    onItemSelected && onItemSelected(selectedOptions);
  };
  return (
    <div>
      <MECheckBoxGroup
        data={values}
        valueExtractor={(it) => it.key}
        labelExtractor={(it) => it.name}
        onItemSelected={transfer}
        value={userCurrentDefault}
      />
    </div>
  );
}

export default RenderCheckboxes;
