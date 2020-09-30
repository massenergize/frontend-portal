import React, { Component } from "react";
import PropTypes from "prop-types";
import METextField from "./METextField";
import MEChipWrap from "./MEChipWrap";
/**
 * @prop {object} style
 * @prop {object} chipStyle
 * @prop {string} className
 * @prop {string} name
 * @prop {func} onItemsChange
 */
export default class MEChipMaker extends Component {
  constructor(props) {
    super();
    this.state = {
      items: [],
      text: "",
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  componentDidMount() {
    // this.enterKeyIsPressed();
  }

  enterKeyIsPressed() {
    const textBox = document.getElementById("chip-text-box");
    console.log(textBox);
    textBox.on("keydown", function (e) {
      if (e.keyCode === 13 || e.keyCode === "13")
        console.log("I have done something");
    });
  }
  onChange(e) {
    const text = e.target.value;
    // if(this.enterKeyIsPressed(e)) return;
    this.setState({ text });
  }
  onKeyPress(e) {
    e.preventDefault();
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {
      //Enter keycode
      alert("enter press");
    }
  }
  render() {
    const { className, style, name, chipStyle, chipClassName } = this.props;
    const { items, text } = this.state;
    console.log(this.state.text);
    return (
      <div>
        <MEChipWrap data={items} className={chipClassName} style={chipStyle}>
          <METextField
            id="chip-text-box"
            style={style}
            className={className}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            value={text}
            name={name}
          />
        </MEChipWrap>
      </div>
    );
  }
}

MEChipMaker.propTypes = {
  style: PropTypes.object,
  chipStyle: PropTypes.object,
  className: PropTypes.string,
  chipClassName: PropTypes.string,
  name: PropTypes.string,
  onItemsChange: PropTypes.func,
};
MEChipMaker.defaultProps = {
  style: {},
  chipStyle: {},
  className: "",
  chipClassName: "",
  name: "le_chip_maker",
};
