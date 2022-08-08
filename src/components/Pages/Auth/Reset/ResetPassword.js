import React, { useState } from "react";
// import MEButton from "../../Widgets/MEButton";
import Notification from "../../Widgets/Notification/Notification";
import AuthFooter from "../Components/auth footer/AuthFooter";
import AuthHeader from "../Components/AuthHeader";
import TextBoxAndButtonCombo from "../Components/TextBoxAndButtonCombo";
import { ifEnterKeyIsPressed, isInvalid } from "../shared/utils";
import { sendPasswordResetEmail } from "./../shared/firebase-helpers";
export default function ResetPassword({ cancel }) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const doReset = () => {
    if (!email) return;
    setLoading(true);
    setNotification(null);
    sendPasswordResetEmail(email, (isSent, error) => {
      setSent(true);
      if (isSent)
        setNotification({
          message: " We have sent you a link, please check your email",
          good: true,
        });
      else setNotification({ message: error, good: false });
      setLoading(false);
    });
  };

  const whenUserTypes = (e) => {
    if (ifEnterKeyIsPressed(e)) doReset();
  };
  return (
    <div>
      <div
        // className="styled-form login-form mob-login-white-cleaner me-anime-fade-in-up"
        style={{ height: window.screen.height, marginTop: 40 }}
      >
        {notification && (
          <Notification {...(notification || {})}>
            {" "}
            {notification?.message}
          </Notification>
        )}
        <div
          className="z-depth-float force-no-elevation-on-mobile me-anime-fade-in-up"
          style={{ borderRadius: 12 }}
        >
          {/* <div
            className="section-title style-2 mob-sweet-b-10"
            style={{ marginBottom: 5 }}
          >
            <h3 className="mog-title-fix">Reset Password</h3>
          </div> */}
          <div className="mob-login-card-fix" style={{ padding: 55 }}>
            <AuthHeader>I forgot my password</AuthHeader>

            <TextBoxAndButtonCombo
              placeholder="Enter your email address and click send"
              btnText={sent ? "Resend" : "Send"}
              loading={loading}
              loadingText="Sending..."
              name="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInvalid(email) || loading}
              genericProps={{ onKeyUp: whenUserTypes }}
              onClick={() => doReset()}
            />
            <div style={{ margin: "7px 0px" }}>
              <small className="auth-info" style={{ marginBottom: 5 }}>
                We will send you a link to reset your password
              </small>
            </div>

            {/* <div>
            <p>
              Enter the email address of your existing account to reset your
              password
            </p>
          </div> */}

            {/* <div className="form-group mob-sweet-b-10">
            <span className="adon-icon">
              <span className="fa fa-envelope-o"></span>
            </span>
            <input
              id="login-email"
              type="email"
              name="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here..."
            />
          </div> */}
            {/* {sent && (
              <p style={{ color: "var(--app-theme-green)" }}>
                We have sent you a link, check your email
              </p>
            )} */}
            {/* <div style={{ display: "flex" }}>
            <MEButton
              variation="accent"
              containerStyle={{}}
              onClick={() => cancel()}
            >
              Cancel
            </MEButton>
            <MEButton
              onClick={() => doReset()}
              containerStyle={{ marginLeft: "auto" }}
            >
              Send
            </MEButton>
          </div> */}
          </div>
          <AuthFooter back={cancel} />
        </div>
      </div>
    </div>
  );
}
