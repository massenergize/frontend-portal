import React from "react";
import CustomTooltip from "../Pages/Widgets/CustomTooltip";
import SmartImage from "./SmartImage";

function MEImage(props) {
  const { image } = props;
  const { info } = image || {};
  const { copyright_att } = info || {};
  // eslint-disable-next-line  jsx-a11y/alt-text
  const renderImage = () => <SmartImage {...props} />;
  if (copyright_att)
    return (
      <>
        <CustomTooltip text={`Image rights belong to ${copyright_att}`}>
          {renderImage()}
        </CustomTooltip>
      </>
    );

  return renderImage();
}

export default MEImage;
