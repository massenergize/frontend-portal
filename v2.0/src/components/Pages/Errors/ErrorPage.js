import React from "react";
import oops from "./oops.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import URLS from "../../../api/urls";

class ErrorPage extends React.Component {
  render() {
    const homeURL = window.location.origin + this.props.links.home;
    const currentlyOnHomePage = window.location.href === homeURL;
    const errorMessage = this.props.errorMessage
      ? "Error: " + this.props.errorMessage
      : "An error occured.";

    const errorDescription = this.props.errorDescription
      ? this.props.errorDescription
      : "The cause is unknown.";

    //TODO: describe the ways in which user can help report the error

    return (
      <div>
        <div
          className="boxed_wrapper"
          style={{
            height: window.screen.height,
            paddingTop: "80px",
            paddingBottom: "80px",
          }}
        >
          <center>
            <img
              alt="404"
              src={oops}
              style={{ marginBottom: 20, height: 100, width: 100 }}
            />
            <h1 style={{ color: "lightgray" }}>
              {!this.props.invalidCommunity
                ? errorMessage
                : "The community you want to access does not exist."}
            </h1>
            <h3
              className="text-center"
              style={{ marginBottom: 20, color: "lightgray" }}
            >
              {" "}
              {!this.props.invalidCommunity
                ? errorDescription
                : "Contact us at info@massenergize.org"}
            </h3>
            {this.props.allowBack && (
              <p className="text-center">
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.back();
                  }}
                  className="mass-domain-link "
                >
                  Go Back
                </Link>
              </p>
            )}

            {this.props.invalidCommunity && (
              <p className="text-center">
                <a href={URLS.COMMUNITIES} className="mass-domain-link ">
                  Checkout all active communities
                </a>
              </p>
            )}
            {!this.props.allowBack && !this.props.invalidCommunity && (
              <p className="text-center">
                <Link
                  to={currentlyOnHomePage ? "/" : this.props.links.home}
                  className="mass-domain-link "
                >
                  {currentlyOnHomePage ? "Reload Page" : " Return to Home Page"}
                </Link>
              </p>
            )}
          </center>
        </div>
      </div>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    links: store.links,
  };
};

export default connect(mapStoreToProps, null)(ErrorPage);
