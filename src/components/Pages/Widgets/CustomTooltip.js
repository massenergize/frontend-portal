import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
class CustomTooltip extends Component {
  constructor(props) {
    super();
    this.state = { hoverableItemHeight: 0 };
  }

  componentDidMount() {
    if (this.props.custom)
      this.setState({
        hoverableItemHeight:
          document.getElementById("hoverable-item").offsetHeight,
      });
  }
  render() {
    const {
      containerStyle,
      contentStyle,
      paperStyle,
      custom,
      placement,
      text,
    } = this.props;
    if (!custom)
      return (
        <OverlayTrigger
          placement={placement || "auto"}
          overlay={<Tooltip>{text}</Tooltip>}
        >
          {this.props.children}
        </OverlayTrigger>
      );
    return (
      <div
        style={{ display: "inline-block", ...containerStyle }}
        className="c-tooltip-container"
      >
        <div
          className="c-tooltip-msg-container"
          style={{
            marginTop: -1 * this.state.hoverableItemHeight,
            ...contentStyle,
          }}
        >
          <div
            className="c-tooltip-text-paper  z-depth-float-half"
            style={paperStyle}
          >
            <span style={{ fontSize: 12 }}>{this.props.text}</span>
          </div>
        </div>
        <div
          id="hoverable-item"
          style={{ display: "inline-block", cursor: "pointer" }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  paperStyle: PropTypes.object,
};
CustomTooltip.defaultProps = {
  containerStyle: {},
  contentStyle: {},
  paperStyle: {},
};

export default CustomTooltip;
