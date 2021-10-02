import React, { Component } from "react";
import PropTypes from "prop-types";
import MECard from "./MECard";
import METextView from "./METextView";
import MEButton from "./MEButton";

const UNION = "union";
const SUCCESS = "success";
const NORMAL = "normal";
const ACCENT = "accent";
const PLAIN = "plain";
export default class SnackBar extends Component {
  showActionBtn() {
    const { action, close, actionText } = this.props;
    if (action) {
      return (
        <MEButton
          onClick={() => this.handleAction(action)}
          style={{ marginLeft: "auto" }}
          className="mob-snackbar-text"
        >
          {actionText}
        </MEButton>
      );
    }
    return (
      <MEButton
        style={{ marginLeft: "auto", position: "absolute", right: "2%" }}
        className="mob-snackbar-text"
        onClick={() => this.handleAction(close)}
      >
        {actionText}
      </MEButton>
    );
  }
  getVariation() {
    var { variation } = this.props;
    variation = variation.toLowerCase();
    if (!variation || variation === PLAIN) return "snackbar-plain";
    if (variation === NORMAL || variation === SUCCESS)
      return "snackbar-success";
    if (variation === ACCENT) return "snackbar-accent";
    if (variation === UNION) return "snackbar-union";
  }

  handleAction(fxn) {
    if (!fxn) return;
    fxn();
  }
  render() {
    const { text } = this.props;
    return (
      <div className={`snackbar-main-container `}>
        <MECard
          className={`z-depth-float-2 me-show-from-bottom ${this.getVariation()}`}
          style={{ borderRadius: 5, display: "flex" }}
        >
          <METextView
            type="p"
            containerStyle={{ width: "80%" }}
            style={{ marginRight: 15, fontSize: 18, width: "100%" }}
            className="mob-snackbar-text"
          >
            {text}
          </METextView>
          {this.showActionBtn()}
        </MECard>
      </div>
    );
  }
}

SnackBar.propTypes = {
  actionText: PropTypes.string,
  action: PropTypes.func,
  close: PropTypes.func,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  variation: PropTypes.string,
};
SnackBar.defaultProps = {
  variation: "",
  actionText: "Close",
  text:
    "This is where you write some kind of notification that has to be displayed ",
  style: {},
  className: "",
  containerStyle: {},
  containerClassName: "",
};
