import React, { Component } from "react";
import PropTypes from "prop-types";
import MEButton from "./MEButton";
import { getRandomIntegerInRange } from "../../Utils";
const TOP = "top";
const BOTTOM = "bottom";
/**
 * To use this paginator you have to provide a fxn from it's parent component
 * that directly accesses it's state.
 * With this function provided, any time a user clicks on next, or previous,
 * the paginator does it's thing, and just provides the new data through the "stateAccessFunction"
 * provided as props, which updates the parent's state, hence causing a rerender of the parent componet
 * with the new data
 * @props {func} stateAccessFunction
 * @props {ArrayOf(Objects)} data
 * @props {int} howManyPerPage
 *
 */
export default class Paginator extends Component {
  constructor(props) {
    super(props);
    var { perPage, data } = this.props;
    data = data ? data : [];
    this.state = {
      currentPage: 0,
      itemsLeft: data.length,
      pageCount: Math.round(data.length / Number(perPage)),
    };
    this.moveToPage = this.moveToPage.bind(this);
  }

  componentDidMount() {
    // this.moveToPage(1);
  }

  moveToPage(pageNumber) {
    var { perPage, data, stateAccessFunction } = this.props;
    data = data ? data : [];
    perPage = Number(perPage);
    const { itemsLeft, currentPage } = this.state;
    // the current page x by perpage number will give how items have been taken away any time
    const whereIAmAt = (pageNumber - 1) * perPage;
    const endpoint = whereIAmAt + perPage;
    // use the number of items taken away to determine the point in the data list to start from
    // and add the perPage number to determine the end index of the point we want to slice to in the data list
    const dataToSend = data.slice(whereIAmAt, endpoint);
    // now to find how much data has been retrieved in total including the curernt data tha tis about to be shipped
    // add the "whereIAmAt"  to the number of items that were obtained from the slice
    const taken = whereIAmAt + dataToSend.length;
    //now just update state values
    this.setState({
      currentPage: pageNumber,
      itemsLeft: data.length - taken,
    });
    if (!stateAccessFunction) return;
    stateAccessFunction(dataToSend);
  }
  ejectNextBtn() {
    const { showNext } = this.props;
    // only show next button if there are more items left
    if (showNext) {
      return (
        <MEButton
          onClick={this.props.nextFxn}
          containerStyle={{ marginLeft: "auto" }}
        >
          Next
        </MEButton>
      );
    }
  }
  ejectPreviousBtn() {
    const { showPrev} = this.props;
    // console.log("Data has pulled thorugh", this.props.data);
    // dont show previous button if the current page is 1 , so users cant go off course
    if (showPrev) {
      return <MEButton onClick={this.props.prevFxn}>Previous</MEButton>;
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
    return (
      <div
        style={{ position: "absolute", width: "100%", ...this.getPosition() }}
      >
        <div style={{ display: "flex", padding: "0px 35px" }}>
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
  position: PropTypes.string,
};
Paginator.defaultProps = {
  id: "paginator-default-" + getRandomIntegerInRange(100).toString(),
  showNext: true,
  showPrev: true,
  position: BOTTOM,
  nextFxn: () => {
    return null;
  },
  prevFxn: () => {
    return null;
  },
};
