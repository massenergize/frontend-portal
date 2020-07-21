import React from 'react'
import {
  EmailShareButton,
  TwitterShareButton,
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon
} from 'react-share';

function ShareButtons(props) {

  const { label, url, pageTitle, pageDescription } = props;

  const text = `${pageTitle}: ${pageDescription}`;

  return <>
    {label && <h5 style={{ textAlign: 'center' }}>{label}</h5>}

    <div className="row justify-content-center">
      <FacebookShareButton url={url} quote={text} hashtag="#MassEnergize">
        <FacebookIcon size={50} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={text} hashtags={["MassEnergize", "Sustainability", "CleanEnergy"]}>
        <TwitterIcon size={50} round />
      </TwitterShareButton>
      <EmailShareButton url={url} subject={pageTitle} body={pageDescription}>
        <EmailIcon size={50} round />
      </EmailShareButton>
    </div>
  </>
}

export default ShareButtons;