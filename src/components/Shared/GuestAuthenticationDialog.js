import React, { useState } from "react";
import MEButton from "../Pages/Widgets/MEButton";
import MEModal from "../Pages/Widgets/MEModal";
import METextField from "../Pages/Widgets/METextField";

function GuestAuthenticationDialog(props) {
  return (
    <MEModal {...props} v2>
      <div className="guest-dialog-container">
        <div className="guest-dialog-content">
          <p className="responsive-p" >
            Please input your{" "}
            <span style={{ color: "var(--app-theme-orange)" }}>email</span>{" "}
            below. That's all you would have to do for now.
          </p>
          <METextField placeholder="example@gmail.com" />
        </div>
        <div className="guest-dialog-footer">
          <MEButton containerStyle={{ marginLeft: "auto" }}>
            Start As Guest
          </MEButton>
        </div>
      </div>
    </MEModal>
  );
}

export default GuestAuthenticationDialog;
