import React, { Component } from "react";

export default class ActionBoxCounter extends Component {
  render() {
    const { type, style, big, med } = this.props;
    return (
      <div class="action-box-counter z-depth-float" style={style}>
        <div style={{ padding: 15 }}>
          <center>
            <h1 style={{ fontSize: 60, fontWeight: "700" }}>{big}</h1>
            <small
              style={{ fontWeight: "600", fontSize: 21, color: "#656161" }}
            >
              {type}
            </small>
            <h2 style={{ fontWeight: "600", margin: 10 }}>{med}</h2>
            <i className="fa fa-tree box-ico"></i>{" "}
            <small>
              <b>Planted</b>
            </small>{" "}
            {/* <i className="fa fa-caret-right box-ico"></i> */}
            <i className="fa fa-arrow-circle-right box-ico"></i>
            <br />
            {/* <p class="box-counter-label-btn">Full List</p> */}
          </center>
        </div>
        <button className="full-list-btn">
          Full List
        </button>
      </div>
    );
  }
}

ActionBoxCounter.defaultProps={
  type :"Done!", 
  style:{}, 
  big:100, 
  med:2000
}
