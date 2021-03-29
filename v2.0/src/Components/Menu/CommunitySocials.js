import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { changeToProperURL } from "../Utils";

export default class CommunitySocials extends Component {
  render() {
    const { community, moreInfo } = this.props;
    return (
      <div className="footer-widget contact-column text-center text-md-left">
        <center>
          <div className="section-title">
            <b className="text-white">
              Follow {community ? community.name : "Us"} On Social Media
            </b>
          </div>
          {moreInfo && moreInfo.facebook_link && (
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="footer-social"
              href={changeToProperURL(moreInfo.facebook_link)}
            >
              <i className="fa fa-facebook"></i>
            </a>
          )}
          {moreInfo && moreInfo.instagram_link && (
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={changeToProperURL(moreInfo.instagram_link)}
              className="footer-social"
              style={{ padding: "13px 17px", background: "#C13584" }}
            >
              <i className="fa fa-instagram"></i>
            </a>
          )}
          {moreInfo && moreInfo.twitter_link && (
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={changeToProperURL(moreInfo.twitter_link)}
              className="footer-social"
              style={{ background: "#06aced", padding: "11px 14px" }}
            >
              <i className="fa fa-twitter"></i>
            </a>
          )}
        </center>
      </div>
    );
  }
}
