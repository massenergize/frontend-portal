import React, { Component, createRef, useRef } from "react";
import PropTypes from "prop-types";
import MEButton from "./MEButton";
import MECard from "./MECard";

class MEUploader extends Component {
  constructor(props) {
    super();
    this.state = { file: null };
    this.removeImage = this.removeImage.bind(this); 
    
  }

  searchForImage(e) {
    e.preventDefault();
    const file = document.getElementById(this.props.name);
    file.click();
    return false;
  }
  handleChange(e) {
    e.preventDefault();
    const { onFileSelected } = this.props;
    const file = e.target.files[0];
    this.setState({ file });
    if (!onFileSelected) return;
    onFileSelected(file, this.removeImage);
    return;
  }

  removeImage() {
    this.setState({ file: null });
    return;
  }

  switchStates() {
    const { file } = this.state;
    const { defaultValue, name } = this.props;
    if (!file && defaultValue) {
      return (
        <center>
          <img
            src={defaultValue}
            alt={`${name} image`}
            onClick={(e) => this.searchForImage(e)}
            className="image-chooser-default z-depth-float"
          />
          <br />
          <MEButton onClick={(e) => this.searchForImage(e)}>Change</MEButton>
        </center>
      );
    }

    if (file) {
      return (
        <div>
          <center>
            <MECard style={{ width: 100, height: 100 }}>
              <center>
                <span
                  className="fa fa-image"
                  style={{ fontSize: "4rem" }}
                ></span>
              </center>
            </MECard>
            <p className="me-text-color-app" style={{ margin: 15 }}>
              {file.name}
            </p>
            <MEButton onClick={(e) => this.searchForImage(e)}>
              Change Image
            </MEButton>
          </center>
        </div>
      );
    }

    return (
      <center>
        <span className="fa fa-upload" style={{ fontSize: "4rem" }} />
        <p style={{ margin: 15, color: "#d2cfcf" }}>
          Choose an image from your device
        </p>
        <MEButton onClick={(e) => this.searchForImage(e)}>Choose</MEButton>
      </center>
    );
  }
  render() {
    const { style, className } = this.props;
    return (
      <div style={{ position: "relative", ...style }} className={className}>
        <div className="me-uploader-container">{this.switchStates()}</div>
        <input
          type="file"
          onChange={(e) => {
            this.handleChange(e);
          }}
          id={this.props.name}
          style={{ display: "none" }}
        />
      </div>
    );
  }
}
MEUploader.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
};
MEUploader.defaultProps = {
  style: {},
  className: "",
  name: "some_name",
  defaultValue: null,
};
export default MEUploader;
