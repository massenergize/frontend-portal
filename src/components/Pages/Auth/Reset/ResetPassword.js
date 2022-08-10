import React, { useState } from "react";
import MEButton from "../../Widgets/MEButton";
import AuthFooter from "../Components/auth footer/AuthFooter";
import AuthHeader from "../Components/AuthHeader";
import TextBoxAndButtonCombo from "../Components/TextBoxAndButtonCombo";
import { sendPasswordResetEmail } from "./../shared/firebase-helpers";
export default function ResetPassword({ cancel }) {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const doReset = () => {
    if (!email) return;
    sendPasswordResetEmail(email, (isSent) => setSent(isSent));
  };
  return (
    <div>
      <div
        // className="styled-form login-form mob-login-white-cleaner me-anime-fade-in-up"
        style={{ height: window.screen.height, marginTop: 40 }}
      >
        <div className="z-depth-float " style={{ borderRadius: 12 }}>
          {/* <div
            className="section-title style-2 mob-sweet-b-10"
            style={{ marginBottom: 5 }}
          >
            <h3 className="mog-title-fix">Reset Password</h3>
          </div> */}
          <div className="mob-login-card-fix" style={{ padding: 55 }}>
            <AuthHeader>I forgot my password</AuthHeader>

            <TextBoxAndButtonCombo placeholder="Enter your email address and click send" />
            <small className="auth-info" style={{ marginBottom: 5 }}>
              We will send you a link to reset your password
            </small>

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
            {sent && (
              <p style={{ color: "var(--app-theme-green)" }}>
                Reset password is sent, check your email
              </p>
            )}
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
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
