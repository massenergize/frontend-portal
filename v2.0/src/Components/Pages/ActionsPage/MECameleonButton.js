import React, { Component } from "react";
import CustomTooltip from "../Widgets/CustomTooltip";
// import PropTypes from "prop-types";
import MEButton from "../Widgets/MEButton";
import {
  CASE_PROPS,
  DEFAULT_STATE,
  DONE,
  IS_DONE,
  TODO,
} from "./ActionStateConstants";
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
  renderButton(props) {
    const passed = this.props;
    if ( !props) return <small>Dont have any props</small>
    props = {...props,...passed} 
    if (props.hasPopover) {
      return (
        <CustomTooltip text={props.popoverText}>
          <MEButton className={props.className} style={props.style}>
            {props.text}
          </MEButton>
        </CustomTooltip>
      );
    }
    return (
      <MEButton className={props.className} style={props.style}>
        {props.text}
      </MEButton>
    );
  }
  render() {
    const { _case, type } = this.props;
    const props = CASE_PROPS[_case][type];

    return this.renderButton(props)
  }
}

MECameleonButton.defaultProps = {
  _case: IS_DONE,
  type: TODO,
  hasPopover: true, 
  popoverText: "This is the default poopver"
};
MECameleonButton.propTypes = {};

export default MECameleonButton;
