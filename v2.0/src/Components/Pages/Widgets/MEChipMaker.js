import React, { Component } from "react";
import PropTypes from "prop-types";
import METextField from "./METextField";
import MEChipWrap from "./MEChipWrap";
import MEButton from "./MEButton";
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
    this.removeItemOnClick = this.removeItemOnClick.bind(this);
  }

  onChange(e) {
    const text = e.target.value;
    this.setState({ text });
  }
  collectTextAndAdd() {
    const { text, items } = this.state;
    const box = document.getElementById("chip-text-box");
    const val = box.value;
    if (text && !items.includes(text)) {
      this.setState({ items: [...items, text], text: "" });
    }
  }
  removeItemOnClick(item) {
    console.log("I have been called");
    const { items } = this.state;
    const filtered = items.filter((itm) => itm !== item);
    this.setState({ items: filtered });
  }

  render() {
    const {
      className,
      style,
      name,
      chipStyle,
      chipClassName,
      placeholder,
    } = this.props;
    const { items, text } = this.state;

    return (
      <div>
        <MEChipWrap
          removeItem={this.removeItemOnClick}
          data={items}
          className={chipClassName}
          style={chipStyle}
        >
          <METextField
            id="chip-text-box"
            style={style}
            className={className}
            onChange={this.onChange}
            value={text}
            placeholder={placeholder}
            name={name}
            history ={false}
          />

          <div style={{ width: "100%", display: "flex" }}>
            <MEButton
              style={{ padding: "8px 20px" , fontSize:"small"}}
              onClick={() => this.collectTextAndAdd()}
            >
              Add
            </MEButton>
          </div>
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
  placeholder: PropTypes.string,
};
MEChipMaker.defaultProps = {
  style: {},
  chipStyle: {},
  className: "",
  chipClassName: "",
  name: "le_chip_maker",
};
