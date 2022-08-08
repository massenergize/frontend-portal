import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BreadCrumbBar from "../../../../Shared/BreadCrumbBar";
import AuthFooter from "../../Components/auth footer/AuthFooter";
import AuthHeader from "../../Components/AuthHeader";
import OpenEmailApp from "../OpenEmailApp";
import {
  sendVerificationEmail,
  signMeOut,
} from "./../../../../../redux/actions/authActions";
function VerifyEmailBox({ fireAuth, sendVerificationEmail, signMeOut }) {
  const [emailIsSent, setEmailSent] = useState(false);

  const sendEmail = () => {
    setEmailSent(false);
    sendVerificationEmail(fireAuth, (sent) => {
      if (sent) setEmailSent(true);
    });
  };

  return (
    <div className="boxed_wrapper" style={{ height: "100vh" }}>
      <BreadCrumbBar links={[{ name: "Verify Email" }]} />
      <section
        className="register-section sec-padd-top"
        style={{ paddingTop: 5 }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-12 offset-md-2">
              <div
                className="z-depth-float me-anime-open-in force-no-elevation-on-mobile"
                style={{
                  borderRadius: 6,
                }}
              >
                <div className="login-form-content">
                  {" "}
                  <AuthHeader>Check your email</AuthHeader>
                  <p id="verify-email-area">
                    <span style={{ color: "black" }}>
                      We sent a link to your email. Please click that link to
                      continue.
                      <br />
                      Not in your inbox? Please check your <b>
                        "Spam"
                      </b> and <b>"Promotions" </b>
                      folders
                    </span>
                    {/* <strong style={{ color: "maroon", marginLeft: 4 }}>
                    <em>check your spam folder.</em>
                  </strong> */}
                    <button
                      type="button"
                      className="auth-link touchable-opacity"
                      onClick={sendEmail}
                      style={{ marginTop: 10 }}
                    >
                      Not there? Click to resend email
                    </button>
                    <br />
                    {emailIsSent && (
                      <p style={{ color: "var(--app-theme-green)" }}>
                        Email was sent!
                      </p>
                    )}
                  </p>
                </div>
                {/* <OpenEmailApp showCancel={true} /> */}
                <AuthFooter
                  buttonText="CANCEL THIS PROCESS"
                  back={() => signMeOut()}
                />
              </div>
            </div>
          </div>
        </div>{" "}
      </section>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { fireAuth: state.fireAuth };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ sendVerificationEmail, signMeOut }, dispatch);
};
// const mapDispatchToProps = dispatch=>

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailBox);
