import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * @prop {ArrayOf(Strings)} data | Array of text values to display near the radio button
 * @prop {ArrayOf(Strings)} dataValues | values to be returned when radio is selected (optional)
 * if "dataValues" is not set, the string content of the selected radio button itself will be returned on select
 * @prop {Object} style
 * @prop {func} onItemSelected | trigger that returns the value of the selected radio button
 * @prop {string} className
 * @prop {string} name
 * @prop {Object} containerStyle
 * @prop {String} containerClassName
 * @prop {string} variant | horizontal | vertical
 *
 *
 */
export default class MERadio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.value,
    };
  }
  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (prevProps.value !== value) {
      this.setState({ selected: value });
    }
  }
  handleOnClick(child) {
    var { onItemSelected } = this.props;
    this.setState({ selected: this.valueOf(child) });
    if (!onItemSelected) return;
    onItemSelected(this.valueOf(child));
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

  ejectChildren() {
    const { data, className, style, variant } = this.props;
    if (!data || data.length === 0) return <span></span>;
    return data.map((child, key) => {
      var squareActive = "",
        dotActive = "";
      if (this.state.selected === this.valueOf(child)) {
        squareActive = "me-check-square-active";
        dotActive = "me-floating-check-active";
      }
      const variantClassName =
        variant === "horizontal" ? "put-me-inline" : "put-me-block";
      return (
        <div
          key={key}
          className={`${variantClassName}  me-check-container ${className}`}
          onClick={() => this.handleOnClick(child)}
          style={{
            position: "relative",
            marginRight: 6,
            cursor: "pointer",
            ...style,
          }}
        >
          <div
            className={`me-floating-check  ${dotActive} me-round-sharp `}
          ></div>
          <div
            className={`me-check-square ${squareActive}  me-round-sharp`}
          ></div>
          <span style={{ marginRight: 7 }}>{this.nameOf(child)}</span>
        </div>
      );
    });
  }
  render() {
    const { containerStyle, containerClassName } = this.props;
    return (
      <div
        className={containerClassName}
        style={{ margin: "6px 0px", ...(containerStyle || {}) }}
      >
        {this.ejectChildren()}
      </div>
    );
  }
}

MERadio.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onItemSelected: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["horizontal", "vertical"]),
};
MERadio.defaultProps = {
  data: [],
  dataValues: [],
  style: {},
  className: "",
  value: "Radio Text Here ",
  name: "some-name",
  containerStyle: {},
  containerClassName: "",
  variant: "horizontal",
};
