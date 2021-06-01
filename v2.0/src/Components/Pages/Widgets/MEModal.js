import React, { Component } from "react";
import MECard from "./MECard";
import MEButton from "./MEButton";
import PropTypes from "prop-types";
const SMALL = "sm";
const MEDIUM = "md";
const LARGE = "lg";

/**
 * A modal wrapper, that just envelopers any container you pass in as a child
 * The children are elevated with a dark overlay, and are fit on to an ME card
 * @prop {string} size : "sm" | "md" | "lg"
 * @prop {func} closeModal | a toggle fxn from the parent modal to hide
 * @prop {string} className
 * @prop {object} style
 * @prop {object} contentStyle
 * @prop {string} containerClassName
 * @prop {Boolean} showOverlay | Specifies whether or not a translucent overlay should appear behing the modal
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
    if (size.toLowerCase() === LARGE) return ""; //no large?
  }
  render() {
    const {
      closeModal,
      style,
      className,
      contentStyle,
      containerClassName,
      showOverlay,
      showCloseBtn,
    } = this.props;
    const defaults = { background: "white", marginTop: -4, borderRadius: 7 };
    const overlayStyle = showOverlay ? {} : { display: "none" };
    return (
      <div>
        <div
          className="me-overlay"
          style={overlayStyle}
          onClick={closeModal}
        ></div>

        <div
          className={`me-modal-content me-modal-fade-down ${this.getSize()} ${containerClassName}`}
          style={contentStyle}
        >
          {showCloseBtn && (
            <center>
              <MEButton
                onClick={closeModal}
                className="me-close close-mob-padding"
                style={{
                  marginBottom: -70,
                  fontWeight: "bold",
                  padding: "10px 17px",
                }}
              >
                <span className="fa fa-close" style={{ fontSize: 15 }}></span>
              </MEButton>
            </center>
          )}
          <MECard
            className={`z-depth-5 ${className}`}
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
  contentStyle: PropTypes.object,
  containerClassName: PropTypes.string,
  showOverlay: PropTypes.bool,
};

MEModal.defaultProps = {
  style: {},
  contentStyle: {},
  classNames: "",
  size: "sm",
  containerClassName: "",
  showOverlay: true,
  showCloseBtn: true,
};
