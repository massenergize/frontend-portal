import React, { Component } from "react";
import PropTypes from "prop-types";
import "./../css/Gallamsey.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import GText from "./GText";
/**
 * DATA CONTENT MUST BE AN ARRAY OF ONLY TEXT, ONLY TEXT!
 * @props data | Array of text content to display
 * @props onItemSelected : a function that gives you the currently selected item
 * @props placeholder
 *
 */
class MEDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
      drop: false,
      placeholder: this.props.placeholder,
    };
    this.toggleDrop = this.toggleDrop.bind(this);
  }
  dropItems = () => {
    const { drop } = this.state;
    if (drop) {
      return (
        <div className="g-dropdown" style={{ minHeight: 50 }}>
          {this.ejectChildren()}
        </div>
      );
    }
  };
  toggleDrop = (e) => {
    const { drop } = this.state;
    this.setState({ drop: !drop });
  };

  onItemClick = (item) => {
    const { onItemSelected } = this.props;
    this.setState({ activeItem: item });
    this.toggleDrop();
    if (onItemSelected) {
      onItemSelected(item);
    }
  };

  ejectChildren = () => {
    const { data } = this.props;
    if (!data) return;
    return data.map((item, index) => {
      const activeClass =
        item === this.state.activeItem ? "g-drop-item-active" : "";
      return (
        <div key={index}>
          <GText
            type="p"
            style={{ padding: 15, cursor: "pointer", display:"block" }}
            className={`g-drop-item ${activeClass}`}
            onClick={() => {
              this.onItemClick(item);
            }}
          >
            {item}
          </GText>
        </div>
      );
    });
  };
  activateGhostCurtain = () => {
    const {drop} = this.state;
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
            className="g-select-head"
            style={{ position: "relative" }}
            onClick={(e) => this.toggleDrop(e)}
          >
            <p className="reset-margin put-me-inline">
              {activeItem ? activeItem : defaultText}
            </p>
            <div className="float-right put-me-inline">
              <FontAwesomeIcon icon={faArrowDown} />
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
};
export default MEDropdown;
