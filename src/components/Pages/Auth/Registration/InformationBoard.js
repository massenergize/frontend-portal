import React from "react";
import MEButton from "../../Widgets/MEButton";

export default function InformationBoard({ html, close }) {
  return (
    <div>
      <div
        style={{ borderRadius: 6, marginBottom: 70 }}
        className="z-depth-float me-anime-open-in rich-text-container"
      >
        <div
          style={{ padding: 20, color: "black" }}
          dangerouslySetInnerHTML={{
            __html: html ? html : "Content failed to load or does not exist",
          }}
        ></div>

        <div
          style={{
            width: "100%",
            display: "flex",
            padding: "15px 20px",
          }}
        >
          <MEButton
            variation="accent"
            onClick={() => close && close()}
            containerStyle={{ marginLeft: "auto" }}
          >
            Done
          </MEButton>
        </div>
      </div>
    </div>
  );
}
