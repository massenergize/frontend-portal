import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import MEButton from "../../Widgets/MEButton";
import AuthFooter from "../Components/auth footer/AuthFooter";
import AuthHeader from "../Components/AuthHeader";
import TextBoxAndButtonCombo from "../Components/TextBoxAndButtonCombo";
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
    // signInWithGoogle,
    // signInWithFacebook,
    setPasswordReset,
    userWantsToResetPassword,
    setNotification,
    finaliseNoPasswordAuth,
    setLoading,
    back,
  } = props;

  const [form, setForm] = useState({});
  const history = useHistory();

  const [
    userContinuedPasswordFreeInDiffEnv,
    setUserContinuedPasswordFreeInDiffEnv,
  ] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const hasInvalidContent = () => {
    return isInvalid(getValue("password")) || isInvalid(getValue("email"));
  };
  const whenUserTypes = (e) => {
    if (hasInvalidContent()) return;
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
        message: `MassEnergize sent you an email with a link, please click the link to continue. If its not in your inbox, check your Promotions and Spam folder. Not there? Use the link below to resend`,
        resendFunction: sendLink,
      });
    });
  };

  const backgroundCheckForPasswordlessAuthentication = useCallback(() => {
    checkForPasswordFreeAuth((email, error) => {
      if (!error) return finaliseNoPasswordAuth(email);

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
          style={{ borderRadius: 12 }}
        >
          <div className="login-form-content">
            <AuthHeader>Sign in with email and password</AuthHeader>
            <input
              style={{ width: "100%", marginBottom: 6 }}
              placeholder="Enter your email address"
              name="email"
              className="auth-textbox"
              value={getValue("email")}
              onChange={onChange}
            />
            <TextBoxAndButtonCombo
              value={getValue("password")}
              onClick={() => signUserIn(form)}
              name="password"
              type="password"
              onChange={onChange}
              btnText="Sign In"
              placeholder="Enter your secure password here"
              genericProps={{ onKeyUp: whenUserTypes }}
              loading={loading}
              loadingText="Checking..."
              disabled={hasInvalidContent() || loading}
            />
            <div
              className="auth-link touchable-opacity"
              style={{ marginTop: 10 }}
              onClick={() => setPasswordReset(true)}
            >
              <p>Forgot my password</p>{" "}
              <i
                className="fa fa-long-arrow-right"
                style={{ color: "var(--app-theme-green)" }}
              />
            </div>
          </div>

          <AuthFooter back={back}>
            {" "}
            <button
              className="auth-btns touchable-opacity"
              style={{
                background: "var(--app-theme-orange)",
                borderBottomRightRadius: 5,
                margin: 0,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
              onClick={() => history.push(links?.signup)}
            >
              Haven't joined yet? Join{" "}
              <i
                className="fa fa-long-arrow-right"
                style={{ color: "white", marginLeft: 3 }}
              />
            </button>
          </AuthFooter>
          {/* <div
            className="section-title style-2 mob-sweet-b-10"
            style={{ marginBottom: 5 }}
          >
            <h3 className="mob-title-fix">{title}</h3>
            <p> {description}</p>
          </div> */}

          {/* <div>
            <p className="mob-f-text">
              Fill in the form appropriately to activate the 'sign in' button
            </p>
          </div> */}

          {/* <div>
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

            <div className="clearfix btn-grouping">
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
                  className="mob-log-submit"
                >
                  {loading ? "Working on it..." : "Sign In"}
                </MEButton>
              </div>

              {!loading && (
                <div
                  className="form-group social-links-two padd-top-5 pull-right"
                  style={{ marginLeft: "auto" }}
                >
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
              )}
            </div>

            <div className="row">
              <div className="col col-link-btns">
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
                <br className="pc-vanish" />
                <p className="mob-f-text">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
