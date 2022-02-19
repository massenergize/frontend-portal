import React from "react";
import {
  EmailShareButton,
  TwitterShareButton,
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from "react-share";

function ShareButtons({ label, url, pageTitle, pageDescription, include }) {
  const text = `${pageTitle || ""}${(pageDescription && ":") || ""} ${
    pageDescription || ""
  }`;
  const FacebookSharing = (
    <FacebookShareButton
      className="me-social z-depth-1"
      url={url}
      quote={text}
      hashtag="#MassEnergize"
    >
      <FacebookIcon size={50} round />
    </FacebookShareButton>
  );

  const TwitterSharing = (
    <TwitterShareButton
      className="me-social z-depth-1"
      url={url}
      title={text}
      hashtags={["MassEnergize", "Sustainability", "CleanEnergy"]}
    >
      <TwitterIcon size={50} round />
    </TwitterShareButton>
  );

  const EmailSharing = (
    <EmailShareButton
      className="me-social z-depth-1"
      url={url}
      subject={pageTitle}
      body={pageDescription}
      openShareDialogOnClick
      onClick={(e) => e.preventDefault()}
    >
      <EmailIcon size={50} round />
    </EmailShareButton>
  );

  const SharingButtons = {
    facebook: FacebookSharing,
    twitter: TwitterSharing,
    email: EmailSharing,
  };

  const cherryPick = () => {
    if (!include?.length) return;
    return include?.map((key) => (
      <React.Fragment key={key}> {SharingButtons[key]}</React.Fragment>
    ));
  };
  return (
    <>
      {label && <h5 style={{ textAlign: "center" }}>{label}</h5>}

      <div className="row justify-content-center">
        {cherryPick() ||
          Object.keys(SharingButtons).map((key) => (
            <React.Fragment key={key}> {SharingButtons[key]}</React.Fragment>
          ))}
      </div>
    </>
  );
}

export default ShareButtons;
