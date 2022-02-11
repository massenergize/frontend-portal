import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  getRandomColor,
  ifEnterKeyIsPressed,
  isInvalid,
} from "../shared/utils";
import MEButton from "./../../../../components/Pages/Widgets/MEButton";
import FormCompletion from "./FormCompletion";


export default function SignUpAuth({
  description,
  title,
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
  registerWithGoogle,
  registerWithFacebook,
  showTour,
}) {
  const [form, setForm] = useState({});
  const [itsTimeForRegistration] = useState(userNeedsToRegister);

  const history = useHistory();

  const yesDeleteMyAccount = () => {
    cancelRegistration();
    history.push(links.signin);
  };
  const onChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
  };

  const whenUserTypes = (e) => {
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
      preferred_name: form.preferred_name || form.firstName,
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
        onChange={onChange}
        getValue={getValue}
        form={form}
        cancelRegistration={yesDeleteMyAccount}
        createMyAccountNow={finaliseFormAndRegister}
        loading={loading}
        policies={policies}
      />
    );


  return (
    <div className="styled-form register-form">
      <div
        className="z-depth-float me-anime-fade-in-up"
        style={{ padding: 46, borderRadius: 12 }}
      >
        <div className="section-title style-2">
          <h3>{title}</h3>
          <p> {description}</p>
        </div>
        <div>
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
            <div style={{ display: "flex", flexDirection: "row" }}>
              <MEButton
                disabled={
                  isInvalid(getValue("email")) || invalidPassword() || loading
                }
                id="create-profile-btn"
                loading={loading}
                onClick={() => registerUser(form)}
              >
                {loading ? "Creating profile..." : " Create Profile"}
              </MEButton>

              <div style={{ marginLeft: "auto" }}>
                <small style={{ margin: "0px 15px" }}>
                  <b>OR USE</b>
                </small>
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
            </div>

            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <Link
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  marginBottom: 6,
                  fontSize: "large",
                }}
                className=" energize-link"
                to={links.signin}
              >
                I have an account already
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
