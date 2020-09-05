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
import MEUploader from "../MEUploader";

const INPUT = "input";
const TEXTAREA = "textarea";
const DROPDOWN = "dropdown";
const AUTOCOMPLETE = "autocomplete";
const RADIOGROUP = "radio-group";
const CHECKBOXES = "checkbox-group";
const FILE = "file";

/**
 * This Component accepts a formField Item and accepts
 * @props {Array[formFieldItem]} fields
 * @props {Object} style
 * @props {string} className
 * @props {string} actionText
 * @returns HTML Form event && form Content (e, content)
 *
 */
export default class FormGenerator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.setDefaultValues = this.setDefaultValues.bind(this);
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
  getDropdown(formObject, key) {
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MEDropdown
          {...formObject}
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
  getFileUploader(formObject, key) {
    return (
      <div key={key} className="small-form-spacing">
        {this.labelOrNot(formObject)}
        <MEUploader
          {...formObject}
          onFileSelected={(file) => {
            this.handleFields(formObject.name, file);
          }}
        />
      </div>
    );
  }
  componentDidMount() {
    const { fields } = this.props;
    if (!fields) return;
    this.setDefaultValues();
  }

  setDefaultValues() {
    const { fields } = this.props;
    var defaults = {};
    fields.forEach((formItem) => {
      if (formItem.value || formItem.defaultValue) {
        defaults = {
          ...defaults,
          [formItem.name]: formItem.value || formItem.defaultValue,
        };
      }
    });
    if (defaults === {}) return;
    this.setState({
      formData: defaults,
    });
  }
  createAndEjectForm() {
    const { fields } = this.props;
    if (!fields || fields.length === 0) return <small>Ogbemi!</small>;
    return fields.map((formItem, index) => {
      switch (formItem.type.toLowerCase()) {
        case INPUT:
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
      }
    });
  }

  onSubmit(e) {
    const { onSubmit } = this.props;
    if (!onSubmit) return;
    onSubmit(e, this.state.formData);
    return;
  }

  render() {
    const { animate, className, style, title } = this.props;
    const animationClass = animate ? "me-open-in" : "";
    return (
      <div>
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
            <div style={{ display: "flex" }}>
              <MEButton containerStyle={{ marginLeft: "auto" }}>
                {this.props.actionText}
              </MEButton>
            </div>
          </form>
        </MECard>
      </div>
    );
  }
}

FormGenerator.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.object,
  animate: PropTypes.bool,
  actionText: PropTypes.string,
  className: "",
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
};

FormGenerator.defaultProps = {
  fields: [],
  animate: true,
  style: {},
  className: "",
  actionText: "Submit",
  title: "",
};
