import React, { Component } from "react";
import PropTypes from "prop-types";
import METextView from "./METextView";
import { getRandomIntegerInRange } from "../../Utils";
/**
 * DATA CONTENT MUST BE AN ARRAY OF ONLY TEXT, ONLY TEXT!
 * @props data | Array of text content to display
 * @props dataValues | Array of values that will be returned "onItemSelected"
 * @props onItemSelected : a function that gives you the currently selected item
 * @props placeholder
 *
 */

const NONE = "------";
class MEDropdown extends Component {
  static NONE = NONE;
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.value,
      drop: false,
      placeholder: this.props.placeholder,
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
    var { onItemSelected, dataValues, data } = this.props;
    dataValues = dataValues.length === 0 ? data : dataValues;
    this.setState({ activeItem: item });
    this.toggleDrop();
    if (onItemSelected) {
      const value = dataValues[index];
      onItemSelected(value);
    }
  };

  componentDidUpdate(prevProps) {
    const value = prevProps.value;
    if (value !== this.props.value) {
      this.setState({ activeItem: this.props.value });
    }
  }
  ejectChildren = () => {
    var { data, dataValues, childClassName } = this.props;
    dataValues = dataValues.length === 0 ? data : dataValues;
    if (!data) return;
    if (data.length !== dataValues.length) {
      console.log("Warning: Your data list does not match your value list!!!!");
    }

    return data.map((item, index) => {
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
            className={` ${childActiveClass} ${childClassName}`}
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
    const { id, togglerClassName } = this.props;
    return (
      <div>
        {this.activateGhostCurtain()}
        <div style={{ position: "relative" }}>
          <div
            id={id ? id : getRandomIntegerInRange().toString()}
            className={`me-select-head ${togglerClassName}`}
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
  dataValues: PropTypes.array,
};
MEDropdown.defaultProps = {
  data: [],
  dataValues: [],
  placeholder: "Select Item",
  value: null,
};
export default MEDropdown;
