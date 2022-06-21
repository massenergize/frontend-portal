import React from "react";
import RadioButtons from "./../Widgets/MERadio";
function RenderRadios({ values, onItemSelected }) {
  values = Object.entries(values).map(([key, items]) => ({ ...items, key }));
    console.log("HEre the values", values);
  return (
    <div>
      <RadioButtons
        data={values}
        valueExtractor={(it) => it.key}
        labelExtractor={(it) => it.name}
        onItemSelected={onItemSelected}
        // value={"as_posted"}
      />
    </div>
  );
}

export default RenderRadios;
