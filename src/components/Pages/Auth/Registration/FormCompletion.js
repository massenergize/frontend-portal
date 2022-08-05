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
  const [userNameValid, setUserNameValid] = useState(false);

  const [invalidUsernameDisplay, setInvalidUsernameDisplay] = useState("none");
  const [nonUniqueUsername, setNonUniqueUsername] = useState("")

  const [firstColor, setFirstColor] = useState("");
  const [secondColor, setSecondColor] = useState("");
  const [thirdColor, setThirdColor] = useState("");

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

  const validateUserName = async (username) => {
    return await apiCall("users.validate.username", {username: username}).then(json => {
        if (json.success) return json.data;
        else {
            console.log(json.error);
            return false; }
    });
  }

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    onUsernameChange(e.target.value);
    setUserNameValid(false);
    setInvalidUsernameDisplay("none");

    console.log("USERNAME_VALID IS NOW FALSE: ", userNameValid);
  }

  const suggestUsername = async () => {
    let last = "";
    for (let x of lastName.split('-')) {
        last += x.charAt(0).toUpperCase()
    }

    const template = firstName.charAt(0).toUpperCase() + firstName.substring(1) + last;
    const data = await validateUserName(template);
    console.log("data: ", data);

    setUserName(data['suggested_username'])
    setUserNameValid(true);
    onUsernameChange(data['suggested_username']);
    setThirdColor("green");
    setInvalidUsernameDisplay("none");
  }

  const autoSetSuggestion = () => {
    if (firstName && lastName && !userName) {
        suggestUsername();
    }
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
        {/* style={{marginTop: 20}} does no change */}
        <h3 align="center" className="cool-font mob-font-lg me-section-title">
          Welcome to { community.name }
        </h3>
        <h5 align="center" className="cool-font mob-font-lg me-section-title">
            Almost there! Please tell us your name
        </h5>


        <div className="c-f-inner-wrapper">
          <div className="form-group">
            <span className="adon-icon">
              <span className="fa fa-user" style={{color: firstColor}}></span>
            </span>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={onChange}
              onBlur={() => { if (firstName) setFirstColor("green"); else setFirstColor("") }}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <span className="adon-icon">
              <span className="fa fa-user" style={{color: secondColor}}></span>
            </span>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={onChange}
              onBlur={() => { autoSetSuggestion(); if (lastName) setSecondColor("green"); else setSecondColor("") }}
              placeholder="Last Name"
              required
            />
          </div>
          <p style={{marginTop: 10, marginBottom: 0 }}>
            What username would you like? {" "} 
            You can use our suggestion or create your own.
          </p>
          <div className="form-group" style={{ marginBottom: 20, marginTop: 10 }}>
            <span className="adon-icon">
              <span className="fa fa-user" style={{color: thirdColor}}></span>
            </span>
            <input
              type="text"
              name="userName"
              value={userName || ""}
              onChange={(e) => handleUserNameChange(e)}
              onBlur={async () => { 
                if (!userName) {
                    setInvalidUsernameDisplay("none");
                    setThirdColor("");
                    return;
                }
                
                if (userNameValid) {
                    setThirdColor("green");
                    setInvalidUsernameDisplay("none");
                    return;
                }

                const data = await validateUserName(userName);
                if (data['valid']) {
                    setThirdColor("green");
                    setUserNameValid(true);
                    setInvalidUsernameDisplay("none");
                    return;
                }

                setThirdColor("green");
                setUserNameValid(true);
                setNonUniqueUsername(userName)
                setUserName(data['suggested_username'])
                setInvalidUsernameDisplay("block");
              }}
              placeholder="Username (unique)"
            />
          </div>
          <div style={{display: invalidUsernameDisplay }}>The username '{nonUniqueUsername}' is taken, how about '{userName}'?</div>
          <p style={{marginTop: 10 }}>
            Your ZIP code is used to count your actions properly towards the community goal.
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
              disabled={!captchaIsValid || formNeedsWorks() || !userNameValid}
              onClick={async () => createMyAccountNow()}
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
