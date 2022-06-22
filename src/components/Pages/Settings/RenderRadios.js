import React from "react";
import RadioButtons from "./../Widgets/MERadio";
function RenderRadios({ values, onItemSelected, defaultFromUser }) {
  const options = Object.entries(values).map(([key, items]) => ({
    ...items,
    key,
  }));
  var userCurrentDefault = Object.entries(defaultFromUser || {})[0];
  const [defaultValue] = userCurrentDefault || [];
  const transfer = (keyOfOption) => {
    onItemSelected && onItemSelected({ [keyOfOption]: { value: true } });
  };

  return (
    <div>
      <RadioButtons
        data={options}
        valueExtractor={(it) => it.key}
        labelExtractor={(it) => it.name}
        onItemSelected={transfer}
        value={defaultValue}
      />
    </div>
  );
}

export default RenderRadios;
