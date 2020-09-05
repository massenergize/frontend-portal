import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * @props {ArrayOf(Strings)} data
 * @props {Object} style
 * @props {string} className
 * @props {string} name
 * @props {Object} containerStyle
 * @props {String} containerClassName
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
    const { onItemSelected } = this.props;
    this.setState({ selected: child });
    if (!onItemSelected) return;
    onItemSelected(child);
  }

  ejectChildren() {
    const { data, className, style } = this.props;
    if (!data || data.length === 0) return <span></span>;
    return data.map((child, key) => {
      var squareActive = "",
        dotActive = "";
      if (this.state.selected === child) {
        squareActive = "me-check-square-active";
        dotActive = "me-floating-check-active";
      }
      return (
        <div
          key={key}
          className={`put-me-inline  me-check-container ${className}`}
          onClick={() => this.handleOnClick(child)}
          style={{ position:"relative",marginRight: 6, cursor: "pointer", ...style }}
        >
          <div className={`me-floating-check  ${dotActive} me-round-sharp `} ></div>
          <div className={`me-check-square ${squareActive}  me-round-sharp`}></div>
          <span>{child}</span>
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
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
};
MERadio.defaultProps = {
  data: [],
  style: {},
  className: "",
  value: "Radio Text Here ",
  name: "some-name",
  containerStyle: {},
  containerClassName: "",
  value: "",
};
