import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { completeUserDeletion } from "../../../redux/actions/authActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import { fetchParamsFromURL } from "../../Utils";
import {
  firebaseDeleteEmailPasswordAccount,
  sendSignInLinkToEmail,
} from "../Auth/shared/firebase-helpers";
import TabView from "../Widgets/METabView/METabView";
import METextView from "../Widgets/METextView";
import Notification from "../Widgets/Notification/Notification";
import AddPassword from "./AddPassword";
import PasswordLessDeleteBox from "./PasswordLessDeleteBox";
import Seo from "../../Shared/Seo";
const VERIFIED = "verfied";
const ADD_PASSWORD = "add-password";
const DELETE_ACCOUNT = "delete-account";
function ProfilePasswordlessRedirectPage({
  user,
  fireAuth,
  location,
  deleteUserFromMEAndLogout,
  settings,
  links,
  community
}) {
  // const { signInConfig } = settings || {};
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(ADD_PASSWORD);
  const { params } = fetchParamsFromURL(location, null, ["page", "status"]);

  const deletePasswordlessAccount = () => {
    const data = {
      isPasswordFree: true,
      emailLink: window.location.href,
      email: user?.email,
    };
    setError(false);
    setLoading(true);
    return firebaseDeleteEmailPasswordAccount(data, (done, error) => {
      if (error) {
        setError(error);
        setLoading(false);
        setActiveTab(DELETE_ACCOUNT);
      }
      if (done) {
        deleteUserFromMEAndLogout();
      }
    });
  };

  const Tabs = [
    {
      key: ADD_PASSWORD,
      component: (
        <AddPassword
          error={error}
          setError={setError}
          fireAuth={fireAuth}
          setSuccess={setSuccess}
          loading={loading}
          setLoading={setLoading}
          links={links}
        />
      ),
      name: "Add A Password",
    },
    {
      key: DELETE_ACCOUNT,
      component: (
        <PasswordLessDeleteBox
          deleteAccount={deletePasswordlessAccount}
          loading={loading}
        />
      ),
      name: "Delete My Account",
    },
  ];

  const sendEmail = () => {
    const urlToThisPage = window.location.href + "?status=" + VERIFIED;
    setSent(false);
    setError(false);
    sendSignInLinkToEmail(
      fireAuth?.email,
      () => {
        setSent(true);
      },
      urlToThisPage,
      community
    );
  };

  const userHasComeFromEmail = params?.status === VERIFIED;
  const styles = !userHasComeFromEmail
    ? { opacity: "0.2", pointerEvents: "none" }
    : {};
  return (
    <>
    {Seo({
      title: 'Manage Password',
      description: '',
      url: `${window.location.pathname}`,
      site_name: 'community?.name',
    })}
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
                <ol>
                  <li>
                    <span
                      className="touchable-opacity"
                      onClick={() => sendEmail()}
                    >
                      <b style={{ color: "var(--app-theme-orange)" }}>
                        Click here
                      </b>
                    </span>{" "}
                    for a{" "}
                    <b style={{ color: "var(--app-theme-green)" }}>special</b>{" "}
                    link.
                  </li>
                  <li>Check your email.</li>
                  <li>
                    Then click the link we sent you. It should bring you back to
                    this page.
                  </li>
                </ol>
              </METextView>
              <br />
              {sent && (
                <>
                  <small style={{ color: "var(--app-theme-green)" }}>
                    <b>Special link is sent!</b>
                  </small>
                  <br />
                </>
              )}
              {/* ---------------------------------------------------- */}
              {userHasComeFromEmail && (
                <>
                  <METextView
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      background: "floralwhite",
                      padding: 15,
                      borderRadius: 5,
                    }}
                  >
                    You are now free to either add a password, or delete your
                    account as you wish
                  </METextView>
                  <br />
                </>
              )}
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

              <div style={styles}>
                <TabView
                  tabs={Tabs}
                  // onMount={(changer) => setChanger(changer)}
                  defaultTab={activeTab}
                />
              </div>
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
    links: store.links,
    settings: store.user.userFirebaseSettings,
    community: store.page.community,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      deleteUserFromMEAndLogout: completeUserDeletion,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProfilePasswordlessRedirectPage));
