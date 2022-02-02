import React from "react";
import MEButton from "../../Widgets/MEButton";

export default function DeleteConfirmation({
  setDeleteConfirmation,
  cancelRegistration,
}) {
  return (
    <div
      className="z-depth-float me-anime-open-in"
      style={{ padding: 20, borderRadius: 6 }}
    >
      <p style={{ color: "black", margin: 0 }}>
        If you cancel, your registration information will be
        completely removed from the platform. Are you sure about this?
      </p>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginLeft: "auto" }}>
          <MEButton
            variation="accent"
            onClick={() => setDeleteConfirmation(false)}
          >
            No
          </MEButton>
          <MEButton onClick={() => cancelRegistration()}>Yes</MEButton>
        </div>
      </div>
    </div>
  );
}
