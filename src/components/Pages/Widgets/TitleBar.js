import React from "react";

function TitleBar() {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignCenter: "center" }}
    >
      <span
        className="touchable-opacity"
        style={{
          background: "var(--app-theme-green)",
          padding: "10px 15px",
          marginLeft: "auto",
          color: "white",
        }}
      >
        <i className=" fa fa-times" />
      </span>
    </div>
  );
}

export default TitleBar;
