import React from "react";
import MEButton from "../Widgets/MEButton";
import MECard from "../Widgets/MECard";

export default function PasswordLessDeleteBox({ deleteAccount, loading }) {
  return (
    <MECard className="me-anime-open-in">
      <h1 style={{ color: "red" }}>Danger Zone</h1>
      <p style={{ color: "black" }}>
        Your cannot reverse this action, your account will be deleted
        permanently.
      </p>

      <MEButton
        loading={loading}
        onClick={() => deleteAccount()}
        disabled={loading}
      >
        {" "}
        Delete{" "}
      </MEButton>
    </MECard>
  );
}
