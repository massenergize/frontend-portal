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
  collectSearchTextValueFromURL,
  filterTagCollections,
  makeStringFromArrOfObjects,
  processFiltersAndUpdateURL,
  recreateFiltersForState,
  searchIsActiveFindContent,
  fetchCopyrightData,
} from "../../Utils";
import { NONE } from "../Widgets/MELightDropDown";
import HorizontalFilterBox from "../EventsPage/HorizontalFilterBox";
import Tooltip from "../Widgets/CustomTooltip";
// import Funnel from "../EventsPage/Funnel";
// import METextView from "../Widgets/METextView";
import MEAnimation from "../../Shared/Classes/MEAnimation";
import {
  reduxLoadServiceProviders,
  reduxLoadServiceProvidersPage,
  reduxLoadTagCols,
  reduxMarkRequestAsDone,
  reduxToggleGuestAuthDialog,
  reduxToggleUniversalModal,
} from "../../../redux/actions/pageActions";
import StoryForm from "../ActionsPage/StoryForm";
import { PAGE_ESSENTIALS, VENDOR } from "../../Constants";
// import MEButton from "../Widgets/MEButton";
import StoryFormButtonModal from "../StoriesPage/StoryFormButtonModal";
import AddButton from "../../Shared/AddButton";
import Feature from "../FeatureFlags/Feature";
import { FLAGS } from "../FeatureFlags/flags";
import Seo from "../../Shared/Seo";
import METooltip from "../../Shared/METooltip";
import RibbonBanner from "../../Shared/RibbonBanner";
import { apiCall } from "../../../api/functions";
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

  fetchEssentials = () => {
    const { community, pageRequests } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain: subdomain };
    const page = (pageRequests || {})[PAGE_ESSENTIALS.VENDORS.key];
    if (page?.loaded) return;
    Promise.all(
      PAGE_ESSENTIALS.VENDORS.routes.map((route) => apiCall(route, payload))
    )
      .then((response) => {
        const [pageData, tagCols, vendors] = response;
        this.props.loadVendorsPage(pageData.data);
        this.props.loadTagCollections(tagCols.data);
        this.props.updateVendorsInRedux(vendors.data);
        this.props.reduxMarkRequestAsDone({
          ...pageRequests,
          [PAGE_ESSENTIALS.VENDORS.key]: { loaded: true },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    this.fetchEssentials();
  }

  addMeToSelected(param, reset = false) {
    processFiltersAndUpdateURL(param, this.props);
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
  onSearchTextChange(text) {
    this.setState({ searchText: text || "" });
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

  static getDerivedStateFromProps = (props, state) => {
    if (!state.mounted) {
      const oneCollection = props?.tagCols && props.tagCols[0];
      if (oneCollection?.id)
        return {
          checked_values: recreateFiltersForState(
            props.tagCols,
            props.location
          ),
          mounted: true,
          searchText: collectSearchTextValueFromURL(props.location),
        };
    }

    return null;
  };
  triggerGuestDialog(e) {
    e && e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.signInWithAuthenticationDialog(true);
  }

  renderAddForm = () => {
    const { user, serviceProviders, updateVendorsInRedux, communityData } =
      this.props;
    let _props = {};
    if (!user) {
      _props = {
        ..._props,
        overrideOpen: () =>
          this.triggerGuestDialog && this.triggerGuestDialog(),
      };
    }

    return (
      <StoryFormButtonModal
        ModalType={VENDOR}
        reduxProps={{
          reduxItems: serviceProviders,
          updateItemInRedux: updateVendorsInRedux,
        }}
        {..._props}
      >
        <AddButton type={VENDOR} community={communityData?.community?.name} />
      </StoryFormButtonModal>
    );
  };
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
          className="text-center test-no-of-vendors-div"
          style={{
            width: "100%",
            minHeight: window.screen.height - 200,
            paddingTop: "10vh",
          }}
          data-number-of-vendors={serviceProviders?.length}
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
      pageData && pageData.description ? pageData.description : "";

    var vendors =
      this.searchIsActiveSoFindContentThatMatch() ||
      applyTagsAndGetContent(serviceProviders, this.state.checked_values);

    return (
      <>
        {Seo({
          title: "Service Providers",
          description: "",
          url: `${window.location.pathname}`,
          site_name: this.props?.community?.name,
        })}
        <div
          className="boxed_wrapper"
          style={{
            minHeight: window.screen.height - 200,
          }}
        >
          <BreadCrumbBar links={[{ name: "Service Providers" }]} />
          <div
            className="container override-container-width test-no-of-vendors-div"
            data-number-of-vendors={serviceProviders?.length}
          >
            <div className="row">
              <div className="col-md-10 col-lg-10 col-sm-12 offset-md-1 ">
                <div className="all-head-area position-btn-and-title">
                  <div className="text-center page-title-container">
                    {description ? (
                      <PageTitle style={{ fontSize: 24 }}>
                        {title}
                        <Tooltip text={description}>
                          <span
                            className="fa fa-info-circle"
                            style={{ color: "#428a36", padding: "5px" }}
                          ></span>
                        </Tooltip>
                      </PageTitle>
                    ) : (
                      <PageTitle style={{ fontSize: 24 }}>{title}</PageTitle>
                    )}
                    <center>{sub_title ? <p>{sub_title}</p> : null}</center>
                  </div>
                  <div className="phone-vanish submitted-content-btn-wrapper">
                    <Feature
                      name={FLAGS.USER_SUBMITTED_VENDORS}
                      children={this.renderAddForm()}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 90 }}>
                  <HorizontalFilterBox
                    type={VENDOR}
                    tagCols={this.props.tagCols}
                    boxClick={this.addMeToSelected}
                    search={this.handleSearch}
                    searchText={this.state.searchText}
                    filtersFromURL={this.state.checked_values}
                    doneProcessingURLFilter={this.state.mounted}
                    onSearchTextChange={this.onSearchTextChange.bind(this)}
                    updateItemInRedux={this.props.updateVendorsInRedux}
                    reduxItems={this.props.serviceProviders}
                    customStyles={{ width: "100%" }}
                    renderAddButton={() => (
                      <Feature
                        name={FLAGS.USER_SUBMITTED_VENDORS}
                        children={this.renderAddForm()}
                      />
                    )}
                  />
                </div>

                <div
                  className="row pt-3 pb-3 phone-marg-top-90 "
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

  onEditButtonClicked = (vendor) => {
    let newVendor = {
      ...vendor,
      image: vendor?.logo,
      key_contact_email: vendor?.key_contact?.email,
      key_contact_name: vendor?.key_contact?.name,
      ...fetchCopyrightData(vendor?.logo?.info),
    };
    this.props.toggleModal({
      show: true,
      title: "Edit Vendor Form",
      size: "md",
      component: (
        <StoryForm
          ModalType={VENDOR}
          close={() => this.props.toggleModal({ show: false })}
          draftData={newVendor}
          TriggerSuccessNotification={(bool) => ({})}
          updateItemInRedux={this.props.updateVendorsInRedux}
          reduxItems={this.props.serviceProviders}
        />
      ),
    });
  };

  renderVendors(vendors) {
    if (this.state.mirror_services.length === 0) {
      vendors =
        this.state.check_values === null
          ? this.props.serviceProviders
          : vendors;
    }
    const tooltipText =
      "You alone are seeing this service provider that you submitted. You can edit it until a Community admin approves it. To edit, click on the card";
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

    let sorted_vendors = vendors.sort((a, b) =>
      a.is_published === b.is_published ? 0 : a.is_published ? 1 : -1
    );

    return sorted_vendors.map((vendor, index) => {
      return (
        <div
          data-tag-names={makeStringFromArrOfObjects(
            vendor?.tags,
            (v) => v.name
          )}
          className={`col-12 col-md-4 col-lg-4 test-vendor-card`}
          key={index.toString()}
        >
          <MECard
            className={`vendor-hover  ${MEAnimation.getAnimationClass()}`}
            style={{
              borderRadius: 10,
              position: "relative",
              paddingBottom: 40,
            }}
          >
            {!vendor?.is_published && <RibbonBanner />}
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
                  {vendor?.is_published ? (
                    <img
                      className="w-100 service-prov-img"
                      src={vendor.logo ? vendor.logo.url : notFound}
                      alt={vendor.name}
                    />
                  ) : (
                    <METooltip text={tooltipText}>
                      <img
                        className="w-100 service-prov-img"
                        src={vendor.logo ? vendor.logo.url : notFound}
                        alt={vendor.name}
                      />
                    </METooltip>
                  )}
                </Link>
                <Link to={`${this.props.links.services}/${vendor.id}`}>
                  <h4
                    className="pt-3 test-vendor-name"
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
    user: store.user.info,
    serviceProviders: store.page.serviceProviders,
    communityData: store.page.communityData,
    links: store.links,
    community: store.page.community,
    tagCols: filterTagCollections(
      store.page.serviceProviders,
      store.page.tagCols
    ),
    pageRequests: store.page.pageRequests,
    
  };
};
const mapDispatchToProps = {
  toggleModal: reduxToggleUniversalModal,
  updateVendorsInRedux: reduxLoadServiceProviders,
  loadVendorsPage: reduxLoadServiceProvidersPage,
  loadTagCollections: reduxLoadTagCols,
  signInWithAuthenticationDialog: () => reduxToggleGuestAuthDialog(true),
  reduxMarkRequestAsDone
};
export default connect(mapStoreToProps, mapDispatchToProps)(ServicesPage);
