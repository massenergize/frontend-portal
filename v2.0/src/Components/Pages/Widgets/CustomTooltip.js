import React, { Component } from "react";

class CustomTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = { hoverableItemHeight: 0 };
  }

  componentDidMount() {
    this.setState({
      hoverableItemHeight: document.getElementById("hoverable-item")
        .offsetHeight,
    });
  }
  render() {
    const {containerStyle, contentStyle} = this.props;
    return (
      <div style={{ display: "inline-block", ...containerStyle }} className="c-tooltip-container" >
        <div
          className="c-tooltip-msg-container"
          style={{
            marginTop: -1 * (this.state.hoverableItemHeight+10),
            ...contentStyle
          }}
        >
          <div className="c-tooltip-text-paper  z-depth-1">
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

export default CustomTooltip;

CustomTooltip.defaultProps = {
  containerStyle:{},
  contentStyle:{}
}
