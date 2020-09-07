import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * @props {Array} data
 * @props {Array} dataValues
 * @props {func} onItemSelected
 * @props {Object} style
 * @props {string} className
 * @props {string} name
 * @props {Object} containerStyle
 * @props {String} containerClassName
 * @value {Array} value
 *
 */
export default class MECheckBoxGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.value,
      dataValues: this.props.dataValues
        ? this.props.dataValues
        : this.props.data,
      data: this.props.data,
    };
  }
  handleOnClick(child) {
    const { onItemSelected, data } = this.props;
    const { selected, dataValues } = this.state;
    child = dataValues[data.indexOf(child)];
    var allItems;
    if (!selected || !selected.includes(child)) {
      allItems = [...selected, child];
      this.setState({ selected: allItems });
    } else {
      allItems = selected.filter((itm) => itm !== child);
      this.setState({ selected: allItems });
    }

    if (!onItemSelected) return;
    onItemSelected(allItems, child);
  }

  checked(child) {
    const { selected, dataValues, data } = this.state;
    const value = dataValues[data.indexOf(child)];
    if (selected && selected.includes(value)) return true;
    return false;
  }
  ejectChildren() {
    const { data, className, style } = this.props;
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
          <div className={`me-floating-check ${dotActive} `}></div>
          <div className={`me-check-square ${squareActive}`}></div>
          <span>{child}</span>
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
  data: PropTypes.array.isRequired,
  dataValues: PropTypes.array,
  name: PropTypes.string.isRequired,
  value: PropTypes.array,
  onItemSelected: PropTypes.func.isRequired,
};
MECheckBoxGroup.defaultProps = {
  data: [],
  dataValues: [],
  style: {},
  className: "",
  value: "Radio Text Here ",
  name: "some-name",
  containerStyle: {},
  containerClassName: "",
  value: [],
};
