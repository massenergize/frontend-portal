import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { isValidUrl } from "../../../api/urls";

/**
 * renders a single icon box on the home page
 * @props
 *      icon (fa fa-something)
 *      title
 *      description
 *      link
 */
class IconBox extends React.Component {
  renderBoxStuff() {
    return (
      <>
        <div className="icon-box text-center">
          <span className={this.props.icon}></span>
        </div>

        <h4
          style={{ color: "darkslategrey" }}
          className="cool-font mob-font-lg"
        >
          {this.props.title}
        </h4>
        <p className="cool-font phone-vanish make-me-dark">
          <br />
          {this.props.description}
        </p>
      </>
    );
  }

  render() {
    return (
      <div
        className="service-item center hover-service-item me-anime-open-in"
        style={{ background: "white" }}
      >
        {isValidUrl(this.props.link) ? (
          <a
            href={`${this.props.link}`}
            style={{ width: "100%", height: "100%" }}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            {this.renderBoxStuff()}
          </a>
        ) : (
          <Link
            to={`${this.props.link}`}
            style={{ width: "100%", height: "100%" }}
          >
            {this.renderBoxStuff()}
          </Link>
        )}
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    links: store.links,
  };
};
export default connect(mapStoreToProps)(IconBox);
