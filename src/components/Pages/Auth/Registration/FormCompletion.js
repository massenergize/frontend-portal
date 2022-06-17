import React, { useState } from "react";
import MEButton from "../../Widgets/MEButton";
import ReCAPTCHA from "react-google-recaptcha";
import "./FormCompletion.css";
import { isInvalid } from "../shared/utils";
import { onReCaptchaChange } from "../../../../redux/actions/authActions";
import InformationBoard from "./InformationBoard";
import DeleteConfirmation from "./DeleteConfirmation";
import { apiCall } from "../../../../api/functions";
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
  onUsernameChange
}) {
  const [captchaIsValid, setcaptchaIsValid] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const [showPP, setShowPP] = useState(false);
  const [userName, setUserName] = useState("");

  const TOS = policies?.find((x) => x.name === "Terms of Service") || "";
  const PP = policies?.find((x) => x.name === "Privacy Policy") || "";

  const firstName = getValue("firstName");
  const lastName = getValue("lastName");
  const zip = getValue("zip");

  const checkCaptcha = (value) => {
    onReCaptchaChange(value, (status) => setcaptchaIsValid(status));
  };

  const formNeedsWorks = () => {
    const fieldVals = [firstName, lastName, zip];
    for (let i = 0; i < fieldVals.length; i++) {
      const field = fieldVals[i];
      if (isInvalid(field)) return true;
    }
    return false;
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    onUsernameChange(e.target.value);
    console.log(community);
  }

  const suggestUsername = async () => {
    if (!firstName || !lastName) return;

    let suggestion = firstName + "-" + lastName;
    let number = 0;
    let is_valid;
    
    await apiCall("users.validate.username", {suggestion: suggestion}).then(json => {
        if (json.success) 
            is_valid = json.data;
        else
            console.log(json.error);
    });

    while (!is_valid) {
        suggestion = firstName + "-" + lastName + "-" + number;
        number += 1;

        await apiCall("users.validate.username", {suggestion: suggestion}).then(json => {
            if (json.success) 
                is_valid = json.data;
            else
                console.log(json.error);
        });
    }

    setUserName(suggestion);
    onUsernameChange(suggestion);
  }

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

  return (
    <div>
      <div className="styled-form me-anime-fade-in-up register-form z-depth-float shave-points">
        {/* <div className="complete-form-header">
          <p>Almost there, please tell us all of the following. Thank you!</p>
        </div> */}

        <img src={ community.logo.url } alt="Welcome" align="center" style={{ height: 100, width: 100, margin: "auto",display: "block", marginTop: 10 }} />
        <br />
        <h3 align="center" className="cool-font mob-font-lg me-section-title">
          Welcome to { community.name }
        </h3>
        <h5 align="center" className="cool-font mob-font-lg me-section-title">
            Almost there! Please tell us all of the following
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
              placeholder="Last Name"
              required
            />
          </div>
          <p style={{marginTop: 10 }}>
            We don't share your full name with others.
            <br />
            We don't make your full name public on the site, so please create a username below.
          </p>
          <div className="form-group">
            <span className="adon-icon">
              <span className="fa fa-user"></span>
            </span>
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={(e) => handleUserNameChange(e)}
              placeholder="User Name (unique)"
            />
            <MEButton style={{marginTop: 20 }} onClick={() => suggestUsername()}>
              User Name Suggestion
            </MEButton>
          </div>
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
          <p style={{marginTop: 10 }}>
            Your ZIP code is used to make your action count towards { community.name }'s collective goal.
          </p>
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
              disabled={!captchaIsValid || formNeedsWorks()}
              onClick={() => createMyAccountNow()}
              loading={loading}
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
