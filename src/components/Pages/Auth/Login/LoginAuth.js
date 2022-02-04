import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MEButton from "../../Widgets/MEButton";
import PasswordFreeForm from "../Password Free/PasswordFreeForm";
import ResetPassword from "../Reset/ResetPassword";
import {
  checkForPasswordFreeAuth,
  DIFFERENT_ENVIRONMENT,
  sendSignInLinkToEmail,
} from "../shared/firebase-helpers";
import { ifEnterKeyIsPressed, isInvalid } from "../shared/utils";

export default function LoginAuth(props) {
  const {
    userWantsPasswordFree,
    setUsePasswordFree,
    signUserIn,
    loading,
    links,
    description,
    title,
    signInWithGoogle,
    signInWithFacebook,
    setPasswordReset,
    userWantsToResetPassword,
    setNotification,
    finaliseNoPasswordAuth,
    setLoading,
  } = props;

  const [form, setForm] = useState({});
  const [
    userContinuedPasswordFreeInDiffEnv,
    setUserContinuedPasswordFreeInDiffEnv,
  ] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const whenUserTypes = (e) => {
    if (ifEnterKeyIsPressed(e)) signUserIn(form);
  };

  const getValue = (name) => {
    return (form || {})[name] || "";
  };

  const sendLink = () => {
    setNotification({});
    setLoading(true);

    const email = getValue("email");
    if (userContinuedPasswordFreeInDiffEnv)
      return finaliseNoPasswordAuth(email);

    sendSignInLinkToEmail(email, (_, error) => {
      setLoading(false);
      if (error) return setNotification({ good: false, message: error });
      setNotification({
        good: true,
        message: `We have sent a  special link to ${email}, check it out.`,
      });
    });
  };

  const backgroundCheckForPasswordlessAuthentication = useCallback(() => {
    checkForPasswordFreeAuth((email, error) => {
      if (!error) {
        finaliseNoPasswordAuth(email);
        return;
      }
      if (error === DIFFERENT_ENVIRONMENT) {
        setNotification({
          good: false,
          message:
            "Password-free authentication was unable to complete. Are you continuing the process on a new device or browser? Please provide your email again",
        });
        setUserContinuedPasswordFreeInDiffEnv(true);
      }
    });
  }, [
    setUserContinuedPasswordFreeInDiffEnv,
    finaliseNoPasswordAuth,
    setNotification,
  ]);

  useEffect(() => {
    backgroundCheckForPasswordlessAuthentication();
  }, [backgroundCheckForPasswordlessAuthentication]);

  if (userWantsToResetPassword)
    return <ResetPassword cancel={() => setPasswordReset(false)} />;

  if (userWantsPasswordFree)
    return (
      <PasswordFreeForm
        {...props}
        title={title}
        description={description}
        usePassword={() => setUsePasswordFree(false)}
        onChange={onChange}
        getValue={getValue}
        sendLink={sendLink}
        loading={loading}
      />
    );

  return (
    <div>
      <div
        className="styled-form login-form mob-login-white-cleaner me-anime-fade-in-up"
        style={{ height: window.screen.height, marginTop: 40 }}
      >
        <div
          className="z-depth-float mob-login-card-fix"
          style={{ padding: 55, borderRadius: 12 }}
        >
          <div
            className="section-title style-2 mob-sweet-b-10"
            style={{ marginBottom: 5 }}
          >
            <h3 className="mog-title-fix">{title}</h3>
            <p> {description}</p>
          </div>

          <div>
            <p>
              Fill in the form appropriately to activate the 'sign in' button
            </p>
          </div>

          <div>
            <div className="form-group mob-sweet-b-10">
              <span className="adon-icon">
                <span className="fa fa-envelope-o"></span>
              </span>
              <input
                id="login-email"
                type="email"
                name="email"
                value={getValue("email")}
                // onChange={onChange}
                placeholder="Enter your email here..."
                onChange={onChange}
              />
            </div>

            <div className="form-group mob-sweet-b-10">
              <span className="adon-icon">
                <span className="fa fa-unlock-alt"></span>
              </span>
              <input
                id="login-password"
                type="password"
                name="password"
                value={getValue("password")}
                placeholder="Enter your secure password here..."
                onChange={onChange}
                onKeyUp={whenUserTypes}
              />
            </div>

            <div className="clearfix">
              <div className="form-group pull-left">
                <MEButton
                  onClick={() => signUserIn(form)}
                  disabled={
                    isInvalid(getValue("email")) ||
                    isInvalid(getValue("password")) ||
                    loading
                  }
                  id="sign-in-btn"
                  loading={loading}
                >
                  {loading ? "Working on it..." : "Sign In"}
                </MEButton>
              </div>

              <div className="form-group social-links-two padd-top-5 pull-right">
                Or sign in with
                <button
                  onClick={() => signInWithGoogle()}
                  id="google"
                  type="button"
                  className="img-circle  round-me  me-google-btn z-depth-float"
                >
                  <span className="fa fa-google"></span>
                </button>
                <button
                  onClick={signInWithFacebook}
                  id="facebook"
                  type="button"
                  className="img-circle  round-me me-facebook-btn z-depth-float"
                >
                  <span className="fa fa-facebook"></span>
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <button
                    style={{
                      textDecoration: "underline",
                      fontWeight: "bold",
                      marginBottom: 6,
                      fontSize: "large",
                    }}
                    className=" energize-link"
                    onClick={() => setUsePasswordFree(true)}
                  >
                    Sign In With No Password
                  </button>

                  <button
                    className=" energize-link"
                    style={{ marginLeft: "auto" }}
                    onClick={() => setPasswordReset(true)}
                  >
                    I Forgot my password
                  </button>
                </div>
                <p>
                  Don't have a profile?
                  <Link
                    style={{ marginLeft: 5 }}
                    className="energize-link"
                    to={links?.signup}
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}