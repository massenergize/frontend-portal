export const AUTH_STATES = {
  USER_IS_NOT_AUTHENTICATED: "user-is-not-authenticated",
  CHECKING_FIREBASE: "looking_for_firebase_authentication",
  CHECK_MASS_ENERGIZE: "checking_massenergize_for_profile",
  NEEDS_REGISTRATION: "authenticated_but_needs_registration",
};

export const translateFirebaseError = (error) => {
  if (!error) return;
  if (error.includes("auth/uid-already-exists"))
    return "Hi there, a user already exists with this email";
  if (error.includes("auth/invalid-password"))
    return "Hi, it looks like you typed a wrong password";
  if (error.includes("auth/invalid-email"))
    return "Hi, please provide a valid email address, thank you :)";
  if (error.includes("auth/user-not-found"))
    return "Hi, it looks like you do not have an account with this email yet.. :(";
  return error?.toString();
};

export const isInvalid = (value) => {
  if (!value || value?.trim() === "") return true;
  return false;
};

export const validatePassword = (password, confirmPasssword) => {
  if (!password) return { passed: false, error: "Enter a paswword" };

  if (password.length < 6)
    return {
      passed: false,
      error: "Please enter a password that is more than 6 characters...",
    };
  if (password !== confirmPasssword)
    return {
      passed: false,
      error: "It looks like your passwords do not match...",
    };
  return { passed: true };
};

export const ifEnterKeyIsPressed = (e) => {
  if (e?.key === "Enter" || e?.keyCode === 13) return true;
  return false;
};
