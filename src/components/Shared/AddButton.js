import React from 'react'
import CustomTooltip from '../Pages/Widgets/CustomTooltip';

export default function AddButton({onClick, text, type, community, style, className}) {
  return (
    <CustomTooltip
      text={`Use this button to submit a new ${
        type?.toLowerCase() || ""
      } for ${community}. It will be reviewed by the community admin before it can be published.`}
    >
      <div
        className={`round-sticky-btn-container ${className}`}
        onClick={() => onClick && onClick()}
        style={style}
      >
        <div className="round-sticky-btn touchable-opacity">
          <i className="fa fa-plus" />
          <span style={{ marginLeft: 5, marginBottom: 2 }}>
            {text || type || "New"}
          </span>
        </div>
      </div>
    </CustomTooltip>
  );
}
