import React from "react";
//@TODO: Use this component to replace all the other places that have footer with buttons (red & green ones)
function MELightFooter({
  children,
  onCancel,
  onConfirm,
  loading,
  cancelText = "CANCEL",
  okText = "OK",
  disabled = false,
}) {
  return (
    <div className="me-light-footer">
      {children}
      <div style={{ marginLeft: "auto" }}>
        <button
          disabled={disabled}
          onClick={onConfirm}
          className="flat-btn  flat-btn_submit btn-success "
        >
          {loading && (
            <i style={{ marginRight: 5 }} className="fa fa-spinner fa-spin"></i>
          )}
          {okText}
        </button>
        <button onClick={onCancel} className="flat-btn close-flat">
          {cancelText}
        </button>
      </div>
    </div>
  );
}

export default MELightFooter;
