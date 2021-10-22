import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
export default class MELink extends Component {
  handleOnClick(e){
    const {onClick} = this.props; 
    if(!onClick) return ; 
    onClick(e);
  }
  render() {
    const { to, href, style } = this.props;
    return (
      <Link to={to || href} className="me-anchor-link-new" style={style} onClick={(e)=>{this.handleOnClick(e)}}>
        {this.props.children}
      </Link>
    );
  }
}

MELink.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  linkText: PropTypes.string,
  style:PropTypes.object
};

MELink.defaultProps = {
  to: "#",
  href: "#",
  linkText: "Link text here...",
  style:{}
};
