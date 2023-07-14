import React from 'react'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'

export default function METooltip({ children, text }) {
  return (
    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{text}</Tooltip>}>
        {children}
    </OverlayTrigger>
  );
}
