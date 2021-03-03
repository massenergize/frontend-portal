import React, { Component } from "react";
import Dropdown from "react-bootstrap/esm/Dropdown";
// import PropTypes from "prop-types";

export default class MELightDropDown extends Component {
  renderChildren(data) {
    if (!data) return;
    return data.map((child, index) => {
      return ( 
        <div key={index.toString()}>
          <Dropdown.Item
            className="dropdown-item  me-dropdown-theme-item force-padding-15"
            style={{ fontWeight: "normal" }}
          >
            {child}
          </Dropdown.Item>
        </div>
      );
    });
  }
  render() {
    const { label, data } = this.props;
    return (
      <div>
        <Dropdown onSelect={() => null} style={{ display: "inline-block" }}>
          <Dropdown.Toggle
            style={{ padding: "9px 16px" }}
            className="me-undefault-btn me-light-drop-clickable undo-dropdown-active"
          >
            {label}
          </Dropdown.Toggle>
          <Dropdown.Menu
            style={{
              borderTop: "5px solid #8dc63f",
              borderRadius: "0",
              padding: "0",
            }}
            className="me-dropdown-theme me-anime-slide-from-top z-depth-1"
          >
            {this.renderChildren(data)}
            {/* <Dropdown.Item className="dropdown-item  me-dropdown-theme-item force-padding-20">
              Edit Profile
            </Dropdown.Item>
            <Dropdown.Item className="dropdown-item me-dropdown-theme-item force-padding-20">
              The Other Thing
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

MELightDropDown.defaultProps = {
  label: "Clickable Header",
  data: ["Data", "Data Name", "Data Age"],
};
