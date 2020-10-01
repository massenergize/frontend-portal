import React, { Component } from "react";
import PropTypes from "prop-types";
import METextField from "./METextField";
import MEChipWrap from "./MEChipWrap";
import MEButton from "./MEButton";
import { getTextArrayAsString } from "../../Utils";
/**
 * @prop {object} style
 * @prop {object} chipStyle
 * @prop {string} className
 * @prop {string} name
 * @prop {func} onItemChange
 * @prop {bool} asArray | Used to specify whether content should be returned in an array or joined into one string
 * @prop {string} separationKey | Should be specified if asArray is set to false
 */
export default class MEChipMaker extends Component {
  constructor(props) {
    super();
    this.state = {
      items: this.getDefaultValue(props),
      text: "",
    };
    this.onChange = this.onChange.bind(this);
    this.removeItemOnClick = this.removeItemOnClick.bind(this);
  }

  onChange(e) {
    const text = e.target.value;
    this.setState({ text });
  }
  collectTextAndAdd(e) {
    e.preventDefault();
    const { text, items } = this.state;
    let newContent = items;
    if (text && !items.includes(text)) {
      newContent = [...items, text];
      this.setState({ items: newContent, text: "" });
    }
    this.forwardChangedItems(newContent);
    return;
  }

  forwardChangedItems(items) {
    const { onItemChange, separationKey, asArray } = this.props;
    if (!onItemChange) return;
    if (!asArray) {
      const asText = getTextArrayAsString(items, separationKey);
      onItemChange(asText);
      return;
    }
    onItemChange(items);
    return;
  }
  removeItemOnClick(item) {
    const { items } = this.state;
    const { onItemChange } = this.props;
    const filtered = items.filter((itm) => itm !== item);
    this.setState({ items: filtered });
    this.forwardChangedItems(filtered);
  }

  getDefaultValue(props) {
    const { asArray, value, separationKey } = props;
    if (!value || value.length < 1) return [];
    if (asArray) {
      return value;
    }
    return value.split(separationKey);
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
            history={false}
          />
          <div style={{ width: "100%", display: "flex" }}>
            <MEButton
              style={{ padding: "8px 20px", fontSize: "small" }}
              onClick={(e) => this.collectTextAndAdd(e)}
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
  onItemChange: PropTypes.func,
  placeholder: PropTypes.string,
  asArray: PropTypes.bool,
  separationKey: PropTypes.string,
  value : PropTypes.array || PropTypes.string
};
MEChipMaker.defaultProps = {
  style: {},
  chipStyle: {},
  className: "",
  chipClassName: "",
  name: "le_chip_maker",
  asArray: true,
  separationKey: ",",
  value:[]
};
