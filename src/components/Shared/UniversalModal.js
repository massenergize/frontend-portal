import React from "react";
import MEModal from "../Pages/Widgets/MEModal";

function UniversalModal(props) {
  const { component } = props;
  return (
    <MEModal {...props} v2>
      {component}
    </MEModal>
  );
}

export default UniversalModal;
