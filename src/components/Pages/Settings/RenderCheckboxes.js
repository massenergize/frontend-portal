import React from "react";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";

function RenderCheckboxes({ values, onItemSelected }) {
  values = Object.entries(values).map(([key, items]) => ({ ...items, key }));
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
      />
    </div>
  );
}

export default RenderCheckboxes;
