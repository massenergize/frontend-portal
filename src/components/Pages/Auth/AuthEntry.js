import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { bindActionCreators } from "redux";
import {
  authenticateWithFacebook,
  authenticateWithGoogle,
  cancelMyRegistration,
  completeUserRegistration,
  finaliseNoPasswordAuthentication,
  firebaseLogin,
  firebaseRegistration,
  setAuthNotification,
} from "../../../redux/actions/authActions";
import { reduxToggleGuestAuthDialog } from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import { fetchParamsFromURL } from "../../Utils";
import Notification from "../Widgets/Notification/Notification";
import LoginAuth from "./Login/LoginAuth";
import SignUpAuth from "./Registration/SignUpAuth";
import VerifyEmailBox from "./shared/components/VerifyEmailBox";
import OpenEmailApp from "./shared/OpenEmailApp";
import { AUTH_STATES, validatePassword } from "./shared/utils";

const SIGNIN = "signin";
const REGISTER = "signup";
const LAST_VISITED = "last_visited";
function AuthEntry({
  firebaseLogin,
  notification,
  links,
  setNotification,
  firebaseRegistration,
  doAuthenticationWithGoogle,
  doAuthenticationWithFacebook,
  authState,
  cancelRegistration,
  community,
  fireAuth,
  completeFormRegistrationInME,
  policies,
  finaliseNoPasswordAuth,
  registerPageData,
  showTour,
  back,
  match,
}) {
  const URL = window.location.href;
  const isSignInPage = URL.includes(SIGNIN);
  const isRegistrationPage = URL.includes(REGISTER);

  const lastKnownLocation = localStorage.getItem(LAST_VISITED);
  const userNeedsToRegister = authState === AUTH_STATES.NEEDS_REGISTRATION;
  const userIsAuthenticated = authState === AUTH_STATES.USER_IS_AUTHENTICATED;
  const appIsNowCheckingFirebase = authState === AUTH_STATES.CHECKING_FIREBASE;
  const appIsCheckingMassEnergize =
    authState === AUTH_STATES.CHECK_MASS_ENERGIZE;

  const [loading, setLoading] = useState(false);
  const [userWantsPasswordFree, setUsePasswordFree] = useState(false);
  const [userWantsPasswordReset, setUserWantsPasswordReset] = useState(false);

  const clearSlate = () => {
    setNotification({});
  };
  const signUserIn = (form) => {
    clearSlate();
    setLoading(true);
    firebaseLogin(form, () => setLoading(false));
  };

  const registerUser = (form) => {
    clearSlate();
    const passwordRequirements = validatePassword(
      form?.password,
      form?.confirm_password
    );

    if (!passwordRequirements.passed)
      return setNotification({
        good: false,
        message: passwordRequirements.error,
      });
    setLoading(true);
    firebaseRegistration(form, () => setLoading(false));
  };

  useEffect(() => {
    //We can go straight to passwordless form, by passing a value in the URL
    const noPassword = fetchParamsFromURL(
      window.location,
      "noPassword"
    )?.noPassword;
    const passwordLessValueViaURL =
      (noPassword || "").trim().toLowerCase() === "true";
    setUsePasswordFree(passwordLessValueViaURL);
  }, [match]);
  // ---------------------------------------------------------------

  if (fireAuth && !fireAuth.emailVerified) return <VerifyEmailBox />;

  if (userIsAuthenticated)
    return <Redirect to={lastKnownLocation || links.profile} />;

  if (appIsNowCheckingFirebase || appIsCheckingMassEnergize)
    return <LoadingCircle />;

  // ------------------------------------------------------------------

  var title = "Welcome!",
    description = "",
    Page,
    PageTitle;

  if (isSignInPage && !userNeedsToRegister) {
    Page = (
      <LoginAuth
        loading={loading}
        userWantsPasswordFree={userWantsPasswordFree}
        userWantsToResetPassword={userWantsPasswordReset}
        description={description}
        title={title}
        setUsePasswordFree={setUsePasswordFree}
        signUserIn={signUserIn}
        links={links}
        signInWithGoogle={doAuthenticationWithGoogle}
        signInWithFacebook={doAuthenticationWithFacebook}
        setPasswordReset={setUserWantsPasswordReset}
        setNotification={setNotification}
        finaliseNoPasswordAuth={finaliseNoPasswordAuth}
        setLoading={setLoading}
        back={back}
      />
    );
    PageTitle = userWantsPasswordFree ? "Password-Free Sign In" : "Sign In";
  } else if (isRegistrationPage || userNeedsToRegister) {
    title = registerPageData?.title || title;
    description =
      registerPageData?.description ||
      "This helps us count your impact correctly, and avoid double counting. We collect no sensitive personal data, and do not share data.";
    Page = (
      <SignUpAuth
        setLoading={setLoading}
        loading={loading}
        links={links}
        description={description}
        title={title}
        registerUser={registerUser}
        registerWithGoogle={doAuthenticationWithGoogle}
        registerWithFacebook={doAuthenticationWithFacebook}
        userNeedsToRegister={userNeedsToRegister}
        cancelRegistration={cancelRegistration}
        community={community}
        fireAuth={fireAuth}
        completeFormRegistrationInME={completeFormRegistrationInME}
        policies={policies}
        showTour={showTour}
        back={back}
        setNotification={setNotification}
      />
    );
    PageTitle = "Sign Up";
  }

  return (
    <>
      <div>
        <div className="boxed_wrapper" style={{ height: "100vh" }}>
          <BreadCrumbBar links={[{ name: PageTitle }]} />
          <section
            className="register-section sec-padd-top"
            style={{ paddingTop: 5 }}
          >
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-12 offset-md-2">
                  {notification?.message && (
                    <Notification {...notification}>
                      {notification?.message}
                    </Notification>
                  )}
                  {notification?.resendFunction && (
                    <a
                      href="#void"
                      onClick={(e) => {
                        e.preventDefault();
                        notification.resendFunction();
                      }}
                      style={{ fontWeight: "bold" }}
                      className="energize-link"
                    >
                      Resend Link
                    </a>
                  )}
                  {notification?.good && userWantsPasswordFree && (
                    <OpenEmailApp />
                  )}
                  {Page}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    notification: state.authNotification,
    authState: state.authState,
    fireAuth: state.fireAuth,
    links: state.links,
    community: state.page.community,
    user: state.user,
    policies: state.page.policies,
    registerPageData: state.page.registerPage,
    showTour: state.page.showTour,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      firebaseLogin: firebaseLogin,
      setNotification: setAuthNotification,
      firebaseRegistration,
      doAuthenticationWithGoogle: authenticateWithGoogle,
      doAuthenticationWithFacebook: authenticateWithFacebook,
      cancelRegistration: cancelMyRegistration,
      completeFormRegistrationInME: completeUserRegistration,
      finaliseNoPasswordAuth: finaliseNoPasswordAuthentication,
      back: () => reduxToggleGuestAuthDialog(true),
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthEntry);
