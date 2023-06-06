import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import AuthFooter from "../Components/auth footer/AuthFooter";
import AuthHeader from "../Components/AuthHeader";
import TextBoxAndButtonCombo from "../Components/TextBoxAndButtonCombo";
import {
  getRandomColor,
  ifEnterKeyIsPressed,
  isInvalid,
} from "../shared/utils";
// import MEButton from "./../../../../components/Pages/Widgets/MEButton";
import FormCompletion from "./FormCompletion";
import { apiCall } from "../../../../api/functions";
const ALLOWED_TRIGGERS = ["firstName", "lastName"];
export default function SignUpAuth({
  // description,
  // title,
  loading,
  registerUser,
  links,
  userNeedsToRegister,
  cancelRegistration,
  community,
  fireAuth,
  completeFormRegistrationInME,
  setLoading,
  policies,
  setNotification,
  // registerWithGoogle,
  // registerWithFacebook,
  // showTour,
  back,
}) {
  const [form, setForm] = useState({});
  const [itsTimeForRegistration] = useState(userNeedsToRegister);
  const [userName, setUserName] = useState("");
  const [suggested, setSuggested] = useState(null);
  const [validatorLoading, setValidatorLoading] = useState(false);
  const history = useHistory();
  // // let debounceTimeoutId;
  // // const controller = new AbortController();

  const onUsernameChange = (username) => {
    setUserName(username);
  };

  const yesDeleteMyAccount = () => {
    cancelRegistration();
    history.push(links.signin);
  };

  // const debounceSearch = ({ cb, requestBody, url, controller, timeoutId }) => {
  //   clearTimeout(timeoutId);
  //   controller.abort(); // Cancel previous request
  //   timeoutId = setTimeout(async () => {
  //     console.log("LEts see body", requestBody)
  //     try {
  //       const { signal } = controller;
  //       const response = await apiCall(url, requestBody, null, { signal });
  //       console.log("this is the response by geee", response);
  //       // const response = await fetch(
  //       //   `https://api.example.com/search?q=${value}`,
  //       //   { signal }
  //       // );
  //       cb && cb(response, false, null);
  //     } catch (error) {
  //       if (error.name === "AbortError") console.log("Request aborted");
  //       if (error.name !== "AbortError") {
  //         console.error(error);
  //         cb && cb(null, true, error);
  //       }
  //     }
  //   }, 600); // Debounce delay in milliseconds
  // };

  // const validateUserName = (response, failed, error) => {
  //   if (failed)
  //     return setFormErrors({ ...(formErrors || {}), ["userName"]: error });
  // };

  const validateOrSuggestUserName = () => {
    const value = (form?.firstName || "") + (form?.lastName || "");
    setNotification({});
    setValidatorLoading(true);
    // console.log("This is the form I think ", form);
    apiCall("users.validate.username", { username: value }).then(
      ({ data, success, error }) => {
        setValidatorLoading(false);
        if (!success) return console.log("Error validating: ", error);
        const { code, valid, suggested_username, message } = data;
        if (!valid && code === 911)
          return setNotification({ good: false, message });

        if (!valid && code === 202) return setSuggested(suggested_username);
      }
    );
  };
  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const newForm = { ...form, [name]: value?.trim() };
    setForm(newForm);
    // setValidatorLoading(true);
  };

  const hasInvalidContent = () => {
    return isInvalid(getValue("password")) || isInvalid(getValue("email"));
  };
  const whenUserTypes = (e) => {
    if (hasInvalidContent()) return;
    if (ifEnterKeyIsPressed(e)) registerUser(form);
  };

  const getValue = (name) => {
    return (form || {})[name] || "";
  };

  const invalidPassword = () => {
    var status =
      isInvalid(getValue("password")) ||
      isInvalid(getValue("confirm_password"));
    return status;
  };

  const finaliseFormAndRegister = () => {
    const location = " , " + form.city + ", " + form.state + ", " + form.zip;
    const body = {
      full_name: form.firstName + " " + form.lastName,
      preferred_name: userName || form.firstName,
      email: fireAuth.email,
      location: location,
      is_vendor: false,
      accepts_terms_and_conditions: true,
      subdomain: community && community.subdomain,
      color: getRandomColor(),
    };

    setLoading(true);
    completeFormRegistrationInME(body, () => setLoading(false));
  };
  if (itsTimeForRegistration)
    return (
      <FormCompletion
        validateOrSuggestUserName={validateOrSuggestUserName}
        validatorLoading={validatorLoading}
        onChange={onChange}
        getValue={getValue}
        form={form}
        cancelRegistration={yesDeleteMyAccount}
        createMyAccountNow={finaliseFormAndRegister}
        loading={loading}
        policies={policies}
        community={community}
        onUsernameChange={onUsernameChange}
        suggestedName={suggested}
      />
    );

  return (
    <div className=" register-form">
      <div
        className="z-depth-float me-anime-fade-in-up force-no-elevation-on-mobile"
        style={{ borderRadius: 12 }}
      >
        <div className="register-form-content">
          <AuthHeader>Welcome!</AuthHeader>
          <small className="auth-info">
            When you join, we can count your impact. We do not collect sensitive
            personal data and do not share data.
          </small>
          <div style={{ marginTop: 6 }}>
            <input
              style={{ width: "100%", marginBottom: 6 }}
              placeholder="Enter your email address"
              className="auth-textbox"
              type="email"
              name="email"
              value={getValue("email")}
              onChange={onChange}
            />
            <input
              style={{ width: "100%", marginBottom: 6 }}
              placeholder="Enter your password here"
              type="password"
              name="password"
              value={getValue("password")}
              className="auth-textbox"
              onChange={onChange}
            />

            <TextBoxAndButtonCombo
              placeholder="Re-enter the password"
              name="confirm_password"
              value={getValue("confirm_password")}
              type="password"
              onChange={onChange}
              btnText="Join"
              disabled={
                isInvalid(getValue("email")) || invalidPassword() || loading
              }
              genericProps={{ onKeyUp: whenUserTypes }}
              loading={loading}
              onClick={() => registerUser(form)}
            />
          </div>
        </div>
        <AuthFooter back={back}>
          {" "}
          <button
            className="auth-btns touchable-opacity"
            style={{
              background: "var(--app-theme-orange)",
              borderBottomRightRadius: 5,
              margin: 0,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
            onClick={() => history.push(links?.signin)}
          >
            I have a profile already
            <i
              className="fa fa-long-arrow-right"
              style={{ color: "white", marginLeft: 6 }}
            />
          </button>{" "}
        </AuthFooter>

        {/* <div className=" style-2">
          <h3 className="mob-title-fix">{title}</h3>
          <p className="mob-f-text"> {description}</p>
        </div> */}
        {/* <div>
          <div className="form-group">
            <span className="adon-icon">
              <span className="fa fa-envelope-o"></span>
            </span>
            <input
              id="email"
              type="email"
              name="email"
              value={getValue("email")}
              onChange={onChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <div className="form-group">
              <span className="adon-icon">
                <span className="fa fa-unlock-alt"></span>
              </span>
              <input
                id="password"
                type="password"
                name="password"
                value={getValue("password")}
                onChange={onChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <span className="adon-icon">
                <span className="fa fa-unlock-alt"></span>
              </span>
              <input
                id="confirm-password"
                type="password"
                name="confirm_password"
                value={getValue("confirm_password")}
                onChange={onChange}
                onKeyUp={whenUserTypes}
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>
          <br />

          <div className="clearfix">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MEButton
                disabled={
                  isInvalid(getValue("email")) || invalidPassword() || loading
                }
                id="create-profile-btn"
                className="mob-log-submit"
                loading={loading}
                onClick={() => registerUser(form)}
              >
                {loading ? "Creating profile..." : " Create Profile"}
              </MEButton>

              {!loading && (
                <div
                  className="form-group social-links-two padd-top-5 "
                  style={{ marginLeft: "auto", marginBottom: 0 }}
                >
                  <small style={{ margin: "0px 15px" }}>
                    <b>OR USE</b>
                  </small>

                  <button
                    onClick={() => {
                      registerWithGoogle((user) => {
                        if (user) window.location.reload();
                      });
                    }}
                    id="google"
                    type="button"
                    className="img-circle  round-me  me-google-btn z-depth-float"
                  >
                    <span className="fa fa-google"></span>
                  </button>
                  <button
                    onClick={() =>
                      registerWithFacebook((user) => {
                        if (user) window.location.reload();
                      })
                    }
                    id="facebook"
                    type="button"
                    className="img-circle  round-me me-facebook-btn z-depth-float"
                  >
                    <span className="fa fa-facebook"></span>
                  </button>
                   <MEButton
                  onClick={() => {
                    registerWithGoogle((user) => {
                      if (user) window.location.reload();
                    });
                  }}
                  className="me-google-btn"
                >
                  Google
                </MEButton>

                <MEButton
                  onClick={() =>
                    registerWithFacebook((user) => {
                      if (user) window.location.reload();
                    })
                  }
                  className="me-facebook-btn"
                >
                  Facebook
                </MEButton>
                </div>
              )}
            </div>

            <div
              className="link-groups"
              // style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <Link
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  marginBottom: 6,
                  fontSize: "large",
                }}
                className="energize-link"
                to={links.signin}
              >
                I have an account already
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
