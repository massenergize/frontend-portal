import React from "react";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ErrorPage from "./../Errors/ErrorPage";
import notFound from "./green-mat.jpg";
import Funnel from "../EventsPage/Funnel";
import LoadingCircle from "../../Shared/LoadingCircle";
import MECard from "../Widgets/MECard";
import error_png from "./../../Pages/Errors/oops.png";
// import METextView from "../Widgets/METextView";
import { Link } from "react-router-dom";

class ServicesPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      check_values: null,
      mirror_services: [],
    };
  }
  addMeToSelected(tagID) {
    tagID = Number(tagID);
    const arr = this.state.check_values ? this.state.check_values : [];
    if (arr.includes(tagID)) {
      var filtered = arr.filter((item) => item !== tagID);
      this.setState({ check_values: filtered.length === 0 ? null : filtered });
    } else {
      this.setState({ check_values: [tagID, ...arr] });
    }
  }
  handleBoxClick(id) {
    // var id = event.target.value;
    this.addMeToSelected(id);
  }
  handleSearch = (event) => {
    const value = event.target.value;
    const services = this.props.serviceProviders;
    const common = [];
    if (value.trim() !== "") {
      for (let i = 0; i < services.length; i++) {
        const ev = services[i];
        if (ev.name.toLowerCase().includes(value.toLowerCase())) {
          common.push(ev);
        }
      }
      this.setState({ mirror_services: [...common] });
    } else {
      this.setState({ mirror_services: [] });
    }
  };
  findCommon() {
    const services = this.props.serviceProviders;
    const values = this.state.check_values ? this.state.check_values : [];
    const common = [];
    if (services) {
      for (let i = 0; i < services.length; i++) {
        const ev = services[i];
        if (ev.tags) {
          for (let i = 0; i < ev.tags.length; i++) {
            const tag = ev.tags[i];
            //only push events if they arent there already
            if (values.includes(tag.id) && !common.includes(ev)) {
              common.push(ev);
            }
          }
        }
      }
    }
    return common;
  }
  render() {
    var { serviceProviders } = this.props;

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
            height: window.screen.height - 200,
            paddingTop: "10vh",
          }}
        >
          <img src={error_png} style={{ height: 70, width: 70 }} alt ="error emoji png "/>
          <p style={{ marginTop: 10, textAlign: "center" }}>
            {" "}
            Looks like your community hasn't partnered with any service
            providers yet.
            <br /> Try again later
          </p>
        </div>
      );
    }
    var vendors =
      this.state.mirror_services.length > 0
        ? this.state.mirror_services
        : this.findCommon();

    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Service Providers" }]} />
          <div className="container override-container-width">
            <div className="row">
              <div className="phone-vanish col-md-3 mob-vendor-white-cleaner">
                <div
                  className=" z-depth-float me-anime-open-in"
                  style={{
                    marginTop: 90,
                    padding: "45px 13px",
                    borderRadius: 15,
                  }}
                >
                  <h4>Filter by...</h4>
                  <Funnel
                    type="service"
                    boxClick={this.handleBoxClick}
                    search={this.handleSearch}
                    foundNumber={this.state.mirror_services.length}
                  />
                </div>
              </div>
              <div className="col-md-9 col-lg-9 col-sm-12 ">
                <div>
                  <h3 className="text-center">Service Providers</h3>
                  <h5 className="text-center" style={{ color: "darkgray" }}>
                    Click to view each provider's services
                  </h5>
                </div>

                <div
                  className="row pt-3 pb-3"
                  style={{ maxHeight: 700, overflowY: "scroll" }}
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
        <div className="col-12 col-md-4 col-lg-4" key={vendor.vendor}>
          <MECard className="vendor-hover" style={{ borderRadius: 10 }}>
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
                    className="w-100"
                    style={{
                      minHeight: 200,
                      maxHeight: 200,
                      objectFit: "contain",
                      borderTopRightRadius: 12,
                      borderTopLeftRadius: 12,
                    }}
                    src={vendor.logo ? vendor.logo.url : notFound}
                    alt={vendor.name}
                  />
                </Link>
                <Link to={`${this.props.links.services}/${vendor.id}`}>
                  <h4 className="pt-3" style={{ fontSize: 14 }}>
                    {vendor.name}
                  </h4>
                </Link>
              </div>
            </div>
            {/* </div> */}
          </MECard>
        </div>
      );
      // return (
      //   <div key={index.toString()}>
      //     <MECard
      //       style={{ borderRadius: 10 }}
      //       className="me-vendor-card me-anime-move-from-left phone-vanish"
      //       to={`${this.props.links.services}/${vendor.id}`}
      //     >
      //       <img
      //         className="me-vendor-img"
      //         src={vendor.logo ? vendor.logo.url : notFound}
      //         alt={vendor.name}
      //       />
      //       <METextView style={{ color: "black", textTransform: "capitalize" }}>
      //         {" "}
      //         {vendor.name}
      //       </METextView>
      //     </MECard>

      //     {/*  ------ PHONE VENDOR CARD ------------- */}
      //     <MECard
      //       style={{
      //         borderRadius: 5,
      //         border: "solid 0px #8ec344",
      //         borderLeftWidth: 6,
      //         padding: "20px 20px"
      //       }}
      //       className=" me-anime-move-from-left pc-vanish"
      //       to={`${this.props.links.services}/${vendor.id}`}

      //     >
      //       <img
      //         className="me-vendor-img"
      //         style={{ minHeight: 60 }}
      //         src={vendor.logo ? vendor.logo.url : notFound}
      //         alt={vendor.name}
      //       />
      //       <METextView style={{ color: "black", textTransform: "capitalize" }}>
      //         {" "}
      //         {vendor.name}
      //       </METextView>
      //     </MECard>
      //   </div>
      // );
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    homePageData: store.page.homePage,
    pageData: store.page.ServicesPage,
    serviceProviders: store.page.serviceProviders,
    links: store.links,
  };
};
export default connect(mapStoreToProps, null)(ServicesPage);
