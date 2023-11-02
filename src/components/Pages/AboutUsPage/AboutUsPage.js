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
import Seo from "../../Shared/Seo";

class AboutUsPage extends React.Component {
  componentDidMount() {
    window.gtag('set', 'user_properties', {page_title: "AboutUsPage"});
  }

  renderImage(image) {
    if (!image) return;
    const { url } = image || {};
    return (
      url && (
        <img
        className="about-us-img"
          alt="about-us media"
          src={url}
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
    const image = pageData.image
      ? pageData.image
      : pageData.images
      ? pageData.images[0]
      : null;
    const paragraphContent = pageData.description;

    const donatePageData = this.props.donatePageData;
    const donateEnabled =
      donatePageData && donatePageData.is_published
        ? donatePageData.is_published
        : null;
    const donateMessage =
      donatePageData && donatePageData.title ? donatePageData.title : null;

      const {community} = this.props;

    return (
      <div className="boxed_wrapper">
        {Seo({
          title: "About Us",
          description: "",
          url: `${window.location.pathname}`,
          site_name: community?.name,
        })}
        <BreadCrumbBar links={[{ name: "About Us" }]} />
        <div className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12">
          <div style={{ marginTop: 70 }}></div>
          <div
            className={
              paragraphContent ? "col-sm-12 col-md-10 offset-md-1" : "d-none"
            }
          >
            <center>
              <h2 className="cool-font solid-font" style={{ padding: 10 }}>
                {title}
              </h2>
            </center>
            {subtitle ? (
              <div>
                <center>
                  <h4 className="cool-font " style={{ padding: 10 }}>
                    {subtitle}
                  </h4>
                </center>
              </div>
            ) : null}
            <center>{image && this.renderImage(image)}</center>
            <div
              className="community-about-text cool-font make-me-dark rich-text-container"
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

          {/* removed About MassEnergize section */}
        </div>

        {donateEnabled ? (
          <div>
            <DonateBar donateMessage={donateMessage} />
          </div>
        ) : null}
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
