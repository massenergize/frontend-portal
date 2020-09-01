import React, { Component } from "react";
import PropTypes from "prop-types";
const ICON = "icon";
const IMAGE = "image";
const H1 = "h1";
const H2 = "h2";
const H3 = "h3";
const h4 = "h4";
const h5 = "h5";
const h6 = "h6";
const PARA = "p";
const SMALL = "small";
/**
 * This component can serve as a normal html paragraph with just text,
 * and can also serve more advance fxns by displaying icons, or tiny imgs, on the left of text
 * @props @type {String} className
 * @props @type {Object} style
 * @props @type {Object} containerStyle
 * @props @type {String } mediaType | Either : icon OR image
 * @props @type {String} icon   | fontawesome icon
 * @props @type {String | Blob} imageSource  | any url to image, of imported image
 * @props @type {String} iconSize | size of fontawesome icon in px
 * @props @type {String} type | @REQUIRED
 * @props @type {func} onClick
 * @props @type {String} iconColor
 *
 */

class METextView extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  ejectIcon() {
    const { icon, iconSize, iconColor } = this.props;
    const size = iconSize ? iconSize : "small";
    const color = iconColor ? iconColor : "gray";
    const iconStyles = {color:color, fontSize:size}
    if (icon) {
      return (
        <span style={{ marginRight: 5 }}>
         <i className={icon} styles={iconStyles} />
        </span>
      );
    }
  }
  ejectImage() {
    const { imageSource } = this.props;
    if (imageSource) {
      return (
        <img
          src={imageSource}
          className="put-me-inline"
          style={{ height: 30, width: 30, objectFit: "contain" }}
        />
      );
    }
  }

  ejectMedia() {
    const { mediaType } = this.props;
    if (!mediaType) return;
    if (mediaType.toLowerCase() === ICON.toLowerCase()) {
      return this.ejectIcon();
    } else if (mediaType.toLowerCase() === IMAGE.toLowerCase()) {
      return this.ejectImage();
    }
  }
  createSmallText(styles, classes) {
    return (
      <small
        style={styles}
        className={classes}
        onClick={(e) => this.handleOnClick(e)}
      >
        {this.ejectMedia()} {this.props.children}
      </small>
    );
  }

  handleOnClick(e){
    const {onClick } = this.props; 
    if(!onClick) return; 
    onClick(e);
  }
  createHeader(styles, classes) {
    return (
      <h2
        style={styles}
        className={classes}
        onClick={(e) => this.handleOnClick(e)}
      >
        {this.ejectMedia()} {this.props.children}
      </h2>
    );
  }
  createParagraph(styles, classes) {
    return (
      <p
        style={styles}
        className={classes}
        onClick={(e) => this.handleOnClick(e)}
      >
        {this.ejectMedia()} {this.props.children}
      </p>
    );
  }
  ejectComponent() {
    const { type, style, className } = this.props;
    if (!type) {
      console.log("You did not specify the type of METext you needed....!!!");
      return;
    }
    const classes = `me-paragraph ${className ? className : ""}`;
    const styles = style ? { ...style } : null;
    switch (type.toLowerCase()) {
      case PARA:
        return this.createParagraph(styles, classes);
      case SMALL || H6 || H5:
        return this.createSmallText(styles, classes);
      case H1 || H2 || H3 || H4:
        return this.createHeader(styles, classes);
      
      default:
        return this.createParagraph(styles, classes);
    }

    // who even specifies h-tags anymore LMAO!!!!!! 
  }

  render() {
    const {containerStyle} = this.props;
    const styles = containerStyle ? { ...containerStyle } : null;
    return <div style={styles}>{this.ejectComponent()}</div>;
  }
}
METextView.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  containerStyle:PropTypes.object,
  icon: PropTypes.object,
  imageSource: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  iconSize: PropTypes.string,
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  iconColor: PropTypes.string
};
export default METextView;
