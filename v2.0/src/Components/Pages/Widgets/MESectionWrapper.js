import React, { Component } from "react";
import PropTypes from "prop-types";


/**
 * MassEnergize toned-down version of an accordion
 * @props {string} className
 * @props {object} style
 * @props {boolean} collapsed @required
 * @props {boolean} badge
 * @props {string} badgeText
 * @props {string} headerText
 * @props {object} containerStyle
 * @props {string} containerClassName
 *
 */
export default class MESectionWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: this.props.collapsed,
    };
  }

  showBadge() {
    const { badge, badgeText } = this.props;
    if (badge) {
      return <span className="me-badge">{badgeText ? badgeText : 0}</span>;
    }
  }

  showBody() {
    const { containerClassName, containerStyle } = this.props;
    const { collapsed } = this.state;
    const moveUp = "move-up-and-vanish";
    const moveDown = "move-down-and-appear";
    var anime = collapsed ? moveUp : moveDown;
    return (
      <div
        style={containerStyle}
        className={`me-section-wrapper-body ${anime} ${containerClassName}`}
        style={{ zIndex: -1 }}
      >
        <div>{this.props.children}</div>
      </div>
    );
  }
  render() {
    const { collapsed } = this.state;
    const { style, className, headerText } = this.props;
    return (
      <div className="me-anime-show-up">
        <div
          className={`me-section-wrapper-header section-green z-depth-1 ${className}`}
          style={style}
          onClick={() => this.setState({ collapsed: !collapsed })}
        >
          {this.showBadge()}
          {headerText}
        </div>
        {this.showBody()}
      </div>
    );
  }
}
MESectionWrapper.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  collapsed: PropTypes.bool.isRequired,
  badgeText: PropTypes.bool,
  badge: PropTypes.bool,
  headerText: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  containerClassName: PropTypes.string,
};

MESectionWrapper.defaultProps = {
  className:"", 
  style:{}, 
  collapsed:false, 
  badge:false, 
  headerText: "You need to provide a header text",
  containerStyle:{}, 
  containerClassName:""
}