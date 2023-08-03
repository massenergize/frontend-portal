import React from "react";

export default function RibbonBanner({ text, style, className }) {
  return (
    <div className="ribbon-container" data-ribbon={text|| "Pending Approval"}></div>
  );
}
