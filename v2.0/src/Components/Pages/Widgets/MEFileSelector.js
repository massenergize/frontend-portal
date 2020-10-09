import React, { Component } from "react";
import PropTypes from "prop-types";
import MEButton from "./MEButton";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import MEModal from "./MEModal";

/**
 * A component that allows file selection and image cropping as well as resizing
 * with preview right on the fly
 * @prop {Function} onFileSelected | @returns an object of  the cropped file object, the original name of the file, and other details
 * @prop {Object} style | normal css styles
 * @prop {String} className | normal classes
 * @prop {Number} ratioWidth aspect Ratio width
 * @prop {Number} ratioHeight asepct ration height
 * @prop {Number} maxWidth maximum width of the crop frame
 * @prop {Number} maximumHeight of the crop frame
 * @prop {Object} previewStyle | normal css style for the preview image tag
 */
class MEFileSelector extends Component {
  constructor(props) {
    super();
    this.state = {
      file: null,
      crop: {
        aspect: props.ratioWidth / props.ratioHeight,
        unit: "%",
        x: 5,
        y: 5,
      },
      showPrev: false,
    };

    this.toggleCropperModal = this.toggleCropperModal.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.handleCropClick = this.handleCropClick.bind(this);
  }

  searchForImage(e) {
    e.preventDefault();
    const file = document.getElementById(this.props.name);
    file.click();
    return false;
  }
  readContentOfSelectedFile(file) {
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      this.setState({ src: reader.result })
    );
    reader.readAsDataURL(file);
  }
  handleChange(e) {
    e.preventDefault();
    const theFiles = e.target.files;
    if (!theFiles || theFiles.length < 1) return;
    const { onFileSelected } = this.props;
    const file = theFiles[0];
    this.readContentOfSelectedFile(file); //in base64 and save to the state as src
    this.setState({ file }); // the a version of the same selected in the format of a FileObject
    this.toggleCropperModal();
    return;
  }
  toggleCropperModal() {
    const modal = this.state.modal;
    this.setState({ modal: !modal });
  }
  /**
   * Just a function the updates the new crop size frame that
   * the user has specified now
   * @param {*} crop
   * @param {*} percent
   */
  whenCropChanges = (crop, percent) => {
    this.setState({ crop });
  };

  /**
   * Update reference to image when it is fully loaded
   * @param {*} image
   */
  onImageLoaded = (image) => {
    const { ratioHeight, ratioWidth } = this.props;
    this.imageRef = image;
    return false;
  };

  makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }
  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  /**
   * Return a base64 version of an image file provided, based on a crop frame
   * @param {HTMLImageElement} image - Image File Object
   * @param {Object} crop - crop Object
   * @param {String} fileName - Name of the returned file in Promise
   * @returns {base64String} Image
   */
  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    // As Base64 string
    const base64Image = canvas.toDataURL("image/jpeg");
    this.setState({
      croppedVersionOfFile: this.base64StringtoFile(base64Image, "new_image"),
    });
    return base64Image;
  }

  /**
   *Get the file size of Image File Object provided as a parameter
   * @param {File} file
   * @returns {Number} file size
   */
  getFileSize(file) {
    if (!file) return "";
    const MEGA = 1000000;
    const KILO = 1000;
    var size = file.size;
    var unit = size < MEGA ? "KB" : "MB";
    if (size < MEGA) return Math.round(size / KILO).toString() + " KB";
    return Math.round(size / MEGA).toString() + " MB";
  }

  /**
   *
   * Convert a base64 String back to a file object
   * @param {base64String} base64String
   * @param {String} filename
   * @returns {File} image File Object
   *
   */
  base64StringtoFile(base64String, filename) {
    var arr = base64String.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  handleCropClick() {
    const { onFileSelected } = this.props;
    this.setState({ showPrev: true });
    this.toggleCropperModal();
    if (!onFileSelected) return;
    const { file, croppedVersionOfFile } = this.state;
    const originalSize = this.getFileSize(file);
    const newSize = this.getFileSize(croppedVersionOfFile);
    const toBeSent = {
      originalFile: file,
      originalSize: { size: file.size, text: originalSize },
      croppedFile: croppedVersionOfFile,
      croppedSize: { size: croppedVersionOfFile.size, text: newSize },
      originalFileName: file.name,
    };

    onFileSelected(toBeSent, this.removeImage); // the remove function is sent to allow the uploader to be rest outside of the component
    return;
  }

  removeImage(e) {
    if (e) e.preventDefault();
    const { onFileSelected } = this.props;
    this.setState({ file: null });
    if (!onFileSelected) return;
    onFileSelected(null);
  }
  renderCroppingModal() {
    const { modal, src, crop } = this.state;
    const { maxHeight, maxWidth, extSrc } = this.props;
    var source = src || extSrc;
    if (modal) {
      return (
        <MEModal
          closeModal={this.toggleCropperModal}
          style={{ paddingTop: 30, maxHeight: "50vh", overflowY: "scroll" }}
          contentStyle={{ left:0 }}
        >
          <center>
            <MEButton
              onClick={this.handleCropClick}
              style={{ marginBottom: 10 }}
            >
              Crop
            </MEButton>
          </center>
          {source && (
            <div
              style={{
                width: "60%",
                display: "inline",
                marginTop: 20,
                maxHeight: 250,
                overflowY: "scroll",
              }}
            >
              <center>
                <ReactCrop
                  src={src}
                  crop={crop}
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={(newCrop) => this.whenCropChanges(newCrop)}
                  maxWidth={maxWidth}
                  maxHeight={maxHeight}
                />
              </center>
            </div>
          )}
        </MEModal>
      );
    }
  }
  switchStates() {
    const { file, croppedImageUrl, showPrev } = this.state;
    const { previewStyle } = this.props;
    if (file) {
      return (
        <div>
          {this.renderCroppingModal()}
          <center>
            {/* ------------------------ PREVIEW IMAGE ------------------- */}
            {croppedImageUrl && showPrev && (
              <img
                onClick={this.toggleCropperModal}
                alt="Your cropped  image"
                style={{
                  maxWidth: "100%",
                  borderRadius: 10,
                  cursor: "pointer",
                  ...previewStyle,
                }}
                className="z-depth-float"
                src={croppedImageUrl}
              />
            )}
            <br />
            <a href="#" onClick={this.removeImage}>
              Remove Image
            </a>
            <p style={{ margin: 15, color: "#d2cfcf" }}>{file.name}</p>

            <MEButton
              className="g-uploader-btn-class"
              onClick={(e) => this.searchForImage(e)}
            >
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
          Choose an image from you device
        </p>
        <MEButton
          className="g-uploader-btn-class"
          onClick={(e) => this.searchForImage(e)}
        >
          Choose
        </MEButton>
      </center>
    );
  }
  render() {
    const { style, className } = this.props;
    return (
      <div style={{ position: "relative", ...style }} className={className}>
        <div className="g-uploader-container">{this.switchStates()}</div>
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
MEFileSelector.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  onFileSelected: PropTypes.func.isRequired,
  ratioWidth: PropTypes.number,
  ratioHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  previewStyle: PropTypes.object,
};
MEFileSelector.defaultProps = {
  style: {},
  className: "",
  name: "some_name",
  ratioWidth: 4,
  ratioHeight: 3,
  maxHeight: 300,
  maxWidth: 300,
  previewStyle: {},
};
export default MEFileSelector;
