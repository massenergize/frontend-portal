import React, { useState } from "react";
import MEButton from "../../Widgets/MEButton";
import ReCAPTCHA from "react-google-recaptcha";
import "./FormCompletion.css";
import { isInvalid } from "../shared/utils";
import { onReCaptchaChange } from "../../../../redux/actions/authActions";
import InformationBoard from "./InformationBoard";
import DeleteConfirmation from "./DeleteConfirmation";
export default function FormCompletion({
  onChange,
  getValue,
  cancelRegistration,
  createMyAccountNow,
  loading,
  policies,
  disableDeleteNotification,
  customCancel,
  community,
  // onUsernameChange,
  validateOrSuggestUserName,
  validatorLoading,
  suggestedName,
  updateForm,
  notification,
  namesChanged,
  setNamesChanged
}) {
  const [captchaIsValid, setcaptchaIsValid] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const [showPP, setShowPP] = useState(false);
  const [userNameValid, setUserNameValid] = useState(undefined);

  const TOS = policies?.find((x) => x.name === "Terms of Service") || "";
  const PP = policies?.find((x) => x.name === "Privacy Policy") || "";

  const firstName = getValue("firstName");
  const lastName = getValue("lastName");
  const userName = getValue("userName");
  // const namesChanged = getValue("namesChanged");
  const zip = getValue("zip");
  const noErrors =
    !notification || notification.good || notification.good === undefined;

  const checkCaptcha = (value) => {
    onReCaptchaChange(value, (status) => setcaptchaIsValid(status));
  };

  const formNeedsWork = () => {
    const fieldVals = [firstName, lastName, zip];
    for (let i = 0; i < fieldVals.length; i++) {
      const field = fieldVals[i];
      if (isInvalid(field)) return true;
    }
    return false;
  };

  if (showTOS)
    return (
      <InformationBoard
        close={() => setShowTOS(false)}
        html={TOS?.description}
      />
    );
  if (showPP)
    return (
      <InformationBoard close={() => setShowPP(false)} html={PP?.description} />
    );

  if (deleteConfirmation)
    return (
      <DeleteConfirmation
        setDeleteConfirmation={setDeleteConfirmation}
        cancelRegistration={cancelRegistration}
      />
    );

  const addOnIcon = (show, icon, style) => {
    if (!show) return <></>;
    return <span className={`fa ${icon || ""}`} style={style || {}}></span>;
  };

  const triggerUsernameValidation = (key) => {
    const value = firstName + lastName;
    validateOrSuggestUserName(
      value,
      ({ code, valid, suggested_username }) => {
        if (code === 911) return;
        if (namesChanged) {
          setUserNameValid(suggested_username ? true : false);
          updateForm({
            userName: valid ? value : suggested_username,
            // namesChanged: false,
          });
          setNamesChanged(false);
        }
      },
      key
    );
  };

  const getValidStyles = () => {
    if (userNameValid === undefined) return {};
    if (userNameValid === true)
      return { borderColor: "#8dc63f", borderWidth: 3 };
    if (userNameValid === false) return { borderColor: "red", borderWidth: 3 };
  };

  
  return (
    <div>
      <div
        style={{ paddingTop: 30 }}
        className="styled-form me-anime-fade-in-up register-form z-depth-float shave-points"
      >
        {/* style={{marginTop: 20}} does no change */}
        <h3 align="center" className="cool-font mob-font-lg me-section-title">
          Welcome to {community.name}
        </h3>
        <h5 align="center" className="cool-font mob-font-lg me-section-title">
          Almost there! Please tell us your name
        </h5>

        <div className="c-f-inner-wrapper">
          <div className="form-group">
            <span className="adon-icon">
              <span className="fa fa-user"></span>
            </span>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={onChange}
              onBlur={() => triggerUsernameValidation("firstName")}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <span className="adon-icon">
              <span className="fa fa-user"></span>
            </span>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={onChange}
              onBlur={() => triggerUsernameValidation("lastName")}
              placeholder="Last Name"
              required
            />
          </div>
          <p style={{ marginTop: 10, marginBottom: 0 }}>
            {suggestedName ? (
              <span>
                The username is already taken, how about "
                <span style={{ color: "green" }}>{suggestedName}</span>" ?
              </span>
            ) : (
              <span>
                What username would you like? You can use our suggestion or
                create your own.
              </span>
            )}
          </p>
          <div
            className="form-group"
            style={{ marginBottom: 20, marginTop: 10 }}
          >
            <span className="adon-icon">
              {addOnIcon(validatorLoading, "fa-spinner fa-spin", {
                color: "#8dc63f",
              })}
              {addOnIcon(
                !validatorLoading && userNameValid,
                "fa-check-circle",
                {
                  color: "#8dc63f",
                  fontSize: 21,
                }
              )}
              {addOnIcon(
                !validatorLoading && userNameValid === false,
                "fa-times-circle",
                {
                  color: "red",
                }
              )}
              {addOnIcon(
                !validatorLoading && userNameValid === undefined,
                "fa-user"
              )}
            </span>
            <input
              style={getValidStyles()}
              type="text"
              name="userName"
              value={userName || ""}
              // onChange={(e) => handleUserNameChange(e)}
              onChange={onChange}
              placeholder="Username (unique)"
              onBlur={() => {
                validateOrSuggestUserName(
                  userName,
                  ({ valid, suggested_username, code }, recommend) => {
                    if (code === 911) return setUserNameValid(false);
                    if (valid) setUserNameValid(true);
                    else setUserNameValid(false);
                    if (code === 202) recommend(suggested_username);
                  }
                );
              }}
            />
          </div>
          {/* <div style={{ display: invalidUsernameDisplay }}>
            The username '{nonUniqueUsername}' is taken, how about '{userName}'?
          </div> */}
          <p style={{ marginTop: 10 }}>
            Your ZIP code is used to count your actions properly towards the
            community goal.
          </p>
          <div className="form-group">
            <input
              type="text"
              name="zip"
              value={zip}
              onChange={onChange}
              placeholder="Household ZIP Code"
              required
            />
          </div>
          <ReCAPTCHA
            sitekey="6LcLsLUUAAAAAL1MkpKSBX57JoCnPD389C-c-O6F"
            onChange={checkCaptcha}
          />
          <p style={{ marginTop: 10 }}>
            By continuing, I accept the{" "}
            <button
              type="button"
              onClick={() => setShowPP(true)}
              className="as-link"
              style={{ display: "inline-block" }}
            >
              Privacy Policy
            </button>{" "}
            (in short, MassEnergize or host organization won't share my data)
            and agree to comply with the
            <button
              type="button"
              onClick={() => setShowTOS(true)}
              className="as-link"
              style={{ display: "inline-block", marginLeft: 3 }}
            >
              Terms of Service
            </button>
          </p>
          <div className="form-completion-footer">
            <div>
              <MEButton
                variation="accent"
                onClick={() => {
                  if (customCancel) return customCancel();
                  setDeleteConfirmation(true);
                }}
                style={{ marginLeft: 10 }}
              >
                Cancel
              </MEButton>
            </div>
            <MEButton
              style={{ marginRight: 8, padding: "11px 40px" }}
              type="submit"
              containerStyle={{ marginLeft: "auto" }}
              disabled={
                !captchaIsValid ||
                formNeedsWork() ||
                !userNameValid ||
                !noErrors
              }
              onClick={async () => createMyAccountNow()}
              loading={loading}
              className={
                captchaIsValid &&
                !formNeedsWork() &&
                userNameValid &&
                noErrors &&
                "form-complete-submit-btn"
              }
            >
              {loading ? "Creating Profile..." : "Finish Signing Up!"}
            </MEButton>
          </div>
          {!disableDeleteNotification && (
            <small>
              If you cancel, you will delete your account, and all your progress
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
