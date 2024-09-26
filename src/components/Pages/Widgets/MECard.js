import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Just simple wrapper with a tiny elevation with href and onClick properties
 * @props {string} to | href (http link in string form)
 * @props {func} onClick
 * @props {string} className
 * @props {object} style
 *
 */
export default class MECard extends Component {
  ejectComponent() {
    const { to, href, onClick, style, className, elevate } = this.props;
    var hoverable = "me-card-hover";
    const classes = `me-card ${
      elevate ? "z-depth-float-half" : ""
    } ${className}`;
    if (to || href) {
      if (href) {
        // if you really need that <a> tag instead of the react-router link, then use "href" instead of "to"
        return (
          <>
            <a
              style={{ color: "black", ...style }}
              href={to || href}
              className={`${classes} ${hoverable}`}
            >
              {this.props.children}
            </a>
          </>
        );
      }
      return (
        <>
          <Link
            style={{ color: "black", ...style }}
            to={to || href}
            className={`${classes} ${hoverable}`}
          >
            {this.props.children}
          </Link>
        </>
      );
    }
    if (!onClick) hoverable = "";
    return (
      <>
        <div
          style={style}
          onClick={(e) => this.handleOnClick(e)}
          className={`${classes} ${hoverable}`}
        >
          {this.props.children}
        </div>
      </>
    );
  }

  handleOnClick(e) {
    const { onClick } = this.props;
    if (!onClick) return;
    onClick(e);
  }

  render() {
    return <>{this.ejectComponent()}</>;
  }
}

MECard.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
  href: PropTypes.string,
};
MECard.defaultProps = {
  style: {},
  className: "",
};
