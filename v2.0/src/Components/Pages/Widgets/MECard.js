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
    const { to, href, onClick, style, className } = this.props;
    var hoverable = "me-card-hover";
    const classes = `me-card z-depth-float-half ${className}`;
    if (to || href) {
      if (href) { // if you really need that <a> tag instead of the react-router link, then use "href" instead of "to"
        return (
          <perfect>
            <a
              style={{ color: "black", ...style }}
              href={to || href}
              className={`${classes} ${hoverable}`}
            >
              {this.props.children}
            </a>
          </perfect>
        );
      }
      return (
        <perfect>
          <Link
            style={{ color: "black", ...style }}
            to={to || href}
            className={`${classes} ${hoverable}`}
          >
            {this.props.children}
          </Link>
        </perfect>
      );
    }
    if (!onClick) hoverable = "";
    return (
      <perfect>
        <div
          style={style}
          onClick={(e) => this.handleOnClick(e)}
          className={`${classes} ${hoverable}`}
        >
          {this.props.children}
        </div>
      </perfect>
    );
  }

  handleOnClick(e) {
    const { onClick } = this.props;
    if (!onClick) return;
    onClick(e);
  }

  render() {
    return <perfect>{this.ejectComponent()}</perfect>;
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
