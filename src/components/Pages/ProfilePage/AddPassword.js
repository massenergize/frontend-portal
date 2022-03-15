import React, { useState } from "react";
import Tooltip from "../../Shared/Tooltip";
import {
  FirebaseEmailAuthProvider,
  sendSignInLinkToEmail,
} from "../Auth/shared/firebase-helpers";
import MEButton from "../Widgets/MEButton";
import MECard from "../Widgets/MECard";
import METextField from "../Widgets/METextField";
import METextView from "../Widgets/METextView";

function AddPassword({ email, closeForm, fireAuth }) {
  const [error, setError] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    const { password, confirmPassword, magicLink } = form;
    if (!password)
      return setError("Please make sure you have entered a valid password");
    if (password !== confirmPassword)
      return setError("Please make sure your passwords match!");
    if (!magicLink)
      return setError("We need your special link to know its you!");

    setLoading(true);
    console.log("I amt he email", magicLink);
    const cred = FirebaseEmailAuthProvider.credentialWithLink(
      fireAuth?.email,
      magicLink
    );
    fireAuth
      .reauthenticateWithCredential(cred)
      .then(() => {
        fireAuth
          .updatePassword(password)
          .then((response) => {
            console.log("I am teh response that came after", response);
            setLoading(false);
          })
          .catch((e) => {
            setError(e?.toString());
            setLoading(false);
          });
      })
      .catch((e) => {
        setError(e?.toString());
      });
  };

  const sendEmail = () => {
    setSent(false);
    sendSignInLinkToEmail(fireAuth?.email, () => {
      setSent(true);
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <METextView style={{ color: "black" }}>
        You email <b style={{ color: "var(--app-theme-orange)" }}>{email}</b> is
        currently using passwordless authentication, you may use the form below
        to add a password.
        <br />
      </METextView>
      <MECard className="me-anime-open-in">
        {error ? (
          <p className="text-danger" style={{ fontSize: 14 }}>
            {error}
          </p>
        ) : null}

        <small>
          Enter Password <span className="text-danger">*</span>
        </small>
        <METextField
          type="password"
          name="password"
          value={form.password || ""}
          onChange={onChange}
          placeholder="Enter a password"
          required
        />
        <small>
          Confirm Password <span className="text-danger">*</span>
        </small>
        <Tooltip text="Re-type your new password to confirm it. Passwords must match">
          <METextField
            type="password"
            name="confirmPassword"
            value={form.confirmPassword || ""}
            onChange={onChange}
            placeholder="Confirm password"
            required
          />
        </Tooltip>
        <br />
        <METextView style={{ color: "black" }}>
          Just so we know its still you,{" "}
          <span className="touchable-opacity">
            <b
              style={{ color: "var(--app-theme-orange)" }}
              onClick={() => sendEmail()}
            >
              Click here
            </b>
          </span>{" "}
          for a special link, and copy the link from your email into the box
          below
        </METextView>
        {sent && (
          <>
            <small style={{ color: "var(--app-theme-green)" }}>
              <b>Specia link is sent!</b>
            </small>
            <br />
          </>
        )}
        <small>
          Paste your special link <span className="text-danger">*</span>
        </small>

        <METextField
          type="text"
          name="magicLink"
          value={form.magicLink || ""}
          onChange={onChange}
          placeholder="Paste your special link here..."
          required
        />

        <br />
        <MEButton loading={loading} disabled={loading}>
          {"Submit"}
        </MEButton>
        <MEButton
          variation="accent"
          onClick={(e) => {
            e.preventDefault();
            closeForm();
          }}
        >
          {" "}
          Cancel{" "}
        </MEButton>
      </MECard>
    </form>
  );
}

export default AddPassword;
