import React, { Component } from "react";
import PropTypes from "prop-types";
import MEButton from "./MEButton";
/**
 * This component accepts a list of string items and displays all of them as chips that are removable
 * @prop {object} style  | normal css styles
 * @prop {string} className
 * @prop {array} data  | an array of text
 */
export default class MEChipWrap extends Component {
  renderChips() {
    const { data } = this.props;
    if (!data) return;
    data.map((text, index) => {
      return (
        <div className="put-me-inline" key={index.toString()}>
          <MEButton mediaType="icon" icon="fa fa-times">
            {text}
          </MEButton>
        </div>
      );
    });
  }
  render() {
    return (
      <div style={{ display: "block", overflowX: "scroll" }}>
        {this.renderChips()}
        {this.props.children}
      </div>
    );
  }
}
MEChipWrap.defaultProps = {
  style: {},
  data: [],
  className: "",
};
MEChipWrap.propTypes = {
  style: PropTypes.object,
  data: PropTypes.array,
  className: PropTypes.string,
};
