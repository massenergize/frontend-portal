import React from "react";
const THEME = {
  GOOD: { background: "#bbebbb8f", color: "green" },
  BAD: { background: "#ffd8d8", color: "maroon" },
};
export default function Notification({ children, good = true, onClick }) {
  const theme = good ? THEME.GOOD : THEME.BAD;
  const icon = good ? "fa-check-circle" : "fa-times";
  return (
    <div
      className="me-anime-open-in touchable-opacity me-auth-not"
      style={{
        ...theme,
      }}
      onClick={() => onClick && onClick()}
    >
      <i className={`fa ${icon} phone-vanish`} ></i>
      {children || "Or this is the notification"}
    </div>
  );
}
