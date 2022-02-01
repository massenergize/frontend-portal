export const AUTH_STATES = {
  USER_IS_NOT_AUTHENTICATED: "user-is-not-authenticated",
  CHECKING_FIREBASE: "looking-for-firebase-authentication",
  CHECK_MASS_ENERGIZE: "checking-massenergize-for-profile",
  MASS_ENERGIZE_PROFILE_DOES_NOT_EXIST:
    "massenergize-profile-does-not-exist-yet",
};

export const translateFirebaseError = (error) => {
  if (!error) return;
  if (error.includes("auth/uid-already-exists"))
    return "Hi there, a user already exists with this email";
  if (error.includes("auth/invalid-password"))
    return "Hi, it looks like you typed a wrong password";
  if (error.includes("auth/invalid-email"))
    return "Hi, please provide a valid email address, thank you :)";
};
