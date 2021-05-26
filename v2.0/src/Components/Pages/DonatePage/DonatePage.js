import React from "react";
import PageTitle from "../../Shared/PageTitle";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import LoadingCircle from "../../Shared/LoadingCircle";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
//import Tooltip from "../Widgets/CustomTooltip";

class DonatePage extends React.Component {
  render() {
    const pageData = this.props.donatePage;
    if (pageData == null) return <LoadingCircle />;
    const title = pageData && pageData.title ? pageData.title : "Support Us!";
    const videoLink = pageData ? pageData.featured_video_link : null;
    const donation_link = pageData ? pageData.donation_link : null;
    //const sub_title = pageData && pageData.sub_title ? pageData.sub_title : null
    const description = pageData.description ? pageData.description : null;
    //const button = section(pageSections, "DonatePageButton", true);

    // TODO: customize donation button and text
    // make video image smaller, wrapped by description
    // page separator
    // Standard MassEnergize donation text

    const donation_link_text = "Make a donation to the community group";
    return (
      <>
        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar links={[{ name: "Donate" }]} />

          <div className="container p-5">
            <div className="text-center">
              <PageTitle style={{ fontSize: 24 }}>{title}</PageTitle>
            </div>

            <center>{description ? <p>{description}</p> : null}</center>

            {videoLink ? (
              <div className={videoLink ? "col-sm-12 col-md-12" : "d-none"}>
                {/* <Video link={videoLink} /> */}
                <ReactPlayer url={videoLink} width="100%" height="550px" />
              </div>
            ) : null}

            <br />
            {donation_link ? (
              <div className="row text-center justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                  <div target="_top">
                    <a
                      rel="noopener noreferrer"
                      href={donation_link}
                      target="_blank"
                    >
                      <input
                        type="image"
                        className="w-100"
                        src="https://i.imgur.com/CwBgXO2.png"
                        border="0"
                        name="submit"
                        title={donation_link_text}
                        alt={donation_link_text}
                      />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row text-center justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                  <div target="_top">
                    <a
                      rel="noopener noreferrer"
                      href="https://paypal.me/massenergize?locale.x=en_US"
                      target="_blank"
                    >
                      <input
                        type="image"
                        className="w-100"
                        src="https://i.imgur.com/CwBgXO2.png"
                        border="0"
                        name="submit"
                        title="PayPal - The safer, easier way to pay online!"
                        alt="Donate with PayPal button"
                      />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    homePageData: store.page.homePageData,
    donatePage: store.page.donatePage,
  };
};
export default connect(mapStoreToProps, null)(DonatePage);
