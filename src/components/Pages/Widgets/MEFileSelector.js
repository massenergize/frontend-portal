import React, { Component } from "react";
import PropTypes from "prop-types";
import MEButton from "./MEButton";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// import MEModal from "./MEModal";

/**
 * A component that allows file selection and image cropping as well as resizing
 * with preview right on the fly
 * @prop {Function} onFileSelected | @returns an object of  the cropped file object, the original name of the file, and other details
 * @prop {Object} style | normal css styles
 * @prop {String} className | normal classes
 * @prop {Number} ratioWidth aspect Ratio width
 * @prop {Number} ratioHeight asepct ration height
 * @prop {Number} maxWidth maximum width of the crop frame
 * @prop {Number} maxHeight of the crop frame
 * @prop {Object} previewStyle | normal css style for the preview image tag
 * @prop {Boolean} showOverlay | determines whether or not the translucent backgroud of the cropping modal
 * should show | default = true
 * @prop {String} modalContainerClassName Just classnames that should be attached on to the cropping modal
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
      defaultRemoved: false,
    };

    this.toggleCropperModal = this.toggleCropperModal.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.initiateCropping = this.initiateCropping.bind(this);
    this.searchForImage = this.searchForImage.bind(this);
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
    return reader.readAsDataURL(file);
  }
  shipProcessedFile(original, processedFile) {
    const { onFileSelected } = this.props;
    if (!onFileSelected) return;
    const originalSize = this.getFileSize(original);
    const newSize = this.getFileSize(processedFile);
    const toBeSent = {
      originalFile: original,
      originalSize: { size: original.size, text: originalSize },
      croppedFile: processedFile,
      croppedSize: { size: processedFile.size, text: newSize },
      originalFileName: original.name,
      file: {
        data: processedFile || original,
        info: {
          size: processedFile?.size || original?.size,
          text: newSize || originalSize,
        },
      },
    };
    onFileSelected(toBeSent, this.removeImage);
    return;
  }
  processUnCroppedFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = (e) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width > 500 ? 500 : img.width;
        canvas.height = canvas.width * (img.height / img.width);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg");
        const newFile = this.base64StringtoFile(data, file.name);
        this.shipProcessedFile(file, newFile);
        this.setState({
          croppedImageUrl: null,
          src: data,
          file: newFile,
          showPrev: true,
          original: file,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  handleChange(e) {
    e.preventDefault();
    const theFiles = e.target.files;
    if (!theFiles || theFiles.length < 1) return;
    const file = theFiles[0];
    this.processUnCroppedFile(file);
    // this.readContentOfSelectedFile(file); //in base64 and save to the state as src
    // the a version of the same selected in the format of a FileObject

    // this.setState({ file });
    // this.toggleCropperModal();
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
    // var unit = size < MEGA ? "KB" : "MB";
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
    return this.shipProcessedFile(file, croppedVersionOfFile);
  }

  initiateCropping(e) {
    if (e) e.preventDefault();
    const { original } = this.state;
    this.readContentOfSelectedFile(original);
    this.toggleCropperModal();
  }

  removeImage(e) {
    if (e) e.preventDefault();
    const { onFileSelected } = this.props;
    this.setState({ file: null });
    if (!onFileSelected) return;
    onFileSelected(null, this.removeImage);
  }
  renderCroppingModal() {
    const { modal, src, crop } = this.state;
    const { maxHeight, maxWidth, extSrc } = this.props;
    var source = src || extSrc;
    if (modal) {
      return (
        <>
          <div className="me-anime-open-in">
            <center>
              <MEButton
                onClick={this.handleCropClick}
                style={{ marginBottom: 10 }}
              >
                Crop
              </MEButton>
              <br />
              <small>
                Hold and drag your cursor over the parts you wish to use
              </small>
              <br />
              <a
                href="##"
                style={{ margin: 15 }}
                onClick={(e) => {
                  e.preventDefault();
                  this.toggleCropperModal();
                  this.setState({ croppedImageUrl: null });
                }}
              >
                Cancel Cropping
              </a>
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
                    circularCrop={this.props.circleCrop}
                  />
                </center>
              </div>
            )}
          </div>
          {/* </MEModal>  */}
        </>
      );
    }
  }

  switchStates() {
    const { file, croppedImageUrl, showPrev, modal, defaultRemoved, src } =
      this.state;
    const {
      previewClassName,
      previewStyle,
      defaultValue,
      name,
      allowCrop,
      formData,
      ImageToDelete,
    } = this.props;

    if (!file && defaultValue && !defaultRemoved) {
      return (
        <center>
          <img
            src={defaultValue}
            alt={`${name}`}
            onClick={(e) => this.searchForImage(e)}
            className={`image-chooser-default z-depth-float ${
              previewClassName || ""
            }`}
            style={previewStyle}
          />
          <br />
          <a
            style={{ marginTop: 6 }}
            href="##"
            onClick={() => {
              this.setState({ defaultRemoved: true }); // this is jsut to give the UI change that the picture has been removed, when this component is being used to edit in a form
              this.removeImage();
            }}
          >
            Remove Image
          </a>
          <br />
          <MEButton onClick={(e) => this.searchForImage(e)}>Change</MEButton>
        </center>
      );
    }

    if (file && modal) {
      return this.renderCroppingModal();
    }

    if (file) {
      return (
        <div>
          <center>
            {/* ------------------------ PREVIEW IMAGE ------------------- */}
            {(croppedImageUrl || src) && showPrev && (
              <img
                onClick={this.searchForImage}
                alt="Cropped"
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  borderRadius: 10,
                  cursor: "pointer",
                  ...previewStyle,
                }}
                className="z-depth-float me-anime-open-in"
                src={croppedImageUrl || src}
              />
            )}
            <br />
            <a style={{ marginTop: 6 }} href="##" onClick={this.removeImage}>
              Remove Image
            </a>
            <br />
            {allowCrop && (
              <a
                style={{ marginTop: 6 }}
                href="##"
                onClick={this.initiateCropping}
              >
                Crop Image
              </a>
            )}
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
    //this.props.formData can have the following 3 states this.props.formData = {}
    //this.props.formData.image = null or this.props.formData.image.img ,
    //if the img url  property does not exist then it will return a null/undefined which will be set to an empty string
    var EditImageSrc = this.props.formData?.image?.url;
    if (typeof EditImageSrc !== "string") {
      EditImageSrc = "";
    }
    return (
      <center>
        {this.state.file || EditImageSrc === "" ? (
          <>
            <span className="fa fa-upload" style={{ fontSize: "4rem" }} />
            <p style={{ margin: 15, color: "#d2cfcf" }}>
              {this.props.placeholder}
            </p>
          </>
        ) : (
          <>
            <div>
              <img
                src={EditImageSrc}
                width="50%"
                height="50%"
                alt="testimonial"
              />
            </div>

            <MEButton
              type="button"
              className="g-uploader-btn-class"
              onClick={async () => {
                //waits for the state to be updated or the imgdel property will be deleted if added too early
                await this.removeImage();
                ImageToDelete(formData?.image);
              }}
            >
              Delete Image
            </MEButton>
          </>
        )}
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
        {/* <img src={this.state.croppedImageUrl} /> */}
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
  modalContainerClassName: PropTypes.string,
  showOverlay: PropTypes.bool,
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
  modalContainerClassName: "",
  showOverlay: true,
  placeholder: "Choose an image from your device",
  allowCrop: true,
  circleCrop: false,
};
export default MEFileSelector;
