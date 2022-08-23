import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import {
  authenticateWithFacebook,
  authenticateWithGoogle,
} from "../../../../../redux/actions/authActions";
import { reduxToggleGuestAuthDialog } from "../../../../../redux/actions/pageActions";
import Feature from "../../../FeatureFlags/Feature";
import GuestAuthenticationDialog from "../../../../Shared/GuestAuthenticationDialog";
import "./AuthenticationOptions.css";
import { FLAGS } from "../../../FeatureFlags/flags";
function AuthenticationOptions({
  links,
  close,
  signInWithGoogle,
  signInWithFacebook,
}) {
  const [userWantsToUseGuestAuth, setUserWantsToUseGuestAuth] = useState(false);
  const history = useHistory();
  if (userWantsToUseGuestAuth) {
    return (
      <GuestAuthenticationDialog
        back={() => setUserWantsToUseGuestAuth(false)}
      />
    );
  }
  return (
    <div className="auth-options-root">
      <h1 className="auth-title">Welcome! Sign in or Join</h1>
      <button
        className="auth-btns touchable-opacity dynamic-width"
        style={{
          background: "var(--app-theme-green)",
          "--width": "60%",
          marginBottom: 14,
        }}
        onClick={() => {
          close && close();
          history.push(`${links?.signin}?noPassword=true`);
        }}
      >
        {" "}
        With email only{" "}
      </button>
      <button
        className="auth-btns touchable-opacity dynamic-width"
        style={{
          background: "black",
          "--width": "60%",
          marginBottom: 14,
        }}
        onClick={() => {
          close && close();
          history.push(links?.signin);
        }}
      >
        {" "}
        With email and password
      </button>

      <div
        className="dynamic-width"
        style={{
          display: "flex",
          "--width": "60%",
          flexDirection: "column",
          marginBottom: 10,
        }}
      >
        <button
          className="auth-btns touchable-opacity"
          style={{
            background: "#D72E2E",
            flex: "1",
            marginBottom: 14,
          }}
          onClick={() => signInWithGoogle(() => close())}
        >
          <i className="fa fa-google" />
          oogle
        </button>
        <button
          className="auth-btns touchable-opacity"
          style={{
            background: "#127FCE",
            flex: "1",
            // marginLeft: 6,
          }}
          onClick={() => signInWithFacebook(() => close())}
        >
          <i className=" fa fa-facebook " />
          acebook
        </button>
      </div>
      <Feature
        name={FLAGS.GUEST_SIGN_IN}
      >
        <div
          className="auth-link touchable-opacity"
          onClick={() => setUserWantsToUseGuestAuth(true)}
        >
          <p>Let me try as a guest</p>{" "}
          <i
            className="fa fa-long-arrow-right"
            style={{ color: "var(--app-theme-green)" }}
          />
        </div>
      </Feature>
    </div>
  );

  function renderGuestLoginFallback() {
    return (
      <div>
        <p
          style={{
            fontSize: "0.9rem",
            color: "maroon",
          }}
        >
          Guest Auth has been disable for new users
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <center
            className="auth-link touchable-opacity"
            onClick={() => setUserWantsToUseGuestAuth(true)}
          >
            <p>Proceed anyway </p>{" "}
            <i
              className="fa fa-long-arrow-right"
              style={{ color: "var(--app-theme-green)" }}
            />
          </center>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    links: state.links,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      signInWithGoogle: authenticateWithGoogle,
      signInWithFacebook: authenticateWithFacebook,
      close: () => reduxToggleGuestAuthDialog(false),
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AuthenticationOptions));
