import React from "react";
import { US_STATES } from "./values";

export default function FormCompletion({ onChange, getValue, form }) {
  const firstName = getValue("firstName");
  const lastName = getValue("lastName");
  const preferredName = getValue("preferredName");
  const city = getValue("city");
  const state = getValue("state");
  return (
    <div>
      <div className="styled-form register-form">
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
      </div>
    </div>
  );
}
