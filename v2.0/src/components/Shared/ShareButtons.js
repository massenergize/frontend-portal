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
      {/**https://stackoverflow.com/questions/10713542/how-to-make-a-custom-linkedin-share-button/61583006#61583006 
       * only providing URL for LinkedIn; other info is taken from Helmet meta tags
      */}
      <LinkedinShareButton url={url}>
        <LinkedinIcon size={50} round />
      </LinkedinShareButton>
      <EmailShareButton url={url} subject={pageTitle} body={pageDescription}>
        <EmailIcon size={50} round />
      </EmailShareButton>
    </div>
  </>


}

export default ShareButtons;