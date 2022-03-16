import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import { fetchParamsFromURL } from "../../Utils";
import { sendSignInLinkToEmail } from "../Auth/shared/firebase-helpers";
import TabView from "../Widgets/METabView/METabView";
import METextView from "../Widgets/METextView";
import Notification from "../Widgets/Notification/Notification";
import AddPassword from "./AddPassword";
import PasswordLessDeleteBox from "./PasswordLessDeleteBox";
const VERIFIED = "verfied";
function ProfilePasswordlessRedirectPage({ user, fireAuth, location }) {
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [success, setSuccess] = useState(true);

  const { params } = fetchParamsFromURL(location, null, ["page", "status"]);

  const TABS = [
    {
      key: "add-password",
      component: (
        <AddPassword
          error={error}
          setError={setError}
          fireAuth={fireAuth}
          setSuccess={setSuccess}
        />
      ),
      name: "Add A Password",
    },
    {
      key: "delete-account",
      component: <PasswordLessDeleteBox />,
      name: "Delete My Account",
    },
  ];

  const sendEmail = () => {
    const urlToThisPage = window.location.href + "?status=" + VERIFIED;
    setSent(false);
    sendSignInLinkToEmail(
      fireAuth?.email,
      () => {
        setSent(true);
      },
      urlToThisPage
    );
  };

  const userHasComeFromEmail = params?.status === VERIFIED;

  return (
    <>
      <div
        className="boxed_wrapper"
        style={{ minHeight: window.screen.height - 200 }}
        id="profile-page-component"
      >
        <BreadCrumbBar links={[{ name: "Passwordless Management" }]} />

        <div className="container">
          <div className="row">
            <div className="col-lg-9 col-md-9  col-12">
              <h4>
                {" "}
                {user ? (
                  <div style={{ display: "inline-block" }}>
                    <span style={{ color: "#8dc63f" }}>
                      {userHasComeFromEmail ? "Welcome back " : "Hi"}
                    </span>{" "}
                    {user?.preferred_name + "," || "..."}
                  </div>
                ) : (
                  "Your Profile"
                )}
              </h4>
              <p>Here, you can manage your password-less account</p>

              {/* ------------------------------------------------------------ */}
              <METextView style={{ color: "black" }}>
                Your email{" "}
                <b style={{ color: "var(--app-theme-orange)", marginRight: 4 }}>
                  {user?.email}
                </b>
                is currently using <b>only</b> passwordless authentication.
                <br />
              </METextView>
              <METextView style={{ color: "black" }}>
                Before you take any of the actions below, we need to know its
                you.
                <br />
                <span className="touchable-opacity" onClick={() => sendEmail()}>
                  <b style={{ color: "var(--app-theme-orange)" }}>Click here</b>
                </span>{" "}
                for a <b style={{ color: "var(--app-theme-green)" }}>special</b>{" "}
                link. Check your email, and click the link we sent you, it
                should bring you back to this page.
              </METextView>
              <br />
              {sent && (
                <>
                  <small style={{ color: "var(--app-theme-green)" }}>
                    <b>Specia link is sent!</b>
                  </small>
                  <br />
                </>
              )}
              {/* ---------------------------------------------------- */}
              {/* {userHasComeFromEmail && (
                <>
                  <METextView
                    className="z-depth-float"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      background: "floralwhite",
                      padding: 15,
                      borderRadius: 5,
                    }}
                  >
                    NB: You are now free to either add a password, or delete
                    your account as you wish. However, you do not have much
                    time, please proceed quickly. If you take too long, you may
                    be asked to re-verify.
                    <br />
                    This is only a safety precaution to protect your account.
                  </METextView>
                  <br />
                </>
              )} */}
              {/* --------------------------------------------------------- */}

              {error && (
                <>
                  <Notification good={false}>{error} </Notification>
                  <br />
                </>
              )}
              {success && (
                <>
                  <Notification good>
                    Great, you are good to go! You can now access your account
                    password-less, or with your password.
                  </Notification>
                  <br />
                </>
              )}

              <TabView tabs={TABS} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (store) => {
  return {
    user: store.user.info,
    fireAuth: store.fireAuth,
  };
};

export default connect(mapStateToProps)(
  withRouter(ProfilePasswordlessRedirectPage)
);
