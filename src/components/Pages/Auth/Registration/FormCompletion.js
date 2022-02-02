import React, { useState } from "react";
import MEButton from "../../Widgets/MEButton";
import { US_STATES } from "./values";
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
}) {
  const [captchaIsValid, setcaptchaIsValid] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showTOS, setShowTOS] = useState(false);
  const [showPP, setShowPP] = useState(false);

  const TOS = policies?.find((x) => x.name === "Terms of Service") || "";
  const PP = policies?.find((x) => x.name === "Privacy Policy") || "";

  const firstName = getValue("firstName");
  const lastName = getValue("lastName");
  const preferredName = getValue("preferred_name");
  const city = getValue("city");
  const state = getValue("state");
  const zip = getValue("zip");

  const checkCaptcha = (value) => {
    onReCaptchaChange(value, (status) => setcaptchaIsValid(status));
  };

  const formNeedsWorks = () => {
    const fieldVals = [firstName, lastName, city, state, zip];
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

  return (
    <div>
      <div className="styled-form register-form z-depth-float shave-points">
        <div className="complete-form-header">
          <p>Almost there, please fill this short form completely</p>
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
              name="preferred_name"
              value={preferredName}
              onChange={onChange}
              placeholder="Preferred Name (visible to others)"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="city"
              value={city}
              onChange={onChange}
              placeholder="City / Town"
            />
          </div>

          <div className="form-group">
            <select
              value={state}
              className="form-control"
              name="state"
              onChange={onChange}
              placeholder="State"
            >
              {US_STATES.map((s, index) => {
                return (
                  <option key={index?.toString()} value={s.value}>
                    {s.name}
                  </option>
                );
              })}
            </select>
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
                onClick={() => setDeleteConfirmation(true)}
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
          <small>
            If you cancel, you will delete your account, and all your progress
          </small>
        </div>
      </div>
    </div>
  );
}
