import React, { useState } from "react";
import { sendSignInLinkToEmail } from "../Auth/shared/firebase-helpers";
import METextField from "../Widgets/METextField";

export default function PasswordLessDeleteBox({ user, onChange }) {
  const [sent, setSent] = useState(false);

  const sendEmail = () => {
    setSent(false);
    sendSignInLinkToEmail(user?.email, () => {
      setSent(true);
    });
  };
  return (
    <div>
      <p>
        We noticed that you registered with the <b>password-free</b> method.{" "}
        <br />
        <b
          className="touchable-opacity"
          style={{ color: "var(--app-theme-green)" }}
          onClick={sendEmail}
        >
          Click here{" "}
        </b>{" "}
        to send yourself a special link, and paste the link in the textbox
        provided below.
        {sent && (
          <>
            <br />
            <small style={{ color: "var(--app-theme-green)" }}>
              We have sent you the email!
            </small>
          </>
        )}
      </p>

      <small>Paste your special link here</small>
      <METextField
        onChange={onChange}
        placeholder="Paste your special link here..."
      />
    </div>
  );
}
