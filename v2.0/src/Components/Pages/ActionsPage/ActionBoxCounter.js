import React, { Component } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { sumOfCarbonScores } from "../../Utils";

const DONE = "DONE";
// const TODO = "TODO";
export default class ActionBoxCounter extends Component {
  render() {
    const { type, style, todo, done } = this.props;
    const data = type === DONE ? done : todo;
    return (
      <div className="action-box-counter z-depth-float" style={style}>
        <div style={{ padding: 15 }}>
          <center>
            <CountUp
              end={data ? data.length : 0}
              duration={3}
              style={{ fontSize: 60, fontWeight: "700", color: "black" }}
            />
            <br />
            <small style={{ fontWeight: "600", fontSize: 21, color: "black" }}>
              {type === DONE ? "Done!" : "To Do"}
            </small>
            <br />
            <CountUp
              end={sumOfCarbonScores(data)}
              duration={2}
              style={{ fontWeight: "600", margin: 10, fontSize: 26 }}
            />
            <br />
            <i className="fa fa-tree box-ico"></i>{" "}
            <small style={{ color: "black" }}>
              <b>Planted</b>
            </small>{" "}
            {/* <i className="fa fa-caret-right box-ico"></i> */}
            <i className="fa fa-arrow-circle-right box-ico"></i>
            <br />
            {/* <Link to={this.props.link} className="box-counter-label-btn">
              Full List
            </Link> */}
          </center>
        </div>
        <Link to={this.props.link} className="full-list-btn">
          Full List
        </Link>
      </div>
    );
  }
}

ActionBoxCounter.defaultProps = {
  type: DONE,
  style: {},
  todo: [],
  done: [],
};
