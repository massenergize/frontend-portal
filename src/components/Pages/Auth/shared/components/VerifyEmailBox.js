import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import BreadCrumbBar from "../../../../Shared/BreadCrumbBar";
import { sendVerificationEmail } from "./../../../../../redux/actions/authActions";
function VerifyEmailBox({ fireAuth, sendVerificationEmail }) {
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
                className="z-depth-float me-anime-open-in"
                style={{
                  padding: 20,
                  borderRadius: 6,
                }}
              >
                <p id="verify-email-area">
                  <span style={{ color: "black" }}>
                    We sent a link to your email address. Please check your
                    email and follow the link to continue. If you don't see a
                    message, be sure to
                  </span>
                  <strong style={{ color: "maroon", marginLeft: 4 }}>
                    <em>check your spam folder.</em>
                  </strong>
                  <button type="button" className="as-link" onClick={sendEmail}>
                    Didnt receive any verification email? Resend Verification
                    Email
                  </button>
                  <br />
                  {emailIsSent && (
                    <p style={{ color: "var(--app-theme-green)" }}>
                      Email was sent!
                    </p>
                  )}
                </p>
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
  return bindActionCreators({ sendVerificationEmail }, dispatch);
};
// const mapDispatchToProps = dispatch=>

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmailBox);
