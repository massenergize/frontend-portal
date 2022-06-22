import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * @prop {Array} data
 * @prop {Array} dataValues
 * @prop {func} onItemSelected
 * @prop {Object} style
 * @prop {string} className
 * @prop {string} name
 * @prop {Object} containerStyle
 * @prop {String} containerClassName
 * @prop {Array} value
 * @prop {object} fineTuneStyle | Normal css inline styles to fine-tune square dot inside checkbox when it misbehaves (rare)
 *
 */
export default class MECheckBoxGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.value,
    };
  }

  valueOf(item) {
    const { valueExtractor } = this.props;
    if (valueExtractor) return valueExtractor(item);
    return item?.name || item?.toString();
  }

  nameOf(item) {
    const { labelExtractor } = this.props;
    if (labelExtractor) return labelExtractor(item);
    return item?.name || item?.toString();
  }
  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (prevProps?.value?.length !== value?.length) {
      this.setState({ selected: value });
    }
  }
  handleOnClick(child) {
    const { onItemSelected } = this.props;
    const { selected } = this.state;
    const value = this.valueOf(child);
    var allItems;
    if (!selected || !selected.includes(value)) {
      allItems = [...selected, value];
      this.setState({ selected: allItems });
    } else {
      allItems = selected.filter((itm) => itm !== value);
      this.setState({ selected: allItems });
    }

    if (!onItemSelected) return;
    onItemSelected(allItems, value);
  }

  checked(child) {
    const { selected } = this.state;
    const value = this.valueOf(child);
    if (selected && selected.includes(value)) return true;
    return false;
  }
  ejectChildren() {
    const { data, className, style, fineTuneSquare } = this.props;
    if (!data || data.length === 0) return <span></span>;

    return data.map((child, key) => {
      var squareActive = "",
        dotActive = "";
      if (this.checked(child)) {
        squareActive = "me-check-square-active";
        dotActive = "me-floating-check-active";
      }
      return (
        <div
          key={key}
          className={`me-check-container ${className}`}
          onClick={() => this.handleOnClick(child)}
          style={{
            position: "relative",
            marginRight: 6,
            cursor: "pointer",
            ...style,
          }}
        >
          <div
            className={`me-floating-check ${dotActive} `}
            style={fineTuneSquare}
          ></div>
          <div className={`me-check-square ${squareActive}`}></div>
          <span>{this.nameOf(child)}</span>
        </div>
      );
    });
  }
  render() {
    return <div>{this.ejectChildren()}</div>;
  }
}

MECheckBoxGroup.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  onItemSelected: PropTypes.func.isRequired,
  fineTuneSquare: PropTypes.object,
};
MECheckBoxGroup.defaultProps = {
  data: [],
  dataValues: [],
  style: {},
  className: "",
  name: "some-name",
  containerStyle: {},
  containerClassName: "",
  value: [],
  fineTuneSquare: {},
};
