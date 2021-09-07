import React, { Component } from "react";
import { getRandomIntegerInRange } from "../../../Utils";
import "./Slider.css";

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = { itemInView: null, index: 0, key: "33ui-2893" };
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({ itemInView: data[0] });
    this.countAndLoadItem();
  }

  countAndLoadItem() {
    const _this = this;
    const interval = this.props.interval;
    setInterval(() => {
      var data = _this.props.data || [];
      var i = Number(_this.state.index) + 1;
      i = i > data.length - 1 ? 0 : i;
      _this.setState({
        itemInView: data[i],
        index: i,
        key: getRandomIntegerInRange().toString(),
      });
    }, interval);
  }

  render() {
    const { key } = this.state;
    return (
      <div className="fadeItemIn" key={key}>
        {this.state.itemInView}
      </div>
    );
  }
}

Slider.defaultProps = {
  data: [1, 2, 3, 4, 5],
  interval: 2000,
};
