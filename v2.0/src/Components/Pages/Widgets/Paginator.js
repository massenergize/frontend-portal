import React, { Component } from "react";
import PropTypes from "prop-types";
import MEButton from "./MEButton";
import { getRandomIntegerInRange } from "../../Utils";
import METextView from "./METextView";
const TOP = "top";
const BOTTOM = "bottom";

export default class Paginator extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.moveToPage(1);
  }

  ejectNextBtn() {
    const { showNext } = this.props;

    if (showNext) {
      return (
        <MEButton
          className="me-anime-open-in "
          onClick={this.props.nextFxn}
          containerStyle={{ marginLeft: "auto" }}
        >
          See More
        </MEButton>
      );
    }
  }
  ejectPreviousBtn() {
    const { showPrev } = this.props;

    if (showPrev) {
      return (
        <MEButton className="me-anime-open-in " onClick={this.props.prevFxn}>
          Previous
        </MEButton>
      );
    }
  }

  getPosition() {
    const { position } = this.props;
    if (position.toLowerCase() === TOP) {
      return { top: 10 };
    }

    return { bottom: 10 };
  }

  render() {
    const { pageCount, currentPage } = this.props;
    return (
      <div style={{ width: "100%", position: "relative" }}>
        <div style={{ display: "flex", padding: "0px 35px" }}>
          {pageCount !==0  && (
            <METextView
              className="put-me-in-the-middle page-text-phone-mode"
              style={{ color: "#8dc343", textShadow:"0px 1px 3px #d2baba",  }}
            >
              Page {currentPage} / { pageCount}<br/> 
            </METextView>
          )}

          {this.ejectPreviousBtn()}
          {this.ejectNextBtn()}
        </div>
      </div>
    );
  }
}

Paginator.propTypes = {
  id: PropTypes.string.isRequired,
  nextFxn: PropTypes.func.isRequired,
  prevFxn: PropTypes.func.isRequired,
  showNext: PropTypes.bool,
  showPrev: PropTypes.bool,
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
};
Paginator.defaultProps = {
  pageCount: 0,
  currentPage: 0,
  id: "paginator-default-" + getRandomIntegerInRange(100).toString(),
  showNext: true,
  showPrev: true,
  nextFxn: () => {
    return null;
  },
  prevFxn: () => {
    return null;
  },
};
