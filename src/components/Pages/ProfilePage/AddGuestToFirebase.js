import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { fetchParamsFromURL } from "../../Utils";
import {
  firebaseAuthenticationWithNoPassword,
  PASSWORD_FREE_EMAIL,
  registerWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "../Auth/shared/firebase-helpers";
import { ifEnterKeyIsPressed } from "../Auth/shared/utils";
import MECheckBoxGroup from "../Widgets/MECheckBoxGroup";
import MELightFooter from "../Widgets/MELightFooter";
import METextField from "../Widgets/METextField";

const CONTINUE_AS_PASSWORDLESS = "continue-as-passwordless";
// const EMAIL_FOR_SIGNIN = "emailForSignin";
function AddGuestToFirebase({
  email,
  setNotification,
  setFirebaseUser,
  loading,
  setLoading,
  sendVerificationEmail,
  links,
  location,
}) {
  const [form, setForm] = useState({ email });
  const [noPassword, setNoPassword] = useState();
  const [sent, setSent] = useState(false);
  const history = useHistory();
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const completePasswordlessAuth = () => {
  //   var email = localStorage.getItem(EMAIL_FOR_SIGNIN);
  //   if (email) email = window.prompt("Please provide email for comfirmation");
  //   firebaseAuthenticationWithNoPassword(email, (_, error) => {
  //     if (error) return setNotification({ good: false, message: error });
  //     const { protocol, host } = window.location;
  //     const link = `${protocol}//${host}${links.profile}`;
  //     window.location.href = link;
  //   });
  // };

  // useEffect(() => {
  //   const { authstate } = fetchParamsFromURL(location, "authstate");
  //   if (authstate === CONTINUE_AS_PASSWORDLESS)
  //     return completePasswordlessAuth();
  // }, []);

  const becomeValidWithNoPassword = () => {
    const { email } = form || {};
    const { protocol, host } = window.location;
    const link = `${protocol}//${host}${links.signin}`;
    console.log("I think this is the link bro", link);
    if (!email)
      return setNotification({
        good: false,
        message: "Please enter a valid email...",
      });
    // ---------------------------------------------
    setLoading(true);
    setNotification(null);
    setSent(false);
    // ---------------------------------------------
    sendSignInLinkToEmail(
      email,
      (_, error) => {
        if (error) {
          setLoading(false);
          return setNotification({ good: false, message: error });
        }
        localStorage.setItem(PASSWORD_FREE_EMAIL, email);
        setNotification({
          good: true,
          message:
            "Congratulations! You have taken the first step to becoming a registered user. Check your email for a link to continue. Remember to check 'Spam' or 'Promotions' folders if you dont find it in your inbox.",
        });
        setLoading(false);
        setSent(true);
      },
      link
    );
  };

  const doFirebaseAuthentication = () => {
    setNotification(null);
    if (noPassword) return becomeValidWithNoPassword();

    if (!form.password)
      return setNotification({
        good: false,
        message: "Please add a secure password",
      });
    if (form.password.length < 6)
      return setNotification({
        good: false,
        message: "Please provide a password that is (6) or more characters",
      });
    if (form.password !== form.confirmPassword)
      return setNotification({
        good: false,
        message: "Your passwords do not match",
      });

    setLoading(true);
    registerWithEmailAndPassword(email, form.password, (auth, error) => {
      setLoading(false);
      console.log("I think I am the auth", auth);
      if (error) {
        setNotification({ good: false, message: error });
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
  // ------------------------------------------------------
  var submitText = loading ? "PROCESSING..." : "CONTINUE";
  submitText = sent && noPassword ? "RESEND" : submitText;
  // -----------------------------------------------------

  return (
    <div className="styled-form me-anime-fade-in-up register-form z-depth-float shave-points">
      <div className="complete-form-header">
        <p>Add a password to secure your account</p>
      </div>

      <div className="c-f-inner-wrapper">
        <MECheckBoxGroup
          valueExtractor={(it) => it.value}
          labelExtractor={(it) => it.name}
          data={[
            {
              name: "I want to continue without a password",
              value: "no-password",
            },
          ]}
          onItemSelected={(items) => {
            setNoPassword(items[0]);
          }}
        />
        <br />
        <small>Email</small>
        <METextField
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
          //   genericProps={{ disabled: true }}
        />
        <div style={{ opacity: noPassword ? ".4" : "1" }}>
          <small>Enter Password</small>
          <METextField
            type="password"
            name="password"
            value={form.password || ""}
            onChange={onChange}
            placeholder="Confirm password"
            genericProps={{ disabled: noPassword }}
          />
          <small>Confirm Password</small>
          <METextField
            type="password"
            name="confirmPassword"
            value={form.confirmPassword || ""}
            onChange={onChange}
            placeholder="Confirm password"
            genericProps={{ onKeyUp: whenUserTypes, disabled: noPassword }}
          />
        </div>
      </div>

      <MELightFooter
        okText={submitText}
        loading={loading}
        onConfirm={doFirebaseAuthentication}
        onCancel={() => history.push(links.profile)}
        disabled={loading}
      />
    </div>
  );
}

export default withRouter(AddGuestToFirebase);
