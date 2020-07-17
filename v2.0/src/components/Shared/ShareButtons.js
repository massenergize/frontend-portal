import React from 'react'
import {
  EmailShareButton,
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon
} from 'react-share';

function ShareButtons(props) {

  const { label, url, pageTitle, pageDescription } = props;

  return <>
    {label && <h5 style={{ textAlign: 'center' }}>{label}</h5>}

    <div className="row justify-content-center">
      <FacebookShareButton url={url} quote={pageDescription} hashtag="#MassEnergize">
        <FacebookIcon size={50} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={pageTitle} hashtags={["MassEnergize", "Sustainability", "CleanEnergy"]}>
        <TwitterIcon size={50} round />
      </TwitterShareButton>
      {/**TODO: fix the weird error here */}
      <LinkedinShareButton url={url} title={pageTitle} summary={pageDescription} source="MassEnergize">
        <LinkedinIcon size={50} round />
      </LinkedinShareButton>
      <EmailShareButton url={url} subject={pageTitle} body={pageDescription}>
        <EmailIcon size={50} round />
      </EmailShareButton>
    </div>
  </>


}

export default ShareButtons;