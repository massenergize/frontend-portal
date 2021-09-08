import React, { Component } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { calcEQ, sumOfCarbonScores } from "../../Utils";
import Slider from "./../Widgets/Slider/Slider";
const DONE = "DONE";
// const TODO = "TODO";
export default class ActionBoxCounter extends Component {
  makeCounterWithCustomValue(end, eqItem, useCounter = false) {
    const { user } = this.props;
    return (
      <>
        <br />
        {useCounter ? (
          <CountUp
            end={end}
            duration={1}
            decimals={1}
            style={{
              fontWeight: "600",
              margin: 10,
              fontSize: 26,
              color: "black",
            }}
          />
        ) : (
          <h1
            style={{
              fontWeight: "600",
              margin: 10,
              fontSize: 26,
              color: "black",
            }}
          >
            {end}
          </h1>
        )}
        <br />
        <small style={{ color: "black" }}>
          <b>
            {!user
              ? "Sign in to see your CO2 / yr"
              : eqItem?.title || `Number of ${eqItem?.name}`}
          </b>
        </small>
      </>
    );
  }
  createSliderData(carbonScore) {
    let { eq } = this.props;
    return (eq || []).map((item) => {
      const value = calcEQ(carbonScore, item.value);
      return this.makeCounterWithCustomValue(value, item);
    });
  }
  render() {
    const { type, style, todo, done, user, pref_eq } = this.props;
    const data = type === DONE ? done : todo;
    const carbonScore = sumOfCarbonScores(data);
    console.log("I am the prefEG bana", pref_eq);
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
            {pref_eq ? (
              this.makeCounterWithCustomValue(
                calcEQ(sumOfCarbonScores(data), pref_eq?.value),
                pref_eq,
                true
              )
            ) : (
              <Slider data={this.createSliderData(carbonScore)} />
            )}

            {user && (
              <>
                <br />
                <small className="equivalence-small">More Equivalences</small>
              </>
            )}
            <br />
          </center>
        </div>
        <Link to={this.props.link} className="full-list-btn">
          {!user ? "Sign In" : "Full List"}
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
