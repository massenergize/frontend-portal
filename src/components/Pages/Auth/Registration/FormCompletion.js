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
  community
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
  }

  const suggestUsername = () => {
    if (!firstName || !lastName) return;

    let suggestion = firstName + "-" + lastName;
    let number = 0;
    
    while (!apiCall("users.validate.username", 
                    {suggestion: suggestion, 
                    community: community['id']})) {
        suggestion = firstName + "-" + lastName + "-" + number;
        number += 1;
    }

    setUserName(suggestion);
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
        <div className="complete-form-header">
          <p>Almost there, please tell us all of the following. Thank you!</p>
        </div>
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
          <div className="form-group">
            <span className="adon-icon">
              <span className="fa fa-user"></span>
            </span>
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={(e) => handleUserNameChange(e.target.value)}
              placeholder="User Name (unique)"
            />
            <MEButton onClick={() => suggestUsername()}>
              User Name Suggestion
            </MEButton>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="zip"
              value={zip}
              onChange={onChange}
              placeholder="Home ZIP Code"
              required
            />
          </div>
          <p style={{marginTop: 10 }}>
            Explanation for why we need ZIP code...
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
              {loading ? "Creating Profile..." : "Finish Creating Profile"}
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
