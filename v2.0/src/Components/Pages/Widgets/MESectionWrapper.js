import React, { Component } from "react";
import PropTypes from "prop-types";
const PLAIN = "plain";
const DEFAULT = "default";
/**
 * MassEnergize toned-down version of an accordion
 * @prop {string} className
 * @prop {object} style
 * @prop {boolean} collapsed  | False by default
 * @prop {boolean} caret
 * @prop {string} badgeText
 * @prop {string} headerText
 * @prop {object} containerStyle
 * @prop {string} containerClassName
 * @prop {string} headerType  | "plain" or "default"
 *
 */
export default class MESectionWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: this.props.collapsed,
    };
  }

  rightExtras() {
    const { rightExtras, caret } = this.props;
    // if (rightExtras) {
    //   return <span className="me-badge">{badgeText ? badgeText : 0}</span>;
    // }
    if (!rightExtras && caret)
      return <i className="me-sect-w-right fa fa-caret-down"></i>;
    return rightExtras && <>{rightExtras}</>;
  }

  showBody() {
    let { containerClassName, containerStyle, headerType } = this.props;
    const { collapsed } = this.state;
    const moveUp = "move-up-and-vanish";
    const moveDown = "move-down-and-appear";
    var anime = collapsed ? moveUp : moveDown;
    containerStyle = { ...containerStyle, zIndex: -1 };
    return (
      <div
        style={containerStyle}
        className={`${
          headerType === DEFAULT && "me-section-wrapper-body"
        } ${anime} ${containerClassName}`}
      >
        <div>{this.props.children}</div>
      </div>
    );
  }
  render() {
    const { collapsed } = this.state;
    const { style, className, headerText, motherStyle, headerType } =
      this.props;
    return (
      <div className="me-anime-show-up" style={motherStyle}>
        {headerType === DEFAULT && (
          <div
            className={`me-section-wrapper-header section-green z-depth-1 ${className}`}
            style={style}
            onClick={() => this.setState({ collapsed: !collapsed })}
          >
            {this.rightExtras()}
            {headerText}
          </div>
        )}
        {headerType === PLAIN && (
          <div
            className={`${className}`}
            style={style}
            onClick={() => this.setState({ collapsed: !collapsed })}
          >
            {this.rightExtras()}
            {headerText}
          </div>
        )}

        {this.showBody()}
      </div>
    );
  }
}
MESectionWrapper.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  collapsed: PropTypes.bool.isRequired,
  // badgeText: PropTypes.bool,
  caret: PropTypes.bool,
  headerText: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  containerClassName: PropTypes.string,
  motherStyle: PropTypes.object,
};

MESectionWrapper.defaultProps = {
  className: "",
  style: {},
  collapsed: false,
  caret: false,
  headerText: "You need to provide a header text",
  containerStyle: {},
  containerClassName: "",
  motherStyle: {},
  headerType: DEFAULT,
  rightExtras: null,
};
