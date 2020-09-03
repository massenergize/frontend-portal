import React from "react";

/**
 * Renders the loading screen that shows when server is still responding
 */
class LoadingCircle extends React.Component {
  render() {
    const { width, height } = this.props;
    var style = {};
    if (width && height) {
      style = { width, height };
    }
    return (
      <div className="d-flex height-100vh justify-content-center align-items-center">
        {/* <img
          src={require("../../assets/images/other/loader.gif")}
          alt="Loading..."
          style={style}
        /> */}
        <div className="me-circle-loader" style={style}></div>
      </div>
    );
  }
}
export default LoadingCircle;
