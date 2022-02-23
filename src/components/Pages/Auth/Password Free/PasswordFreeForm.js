import React from "react";
import MEButton from "../../Widgets/MEButton";
import { ifEnterKeyIsPressed, isInvalid } from "../shared/utils";

export default function PasswordFreeForm({
  description,
  title,
  usePassword,
  onChange,
  getValue,
  sendLink,
  loading,
  signInWithGoogle,
  signInWithFacebook,
}) {
  const email = getValue("email");

  const whenUserTypes = (e) => {
    if (ifEnterKeyIsPressed(e)) sendLink();
  };

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
            {description && <p> {description}</p>}
          </div>

          <div>
            <p>
              Enter your email address for{" "}
              <b style={{ color: "var(--app-theme-green)" }}>password-free</b>{" "}
              sign-in. We'll send you an email with verification link.
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
                value={email}
                onChange={onChange}
                onKeyUp={whenUserTypes}
                placeholder="Enter your email here..."
              />
            </div>

            <div className="clearfix">
              <div className="form-group pull-left">
                <MEButton
                  type="submit"
                  disabled={isInvalid(email)}
                  id="sign-in-btn"
                  onClick={() => sendLink()}
                  loading={loading}
                >
                  {loading ? "Sending Link..." : "Continue"}
                </MEButton>
              </div>

              <div className="form-group social-links-two padd-top-5 pull-right">
                Or sign in with
                <button
                  onClick={() => signInWithGoogle()}
                  id="google"
                  type="button"
                  className="img-circle  round-me z-depth-float me-google-btn"
                >
                  <span className="fa fa-google"></span>
                </button>
                <button
                  onClick={() => signInWithFacebook()}
                  id="facebook"
                  type="button"
                  className="img-circle  round-me z-depth-float me-facebook-btn"
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
                    className="energize-link"
                    onClick={usePassword}
                    id="email-password-link"
                  >
                    I want to use Email and Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
