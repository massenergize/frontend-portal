import React from "react";

function Subtitle({ text, children }) {
  if (!text && !children) return;
  return <p className="me-subtitle">{text || children}</p>;
}

export default Subtitle;
