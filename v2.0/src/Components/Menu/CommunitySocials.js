import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class CommunitySocials extends Component {
  render() {
    const { community } = this.props;
    return (
      <div className="footer-widget contact-column text-center text-md-left">
        <center>
          <div className="section-title">
            <b className="text-white">
              Follow {community ? community.name : "Us"} On Social Media
            </b>
          </div>
          <Link className="footer-social">
            <i className="fa fa-facebook"></i>
          </Link>
          <Link
            className="footer-social"
            style={{ padding: "13px 17px", background: "#C13584" }}
          >
            <i className="fa fa-instagram"></i>
          </Link>
          <Link
            className="footer-social"
            style={{ background: "#06aced", padding: "11px 14px" }}
          >
            <i className="fa fa-twitter"></i>
          </Link>
        </center>
      </div>
    );
  }
}
