import React from "react";

function AuthFooter() {
  return (
    <div className="auth-footer-root">
      <button
        className="auth-btns touchable-opacity"
        style={{
          background: "black",
          borderBottomLeftRadius: 5,
          margin: 0,
        }}
      >
        BACK
      </button>
    </div>
  );
}

export default AuthFooter;
