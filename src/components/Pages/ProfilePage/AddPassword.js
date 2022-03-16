import React, { useState } from "react";
import Tooltip from "../../Shared/Tooltip";
import { FirebaseEmailAuthProvider } from "../Auth/shared/firebase-helpers";
import MEButton from "../Widgets/MEButton";
import MECard from "../Widgets/MECard";
import METextField from "../Widgets/METextField";

function AddPassword({
  closeForm,
  fireAuth,
  setError,
  setSuccess,
  loading,
  setLoading,
  links,
}) {
  const [form, setForm] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    const { password, confirmPassword } = form;
    if (!password)
      return setError("Please make sure you have entered a valid password");
    if (password !== confirmPassword)
      return setError("Please make sure your passwords match!");

    setLoading(true);
    setError(null);

    var cred;
    try {
      cred = FirebaseEmailAuthProvider.credentialWithLink(
        fireAuth?.email,
        window.location.href
      );
    } catch (e) {
      setError(e.toString());
      setLoading(false);
    }

    fireAuth
      .reauthenticateWithCredential(cred)
      .then(() => {
        fireAuth
          .updatePassword(password)
          .then((response) => {
            setSuccess(true);
            setLoading(false);
            window.location.href = links?.profile;
          })
          .catch((e) => {
            console.log("I aim the error boy", e);
            if (e.code === "auth/requires-recent-login") {
              setError(
                "Hi, we need to re-verify you. Please click the link above to re-send the special link. "
              );
              setLoading(false);
              return;
            }
            setError(e?.toString());
            setLoading(false);
          });
      })
      .catch((e) => {
        setError(e?.toString());
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <MECard className="me-anime-open-in">
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
        {/* <br /> */}
        {/* <METextView style={{ color: "black" }}>
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
        )} */}
        {/* <small>
          Paste your special link <span className="text-danger">*</span>
        </small>

        <METextField
          type="text"
          name="magicLink"
          value={form.magicLink || ""}
          onChange={onChange}
          placeholder="Paste your special link here..."
          required
          history = {false}
        />

        <br /> */}
        <div style={{ marginTop: 30 }}></div>
        <MEButton
          loading={loading}
          disabled={loading}
          style={{ marginRight: 10 }}
        >
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
