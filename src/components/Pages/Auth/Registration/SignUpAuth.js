import React, { useState } from "react";
import { isInvalid } from "../shared/utils";
import MEButton from "./../../../../components/Pages/Widgets/MEButton";

export default function SignUpAuth({
  description,
  title,
  loading,
  registerUser,
}) {
  const [form, setForm] = useState({});

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>
          <br />

          <div className="clearfix">
            <div className="form-group pull-left">
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
              <small style={{ margin: "0px 15px" }}>
                <b>OR USE</b>
              </small>
              <MEButton
                // onClick={this.signInWithGoogle}
                className="me-google-btn"
              >
                Google
              </MEButton>

              <MEButton
                // onClick={this.signInWithFacebook}
                className="me-facebook-btn"
              >
                Facebook
              </MEButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
