import React from "react";
import oops from "./oops.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ErrorPage extends React.Component {
  render() {
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
            <h1 style={{ color: "lightgray" }}>{errorMessage}</h1>
            <h3
              className="text-center"
              style={{ marginBottom: 20, color: "lightgray" }}
            >
              {" "}
              {errorDescription}
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
            {!this.props.allowBack && !this.props.invalidCommunity && (
              <p className="text-center">
                <Link to={this.props.links.home} className="mass-domain-link ">
                  Return to Home Page
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
