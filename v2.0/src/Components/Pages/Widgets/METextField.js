import React, { Component } from "react";
import PropTypes from "prop-types";

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
 * 
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
      placeholder,
      name,
      rows,
      inputType,
      className,
      style,
      isRequired,
      id,
      history,
    } = this.props;
    const defaultClasses = `form-control form-field-font-size`;
    const styles = style ? { resize: "none", ...style } : null;
    if (inputType === "input") {
      return (
        <input
          id={id}
          className={`${defaultClasses} only-left-border ${className}`}
          name={name}
          type={type ? type : "text"}
          placeholder={placeholder}
          value={defaultValue}
          style={styles}
          required={isRequired ? isRequired : false}
          onChange={(e) => this.handleOnChange(e)}
          autoComplete={history ? "on" : "off"}
        />
      );
    } else if (inputType === "textarea") {
      return (
        <textarea
          id={id}
          className={`${defaultClasses} only-bottom-border ${className}`}
          name={name}
          placeholder={placeholder}
          value={defaultValue}
          rows={rows ? rows : "10"}
          style={styles}
          required={isRequired ? isRequired : false}
          onChange={(e) => this.handleOnChange(e)}
          autoComplete={history ? "on" : "off"}
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
  value: PropTypes.string,
  isRequired: PropTypes.bool,
  rows: PropTypes.string,
  defaultValue: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
  id: PropTypes.string,
  history: PropTypes.bool,
};

export default METextField;
