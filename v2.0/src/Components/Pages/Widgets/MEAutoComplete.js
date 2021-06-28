import React, { Component } from "react";
import PropTypes from "prop-types";
import METextView from "./METextView";
import METextField from "./METextField";

/**
 * DATA CONTENT MUST BE AN ARRAY OF ONLY TEXT, ONLY TEXT!
 * @props data | Array of text content to display
 * @props onItemSelected : a function that gives you the currently selected item (@returns item)
 * @props placeholder
 * @props onChange track all the changes in the texbox of the autocomplete listener (@returns e)
 * @props style
 * @props id  (normal HTML id )
 * @props persistOnSelect = true OR false | Determines whether or not input should be field with currently selected item
 *@props showItemsOnStart = true OR false | showDoprdown with all dropdown items when a user clicks textbox and is about to type
 * @props useCaret = true OR false | Show caret button
 */
class MEAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
      drop: false,
      placeholder: this.props.placeholder,
      searchHits: [],
      text: this.props.value,
      // data: this.props.data ? this.props.data : [],
    };
    this.toggleDrop = this.toggleDrop.bind(this);
  }

  dropItems = () => {
    const { text, drop, searchHits } = this.state;

    if (this.props.useCaret && drop)
      return (
        <div
          className=" z-depth-1 me-anime-slide-from-top"
          style={{
            minHeight: 50,
            zIndex: 101,
            maxHeight: 300,
            overflowY: "scroll",
            position: "absolute",
            width: "100%",
            background: "white",
            borderRadius: 10,
            top: 10,
          }}
        >
          {this.ejectChildren()}
        </div>
      );

    if (text && drop && searchHits.length > 0) {
      return (
        <div className=" z-depth-1" style={{ minHeight: 50, zIndex: 101 }}>
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
    var { onItemSelected, persistOnSelect, data, dataValues } = this.props;
    dataValues = dataValues || data;
    this.setState({ activeItem: item });
    this.toggleDrop();
    if (persistOnSelect) this.setState({ text: item });
    else this.setState({ text: "" });
    const value = dataValues[data.indexOf(item)];
    if (onItemSelected) onItemSelected(value);
  };

  getContentToSearch = () => {
    if (this.state.searchHits && this.state.searchHits.length > 0)
      return this.state.searchHits;
    return this.props.data;
  };
  ejectChildren = () => {
    const data = this.getContentToSearch();
    if (!data) return;
    return data.map((item, index) => {
      const activeClass =
        item === this.state.activeItem ? "me-drop-item-active" : "";
      return (
        <div key={index}>
          <METextView
            type="p"
            style={{
              padding: 15,
              cursor: "pointer",
              display: "block",
              zIndex: 101,
              marginBottom: 0,
            }}
            className={`me-drop-item ${activeClass}`}
            containerStyle={{ display: "block" }}
            onClick={() => {
              this.onItemClick(item);
            }}
          >
            <span style={this.props.textStyle}>{item}</span>
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
          style={this.props.curtainStyles}
          onClick={() => this.toggleDrop()}
        ></div>
      );
  };

  /**
   * The idea for handling the search is that, if the currently typed text,
   * is used as a key to split any of the text items in the data Array, it will divide
   * the item into parts more than one. But if the current text does not match any part of the text in a particular
   * item inside the data array, splitting, will give an array of length ===1
   * Example: user types "po" and the current data props is equal to ["pongo","police", "paradise"]
   * splitting each of the item with "po" as the key will give
   * "pongo".split("po") =["","ngo"],
   * "police".split("po") =["","lice"],
   * "paradise".split("po") =["paradise"]
   *
   */
  handleTyping = (e) => {
    const content = e.target.value.toLowerCase();
    const { data } = this.props;
    const hits = data.filter((text) => {
      const arr = text.toLowerCase().split(content);
      if (arr.length > 1) return text;
      return null;
    });
    this.setState({ text: content, searchHits: hits, drop: true });
  };

  handleOnchange = (e) => {
    const { onChange } = this.props;
    if (onChange) onChange(e);
  };

  render() {
    const { containerClassName, useCaret, placeholder, text } = this.props;
    const defaultText = placeholder ? placeholder : "Enter text here...";
    return (
      <div>
        {this.activateGhostCurtain()}
        <div style={{ position: "relative" }} className={containerClassName}>
          {useCaret && (
            <span
              className="round-caret"
              onClick={() =>
                this.setState({
                  drop: !this.state.drop,
                })
              }
            >
              <i className="fa fa-caret-down"></i>
            </span>
          )}
          <METextField
            id={this.props.id}
            defaultValue={text ? text : ""}
            inputType="input"
            name="auto-complete"
            className={this.props.className}
            placeholder={defaultText}
            style={this.props.style}
            onChange={(e) => {
              this.handleTyping(e);
              this.handleOnchange(e);
            }}
            history={false}
          />
          {this.dropItems()}
        </div>
      </div>
    );
  }
}

MEAutoComplete.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string),
  onItemSelected: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
  persistOnSelect: PropTypes.bool,
  useCaret: PropTypes.bool,
  curtainStyles: PropTypes.object,
};

MEAutoComplete.defaultProps = {
  containerClassName: "",
  style: {},
  className: "",
  persistOnSelect: false,
  useCaret: false,
  curtainStyles: {},
  textStyle: {},
};
export default MEAutoComplete;
