import React, { Component } from "react";

class Toast extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let color = this.props.notificationState === "Good" ? "#28a745": "red";
    return (<div className="toast-bar z-depth-1" style={{background:color}}>
      <p style={{color:"white", display:'inline'}}>{this.props.msg}</p>
      <small className="okay-btn" onClick = {()=>{this.props.closeFxn()}}> Okay</small>
    </div>);
  }
}

export default Toast;
