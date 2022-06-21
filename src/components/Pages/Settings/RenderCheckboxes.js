import React from "react";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";

function RenderCheckboxes({ values, onItemSelected }) {
  values = Object.entries(values).map(([key, items]) => ({ ...items, key }));
  return (
    <div>
      <MECheckBoxGroup
        data={values}
        valueExtractor={(it) => it.key}
        labelExtractor={(it) => it.name}
        onItemSelected={onItemSelected}
      />
    </div>
  );
}

export default RenderCheckboxes;
