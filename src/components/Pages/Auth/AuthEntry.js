import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  firebaseLogin,
  firebaseRegistration,
  setAuthNotification,
} from "../../../redux/actions/authActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import Notification from "../Widgets/Notification/Notification";
import LoginAuth from "./Login/LoginAuth";
import SignUpAuth from "./Registration/SignUpAuth";
import { validatePassword } from "./shared/utils";
const SIGNIN = "signin";
const REGISTER = "signup";

function AuthEntry({
  firebaseLogin,
  notification,
  links,
  setNotification,
  firebaseRegistration,
}) {
  const URL = window.location.href;
  const isSignInPage = URL.includes(SIGNIN);
  const isRegistrationPage = URL.includes(REGISTER);

  const [loading, setLoading] = useState(false);
  const [userWantsPasswordFree, setUsePasswordFree] = useState(false);

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

  // ------------------------------------------------------------------

  const title = "Welcome To MassEnergize";
  const description = "";
  var Page, PageTitle;

  if (isSignInPage) {
    Page = (
      <LoginAuth
        loading={loading}
        userWantsPasswordFree={userWantsPasswordFree}
        setUsePasswordFree={setUsePasswordFree}
        signUserIn={signUserIn}
        links={links}
      />
    );
    PageTitle = userWantsPasswordFree ? "Password Free Sign In" : "Sign In";
  } else if (isRegistrationPage) {
    Page = (
      <SignUpAuth
        loading={loading}
        links={links}
        description={description}
        title={title}
        registerUser={registerUser}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      firebaseLogin: firebaseLogin,
      setNotification: setAuthNotification,
      firebaseRegistration,
    },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthEntry);
