import React, { useState } from "react";
import fallbackImage from "../../assets/images/fb.svg";
function SmartImage({
  src = "...",
  alt = "Image",
  customFallbackSrc,
  style,
  disableIfError,
  ...props
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div style={{ position: "relative", width: "auto", height: "auto" }}>
      {loading && !error && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 25,
            color: "grey",
            margin: 10,
          }}
        >
          <i className="fa fa-spinner fa-spin" />
        </div>
      )}

      {disableIfError && error ? (
        <></>
      ) : (
        <img
          src={error ? customFallbackSrc || fallbackImage : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: loading ? "none" : "block",
            ...(style || {}),
          }}
          {...props}
        />
      )}
    </div>
  );
}

export default SmartImage;
