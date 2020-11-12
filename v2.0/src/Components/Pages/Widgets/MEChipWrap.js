import React, { Component } from "react";
import PropTypes from "prop-types";
import MEButton from "./MEButton";
/**
 * This component accepts a list of string items and displays all of them as chips that are removable
 * @prop {object} style  | normal css styles
 * @prop {string} className
 * @prop {array} data  | an array of text
 * @prop {func} removeItem | A function that should run a chip is clicked
 */
export default class MEChipWrap extends Component {
  constructor(props) {
    super();
    this.removeItemOnClick = this.removeItemOnClick.bind(this);
  }
  removeItemOnClick(item) {
    const { removeItem } = this.props;
    if (!removeItem) return;
     return removeItem(item);
  }
  renderChips() {
    const { data } = this.props;
    if (!data) return;
    return data.map((text, index) => {
      return (
        <div className="put-me-inline" key={index.toString()}>
          <MEButton
            style={{ fontSize: "small", padding: "8px 11px" }}
            mediaType="icon"
            icon="fa fa-times"
            variation="accent"
            className=" me-anime-open-in"
            onClick={()=>this.removeItemOnClick(text)}
          >
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
  removeItem: PropTypes.func,
};
