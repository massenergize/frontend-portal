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
        {useCounter ? (
          <CountUp
            end={typeof end === 'string' ? Number(end) : end }
            duration={1}
            decimals={1}
            style={{
              fontWeight: "600",
              margin: 10,
              fontSize: 26,
              color: "black",
              display: "block",
              marginBottom: 0,
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
  /**
   * Data generated from here is used to make slider content when user has not chosen a default
   * equivalence yet
   * @param {*} carbonScore
   * @returns
   */
  createSliderData(carbonScore) {
    let { eq } = this.props;
    const data = (eq || []).map((item) => {
      const value = calcEQ(carbonScore, item.value);
      return this.makeCounterWithCustomValue(value, item);
    });
    // Append default carbon value / year
    return [
      this.makeCounterWithCustomValue((carbonScore / 2200)?.toFixed(1), {
        title: "Ton of CO2/year",
      }),
      ...data,
    ];
  }

  renderCounter({ data, carbonScore }) {
    const { user, pref_eq } = this.props;
    if (!user)
      return (
        <>
          <h1
            style={{
              fontWeight: "600",
              margin: 10,
              fontSize: 26,
              color: "black",
            }}
          >
            0.0
          </h1>
          <small style={{ color: "black" }}>
            <b>Sign in to see your CO2 / yr</b>
          </small>
        </>
      );
    return (
      <>
        {" "}
        {pref_eq ? (
          this.makeCounterWithCustomValue(
            calcEQ(sumOfCarbonScores(data), pref_eq?.value),
            pref_eq,
            true
          )
        ) : (
          <Slider data={this.createSliderData(carbonScore)} interval={3000} />
        )}
      </>
    );
  }
  render() {
    const { type, style, todo, done, user, pref_eq } = this.props;
    const data = type === DONE ? done : todo;
    const carbonScore = sumOfCarbonScores(data);
    return (
      <div className="action-box-counter z-depth-float" style={style}>
        <div style={{ padding: 15 }}>
          <center>
            <CountUp
              end={data ? data.length : 0}
              duration={3}
              style={{ fontSize: 55, fontWeight: "700", color: "black" }}
            />
            <br />
            <small style={{ fontWeight: "600", fontSize: 21, color: "black" }}>
              {type === DONE ? "Done!" : "To Do"}
            </small>
            {this.renderCounter({ data, carbonScore })}
            {user && (
              <>
                {pref_eq && <br />}
                <small
                  className="equivalence-small"
                  onClick={() => this.props.toggleEQModal(true)}
                >
                  More Equivalences
                </small>
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
