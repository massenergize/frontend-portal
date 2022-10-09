import React from "react";

export default function ActivityIndicator() {
  return (
    <div
      className="me-circle-loader"
      style={{
        height: 20,
        width: 20,
        border: "dotted 7px green",
        borderTopColor: "var(--app-theme-green)",
        borderBottomColor:"var(--app-theme-orange)",
        borderRightColor:"var(--app-theme-orange)",
        borderLeftColor:"var(--app-theme-green)",
      }}
    ></div>
  );
}
