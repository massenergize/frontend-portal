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
    const { data, className, style } = this.props;
    if (!data || data.length === 0) return <span></span>;
    return data.map((child, key) => {
      var squareActive = "",
        dotActive = "";
      if (this.state.selected === this.valueOf(child)) {
        squareActive = "me-check-square-active";
        dotActive = "me-floating-check-active";
      }
      return (
        <div
          key={key}
          className={`put-me-inline  me-check-container ${className}`}
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
      <div className={containerClassName} style={containerStyle}>
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
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  // dataValues: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onItemSelected: PropTypes.func.isRequired,
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
};
