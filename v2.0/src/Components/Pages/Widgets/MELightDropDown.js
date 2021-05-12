import React, { Component } from "react";
import Dropdown from "react-bootstrap/esm/Dropdown";
// import PropTypes from "prop-types";
export const NONE = "------";
export default class MELightDropDown extends Component {
  onItemSelected(e, child) {
    e.preventDefault();
    const { onItemSelected, dataValues, data } = this.props;
    if (!onItemSelected) return;
    if (!dataValues || dataValues.length === 0) {
      onItemSelected(child, this.props.categoryType);
      return;
    }
    onItemSelected(dataValues[data.indexOf(child)], this.props.categoryType);
  }

  renderChildren(data) {
    if (!data) return;
    data = [NONE, ...data];
    return data.map((child, index) => {
      return (
        <div
          key={index.toString()}
          onClick={(e) => this.onItemSelected(e, child)}
        >
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
    const { label, data, style, labelIcon, menuTextClick } = this.props;
    return (
      <div>
        <Dropdown
          onSelect={() => null}
          style={{ display: "inline-block", padding: "0px 10px" }}
        >
          <Dropdown.Toggle
            style={{ ...style }}
            className="me-undefault-btn me-light-drop-clickable undo-dropdown-active clear-drop-after me-light-drop-fine-tune"
          >
            <span
              onClick={() => {
                if (menuTextClick) menuTextClick();
              }}
            >
              {label}
              {labelIcon}
            </span>
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
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

MELightDropDown.defaultProps = {
  label: "Clickable Header",
  data: ["Data", "Data Name", "Data Age"],
  dataValues: [],
  style: {},
};
