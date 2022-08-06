import React from "react";
import MEButton from "../../../Widgets/MEButton";
import MELink from "../../../Widgets/MELink";
import "./AuthenticationOptions.css";
function AuthenticationOptions() {
  return (
    <div className="auth-options-root">
      <h1 className="auth-title">Welcome! Sign in or Join</h1>
      <button
        className="auth-btns touchable-opacity"
        style={{
          background: "var(--app-theme-green)",
          width: "60%",
          marginBottom: 6,
        }}
      >
        {" "}
        With email only{" "}
      </button>
      <button
        className="auth-btns touchable-opacity"
        style={{
          background: "black",
          width: "60%",
          marginBottom: 6,
        }}
      >
        {" "}
        With email and password
      </button>

      <div
        style={{
          display: "flex",
          // flex: "2",
          width: "60%",
          flexDirection: "row",
          marginBottom: 10,
        }}
      >
        <button
          className="auth-btns touchable-opacity"
          style={{
            background: "#D72E2E",
            flex: "1",
          }}
        >
          <i className="fa fa-google" />
          oogle
        </button>
        <button
          className="auth-btns touchable-opacity"
          style={{
            background: "#127FCE",
            flex: "1",
            marginLeft: 6,
          }}
        >
          <i className=" fa fa-facebook " />
          acebook
        </button>
      </div>
      <div className="auth-link touchable-opacity">
        <p>Let me try as guest</p>{" "}
        <i
          className="fa fa-long-arrow-right"
          style={{ color: "var(--app-theme-green)" }}
        />
      </div>
    </div>
  );
}

export default AuthenticationOptions;
