import React from "react";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import PageTitle from "../../Shared/PageTitle";
import ErrorPage from "./../Errors/ErrorPage";
import notFound from "./green-mat.jpg";
import LoadingCircle from "../../Shared/LoadingCircle";
import MECard from "../Widgets/MECard";
import error_png from "./../../Pages/Errors/oops.png";
import { Link } from "react-router-dom";
import {
  applyTagsAndGetContent,
  filterTagCollections,
  searchIsActiveFindContent,
} from "../../Utils";
import { NONE } from "../Widgets/MELightDropDown";
import HorizontalFilterBox from "../EventsPage/HorizontalFilterBox";
import Tooltip from "../Widgets/CustomTooltip";
// import Funnel from "../EventsPage/Funnel";
// import METextView from "../Widgets/METextView";
import MEAnimation from "../../Shared/Classes/MEAnimation";
class ServicesPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      checked_values: null,
      mirror_services: [],
    };
    this.addMeToSelected = this.addMeToSelected.bind(this);
  }
  addMeToSelected(param, reset = false) {
    if (reset) return this.setState({ checked_values: null });
    var arr = this.state.checked_values ? this.state.checked_values : [];
    // remove previously selected tag of selected category and put the new one
    arr = arr.filter((item) => item.collectionName !== param.collectionName);
    if (!param || param.value !== NONE) arr.push(param);
    this.setState({ checked_values: arr });
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({ searchText: e.target.value });
  }
  searchIsActiveSoFindContentThatMatch() {
    return searchIsActiveFindContent(
      this.props.serviceProviders,
      this.state.checked_values,
      this.state.searchText,
      (service, word) =>
        service.name.toLowerCase().includes(word) ||
        service.description.toLowerCase().includes(word)
    );
  }

  render() {
    var { serviceProviders, pageData } = this.props;
    if (!serviceProviders) {
      return <LoadingCircle />;
    }

    if (!this.props.homePageData) {
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Service Provider data"
        />
      );
    }

    if (serviceProviders.length === 0) {
      return (
        <div
          className="text-center"
          style={{
            width: "100%",
            minHeight: window.screen.height - 200,
            paddingTop: "10vh",
          }}
        >
          <img
            src={error_png}
            style={{ height: 70, width: 70 }}
            alt="error emoji png "
          />
          <p style={{ marginTop: 10, textAlign: "center" }}>
            {" "}
            Looks like your community hasn't partnered with any service
            providers yet.
            <br /> Try again later
          </p>
        </div>
      );
    }

    const title =
      pageData && pageData.title ? pageData.title : "Service Providers";
    const sub_title =
      pageData && pageData.sub_title
        ? pageData.sub_title
        : "Click to view each provider's services";
    const description =
      pageData && pageData.description ? pageData.description : null;

    var vendors =
      this.searchIsActiveSoFindContentThatMatch() ||
      applyTagsAndGetContent(serviceProviders, this.state.checked_values);

    return (
      <>
        <div
          className="boxed_wrapper"
          style={{
            minHeight: window.screen.height - 200,
          }}
        >
          <BreadCrumbBar links={[{ name: "Service Providers" }]} />
          <div className="container override-container-width">
            <div className="row">
              <div className="col-md-10 col-lg-10 col-sm-12 offset-md-1 ">
                <div style={{ marginBottom: 30 }}>
                  <div className="text-center">
                    {description ? (
                      <Tooltip
                        text={description}
                        paperStyle={{ maxWidth: "100vh" }}
                      >
                        <PageTitle style={{ fontSize: 24 }}>
                          {title}
                          <span
                            className="fa fa-info-circle"
                            style={{ color: "#428a36", padding: "5px" }}
                          ></span>
                        </PageTitle>
                      </Tooltip>
                    ) : (
                      <PageTitle style={{ fontSize: 24 }}>{title}</PageTitle>
                    )}
                  </div>
                  <center>{sub_title ? <p>{sub_title}</p> : null}</center>
                </div>
                <div>
                  <HorizontalFilterBox
                    type="action"
                    tagCols={this.props.tagCols}
                    boxClick={this.addMeToSelected}
                    search={this.handleSearch}
                  />
                </div>

                <div
                  className="row pt-3 pb-3 phone-marg-top-90"
                  // style={{ maxHeight: 700, overflowY: "scroll" }}
                  style={{ position: "relative" }}
                >
                  {this.renderVendors(vendors)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  renderVendors(vendors) {
    if (this.state.mirror_services.length === 0) {
      vendors =
        this.state.check_values === null
          ? this.props.serviceProviders
          : vendors;
    }
    if (!vendors || vendors.length === 0) {
      return (
        <div className="boxed_wrapper">
          <h2
            className="text-center"
            style={{
              color: "#9e9e9e",
              margin: "190px 150px",
              padding: "30px",
              border: "solid 2px #fdf9f9",
              borderRadius: 10,
            }}
          >
            {" "}
            Looks like your community hasn't partnered with any vendors yet. Try
            again later :({" "}
          </h2>
        </div>
      );
    }

    return vendors.map((vendor, index) => {
      return (
        <div className={`col-12 col-md-4 col-lg-4`} key={index.toString()}>
          <MECard
            className={`vendor-hover  ${MEAnimation.getAnimationClass()}`}
            style={{ borderRadius: 10, position: "relative" }}
          >
            {/* <div className="card  spacing " style={{ borderTopRightRadius: 12, borderTopLeftRadius: 12 }}> */}
            <div
              className="card-body pref-height "
              style={{
                padding: 0,
                borderTopRightRadius: 12,
                borderTopLeftRadius: 12,
              }}
            >
              <div className="col-12 text-center" style={{ padding: 0 }}>
                <Link to={`${this.props.links.services}/${vendor.id}`}>
                  <img
                    className="w-100 service-prov-img"
                    src={vendor.logo ? vendor.logo.url : notFound}
                    alt={vendor.name}
                  />
                </Link>
                <Link to={`${this.props.links.services}/${vendor.id}`}>
                  <h4
                    className="pt-3"
                    style={{
                      fontSize: "clamp(14px, 16px, 21px)",
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    {vendor.name}
                  </h4>
                </Link>
              </div>
            </div>
            {/* </div> */}
          </MECard>
        </div>
      );
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    homePageData: store.page.homePage,
    pageData: store.page.serviceProvidersPage,
    serviceProviders: store.page.serviceProviders,
    links: store.links,
    tagCols: filterTagCollections(
      store.page.serviceProviders,
      store.page.tagCols
    ),
  };
};
export default connect(mapStoreToProps, null)(ServicesPage);
