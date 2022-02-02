import React, { useState } from "react";
import MEButton from "../../Widgets/MEButton";
import { US_STATES } from "./values";
import ReCAPTCHA from "react-google-recaptcha";
import "./FormCompletion.css";
import { isInvalid } from "../shared/utils";
import { onReCaptchaChange } from "../../../../redux/actions/authActions";
import { useHistory } from "react-router-dom";
export default function FormCompletion({
  onChange,
  getValue,
  cancelRegistration,
}) {
  const [captchaIsValid, setcaptchaIsValid] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const firstName = getValue("firstName");
  const lastName = getValue("lastName");
  const preferredName = getValue("preferredName");
  const city = getValue("city");
  const state = getValue("state");
  const zip = getValue("zip");
  const captcha = getValue("captcha");

  const checkCaptcha = (value) => {
    onReCaptchaChange(value, (status) => setcaptchaIsValid(status));
  };

  const formNeedsWorks = () => {
    [firstName, lastName, preferredName, city, state, zip].forEach((f) => {
      if (isInvalid(f)) return true;
    });
    return false;
  };

  if (deleteConfirmation)
    return (
      <div
        className="z-depth-float me-anime-open-in"
        style={{ padding: 20, borderRadius: 6 }}
      >
        <p style={{ color: "black", margin: 0 }}>
          If you cancel, your account you will lose all your registration
          progress and will be removed from the platform. Are you sure about
          this?
        </p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ marginLeft: "auto" }}>
            <MEButton
              variation="accent"
              onClick={() => setDeleteConfirmation(false)}
            >
              No
            </MEButton>
            <MEButton onClick={() => cancelRegistration()}>Yes</MEButton>
          </div>
        </div>
      </div>
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
              name="preferredName"
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
              // onChange={(event) => this.setState({ state: event.target.value })}
              placeholder="State"
            >
              {US_STATES.map((state, index) => {
                return (
                  <option key={index?.toString()} value={state.value}>
                    {state.name}
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
              onClick={() => this.setState({ showPP: true })}
              className="as-link"
              style={{ display: "inline-block" }}
            >
              Privacy Policy
            </button>{" "}
            (in short, MassEnergize or host organization won't share my data)
            and agree to comply with the
            <button
              type="button"
              // onClick={() => this.setState({ showTOS: true })}
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
            >
              Finish Creating Profile
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
