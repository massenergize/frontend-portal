import React, { Component } from "react";
import PropTypes from "prop-types";
import METextView from "./METextView";
/**
 * DATA CONTENT MUST BE AN ARRAY OF ONLY TEXT, ONLY TEXT!
 * @props data | Array of text content to display
 * @props dataValues | Array of values that will be returned "onItemSelected"
 * @props onItemSelected : a function that gives you the currently selected item
 * @props placeholder
 *
 */
class MEDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.value,
      drop: false,
      placeholder: this.props.placeholder,
      dataValues: this.props.dataValues
        ? this.props.dataValues
        : this.props.data,
      data: this.props.data,
    };
    this.toggleDrop = this.toggleDrop.bind(this);
  }
  dropItems = () => {
    const { drop } = this.state;
    if (drop) {
      return (
        <div className="me-dropdown me-anime-show-up" style={{ minHeight: 50 }}>
          {this.ejectChildren()}
        </div>
      );
    }
  };
  toggleDrop = (e) => {
    const { drop } = this.state;
    this.setState({ drop: !drop });
  };

  onItemClick = (item, index) => {
    const { onItemSelected } = this.props;
    const { dataValues } = this.state;
    this.setState({ activeItem: item });
    this.toggleDrop();
    if (onItemSelected) {
      const value = dataValues[index];
      onItemSelected(value);
    }
  };

  ejectChildren = () => {
    const { data, dataValues } = this.state;
    if (!data) return;
    if (data.length !== dataValues.length) {
      console.log("Warning: Your data list does not match your value list!!!!");
    }
    return data.map((item, index) => {
      // const relatedValue = dataValues[index];
      var activeClass = "",
        childActiveClass = "";
      if (item === this.state.activeItem) {
        activeClass = "me-drop-item-active";
        childActiveClass = "me-drop-p";
      }
      return (
        <div
          key={index}
          className={`me-drop-item  ${activeClass}`}
          onClick={() => {
            this.onItemClick(item, index);
          }}
        >
          <METextView
            className={childActiveClass}
            type="p"
            style={{
              padding: 15,
              cursor: "pointer",
              display: "block",
              margin: 0,
            }}
          >
            {item}
          </METextView>
        </div>
      );
    });
  };
  activateGhostCurtain = () => {
    const { drop } = this.state;
    if (drop)
      return (
        <div
          className="ghost-cover-screen"
          onClick={() => this.toggleDrop()}
        ></div>
      );
  };

  render() {
    const { activeItem, placeholder } = this.state;
    const defaultText = placeholder ? placeholder : "Select Item";
    return (
      <div>
        {this.activateGhostCurtain()}
        <div style={{ position: "relative" }}>
          <div
            className="me-select-head"
            style={{ position: "relative" }}
            onClick={(e) => this.toggleDrop(e)}
          >
            <p className="reset-margin put-me-inline">
              {activeItem ? activeItem : defaultText}
            </p>
            <div className="float-right put-me-inline">
              <span className="fa fa-arrow-down" />
            </div>
          </div>
          {this.dropItems()}
        </div>
      </div>
    );
  }
}

MEDropdown.propTypes = {
  data: PropTypes.array,
  onItemSelected: PropTypes.func,
  placeholder: PropTypes.string,
  dataValues:PropTypes.array
};
MEDropdown.defaultProps = {
  data: [],
  dataValues: [],
  placeholder: "Select Item",
  value: null,
};
export default MEDropdown;
