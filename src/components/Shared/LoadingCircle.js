import React from "react";
import loader from "./../../assets/images/other/loader.gif";
/**
 * Renders the loading screen that shows when server is still responding
 */
class LoadingCircle extends React.Component {
  render() {
    var { width, height, id, style, simple, label } = this.props;

    if (simple)
      return (
        <center>
          <img
            src={loader}
            alt="Loading..."
            style={{
              display: "block",
              margin: "auto",
              width: "150px",
              height: "150px",
            }}
          />
          {label && <span>{label}</span>}
        </center>
      );

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
