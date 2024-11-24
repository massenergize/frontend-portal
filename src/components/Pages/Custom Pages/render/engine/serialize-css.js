const INLINE_KEYS = {
  alignItems: "align-items",
  flexDirection: "flex-direction",
  justifyContent: "justify-content",
  flexWrap: "flex-wrap",
  flexBasis: "flex-basis",
  objectFit: "object-fit",
  marginTop: "margin-top",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",
  marginRight: "margin-right",
  paddingTop: "padding-top",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",
  paddingRight: "padding-right", 
  fontSize: "font-size",
};
export const serializeCss = (inLinObj) => {
  return Object.entries(inLinObj)
    .map(([key, value]) => {
      key = INLINE_KEYS[key] || key;
      return `${key}: ${value};`;
    })
    .join(" ");
};
