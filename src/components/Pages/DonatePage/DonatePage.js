import React from "react";
import PageTitle from "../../Shared/PageTitle";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import LoadingCircle from "../../Shared/LoadingCircle";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import MEButton from "../Widgets/MEButton";
import Seo from "../../Shared/Seo";
import { reduxLoadDonatePage, reduxMarkRequestAsDone } from "../../../redux/actions/pageActions";
import { bindActionCreators } from "redux";
import { PAGE_ESSENTIALS } from "../../Constants";
import { apiCall } from "../../../api/functions";
//import Tooltip from "../Widgets/CustomTooltip";

class DonatePage extends React.Component {
  fetchEssentials = () => {
    const { community, pageRequests } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain: subdomain };
    const page = (pageRequests || {})[PAGE_ESSENTIALS.DONATE.key];
    if (page?.loaded) return;
    Promise.all(
      PAGE_ESSENTIALS.DONATE.routes.map((route) => apiCall(route, payload))
    )
      .then((response) => {
        const [pageData] = response;
        this.props.loadPageData(pageData.data);
        this.props.reduxMarkRequestAsDone({
          ...pageRequests,
          [PAGE_ESSENTIALS.DONATE.key]: { loaded: true },
        });
       
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    window.gtag("set", "user_properties", { page_title: "DonatePage" });
    this.fetchEssentials();
  }

  renderVideo(videoLink) {
    if (!videoLink) return;
    return (
      <div className={videoLink ? "col-sm-12 col-md-12" : "d-none"}>
        <ReactPlayer url={videoLink} width="100%" height="400px" />
      </div>
    );
  }
  render() {
    const pageData = this.props.donatePage;
    if (pageData == null) return <LoadingCircle />;
    const title = pageData && pageData.title ? pageData.title : "Support Us!";
    const videoLink = pageData ? pageData.featured_video_link : null;
    const donation_link = pageData ? pageData.donation_link : null;
    const sub_title =
      pageData && pageData.sub_title ? pageData.sub_title : null;
    const description = pageData.description ? pageData.description : null;
    const { community } = this.props;
    return (
      <>
        {Seo({
          title: "Donate",
          description: "",
          url: `${window.location.pathname}`,
          site_name: community?.name,
        })}
        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar links={[{ name: "Donate" }]} />

          <div className="container p-5 donate-page-space-fix">
            <div className="text-center">
              <PageTitle style={{ fontSize: 24 }}>{title}</PageTitle>
              {sub_title && <p>{sub_title}</p>}
              {donation_link && (
                <center style={{ width: "100%" }}>
                  <MEButton target="_blank" href={donation_link}>
                    Donate
                  </MEButton>
                </center>
              )}
            </div>
            <br />

            <div style={{ display: "flex" }}>
              {videoLink && (
                <div style={{ flex: "1" }} className="phone-vanish">
                  {this.renderVideo(videoLink)}
                </div>
              )}
              <p
                dangerouslySetInnerHTML={{ __html: description }}
                style={{ color: "black", flex: "1", textAlign: "justify" }}
                className="rich-text-container"
              ></p>
            </div>
            <div className="pc-vanish">{this.renderVideo(videoLink)}</div>
            <br />
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
    community: store.page.community,
    pageRequests: store.page.pageRequests,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ loadPageData: reduxLoadDonatePage, reduxMarkRequestAsDone }, dispatch);
};
export default connect(mapStoreToProps, mapDispatchToProps)(DonatePage);
