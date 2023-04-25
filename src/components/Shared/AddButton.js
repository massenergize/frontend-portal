import React from 'react'
import CustomTooltip from '../Pages/Widgets/CustomTooltip';

export default function AddButton({onClick, text, type, community}) {
  return (
    <CustomTooltip
      text={`Use this button to submit a new ${
        type?.toLowerCase() || ""
      } for ${community}. It will be reviewed by the community admin before it can be added.`}
    >
      <div
        className="round-sticky-btn-container"
        onClick={() => onClick && onClick()}
      >
        <div className="round-sticky-btn touchable-opacity">
          <i className="fa fa-plus" />
        </div>
      </div>
    </CustomTooltip>
  );
}