import React, { Component } from "react";
import { getRandomIntegerInRange } from "../../../Utils";
import "./Slider.css";

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = { itemInView: undefined, index: 0, key: "33ui-2893" };
  }

  componentDidMount() {
    this.countAndLoadItem();
  }

  static getDerivedStateFromProps(props, state) {
    // first time its mounting
    if (state.itemInView === undefined && props.data)
      return { itemInView: props.data[0] };
    return null;
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
        {this.state.itemInView || null}
      </div>
    );
  }
}

Slider.defaultProps = {
  data: [1, 2, 3, 4, 5],
  interval: 2000,
};
