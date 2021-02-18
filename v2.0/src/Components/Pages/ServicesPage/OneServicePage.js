import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import notFound from "./green-mat.jpg";
import MESectionWrapper from "../Widgets/MESectionWrapper";
// import { createFirebaseInstance } from "react-redux-firebase";
import DefaultClass from "../../Shared/Classes/DefaultClass";
import { Link } from "react-router-dom";
import MiniTestimonial from "../StoriesPage/MiniTestimonial";
class OneServicePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      limit: 140,
      expanded: null,
    };
  }
  render() {
    if (!this.props.serviceProviders || !this.props.testimonials) {
      return <LoadingCircle />;
    }
    const vendor = this.props.serviceProviders.filter((vendor) => {
      return vendor.id === Number(this.props.match.params.id);
    })[0];
    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { name: "Service Providers", link: this.props.links.services },
              // { name: `Service Provider ${vendor.id}` },
              { name: vendor ? vendor.name : "..." },
            ]}
          />
          <div className="container">
            <div className="row pt-3 pb-3">{this.renderVendor(vendor)}</div>
          </div>
        </div>
      </>
    );
  }

  changeToAbsoluteURL(string) {
    const prefix = "http://";
    var webbie = string ? string : null;
    if (webbie) {
      var temp, first_letter;
      if (webbie.includes("://")) {
        //it means its already an absolute url
        return webbie;
      }
      first_letter = webbie[0];
      if (first_letter === "/") {
        //Now check if website starts with "/"(admin put a relative path of some website)
        //remove the beginning slash
        temp = webbie.substr(1, webbie.length - 1);
        return prefix + temp;
      }
      //if its just a raw link, just add the prefix

      return prefix + webbie;
    }

    return webbie;
  }
  renderVendor(vendor) {
    const stories = this.props.testimonials.filter((story) => {
      return (
        story.vendor && story.vendor.id === Number(this.props.match.params.id)
      );
    });
    const phone =
      vendor && vendor.phone_number ? vendor.phone_number : "Not Provided";
    const email = vendor && vendor.email ? vendor.email : "Not Provided";
    // const key_contact = vendor.key_contact &&
    //   vendor.key_contact.email && vendor.key_contact.name
    //     ? `${vendor.key_contact.name}, ${vendor.key_contact.email}`
    //     : "Not Provided";

    return (
      <div className="col-12" key={vendor.vendor}>
        <div
          className="card rounded-0 spacing"
          style={{ borderColor: "white" }}
        >
          <div className="card-body mob-zero-padding">
            <div className="row">
              <div className="col-md-5 col-12 text-center">
                <img
                  className="w-100 z-depth-float me-anime-open-in"
                  style={{
                    marginBottom: 6,
                    borderRadius: 12,
                    minHeight: 225,
                    maxHeight: 225,
                    objectFit: "contain",
                    padding: 10,
                  }}
                  src={vendor.logo ? vendor.logo.url : notFound}
                  alt={vendor.name}
                />
                {vendor.location ? (
                  <div
                    className="w-100 p-2 bg-dark text-white text-center justify-content-center loc-banner"
                    style={{ borderRadius: 5 }}
                  >
                    <span className="fa fa-map-pin fa-m-right"></span>{" "}
                    {vendor.location.city}, {vendor.location.state}
                  </div>
                ) : null}

                <MESectionWrapper
                  headerText="Contact Information"
                  style={{ marginTop: 6 }}
                >
                  <a
                    style={{ marginBottom: "6px", color: "black" }}
                    href={`tel:${phone}`}
                  >
                    <b>
                      <i className="fa fa-phone fa-m-right"></i>{" "}
                    </b>{" "}
                    {phone}
                  </a>
                  <br />
                  <a
                    style={{ marginBottom: "6px", color: "black" }}
                    href={`mailto:${email}`}
                  >
                    <b>
                      <i className="fa fa-envelope fa-m-right"></i>{" "}
                    </b>{" "}
                    {email}
                  </a>
                  <br />

                  {vendor.website ? (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          this.changeToAbsoluteURL(vendor.website),
                          "_blank"
                        );
                      }}
                      rel="noopener noreferrer"
                      style={{ color: "#f56d39", cursor: "pointer" }}
                      href="#silent"
                    >
                      <i className="fa fa-globe fa-m-right"></i>{" "}
                      {vendor.website.length > 33
                        ? vendor.website.substr(0, 33) + "..."
                        : vendor.website}
                    </a>
                  ) : null}
                  {/* {vendor.key_contact.email && vendor.key_contact.name ? (
                    <a href={`mailto::${vendor.key_contact.email}`} style={{color:'#f56d39'}}>
                      {key_contact}
                    </a>
                  ) : (
                    <small style={{ color: "gray" }}>{key_contact}</small>
                  )} */}
                </MESectionWrapper>
              </div>
              <div
                className="col-md-6 col-lg-6 col-12 mt-3"
                style={{ marginLeft: 25, marginRight: 25 }}
              >
                <h1 className="pt-3 mobile-title">{vendor.name}</h1>
                <p
                  className="cool-font make-me-dark"
                  dangerouslySetInnerHTML={{ __html: vendor.description }}
                ></p>
              </div>
              {vendor.services && vendor.services.length > 0 ? (
                <div className="col-12" style={{ margin: 40 }}>
                  <span>
                    <h4>Services</h4>
                  </span>
                  <ul className="normal">
                    {vendor.services.map((service) => {
                      return (
                        <li
                          style={{
                            display: "inline-block",
                            marginLeft: 0,
                            marginRight: "2em",
                          }}
                          key={vendor.name + "-" + service.id}
                        >
                          <b>{service.name}</b>&nbsp;&nbsp;&nbsp;
                          <p>{service.description}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            {vendor.key_contact != null ? (
              <div className="w-100 p-2 text-center">
                {vendor.user_info ? (
                  <>
                    <a
                      href={"//" + vendor.key_contact.user_info.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-normal mr-3"
                    >
                      <span className="fa fa-link fa-2x"></span>
                    </a>
                    <a
                      href={"mail://" + vendor.key_contact.email}
                      className="font-normal ml-3"
                    >
                      <span className="fa fa-envelope fa-2x"></span>
                    </a>
                  </>
                ) : null}
              </div>
            ) : null}
            <br />
            {this.storyCheck(stories, vendor)}
            {/* <StoryForm vid={vendor.id} /> */}
          </div>
        </div>
      </div>
    );
  }
  storyCheck = (stories) => {
    if (stories.length > 0) {
      return (
        <div>
          <div className="text-center z-depth-float me-anime-open-in">
            <h4
              style={{
                // background: "linear-gradient(45deg, #ff9030, #28a745)",
                background: "#f3f3f2",
                color: "black",
                padding: 26,
              }}
              className="phone-vanish"
            >
              {" "}
              Testimonials about this Service Provider{" "}
            </h4>
          </div>
          <div className="phone-vanish">{this.renderStories(stories)}</div>
          <Link
            className="pc-vanish"
            to={this.props.links && this.props.links.testimonials}
            style={{ textAlign: "center", width: "100%" }}
          >
            See Testimonials
          </Link>
        </div>
      );
    }
  };

  storyHasImage(story) {
    if (story && story.file && story.file.url)
      return { url: story.file.url, status: true };
    return { status: true, url: DefaultClass.getTestimonialsDefaultPhoto() };
  }
  renderStories = (stories) => {
    if (stories.length === 0)
      return (
        <div className="text-center">
          <p> No stories about this Service Provider yet </p>
        </div>
      );
    return (
      <>
        {/* <div className="tab-title-h4">
                    <h4>{stories.length} Stories about this Action</h4>
                </div> */}
        {Object.keys(stories).map((key) => {
          const story = stories[key];
          // const image = this.storyHasImage(story);
          // const date = new Date(story.created_at);
          return (
            <div key={key}>
              <MiniTestimonial story={story} links={this.props.links} />
            </div>
            // className="single-review-box"
            // <div key={key} style={{ padding: 0 }}>
            //   <MECard className="me-anime-open-in" style={{ borderRadius: 10 }}>
            //     {/* <div className="img-holder">
            //     <img src="" alt="" />
            //   </div> */}
            //     <div>
            //       <img
            //         src={image.url}
            //         className="v-story-img phone-vanish"
            //         alt="testimonial media"
            //       />

            //       <div
            //         className="text-holder"
            //         style={{ padding: 20, display: "inline-block", marginLeft:"15%" }}
            //       >
            //         {story.user && (
            //           <div className="top">
            //             <div className="name pull-left">
            //               <h4>
            //                 {story.user.full_name} – {date.toLocaleDateString()}
            //                 :
            //               </h4>
            //             </div>
            //           </div>
            //         )}
            //         <div className="text">
            //           <METextView
            //             style={{
            //               color: "black",
            //               marginLeft: 15,
            //               marginRight: 7,
            //             }}
            //           >
            //             {story.title}
            //             {this.state.expanded &&
            //             this.state.expanded === story.id ? (
            //               <button
            //                 className="as-link"
            //                 style={{ float: "right", marginLeft: 10 }}
            //                 onClick={() => {
            //                   this.setState({ expanded: null });
            //                 }}
            //               >
            //                 See Less
            //               </button>
            //             ) : null}
            //           </METextView>
            //           <p>
            //             {this.state.expanded && this.state.expanded === story.id
            //               ? story.body
            //               : story.body.substring(0, this.state.limit)}
            //             {this.state.limit < story.body.length &&
            //             this.state.expanded !== story.id ? (
            //               <button
            //                 className="as-link"
            //                 style={{ float: "right" }}
            //                 onClick={() => {
            //                   this.setState({ expanded: story.id });
            //                 }}
            //               >
            //                 Read More...
            //               </button>
            //             ) : null}
            //           </p>
            //         </div>
            //         {story.action ? (
            //           <div className="text">
            //             <p>
            //               Linked Action:{" "}
            //               <MELink
            //                 to={`${this.props.links.actions}/${story.action.id}`}
            //               >
            //                 {story.action.title}
            //               </MELink>
            //             </p>
            //           </div>
            //         ) : null}
            //       </div>
            //     </div>
            //   </MECard>
            // </div>
          );
        })}
      </>
    );
  };
}
const mapStoreToProps = (store) => {
  return {
    serviceProviders: store.page.serviceProviders,
    testimonials: store.page.testimonials,
    links: store.links,
  };
};
export default connect(mapStoreToProps, null)(OneServicePage);
