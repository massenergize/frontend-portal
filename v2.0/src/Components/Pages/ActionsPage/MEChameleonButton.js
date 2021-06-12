import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import CustomTooltip from "../Widgets/CustomTooltip";
// import PropTypes from "prop-types";
import MEButton from "../Widgets/MEButton";
import { CASE_PROPS, DEFAULT_STATE, TODO } from "./ActionStateConstants";
/**
 * A more advance ME Button that reacts to aesthetic and functional changes
 * on the fly, based on properties, without actually changing or swapping the button
 * component itself
 * -------------- This is how things happen ----------
 * This component accepts a CASE
 * And with each case, the TODO, and DONE_IT buttons have properties(styles, classes, functions) they must have
 * Default properties are defined a the end of the file
 */

class MECameleonButton extends Component {
  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }
  handleOnClick() {
    const { onClick, href, to } = this.props;
    if (href || to) {
      return this.props.history.push(href || to);
    }
    if (!onClick) return;

    return onClick();
  }
  renderButton(props) {
    const passed = this.props;
    if (!props) return <small>Dont have any props</small>;
    props = { ...props, ...passed };
    if (props.hasPopover) {
      return (
        <CustomTooltip
          text={props.popoverText}
          contentStyle={{ marginLeft: "-9vw" }}
        >
          <MEButton
            className={`cam-btn-defaults ${props.className}`}
            style={props.style}
            onClick={this.handleOnClick}
          >
            {props.text}
          </MEButton>
        </CustomTooltip>
      );
    }
    return (
      <MEButton
        className={`cam-btn-defaults ${props.className}`}
        style={props.style}
      >
        {props.text}
      </MEButton>
    );
  }
  render() {
    const { _case, type } = this.props;
    const props = CASE_PROPS[_case][type];
    return this.renderButton(props);
  }
}

MECameleonButton.defaultProps = {
  _case: DEFAULT_STATE,
  type: TODO,
};
MECameleonButton.propTypes = {};

export default withRouter(MECameleonButton);
