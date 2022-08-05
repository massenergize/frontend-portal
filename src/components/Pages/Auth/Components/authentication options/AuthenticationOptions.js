import React from "react";
import MEButton from "../../../Widgets/MEButton";
import "./AuthenticationOptions.css";
function AuthenticationOptions() {
  return (
    <div className="auth-options-root">
      <h1 className="auth-title">Welcome! Sign in or Join</h1>
      <MEButton flat> With email only </MEButton>
    </div>
  );
}

export default AuthenticationOptions;
