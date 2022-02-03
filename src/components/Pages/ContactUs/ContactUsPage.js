import React from "react";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";

import { connect } from "react-redux";
import { reduxLoadCommunityAdmins } from "../../../redux/actions/pageActions";
import ContactPageForm from "./ContactPageForm";
class ContactUsPage extends React.Component {
  
  ejectLocation(location) {
    if (location) {
      return (
        <div id="test-location-name">
          <h4>Location</h4>
          <p className="make-me-dark">
            {location.address ? location.address + ",\n" : ""}
            {location.city ? location.city : ""}
            {location.state ? `, ${location.state}` : ""}
            {location.zipcode ? `, ${location.zipcode}` : ""}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <h4>Location</h4>
          <p id="test-no-location-name">No location was provided by admin!</p>
        </div>
      );
    }
  }
  render() {
    const communityInfo = this.props.community;
    const pageData = this.props.pageData;
    const title =
      pageData && pageData.title
        ? pageData.title
        : "Contact " + communityInfo && communityInfo.name;
    const description =
      pageData && pageData.description
        ? pageData && pageData.description
        : "We are always striving to make this better and welcome your feedback! Reach the community administrator by filling in the form.";
    if (!this.props.homePageData && !communityInfo) {
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
            Sorry, it looks like this community has no contact information :({" "}
          </h2>
        </div>
      );
    }

    const { id, location, owner_name } = communityInfo;

    return (
      <>
        <div className="boxed_wrapper" style={{ marginBottom: 300 }}>
          <BreadCrumbBar links={[{ name: "Contact Us" }]} />
          <div
            className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12 test-contact-us-wrapper"
            data-location={location}
          >
            <div style={{ marginTop: 70 }}></div>

            <div className="container mob-contact-white-cleaner">
              <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                  <h3>{title}</h3>
                  <p className="make-me-dark">{description}</p> 
                  <h4 className="make-me-dark">{communityInfo.name} site admin:</h4>
                  <h5>{owner_name}</h5> 
                  {this.ejectLocation(location)}
                </div>
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 mob-zero-padding">
                  <ContactPageForm community_id={id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    homePageData: store.page.homePage,
    user: store.user.info,
    links: store.links,
    community: store.page.community,
    communityAdmins: store.page.communityAdmins,
    pageData: store.page.contactUsPage,
  };
};

export default connect(mapStoreToProps, { reduxLoadCommunityAdmins })(
  ContactUsPage
);
