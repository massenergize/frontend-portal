import React from "react";

function TextBoxAndButtonCombo({
  onChange,
  id = "default",
  placeholder = "Enter text here...",
  genericProps,
  style,
  btnStyle,
  btnText = "Continue",
  className,
  onClick,
  loading,
  value,
  name,
  type,
  loadingText,
  disabled,
}) {
  return (
    <div className="auth-text-btn">
      <input
        style={style || {}}
        className={`auth-textbox ${className || ""}`}
        id={id}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e)}
        value={value || ""}
        name={name}
        type={type || "text"}
        {...(genericProps || {})}
      />

      <button
        className="auth-btns touchable-opacity combo-btn-tweak"
        style={{
          background: "var(--app-theme-green)",
          marginLeft: "auto",
          flex: "1",
          ...(btnStyle || {}),
        }}
        onClick={() => onClick && onClick()}
        disabled={disabled}
      >
        {loading && (
          <i className="fa fa-spinner fa-spin" style={{ marginRight: 5 }} />
        )}
        {loading ? loadingText || btnText : btnText}
      </button>
    </div>
  );
}

export default TextBoxAndButtonCombo;
