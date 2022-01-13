import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import StoryForm from "../ActionsPage/StoryForm";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import PageTitle from "../../Shared/PageTitle";
import MEButton from "../Widgets/MEButton";
import MELink from "../Widgets/MELink";
import {
  applyTagsAndGetContent,
  filterTagCollections,
  getHumanFriendlyDate,
  getRandomIntegerInRange,
  searchIsActiveFindContent,
} from "../../Utils";
import HorizontalFilterBox from "../EventsPage/HorizontalFilterBox";
import { NONE } from "../Widgets/MELightDropDown";
import Tooltip from "../Widgets/CustomTooltip";
import StorySheet from "./Story Sheet/StorySheet";
import MECard from "../Widgets/MECard";

class StoriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draftTestimonialData: {},
      limit: 140, //size of a tweet
      checked_values: null,
      modal_content: {
        image: null,
        title: null,
        desc: null,
        ano: null,
        user: null,
      },
      stories: [],
      searchText: null,
    };
    this.renderStories = this.renderStories.bind(this);
    this.addMeToSelected = this.addMeToSelected.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  addMeToSelected(param, reset = false) {
    if (reset) return this.setState({ checked_values: null });
    var arr = this.state.checked_values ? this.state.checked_values : [];
    // remove previously selected tag of selected category and put the new one
    arr = arr.filter((item) => item.collectionName !== param.collectionName);
    if (!param || param.value !== NONE) arr.push(param);
    this.setState({ checked_values: arr });
  }

  //lettings parent know when modal is open to hide story sheet at the bottom of the page.  When the 2 instances of story sheet are on the same page, pictures dont work right
  IsModalOpen =  (IsModalOpen) => {
	  this.setState({IsModalOpen: IsModalOpen})
  }

  renderAddTestmonialBtn() {
    if (this.props.user) {
      return (
        <MEButton
          mediaType="icon"
          icon="fa fa-plus"
          style={{ fontSize: 15 }}
          onClick={this.scrollToForm}
        >
          Add My Testimonial
        </MEButton>
      );
    }
    return (
      <center>
        <MELink to={this.props.links.signin}>Sign In to submit a story</MELink>
      </center>
    );
  }

  renderTestimonialForm() {
    if (this.props.user) {
      return <StoryForm 
      key={this.state.draftTestimonialData.key}
      draftTestimonialData={this.state.draftTestimonialData}
      uid={this.props.user.id} />;
    }
  }
  scrollToForm() {
    document.getElementById("testimonial-area").scrollIntoView({
      behavior: "smooth",
      alignToTop: true,
      block: "start",
    });
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({ searchText: e.target.value });
  }

  searchIsActiveSoFindContentThatMatch() {
    return searchIsActiveFindContent(
      this.props.stories,
      this.state.checked_values,
      this.state.searchText,
      (story, word) =>
        story?.title?.toLowerCase().includes(word) ||
        story?.body?.toLowerCase().includes(word) ||
        story?.user?.preferred_name?.toLowerCase().includes(word) ||
        story?.user?.full_name?.toLowerCase().includes(word)
    );
  }

  renderSideViewStories(stories = []) {
    return (stories || []).map((story, index) => {
      const creatorName =
        story && story.preferred_name
          ? story.preferred_name
          : story.user.preferred_name; //"...";
      // no anonymous testimonials   if (story?.anonymous) creatorName = "Anonymous";
      return (
        <div  key={index.toString()}>
          <div key={index.toString()}>
            <MECard
              href={`${this.props.links.testimonials}#sheet-content-${story.id}`}
              className="extra-story-cards me-anime-move-from-left-fast"
              style={{ fontSize: "0.9rem", textTransform: "capitalise" }}
            >
              {story.title} {story.is_published? "" : "(Pending Appr.)"}
              <br />
              <small style={{ color: "green" }}>
                <b>
                  By {creatorName}, {getHumanFriendlyDate(story.created_at)}
                </b>
              </small>
            </MECard>
          </div>
        </div>
      );
    });
  }

  render() {
    const pageData = this.props.pageData;
    if (pageData == null) return <LoadingCircle />;

    if (!this.props.tagCols) {
      return <LoadingCircle />;
    }

    const title = pageData && pageData.title ? pageData.title : "Testimonials";
    const sub_title =
      pageData && pageData.sub_title ? pageData.sub_title : null;
    const description = pageData.description ? pageData.description : null;

    const stories =
      this.searchIsActiveSoFindContentThatMatch() ||
      applyTagsAndGetContent(this.props.stories, this.state.checked_values);

    return (
      <>
        <div
          className="boxed_wrapper"
          style={{
            minHeight: window.screen.height - 200,
          }}
        >
          <BreadCrumbBar links={[{ name: "Testimonials" }]} />
          <section className="testimonial2">
            <div className="container override-container-width">
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
              <HorizontalFilterBox
			  	IsModalOpen={this.IsModalOpen}
                type="testimonials"
                tagCols={this.props.tagCols}
                boxClick={this.addMeToSelected}
                search={this.handleSearch}
              />
              <div className="row phone-marg-top-90">
                <div className="col-md-3 phone-vanish" style={{ marginTop: 0 }}>
                  <center>
                    <h5>Jump to story</h5>
                  </center>

                  {this.renderSideViewStories(stories)}
                </div>
                <div
                  className="col-md-9 col-lg-9  col-sm-12 test-stories-wrapper"
                  data-number-of-stories={stories?.length || 0}
                >
                  <div
                    className="row"
                    style={{
                      position: "relative",
                      paddingBottom: 50,
                    }}
                  >
                    {this.renderStories(stories)}
                  </div>
                  <div id="testimonial-area" style={{ height: 100 }}></div>
                   {this.state.IsModalOpen ? <div/>  : <div>{this.renderTestimonialForm()}</div>} 
                </div>
              </div>
              <div
                className="col-12 mob-zero-padding"
                style={{ marginTop: 80 }}
              >
                <center>
                  {!this.props.user ? (
                    <p className="text-center">
                      <MELink to={this.props.links.signin}>
                        Sign In to submit a story
                      </MELink>
                    </p>
                  ) : null}
                </center>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  renderStories(stories) {
    if (!stories) {
      return (
        <div className="col-12 text-center">
          <p className="cool-font">
            There aren't any testimonials yet. If you have a story to tell, let
            us know in the form below.
          </p>
        </div>
      );
    }
    if (stories.length === 0) {
      return (
        <div className="col-12 text-center">
          <p className="cool-font">
            {" "}
            There are not any testimonials in the selected categories.
          </p>
        </div>
      );
    }

    return stories.map((story, index) => (
      <div
        key={index.toString()}
        style={{
          width: "100%",
          "--sheet-anime-delay": getRandomIntegerInRange(500),
          "--sheet-anime-duration": getRandomIntegerInRange(500),
        }}
        className="animate-testimonial-sheet test-story-sheet"
      >
        <StorySheet 
		IsModalOpen={this.IsModalOpen}
        {...story} 
        links={this.props.links} />
      </div>
    ));
  }
}
const mapStoreToProps = (store) => {
  return {
    pageData: store.page.testimonialsPage,
    stories: store.page.testimonials,
    user: store.user.info,
    links: store.links,
    tagCols: filterTagCollections(store.page.testimonials, store.page.tagCols),
  };
};
export default connect(mapStoreToProps, null)(StoriesPage);
