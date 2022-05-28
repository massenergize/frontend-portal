import React from "react";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";

import { connect } from "react-redux";
import { reduxLoadCommunityAdmins } from "../../../redux/actions/pageActions";
import ContactPageForm from "./ContactPageForm";

class ContactUsPage extends React.Component {
  prepareLocationText = (location) => {
    let locationText = "";
    if (location) {
      locationText = location.address? location.address +`${location.city || location.state || location.zipcode ? ", " : ""}`: "";
      locationText += location.city? location.city + `${location.state || location.zipcode ? ", " : ""}`: "";
      locationText += location.state? location.state + `${location.zipcode ? ", " : ""}` : "";
      locationText += location.zipcode ? location.zipcode : "";
    }
    return locationText;
  };

  ejectLocation(location) {
    if (location) {
      return (
        <div id="test-location-name">
          <div style={{ display: "flex" }}>
            <i
              class="fas fa-map-marker-alt"
              style={{ fontSize: "1.5rem", marginRight: "10px" }}
            ></i>
            <h4>Location</h4>
          </div>
          <p className="make-me-dak" style={{ color: "grey", marginTop: 10 }}>
            {this.prepareLocationText(location)}
          </p>
        </div>
      );
    } else {
      return <></>;
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

    const getCAdmin =
      communityInfo && communityInfo.admins && communityInfo.admins.length > 0
        ? communityInfo.admins.find(
            (admin) => admin.full_name === communityInfo.owner_name
          )
        : {};
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
                <div
                  className="col-md-6 col-lg-6 col-sm-12 col-xs-12"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <div style={{ marginBottom: "2rem" }}>
                    <h3>{title}</h3>
                    <p
                      className="make-me-dar"
                      style={{
                        color: "grey",
                        marginTop: "10px",
                        textAlign: "justify",
                      }}
                    >
                      {description}
                    </p>
                  </div>

                  <div style={{ marginBottom: "2rem" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        alignItems: "center",
                      }}
                    >
                      <i
                        class="fad fa-user-shield"
                        style={{
                          fontSize: "1.5rem",
                          marginRight: "5px",
                          paddingBottom: "15px",
                        }}
                      ></i>
                      <h3>Community Administrator</h3>
                    </div>
                    <div style={{ display: "flex" }}>
                      {getCAdmin && getCAdmin.profile_picture ? (
                        <img
                          src={getCAdmin.profile_picture.url}
                          alt=" "
                          height={60}
                          width={60}
                          style={{
                            objectFit: "cover",
                            borderRadius: "100%",
                            marginRight: 10,
                            border: "3px solid  #8dc63f",
                          }}
                        />
                      ) : null}
                      <p
                        style={{
                          marginTop:
                            getCAdmin && getCAdmin.profile_picture ? 13 : 0,
                        }}
                      >
                        {owner_name}
                      </p>
                    </div>
                  </div>
                  {this.ejectLocation(location)}
                  <div
                    className="pc-vanish"
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: "whitesmoke",
                      marginTop: "2rem",
                    }}
                  />
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
