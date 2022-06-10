import React, { useState } from "react";
import { registerWithEmailAndPassword } from "../Auth/shared/firebase-helpers";
import { ifEnterKeyIsPressed } from "../Auth/shared/utils";
import MEButton from "../Widgets/MEButton";
import METextField from "../Widgets/METextField";

function AddGuestToFirebase({
  email,
  setError,
  setFirebaseUser,
  loading,
  setLoading,
  sendVerificationEmail,
}) {
  const [form, setForm] = useState({});
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const doFirebaseAuthentication = () => {
    setError(null);

    if (!form.password) return setError("Please add a secure password");
    if (form.password.length < 6)
      return setError(
        "Please provide a password that is (6) or more characters"
      );
    if (form.password !== form.confirmPassword)
      return setError("Your passwords do not match");

    setLoading(true);
    registerWithEmailAndPassword(email, form.password, (auth, error) => {
      setLoading(false);
      console.log("I think I am the auth", auth);
      if (error) {
        setError(error);
        console.log("ERROR_ADDING_ADDING_GUEST_TO_FIREBASE", error);
        return;
      }
      sendVerificationEmail(auth?.user, () => {
        setFirebaseUser(auth?.user);
      });
    });
  };

  const whenUserTypes = (e) => {
    if (ifEnterKeyIsPressed(e)) doFirebaseAuthentication();
  };

  return (
    <div className="styled-form me-anime-fade-in-up register-form z-depth-float shave-points">
      <div className="complete-form-header">
        <p>First add a secure password to your account</p>
      </div>
      <div className="c-f-inner-wrapper">
        <small>Email</small>
        <METextField
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          //   genericProps={{ disabled: true }}
        />
        <small>Enter Password</small>
        <METextField
          type="password"
          name="password"
          value={form.password || ""}
          onChange={onChange}
          placeholder="Confirm password"
        />
        <small>Confirm Password</small>
        <METextField
          type="password"
          name="confirmPassword"
          value={form.confirmPassword || ""}
          onChange={onChange}
          placeholder="Confirm password"
          genericProps={{ onKeyUp: whenUserTypes }}
        />
      </div>
      <div className="g-f-bottom-footer">
        <MEButton
          containerStyle={{ marginLeft: "auto" }}
          onClick={doFirebaseAuthentication}
          loading={loading}
          disabled={loading}
        >
          Done, Add Password
        </MEButton>
      </div>
    </div>
  );
}

export default AddGuestToFirebase;
