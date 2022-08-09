import React from "react";

function AuthHeader({ children, className, style }) {
  return (
    <h1 className={`auth-title ${className || ""}`} style={style || {}}>
      {children}
    </h1>
  );
}

export default AuthHeader;
