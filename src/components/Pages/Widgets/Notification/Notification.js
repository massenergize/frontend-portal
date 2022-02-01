import React from "react";
const common = {};
const THEME = {
  GOOD: { background: "#bbebbb8f", color: "green" },
  BAD: { background: "#ffd8d8", color: "maroon" },
};
export default function Notification({ children, good = true, onClick }) {
  const theme = good ? THEME.GOOD : THEME.BAD;
  const icon = good ? "fa-check-circle" : "fa-times";
  return (
    <div
      className="me-anime-open-in touchable-opacity "
      style={{
        padding: "15px 20px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 4,
        ...theme,
        cursor: "pointer",
        marginBottom: 6,
      }}
      onClick={() => onClick && onClick()}
    >
      <i className={`fa ${icon}`} style={{ marginRight: 5 }}></i>
      {children || "Or this is the notification"}
    </div>
  );
}
