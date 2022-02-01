import React from "react";
import LoginAuth from "./Login/LoginAuth";
import SignUpAuth from "./Registration/SignUpAuth";

const SIGNIN = "signin";
const REGISTER = "signup";

export default function AuthEntry() {
  const URL = window.location.href;
  const isSignInPage = URL.includes(SIGNIN);
  const isRegistrationPage = URL.includes(REGISTER);

  if (isSignInPage) return <LoginAuth />;
  if (isRegistrationPage) return <SignUpAuth />;
  
  return <></>;
}


