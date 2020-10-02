import React, { Component } from "react";
import PropTypes from "prop-types";
class CustomTooltip extends Component {
  constructor(props) {
    super();
    this.state = { hoverableItemHeight: 0 };
  }

  componentDidMount() {
    this.setState({
      hoverableItemHeight: document.getElementById("hoverable-item")
        .offsetHeight,
    });
  }
  render() {
    const {style } = this.props;
    return (
      <div style={{ display: "inline-block" }} className="c-tooltip-container">
        <div
          className="c-tooltip-msg-container"
          style={{
            marginTop: -1 * (this.state.hoverableItemHeight+10),
            ...style
          }}
        >
          <div className="c-tooltip-text-paper  z-depth-float-half">
            <span style={{ fontSize: 12 }}>{this.props.text}</span>
          </div>
        </div>
        <div id="hoverable-item" style={{ display: "inline-block", cursor:"pointer" }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
 

CustomTooltip.propTypes ={
  style: PropTypes.object
}
CustomTooltip.defaultProps = {
  style:{}
}
export default CustomTooltip;
