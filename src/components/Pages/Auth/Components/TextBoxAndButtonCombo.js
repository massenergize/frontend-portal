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
}) {
  return (
    <div className="auth-text-btn">
      <input
        style={style || {}}
        className={`auth-textbox ${className || ""}`}
        id={id}
        placeholder={placeholder}
        onChange={() => onChange && onChange()}
        {...(genericProps || {})}
      />

      <button
        className="auth-btns touchable-opacity"
        style={{
          background: "var(--app-theme-green)",
          marginLeft: "auto",
          flex: "1",
          ...(btnStyle || {}),
        }}
      >
        {btnText}
      </button>
    </div>
  );
}

export default TextBoxAndButtonCombo;
