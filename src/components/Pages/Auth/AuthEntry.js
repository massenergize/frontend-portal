import React, { useState } from "react";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import Notification from "../Widgets/Notification/Notification";
import LoginAuth from "./Login/LoginAuth";
import SignUpAuth from "./Registration/SignUpAuth";

const SIGNIN = "signin";
const REGISTER = "signup";

export default function AuthEntry() {
  const URL = window.location.href;
  const isSignInPage = URL.includes(SIGNIN);
  const isRegistrationPage = URL.includes(REGISTER);
  const [notification, setNotification] = useState({});
  const [loading, setLoading] = useState(false);
  const [userWantsPasswordFree, setUsePasswordFree] = useState(false);

  var Page = <></>;
  var pageTitle;

  if (isSignInPage) {
    Page = (
      <LoginAuth
        loading={loading}
        userWantsPasswordFree={userWantsPasswordFree}
        setUsePasswordFree={setUsePasswordFree}
      />
    );
    pageTitle = userWantsPasswordFree ? "Password Free Sign In" : "Sign In";
  } else if (isRegistrationPage) {
    Page = <SignUpAuth loading={loading} />;
    pageTitle = "Sign Up";
  }

  return (
    <>
      <div>
        <div className="boxed_wrapper" style={{ height: "100vh" }}>
          <BreadCrumbBar links={[{ name: pageTitle }]} />
          <section
            className="register-section sec-padd-top"
            style={{ paddingTop: 5 }}
          >
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-12 offset-md-2">
                  {notification && <Notification {...notification} />}
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
