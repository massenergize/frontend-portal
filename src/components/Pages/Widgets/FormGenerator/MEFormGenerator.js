import React, { Component } from "react";
import PropTypes from "prop-types";
import MECard from "../MECard";
import METextField from "../METextField";
import METextView from "../METextView";
import MEButton from "../MEButton";
import MEDropdown from "../MEDropdown";
import MEAutoComplete from "../MEAutoComplete";
import MERadio from "../MERadio";
import MECheckBoxes from "../MECheckBoxGroup";
// import MEUploader from "../MEUploader";
import MEUploader from "../MEFileSelector";
import MEChipMaker from "../MEChipMaker";
import MERichTextEditor from "../MERichTextEditor/MERichTextEditor";

const INPUT = "input";
const TEXTAREA = "textarea";
const DROPDOWN = "dropdown";
const AUTOCOMPLETE = "autocomplete";
const RADIOGROUP = "radio-group";
const CHECKBOXES = "checkbox-group";
const SECTION = "section-creator";
const CHIPS = "chips";
const FILE = "file";
const HTMLFIELD = "html-field";
const DATE = "date"

export const BAD = "bad";
export const GOOD = "good";

/**
 * This Component accepts a formField Item and accepts
 * @prop {Array[formFieldItem]} fields
 * @prop {object} style
 * @prop {string} className
 * @prop {string} actionText
 * @prop {bool} elevate | should the form be elevated or not?
 * @prop {bool} animate | should the form be animated or not?
 * @prop {object} info | any notification you would like to display below the form {icon, type ("good|bad"), text}
 * @prop {function}  onMount | A function that exports some utility fxns and values from the form generator
 * @returns HTML Form event && form Content (e, content)
 *
 */

export default class FormGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      resetors: {},
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.setDefaultValues = this.setDefaultValues.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  labelOrNot(formObject) {
    if (!formObject.hasLabel) return <span></span>;
    return (
      <METextView type="p" className="reset-margin" style={{ fontSize: 17 }}>
        {formObject.label}
      </METextView>
    );
  }

  handleFields(name, value) {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, [name]: value } });
  }
  getAutoComplete(formObject, key) {
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MEAutoComplete
          {...formObject}
          onItemSelected={(selected) =>
            this.handleFields(formObject.name, selected)
          }
        />
      </div>
    );
  }
  // this fxnality plays a big role in updating the content of the dropdown component from outside
  // and therefore allows us to reset dropdowns in the form appropriately
  getDropDownValueForTwoWayBinding(formObject) {
    // dropdowns do not always return the text a user chooses from the list, they can return a value, from another set
    // of defined values inside "dataValues". So this mech below, is to make sure we still get back the displayed text, even in such situations (TODO:remember to write a detailed doc later...)
    const passedValue = this.state.formData[formObject.name];
    const data =
      formObject.data && formObject.data.length > 0 ? formObject.data : [];
    const index =
      formObject.dataValues && formObject.dataValues.length > 0
        ? formObject.dataValues.indexOf(passedValue)
        : data.indexOf(passedValue);
    return data[index];
  }
  getDropdown(formObject, key) {
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MEDropdown
          {...formObject}
          value={this.getDropDownValueForTwoWayBinding(formObject)}
          onItemSelected={(selected) =>
            this.handleFields(formObject.name, selected)
          }
        />
      </div>
    );
  }
  getInput(formObject, key) {
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <METextField
          inputType={formObject.type}
          {...formObject}
          defaultValue={this.state.formData[formObject.name]}
          onChange={(e) => {
            this.handleFields(formObject.name, e.target.value);
          }}
        />
      </div>
    );
  }

  getCheckBoxes(formObject, key) {
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MECheckBoxes
          {...formObject}
          onItemSelected={(selected) =>
            this.handleFields(formObject.name, selected)
          }
        />
      </div>
    );
  }

  getRadioGroup(formObject, key) {
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MERadio
          containerStyle={{ marginTop: 5 }}
          {...formObject}
          onItemSelected={(selected) =>
            this.handleFields(formObject.name, selected)
          }
        />
      </div>
    );
  }
  handleFileSelection(formObject, file) {
    if (!file) {
      this.setState({ imageInfo: "" });
      return this.handleFields(formObject.name, file);
    }
    if (file.originalSize.size > 999999) {
      this.setState({
        imageInfo: `Your image is quite large(${file.originalSize.text}), it might take a few moments to upload. Please be patient.`,
      });
    } else {
      this.setState({ imageInfo: "" });
    }
    this.handleFields(formObject.name, file.croppedFile);
  }

  getFileUploader(formObject, key) {
    const { resetors } = this.state;
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MEUploader
          ImageToDelete={(ImgToDel) => this.ImageToDelete(ImgToDel)}
          formData={this.state.formData}
          {...formObject}
          onFileSelected={(file, removeFxn) => {
            this.handleFileSelection(formObject, file);
            this.setState({
              resetors: { ...resetors, [formObject.name]: removeFxn },
            });
          }}
        />
      </div>
    );
  }

  getSectionCreator(formObject, key) {
    if (!formObject) return;
    const { title, text } = formObject;
    const titleDisplay = <h5 className="form-title-section">{title}</h5>;
    return (
      <div key={key.toString()}>
        {titleDisplay}
        <p style={{ fontSize: "medium" }}>{text}</p>
      </div>
    );
  }

  getChipMaker(formObject, key) {
    if (!formObject) return;
    return (
      <div key={key.toString()} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MEChipMaker
          {...formObject}
          onItemChange={(items) => {
            this.handleFields(formObject.name, items);
          }}
        />
      </div>
    );
  }
  componentDidMount() {
    const { fields, onMount } = this.props;
    onMount && onMount(this.resetForm);
    if (!fields) return;
    this.setDefaultValues();
    //sets props for form data when in edit mode
    if (this.props.inputData) {
      this.setState({
        formData: this.props.inputData,
      });
    }
  }
  getDropDownDefault(formItem) {
    //the real value of a dropdown should be take from its dataValues array if it exists
    const value = formItem.value || formItem.defaultValue;
    if (formItem.dataValues && formItem.dataValues.length > 0) {
      return formItem.dataValues[formItem.data.indexOf(value)];
    }
    return value;
  }

  setDefaultValues() {
    const { fields } = this.props;
    var defaults = {};
    fields.forEach((formItem) => {
      if (formItem.value || formItem.defaultValue) {
        if (formItem.type === DROPDOWN) {
          defaults = {
            ...defaults,
            [formItem.name]: this.getDropDownDefault(formItem),
          };
        } else {
          defaults = {
            ...defaults,
            [formItem.name]: formItem.value || formItem.defaultValue,
          };
        }
      }
    });
    if (defaults === {}) return;
    this.setState({
      formData: defaults,
    });
  }

  getRichTextEditor(formItem, key) {
    const hasResetFxnInStateAlready = this.state.resetors[formItem.name];
    return (
      <React.Fragment key={key}>
        {this.labelOrNot(formItem)}
        <MERichTextEditor
          onChange={(text) => this.handleFields(formItem.name, text)}
          defaultValue={this.state.formData[formItem.name]}
          onMount={(resetor) =>
            !hasResetFxnInStateAlready &&
            this.setState({
              resetors: { ...this.state.resetors, [formItem.name]: resetor },
            })
          }
        />
      </React.Fragment>
    );
  }

 

  createAndEjectForm() {
    const { fields } = this.props;
    if (!fields || fields.length === 0) return <small></small>;
    return fields.map((formItem, index) => {
      if (!formItem || formItem === {}) return <i></i>;
      switch (formItem.type.toLowerCase()) {
        case INPUT:
          return this.getInput(formItem, index);
        case DATE:
          return this.getInput(formItem, index);  
        case TEXTAREA:
          return this.getInput(formItem, index);
        case DROPDOWN:
          return this.getDropdown(formItem, index);
        case AUTOCOMPLETE:
          return this.getAutoComplete(formItem, index);
        case RADIOGROUP:
          return this.getRadioGroup(formItem, index);
        case CHECKBOXES:
          return this.getCheckBoxes(formItem, index);
        case FILE:
          return this.getFileUploader(formItem, index);
        case SECTION:
          return this.getSectionCreator(formItem, index);
        case CHIPS:
          return this.getChipMaker(formItem, index);
        case HTMLFIELD:
          return this.getRichTextEditor(formItem, index);
        default:
          return <div></div>;
      }
    });
  }

  setError(message) {
    const error = {
      icon: "fa fa-times",
      type: BAD,
      text: message,
    };
    this.setState({ notification: error });
  }

  componentDidUpdate(prevProps) {
    const { info } = this.props;
    const prevInfo = prevProps.info;
    if (prevInfo && info && prevInfo.text !== info.text) {
      this.setState({ notification: info });
    }
  }
  fieldIsEmpty(field) {
    const { formData } = this.state;
    const value = formData[field.name];
    if (!value || value.length < 1) return true;
    return false;
  }
  requiredFieldIsEmpty() {
    const { fields } = this.props;
    if (!fields) return false;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const required = field.required;
      const name = field.name;
      if (required) {
        // set notification in state  and return right away, dont continue
        if (this.fieldIsEmpty(field)) {
          this.setError(`${name} is required please provide information`);
          return true;
        }
      }
    }
    // no required fields are empty
    return false;
  }

  onSubmit(e) {
    const { onSubmit } = this.props;
    if (!onSubmit) return;
    if (this.requiredFieldIsEmpty()) {
      // if any required field is empty
      onSubmit(e, { isNotComplete: true });
      return;
    }
    onSubmit(e, this.state.formData, this.resetForm);
    return;
  }

  resetForm() {
    const { fields } = this.props;
    var defaults = {};
    fields.forEach((formItem) => {
      if (formItem.type === INPUT || formItem.type === TEXTAREA) {
        defaults = {
          ...defaults,
          [formItem.name]: "",
        };
      } else {
        defaults = {
          ...defaults,
          [formItem.name]: formItem.resetKey,
        };
        if (formItem.type === FILE) {
          const reset = this.state.resetors[formItem.name];
          if (reset) reset();
        }
      }
    });
    this.setState({ formData: defaults });
  }

  displayImageWarning() {
    const { imageInfo } = this.state;
    if (imageInfo)
      return (
        <METextView
          mediaType="icon"
          className="page-text-phone-mode"
          icon={"fa fa-exclamation-circle"}
          style={{ color: "orange", fontSize: "medium" }}
        >
          {imageInfo}
        </METextView>
      );
  }
  displayInformation() {
    var { info } = this.props;
    const internalInfo = this.state.notification;
    info = internalInfo || info; // internal info takes priority
    if (!info) return null;
    if (info.type === BAD) {
      return (
        <METextView
          mediaType="icon"
          className="page-text-phone-mode"
          icon={info.icon}
          style={{ color: "red", fontSize: "medium" }}
        >
          {info.text}
        </METextView>
      );
    }

    if (info.type === GOOD) {
      return (
        <METextView
          mediaType="icon"
          className="page-text-phone-mode"
          icon={info.icon}
          style={{ color: "green" }}
        >
          {info.text}
        </METextView>
      );
    }
  }

  //this function keeps track of what  image  to delete should the user remove the image from the post and submit it without an image
  ImageToDelete(ImgToDel) {
    var Data = this.state.formData;
    Data["ImgToDel"] = ImgToDel;
    this.setState({
      formData: Data,
    });
  }
  render() {
    var { animate, className, style, title, elevate, moreActions } = this.props;
    const animationClass = animate ? "me-open-in" : "";
    style = elevate ? style : { boxShadow: "0 0 black", ...style };
    return (
      <MECard className={`${animationClass} ${className}`} style={style}>
        <METextView
          containerStyle={{ width: "100%" }}
          style={{ color: "black", fontSize: 18, textAlign: "center" }}
        >
          {title}
        </METextView>
        <form onSubmit={this.onSubmit}>
          {this.createAndEjectForm()}

          <br />
          <div>{this.displayInformation()}</div>
          <div>{this.displayImageWarning()}</div>
          <div style={{ display: "flex" }}>
            <div style={{ marginLeft: "auto" }}>
              {moreActions}
              <MEButton
                containerStyle={{
                  padding: "10px 12px",
                  fontSize: 18,
                }}
              >
                {this.props.actionText}
              </MEButton>
            </div>
          </div>
        </form>
      </MECard>
    );
  }
}

FormGenerator.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.object,
  animate: PropTypes.bool,
  actionText: PropTypes.string,
  className: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  elevate: PropTypes.bool,
  info: PropTypes.object,
  contentStyle: PropTypes.object,
};

FormGenerator.defaultProps = {
  fields: [],
  animate: true,
  style: {},
  className: "",
  actionText: "Submit",
  title: "",
  elevate: true,
  info: {},
  moreActions: <></>,
};
