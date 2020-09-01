import React, { Component } from "react";
import { Link } from "react-router-dom";
/**
 * A component that has the fundamental design of all buttons for the Gall... platform.
 * Replace the className prop type with a string of all the classes you would like to modify
 * the button with
 * @props @type {String}  className | A text of all extra classes
 * @props @type {Object} style | Normal css styles. Written just the way it is done
 * @props @type {String} icon  | Font awesome class
 * @props @type {String} iconSize | size of the icon you passed ( Eg. sm, lg, 10x, 6x 2x)
 * @props @type {String} iconColor
 * @props @type {func} onClick  | What should happen when the button is clicked?
 * @props @type {String} href
 * @props @type {String} iconPosition | Should the icon be on the left/right side of text?
 * @props @type {String} variation | Used to indicate the preferred btn types (design-wise) options :( "normal","accent", "union")
 */
const ACCENT = "accent";
const UNION = "union";
const NORMAL = "normal";
class MEButton extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleOnClick = (e) => {
    const clickEvent = this.props.onClick;
    if (!clickEvent) return;
    clickEvent(e);
  };
  ejectIcon() {
    const { icon, iconSize, iconColor } = this.props;
    const size = iconSize ? iconSize : "small";
    const color = iconColor ? iconColor : "black";
    const iconStyles = { color: color, fontSize: size };
    if (icon) {
      return (
        <span style={{ marginRight: 5 }}>
          <i icon={icon} styles={iconStyles} />
        </span>
      );
    }
  }
  getClasses() {
    var classes;
    var { className, variation } = this.props;
    className = className ? className : "";
    classes = `me-undefault-btn me-universal-btn me-btn-green ${className}`;
    if (!variation || variation.toLowerCase === NORMAL) return classes;
    if (variation.toLowerCase() === ACCENT) {
      classes = `me-undefault-btn me-universal-btn me-btn-accent ${className}`;
      return classes;
    }
    if (variation.toLowerCase() === UNION) {
      classes = `me-undefault-btn me-universal-btn me-btn-union me-btn-accent ${className}`;
      return classes;
    }

    return classes;
  }

  ejectComponent() {
    const { style, href, to } = this.props;
    const classes = this.getClasses();
    const styles = style ? { ...style } : null;
    if (!href && !to) {
      return (
        <div className="put-me-inline">
          <button
            className={classes}
            style={styles}
            onClick={(e) => this.handleOnClick(e)}
          >
            {this.ejectIcon()}
            {this.props.children}
          </button>
        </div>
      );
    }
    return (
      <div className="put-me-inline">
        <Link
          className={classes}
          style={styles}
          to={href || to}
          onClick={(e) => this.handleOnClick(e)}
        >
          {this.ejectIcon()}
          {this.props.children}
        </Link>
      </div>
    );
  }
  render() {
    return <div className="put-me-inline">{this.ejectComponent()}</div>;
  }
}

export default MEButton;
