import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import notFound from "./me_energy_default.png";
import { getHumanFriendlyDate, getRandomIntegerInRange } from "../../Utils";
// import ShareButtons from "../../Shared/ShareButtons";
import { Helmet } from "react-helmet";
import photo from "./../ActionsPage/try.png";
import METextView from "../Widgets/METextView";
import MELink from "../Widgets/MELink";
import MECard from "../Widgets/MECard";
import { Link } from "react-router-dom";

class OneTestimonialPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      story: null,
      loading: true,
    };
  }

  async fetch(id) {
    try {
      const json = await apiCall("testimonials.info", { testimonial_id: id });
      if (json.success) {
        this.setState({ story: json.data });
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
  }

  getRandomIndexArr(range) {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      const index = getRandomIntegerInRange(range);
      if (!arr.includes(index)) arr.push(index);
    }
    return arr;
  }
  // just pick 3 other testimonials, but pick at random
  getSomeOtherTestimonials() {
    const { id } = this.props.match.params;
    const { stories } = this.props;
    if (!stories) return [];
    const listWithoutCurrent = stories.filter((story) => story.id !== id); // dont include the current testimonial
    var list = this.getRandomIndexArr(listWithoutCurrent.length); // generate 3 random numbers within the range of the number of testimonials
    const randomlyPicked = list.map((index) => listWithoutCurrent[index]); // Look through the testimonial list, and pick out the testimonials that have the same indexes of the randomly generated indexes
    return randomlyPicked;
  }

  renderOtherTestimonials() {
    const otherStories = this.getSomeOtherTestimonials();
    const content = otherStories.map((story, index) => {
      const creatorName =
        story && story.preferred_name ? story.preferred_name : "...";
      return (
        <div key={index.toString()}>
          <MECard
            href={`${this.props.links.testimonials}/${story.id}`}
            className="extra-story-cards me-anime-move-from-left-fast"
          >
            {story.title}
            <br />
            <small style={{ color: "#4a1e04" }}>
              <b>
                By {creatorName}, {getHumanFriendlyDate(story.created_at)}
              </b>
            </small>
          </MECard>
        </div>
      );
    });
    if (otherStories && otherStories.length > 0) {
      return (
        <div className="phone-vanish">
          <MELink
            to={this.props.links.testimonials}
            style={{ textDecoration: "underline", marginBottom: 0 }}
          >
            {" "}
            Read Other Testimonials
          </MELink>
          {content}
        </div>
      );
    }
  }

  renderRelatedAction() {
    const action = this.state.story ? this.state.story.action : {};
    if (action) {
      return (
        <div>
          <small style={{ color: "#7d7d7d" }}>
            This testimonial is related to
          </small>
          <MECard
            style={{ borderRadius: 6, padding: 0 }}
            to={`${this.props.links.actions}/${action.id}`}
            className="me-anime-move-from-left-normal"
          >
            <img
              src={action && action.image ? action.image.url : photo}
              style={{
                display: "inline-block",
                height: 100,
                width: 100,
                objectFit: "cover",
              }}
              alt="testimonial"
            />
            <p
              style={{
                display: "inline-block",
                marginLeft: 18,
                width: "80%",
                color: "black",
              }}
            >
              {action && action.title}
            </p>
          </MECard>
        </div>
      );
    }
  }

  render() {
    const story = this.state.story ? this.state.story : {};
    if (this.state.loading) {
      return <LoadingCircle />;
    }
    if (!story || this.state.error) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Testimonial"
          errorDescription={
            this.state.error ? this.state.error : "Unknown cause"
          }
        />
      );
    }

    return (
      <>
        <Helmet>
          <meta property="og:title" content={story.name} />
          <meta property="og:image" content={story.image && story.image.url} />
          <meta property="og:description" content={story.featured_summary} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar
            links={[
              { link: this.props.links.testimonials, name: "Testimonials" },
              { name: story ? story.title : "..." },
            ]}
          />
          <section className="shop-single-area" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="single-products-details">
                {this.renderStory(story)}
              </div>
              {/* <ShareButtons
                label="Share this event!"
                pageTitle={story.name}
                pageDescription={story.featured_summary}
                url={window.location.href}
              /> */}
            </div>
          </section>
        </div>
      </>
    );
  }

  renderStory(story = {}) {
    let dateString = getHumanFriendlyDate(story.created_at);

    return (
      <section className="event-section style-3">
        <div className="container">
          <h3
            className="cool-font text-center"
            style={
              {
                //textTransform: "capitalize",
              }
            }
          >
            {story.title}
          </h3>
          <div className="single-event sec-padd" style={{ borderWidth: 0 }}>
            <div className="row">
              <div className="col-12 col-lg-4 col-mg-4 col-sm-12">
                <div
                  className="img-box"
                  style={{ height: 200, borderRadius: 10 }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: 10,
                    }}
                    className="z-depth-1 me-anime-open-in"
                    src={story && story.file ? story.file.url : notFound}
                    // src={photo}
                    alt=""
                  />
                </div>
                <div
                  className="ripped-border me-anime-show-up"
                  style={{ margin: "10px 0px" }}
                >
                  <METextView
                    mediaType="icon"
                    icon="fa fa-user"
                    style={{
                      color: "black",
                      marginBottom: 0,
                      fontSize: "medium",
                    }}
                  >
                    By{" "}
                    {story.user && story.preferred_name
                      ? story.preferred_name
                      : "..."}
                  </METextView>
                  <METextView
                    mediaType="icon"
                    icon="fa fa-clock-o"
                    containerStyle={{ display: "block" }}
                    style={{
                      color: "black",
                      marginBottom: 0,
                      fontSize: "medium",
                    }}
                  >
                    {dateString}
                  </METextView>
                </div>
                <MELink to={this.props.links.testimonials}>
                  Add a testimonial
                </MELink>
                {this.renderOtherTestimonials()}
                {this.renderRelatedVendor(story)}
              </div>
              <div className="col-12 col-lg-8 col-md-8">
                <div className="text">
                  <p
                    className="cool-font"
                    style={{ color: "black", textAlign: "justify" }}
                  >
                    {story && story.body}
                  </p>
                  {this.renderRelatedAction()}
                </div>
              </div>
            </div>

            <div className="content">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-12"></div>
                {story.details ? (
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="section-title style-2">
                      <h3>Event Details</h3>
                    </div>

                    <ul className="list2">
                      {/* {this.renderDetails(story.details)} */}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  renderRelatedVendor(story = {}) {
    const link = this.props.links && this.props.links.services;
    const vendor = story && story.vendor;
    const logo = vendor && vendor.logo;
    const title = (
      <p style={{ margin: "10px 0px", fontWeight: "bold", color: "black" }}>
        Related Vendor
      </p>
    );
    if (!vendor) return;
    if (logo)
      return (
        <>
          {title}

          <Link to={`${link}/${vendor.id}`}>
            <div className="stories-sm-vendor">
              <img src={logo.url} alt="vendor logo" />
              <small>{vendor.name}</small>
            </div>
          </Link>
        </>
      );

    return (
      <>
        {title}
        <MELink to={`${link}/${vendor.id}`}>{vendor.name}</MELink>
      </>
    );
  }
  renderDetails(details) {
    return Object.keys(details).map((key) => {
      return (
        <li key={key}>
          <i className="fa fa-check-circle"></i>
          {details[key]}
        </li>
      );
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    user: store.user.info,
    stories: store.page.testimonials,
    links: store.links,
  };
};
export default connect(mapStoreToProps, null)(OneTestimonialPage);
