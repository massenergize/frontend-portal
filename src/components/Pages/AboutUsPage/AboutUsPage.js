import React from "react";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
//import Video from './Video'
import ReactPlayer from "react-player";
import ErrorPage from "./../Errors/ErrorPage";
import DonateBar from "./DonateBar";
import { connect } from "react-redux";
import { reduxLoadCommunityAdmins } from "../../../redux/actions/pageActions";
// Carousel from npm react-multi-carousel
import "react-multi-carousel/lib/styles.css";
import LoadingCircle from "../../Shared/LoadingCircle";

class AboutUsPage extends React.Component {
  renderImage(image) {
    if (!image) return;
    const { url } = image || {};
    return (
      url && (
        <img
          alt="about-us media"
          src={url}
          style={{
            width: "100%",
            minHeight: 300,
            objectFit: "contain",
            margin: 10,
          }}
        />
      )
    );
  }
  render() {
    if (!this.props.pageData || !this.props.community) {
      return <LoadingCircle />;
    } else if (this.props.pageData === {} || this.props.community === {}) {
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load About Us data"
        />
      );
    }

    const pageData = this.props.pageData;
    const title = pageData.title ? pageData.title : "About Our Community";
    const subtitle = pageData.sub_title ? pageData.sub_title : null;
    const videoLink = pageData.featured_video_link
      ? pageData.featured_video_link
      : null;
    const image = pageData.image ? pageData.image : (pageData.images ? pageData.images[0] : null);
    const paragraphContent = pageData.description;

    const donatePageData = this.props.donatePageData;
    const donateEnabled = donatePageData && donatePageData.is_published ? donatePageData.is_published : null;
    const donateMessage = donatePageData && donatePageData.title ? donatePageData.title : null;
    
    return (
      <div className="boxed_wrapper">
        <BreadCrumbBar links={[{ name: "About Us" }]} />
        <div className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12">
          <div style={{ marginTop: 70 }}></div>
          <div
            className={
              paragraphContent ? "col-sm-12 col-md-10 offset-md-1" : "d-none"
            }
          >
            <center>
              <h2 className="cool-font" style={{ padding: 10 }}>
                {title}
              </h2>
            </center>
            {subtitle ? 
            <div>
              <center>
                <h4 className="cool-font" style={{ padding: 10 }}>
                  {subtitle}
                </h4>
              </center>
            </div> : null
            }   
            <center>
              {image && this.renderImage(image)}
            </center>
            <div
              className="community-about-text cool-font make-me-dark"
              style={{ fontSize: "large", textAlign: "justify" }}
              dangerouslySetInnerHTML={{ __html: paragraphContent }}
            ></div>
          </div>

          {videoLink ? (
            <div
              className={
                videoLink ? "col-sm-12 col-md-10 offset-md-1" : "d-none"
              }
            >
              <center>
                {/* <Video link={videoLink} /> */}
                <ReactPlayer url={videoLink} />
              </center>
            </div>
          ) : null}

          <div className=" col-sm-12 col-md-10 offset-md-1 mass-energize-about">
            <center>
              <h2 className="cool-font" style={{ padding: 10 }}>
                About MassEnergize
              </h2>
            </center>
            <p
              className="cool-font make-me-dark"
              style={{ textAlign: "justify" }}
            >
              Our mission is to provide communities with the tools and resources
              to motivate and support their residents, businesses and
              non-profits in a wide array of actions to reduce greenhouse gas
              emissions and prepare for a changing climate. We leverage the
              collective expertise, experience and buying power of multiple
              towns, cities and local organizations by collaborating with them
              on tools, strategies, and resources. This community web platform
              is one example of our work. For more information go to{" "}
              <a
                href="https://www.massenergize.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.massenergize.org
              </a>
              .
            </p>
          </div>
        </div>

        {donateEnabled ? (
          <div>
            <DonateBar donateMessage={donateMessage} />
          </div>  
        ) : null }
      </div>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    community: store.page.community,
    communityAdmins: store.page.communityAdmins,
    pageData: store.page.aboutUsPage,
    donatePageData: store.page.donatePage,
    homePageData: store.page.homePageData,
    links: store.links,
  };
};

export default connect(mapStoreToProps, { reduxLoadCommunityAdmins })(
  AboutUsPage
);
