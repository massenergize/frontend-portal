import React from "react";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";

import { connect } from "react-redux";
import { reduxLoadCommunityAdmins } from "../../../redux/actions/pageActions";
import ContactPageForm from "./ContactPageForm";
class ContactUsPage extends React.Component {
  ejectAdmins(admins) {
    if (admins.length > 0) {
      const adminsMapped = admins.map((admin, index) => {
        return (
          <li>
            <a style={{ fontSize: 17, color: "green" }} href="#void">
              {admin.full_name}
            </a>
          </li>
        );
      });
      return (
        <div>
          <h4>Admins</h4>
          {adminsMapped}
        </div>
      );
    } else {
      return (
        <div>
          <h4>Admins</h4>
          <p>No admins are in charge yet!</p>
        </div>
      );
    }
  }
  ejectLocation(location) {
    if (location) {
      return (
        <div>
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
          <p>No location was provided by admin!</p>
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
        : "We are always striving to make this better and welcome your feedback! Reach the community organizer by filling in the form.";
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

    const { id, location, admins } = communityInfo;

    return (
      <>
        <div className="boxed_wrapper" style={{ marginBottom: 300 }}>
          <BreadCrumbBar links={[{ name: "Contact Us" }]} />
          <div className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12">
            <div style={{ marginTop: 70 }}></div>

            <div className="container mob-contact-white-cleaner">
              <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                  <h3>{title}</h3>
                  <p className="make-me-dark">{description}</p>
                  {this.ejectLocation(location)}
                  {this.ejectAdmins(admins)}
                </div>
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 mob-zero-padding">
                  <ContactPageForm admins={admins} community_id={id} />
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
