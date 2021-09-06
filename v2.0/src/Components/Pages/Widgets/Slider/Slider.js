// import React, { useState, useEffect } from "react";
import "./Slider.css";
// export default function Slider({ data }) {
//   const [itemInView, setItemInView] = useState(0);
//   const [indexOfItem, setIndexOfCurrentItem] = useState(0);

//   const countAndLoadItem = () => {
//     setInterval(() => {
//       (data || []).forEach((item, index) => {
//         console.log("I am the index", index);
//         setItemInView(item);
//         setIndexOfCurrentItem(index);
//       });
//     }, 2500);
//   };

//   // useEffect(() => countAndLoadItem());
//   // countAndLoadItem();
//   return <div>{itemInView}</div>;
// }

import React, { Component } from "react";

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = { itemInView: null, index: 0 };
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({ itemInView: data[0] });
    this.countAndLoadItem();
  }

  countAndLoadItem() {
    const _this = this;
    setInterval(() => {
      var data = _this.props.data || [];
      var i = Number(_this.state.index) + 1;
      i = i > data.length - 1 ? 0 : i;
      _this.setState({
        itemInView: data[i],
        index: i,
      });
    }, 1500);
  }

  render() {
    return <div>{this.state.itemInView}</div>;
  }
}
