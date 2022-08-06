import React from "react";

function TitleBar() {
  return (
    <div
      className="auth-title-bar"
      style={{ display: "flex", flexDirection: "row", alignCenter: "center" }}
    >
      <span className="touchable-opacity title-bar-close-btn">
        <i className=" fa fa-times" />
      </span>
    </div>
  );
}

export default TitleBar;
