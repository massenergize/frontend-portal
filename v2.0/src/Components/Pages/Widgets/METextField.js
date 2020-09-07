import React, { Component } from "react";
import PropTypes from "prop-types";
import { getRandomIntegerInRange } from "../../Utils";

/**
 * @props name | normal  input property name @REQUIRED
 * @props value | normal react input defaultValue
 * @props inputType : @REQUIRED shows whether you want a normal input, or a textarea
 * @props className
 * @props isRequired
 * @props rows
 * @props placeholder
 * @props defaultValue
 * @props style
 * @props onChange | @function
 * @props history  | true or false ( whether or not input field should show history of text)
 * @props readonly
 *
 */

class METextField extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleOnChange = (e) => {
    const { onChange } = this.props;
    if (!onChange) return;
    onChange(e);
  };

  ejectComponent = () => {
    const {
      type,
      defaultValue,
      value,
      placeholder,
      name,
      rows,
      inputType,
      className,
      style,
      isRequired,
      id,
      history,
      readonly,
    } = this.props;
    const defaultClasses = `form-control form-field-font-size`;
    const styles = style ? { resize: "none", ...style } : null;
    const ID = id ? { id: id } : {};
    if (inputType === "input") {
      return (
        <input
          {...ID}
          className={`${defaultClasses} only-left-border ${className}`}
          name={name}
          type={type}
          placeholder={placeholder}
          value={defaultValue || value }
          style={styles}
          required={isRequired ? isRequired : false}
          onChange={(e) => this.handleOnChange(e)}
          autoComplete={history ? "on" : "off"}
          readonly={readonly}
        />
      );
    } else if (inputType === "textarea") {
      return (
        <textarea
          {...ID}
          className={`${defaultClasses} only-bottom-border ${className}`}
          name={name}
          placeholder={placeholder}
          value={defaultValue}
          rows={rows ? rows : "10"}
          style={styles}
          required={isRequired ? isRequired : false}
          onChange={(e) => this.handleOnChange(e)}
          autoComplete={history ? "on" : "off"}
          readonly={readonly}
        />
      );
    }
    return (
      <p>
        Try setting inputType = <b>"input" OR "textarea"</b>
      </p>
    );
  };

  render() {
    return <div>{this.ejectComponent()}</div>;
  }
}
METextField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  inputType: PropTypes.string.isRequired,
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  rows: PropTypes.string,
  defaultValue: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
  id: PropTypes.string,
  history: PropTypes.bool,
  readonly: PropTypes.bool,
};

METextField.defaultProps = {
  name: getRandomIntegerInRange(100).toString(),
  inputType: "input",
  className: "",
  isRequired: false,
  rows: "5",
  defaultValue: "",
  style: {},
  // id: "me-def--d" + getRandomIntegerInRange(100).toString(),
  history: true,
  type: "text",
  placeholder: "Enter text here...",
  readonly: false,
};

export default METextField;
