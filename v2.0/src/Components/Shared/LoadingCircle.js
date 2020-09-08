import React from "react";

/**
 * Renders the loading screen that shows when server is still responding
 */
class LoadingCircle extends React.Component {
  render() {
    var { width, height, id, style } = this.props;
    console.log("I AM THE ID", id);

    if (width && height) {
      style = { width, height, ...style };
    }
    return (
      <div
        id={id}
        className="d-flex height-100vh justify-content-center align-items-center"
        style={style}
      >
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
LoadingCircle.defaultProps = {
  style: {},
};
export default LoadingCircle;
