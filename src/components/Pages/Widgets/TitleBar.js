import React from "react";

function TitleBar({ close }) {
  return (
    <div
      className="auth-title-bar"
      style={{ display: "flex", flexDirection: "row", alignCenter: "center" }}
    >
      <span
        className="touchable-opacity title-bar-close-btn"
        onClick={() => close && close()}
      >
        <i className=" fa fa-times" />
      </span>
    </div>
  );
}

export default TitleBar;
