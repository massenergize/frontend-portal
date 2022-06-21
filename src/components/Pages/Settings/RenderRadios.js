import React from "react";
import RadioButtons from "./../Widgets/MERadio";
function RenderRadios({ values, onItemSelected }) {
  const options = Object.entries(values).map(([key, items]) => ({
    ...items,
    key,
  }));
  // console.log("HEre the values", values);
  const transfer = (keyOfOption) => {
    const selectedOptionObj = (values || {})[keyOfOption] || {};
    onItemSelected &&
      onItemSelected({ [keyOfOption]: { ...selectedOptionObj, value: true } });
  };

  return (
    <div>
      <RadioButtons
        data={options}
        valueExtractor={(it) => it.key}
        labelExtractor={(it) => it.name}
        onItemSelected={transfer}
        // value={"as_posted"}
      />
    </div>
  );
}

export default RenderRadios;
