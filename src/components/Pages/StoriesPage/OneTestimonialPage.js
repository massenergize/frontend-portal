import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import { getHumanFriendlyDate, getRandomIntegerInRange } from "../../Utils";
import photo from "./../ActionsPage/try.png";
import MELink from "../Widgets/MELink";
import MECard from "../Widgets/MECard";
import ShareButtons from "../../Shared/ShareButtons";
import URLS from "../../../api/urls";
import { Link } from "react-router-dom";
import Seo from "../../Shared/Seo";
import { PAGE_ESSENTIALS, TESTIMONIAL } from "../../Constants";
import {
  reduxLoadActions,
  reduxLoadTagCols,
  reduxLoadTestimonials,
  reduxLoadTestimonialsPage,
  reduxMarkRequestAsDone,
  reduxToggleUniversalModal,
} from "../../../redux/actions/pageActions";
import StoryForm from "../ActionsPage/StoryForm";
import OneTestimonialV2 from "./OneTestimonialV2";
import { TESTIMONIAL } from "../../Constants";
import {
  reduxLoadTestimonials,
  reduxToggleUniversalModal,
} from "../../../redux/actions/pageActions";
import StoryForm from "../ActionsPage/StoryForm";
import RibbonBanner from "../../Shared/RibbonBanner";
import MEImage from "../../Shared/MEImage";
import { processBeforeFlight } from "./StoriesPage";

class OneTestimonialPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      story: null,
      loading: true,
    };
  }

  async fetch(id) {
    const { stories } = this.props;
    const story = stories?.find((story) => story.id === id);
    if (story) return this.setState({ story, loading: false });
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
    window.gtag("set", "user_properties", { page_title: "OneTestimonialPage" });
    const { id } = this.props.match.params;
    // this.fetch(id);
    this.fetchEssentials(id);
  }
  //  trigger whenever props.stories change
  static getDerivedStateFromProps(props, state) {
    let { id } = props?.match?.params;
    if (props.stories && id)
      return {
        story: props.stories?.filter((story) => story.id?.toString() === id)[0],
      };
    return null;
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
        story?.preferred_name ||
        story?.user?.preferred_name ||
        story.user?.full_name ||
        "...";
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
                By {(story?.anonymous && "Anonymous") || creatorName},{" "}
                {getHumanFriendlyDate(story.created_at)}
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
            style={{
              textDecoration: "underline",
              marginBottom: 5,
              marginTop: 15,
            }}
          >
            {" "}
            Read Other Testimonials
          </MELink>
          {content}
        </div>
      );
    }
  }

  onEditButtonClick = (data) => {
    let toEdit = {
      id: data?.id,
      community: data?.community?.id,
      key: Math.random(),
      action_id: data?.action?.id,
      tags: [],
      body: data?.body,
      other_vendor: data?.other_vendor,
      preferred_name: data?.preferred_name,
      title: data?.title,
      vendor_id: data?.vendor ? data?.vendor.id : "",
      image: data?.file,
    };
    this.props.toggleModal({
      show: true,
      title: "Edit Testimonial Form",
      size: "md",
      component: (
        <StoryForm
          processBeforeFlight={processBeforeFlight}
          ModalType={TESTIMONIAL}
          close={() => this.props.toggleModal({ show: false })}
          draftData={toEdit}
          TriggerSuccessNotification={(bool) => ({})}
          updateItemInRedux={(data) => this.props.updateItemInRedux(data)}
          reduxItems={this.props.stories}
        />
      ),
    });
  };

  renderRelatedAction() {
    const action = this.state.story ? this.state.story.action : {};
    if (action) {
      return (
        <div style={{ marginTop: 20 }}>
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
                objectFit: "contain",
                marginLeft: 10,
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
    const { community } = story || {};
    const { subdomain } = community || {};

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

    const { tags } = story || {};
    return (
      <>
        {Seo({
          title: story.title,
          description: story.body,
          url: `${window.location.href}`,
          image: story.image && story.image.url,
          keywords: story.title && story.title.split(" "),
          updated_at: story.updated_at,
          created_at: story.created_at,
          tags: (tags || []).map(({ name }) => name) || [],
          site_name: this.props?.community?.name,
        })}

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
              <br />
              <br />
              <ShareButtons
                label="Share this testimonial!"
                pageTitle={story.name}
                pageDescription={story.featured_summary}
                url={`${URLS.SHARE}/${subdomain}/testimonial/${story.id}`}
              />
            </div>
          </section>
        </div>
      </>
    );
  }

  fetchEssentials = (id) => {
    const { community, pageRequests } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain };
    this.fetch(id);
    const page = (pageRequests || {})[PAGE_ESSENTIALS.ONE_TESTIMONIALS.key];
    if (page?.loaded) return;
    // Promise.all([
    //   ...PAGE_ESSENTIALS.TESTIMONIALS.routes.map((route) =>
    //     apiCall(route, payload)
    //   ),
    //   apiCall("testimonials.info", { testimonial_id: id }),
    // ])
    Promise.all(
      PAGE_ESSENTIALS.TESTIMONIALS.routes.map((route) =>
        apiCall(route, payload)
      )
    )
      .then((response) => {
        const [pageData, tagCols, stories, actions, story] = response;
        this.setState({
          story: story?.data,
          error: story?.error,
          loading: false,
        });
        this.props.loadTestimonialsPage(pageData?.data);
        this.props.loadTagCollections(tagCols?.data);
        this.props.loadTestimonials(stories?.data);
        this.props.loadActions(actions?.data);

        this.props.reduxMarkRequestAsDone({
          ...pageRequests,
          [PAGE_ESSENTIALS.ONE_TESTIMONIALS.key]: { loaded: true },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderStory(story = {}) {
    const creatorName =
      story.preferred_name ||
      story?.user?.preferred_name ||
      story?.user?.full_name ||
      "...";

    return (
      <OneTestimonialV2
        creatorName={creatorName}
        story={story}
        stories={this.props.stories}
        otherStories={this.getSomeOtherTestimonials()}
        community={this.props.community}
        edit={this.onEditButtonClick.bind(this)}
        newTestimonial={() =>
          this.props.history.push(this.props.links.testimonials)
        }
        user={this.props.user}
      />
    );
  }
  renderRelatedVendor(story = {}) {
    const link = this.props.links && this.props.links.services;
    const vendor = story && story.vendor;
    const logo = vendor && vendor.logo;
    const title = (
      <p
        style={{
          margin: "10px 0px",
          fontWeight: "bold",
          color: "black",
          marginTop: 20,
        }}
      >
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
    user: store.user.info,
    stories: store.page.testimonials,
    links: store.links,
    community: store.page.community,
    pageRequests: store.page.pageRequests,
  };
};
export default connect(mapStoreToProps, {
  toggleModal: reduxToggleUniversalModal,
  updateItemInRedux: reduxLoadTestimonials,
  loadTestimonials: reduxLoadTestimonials,
  loadTestimonialsPage: reduxLoadTestimonialsPage,
  loadTagCollections: reduxLoadTagCols,
  reduxMarkRequestAsDone,
  loadActions: reduxLoadActions,
})(OneTestimonialPage);
