import React, { Component } from "react";

class Toast extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let color = this.props.notificationState === "Good" ? "#8dc63f" : "red";
    return (
      <div className="toast-bar round-me" style={{ background: color }}>
        <p style={{ color: "white", display: "inline" }}>{this.props.msg}</p>
        <small
          className="okay-btn"
          onClick={() => {
            this.props.closeFxn();
          }}
        >
          {" "}
          Okay
        </small>
      </div>
    );
  }
}

export default Toast;
