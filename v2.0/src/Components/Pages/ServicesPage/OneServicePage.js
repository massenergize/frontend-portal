import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import { Link } from "react-router-dom";
import StoryForm from "../ActionsPage/StoryForm";
import notFound from "./green-mat.jpg";
class OneServicePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      limit: 140,
      expanded: null
    };
  }
  render() {
    if (!this.props.serviceProviders || !this.props.testimonials) {
      return <LoadingCircle />;
    }
    const vendor = this.props.serviceProviders.filter(vendor => {
      return vendor.id === Number(this.props.match.params.id);
    })[0];

    console.log("I am the vendor::::", vendor);
    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { name: "Service Providers", link: this.props.links.services },
              { name: `Service Provider ${vendor.id}` }
            ]}
          />
          <div className="container">
            <div className="row pt-3 pb-3">{this.renderVendor(vendor)}</div>
          </div>
        </div>
      </>
    );
  }

  renderVendor(vendor) {
    const stories = this.props.testimonials.filter(story => {
      return (
        story.vendor && story.vendor.id === Number(this.props.match.params.id)
      );
    });
    const phone = vendor.phone_number ? vendor.phone_number : "Not Provided";
    const email = vendor.email ? vendor.email : "Not Provided";
    const key_contact =
      vendor.key_contact.email && vendor.key_contact.name
        ? `${vendor.key_contact.name}, ${vendor.key_contact.email}`
        : "Not Provided";
    return (
      <div className="col-12" key={vendor.vendor}>
        <div
          className="card rounded-0 spacing"
          style={{ borderColor: "#f9f7f7" }}
        >
          <div className="card-body mob-zero-padding">
            <div className="row">
              <div className="col-md-5 col-12 text-center">
                <img
                  className="w-100 raise"
                  style={{
                    marginBottom: 6,
                    borderRadius: 12,
                    minHeight: 225,
                    maxHeight: 225,
                    objectFit: "contain",
                    padding: 10
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
                <div className="ash-paper">
                  <h6>
                    <b>
                      <i className="fa fa-phone fa-m-right"></i>{" "}
                    </b>{" "}
                    {phone}
                  </h6>
                  <h6>
                    <b>
                      <i className="fa fa-envelope fa-m-right"></i>{" "}
                    </b>{" "}
                    {email}
                  </h6>
                  <h6 style={{ marginBottom: 0 }}>
                    <b>More Information</b>
                  </h6>
                  {vendor.website ? (
                    <a
                      href={vendor.website}
                      target="_blank"
                      style={{ color: "#f56d39" }}
                    >
                      {"Visit Our Website"}
                    </a>
                  ) : (
                    <small style={{ color: "gray" }}>Not Provided</small>
                  )}
                  {/* {vendor.key_contact.email && vendor.key_contact.name ? (
                    <a href={`mailto::${vendor.key_contact.email}`} style={{color:'#f56d39'}}>
                      {key_contact}
                    </a>
                  ) : (
                    <small style={{ color: "gray" }}>{key_contact}</small>
                  )} */}
                </div>
              </div>
              <div className="col-md-7 col-12 mt-3">
                <h1 className="pt-3 mobile-title">{vendor.name}</h1>
                <p className="make-me-dark" style={{textAlign:'justify'}}>{vendor.description}</p>
              </div>
              {vendor.services && vendor.services.length > 0 ? (
                <div className="col-12" style={{ margin: 40 }}>
                  <span>
                    <h4>Services</h4>
                  </span>
                  <ul className="normal">
                    {vendor.services.map(service => {
                      return (
                        <li
                          style={{
                            display: "inline-block",
                            marginLeft: 0,
                            marginRight: "2em"
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
            <StoryForm vid={vendor.id} />
          </div>
        </div>
      </div>
    );
  }
  storyCheck = stories => {
    if (stories.length > 0) {
      return (
        <div>
          <div className="text-center">
            <h4
              style={{
                background: "rgb(249, 251, 249)",
                color: "#383838",
                padding: 26
              }}
            >
              {" "}
              Testimonials about this Service Provider{" "}
            </h4>
          </div>
          {this.renderStories(stories)}
        </div>
      );
    }
  };
  renderStories = stories => {
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
        {Object.keys(stories).map(key => {
          const story = stories[key];
          const date = new Date(story.created_at);
          return (
            <div className="single-review-box" key={key} style={{ padding: 0 }}>
              <div className="img-holder">
                <img src="" alt="" />
              </div>
              <div className="text-holder" style={{ padding: 40 }}>
                {story.user && (
                  <div className="top">
                    <div className="name pull-left">
                      <h4>
                        {story.user.full_name} – {date.toLocaleDateString()}:
                      </h4>
                    </div>
                  </div>
                )}

                <div className="text">
                  <h6>
                    {story.title}
                    {this.state.expanded && this.state.expanded === story.id ? (
                      <button
                        className="as-link"
                        style={{ float: "right" }}
                        onClick={() => {
                          this.setState({ expanded: null });
                        }}
                      >
                        close
                      </button>
                    ) : null}
                  </h6>
                  <p>
                    {this.state.expanded && this.state.expanded === story.id
                      ? story.body
                      : story.body.substring(0, this.state.limit)}
                    {this.state.limit < story.body.length &&
                    this.state.expanded !== story.id ? (
                      <button
                        className="as-link"
                        style={{ float: "right" }}
                        onClick={() => {
                          this.setState({ expanded: story.id });
                        }}
                      >
                        ...more
                      </button>
                    ) : null}
                  </p>
                </div>
                {story.action ? (
                  <div className="text">
                    <p>
                      Linked Action:{" "}
                      <Link
                        to={`${this.props.links.actions}/${story.action.id}`}
                      >
                        {story.action.title}
                      </Link>
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </>
    );
  };
}
const mapStoreToProps = store => {
  return {
    serviceProviders: store.page.serviceProviders,
    testimonials: store.page.testimonials,
    links: store.links
  };
};
export default connect(mapStoreToProps, null)(OneServicePage);
