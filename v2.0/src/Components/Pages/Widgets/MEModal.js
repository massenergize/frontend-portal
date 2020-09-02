import React, { Component } from "react";
import MECard from "./MECard";
import GButton from "./GButton";
import PropTypes from "prop-types";
import {} from "@fortawesome/free-solid-svg-icons";
const SMALL = "sm";
const MEDIUM = "md";
const LARGE = "lg";

/**
 * A modal wrapper, that just envelopers any container you pass in as a child
 * The children are elevated with a dark overlay, and are fit on to an ME card 
 * @props {string} size : "sm" | "md" | "lg"
 * @props {func} closeModal | a toggle fxn from the parent modal to hide 
 * @props {string} className
 * 
 * 
 */
export default class MEModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getSize() {
    const { size } = this.props;
    if (size.toLowerCase() === SMALL) return "me-modal-sm";
    if (size.toLowerCase() === MEDIUM) return "me-modal-md";
    if (size.toLowerCase() === LARGE) return "";
  }
  render() {
    const { closeModal, style, className } = this.props;
    const defaults = { background: "white", marginTop: -4 };
    return (
      <div>
        <div className="me-overlay" onClick={closeModal}></div>
        <div
          className={`me-modal-content me-modal-fade-down ${this.getSize()}`}
        >
          <center>
            <GButton
              onClick={closeModal}
              className="me-close"
              style={{ marginBottom: -70, fontWeight: "bold" }}
            >
              Close
            </GButton>
          </center>
          <MECard
            className={`z-depth-2 ${className}`}
            style={{ ...defaults, ...style }}
          >
            {this.props.children}
          </MECard>
        </div>
      </div>
    );
  }
}

MEModal.propType = {
  style: PropTypes.object,
  classNames: PropTypes.string,
  size: PropTypes.string,
  closeModal: PropTypes.func,
};

MEModal.defaultProps = {
  style: {},
  classNames: "",
  size: "md",
};
