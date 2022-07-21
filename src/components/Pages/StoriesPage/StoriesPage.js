import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import PageTitle from "../../Shared/PageTitle";
import MELink from "../Widgets/MELink";
import {
  applyTagsAndGetContent,
  collectSearchTextValueFromURL,
  filterTagCollections,
  getHumanFriendlyDate,
  getRandomIntegerInRange,
  makeStringFromArrOfObjects,
  processFiltersAndUpdateURL,
  recreateFiltersForState,
  searchIsActiveFindContent,
} from "../../Utils";
import HorizontalFilterBox from "../EventsPage/HorizontalFilterBox";
import { NONE } from "../Widgets/MELightDropDown";
import Tooltip from "../Widgets/CustomTooltip";
import StorySheet from "./Story Sheet/StorySheet";
import MECard from "../Widgets/MECard";
import MEButton from "../Widgets/MEButton";
import StoryFormButtonModal from "./StoryFormButtonModal";
import ShareButtons from "./../../Shared/ShareButtons";
import { reduxToggleGuestAuthDialog } from "../../../redux/actions/pageActions";
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
      mounted: false,
    };
    this.renderStories = this.renderStories.bind(this);
    this.addMeToSelected = this.addMeToSelected.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.triggerGuestDialog = this.triggerGuestDialog.bind(this);
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

  triggerGuestDialog(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.toggleGuestAuthDialog(true);
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
        <MELink to={this.props.links.signin} onClick={this.triggerGuestDialog}>
          Sign In to submit a story
        </MELink>
      </center>
    );
  }

  toggleStoryForm() {
    this.setState({ showStoryForm: !this.state.showStoryForm });
  }
  triggerFormForEdit({ data }) {
    this.setState({
      showEditModal: true,
      draftTestimonialData: data,
    });
  }
  renderTestimonialForm() {
    if (this.props.user) {
      return (
        <div className="every-day-flex">
          <StoryFormButtonModal
            openModal={this.state.showEditModal}
            draftTestimonialData={this.state.draftTestimonialData}
            toggleExternalTrigger={() =>
              this.setState({ showEditModal: false, draftTestimonialData: {} })
            }
          >
            Add Testimonial
          </StoryFormButtonModal>
        </div>
      );
    }
  }
  scrollToForm() {
    document.getElementById("testimonial-area").scrollIntoView({
      behavior: "smooth",
      alignToTop: true,
      block: "start",
    });
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
        story?.preferred_name?.toLowerCase().includes(word)
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
        <div key={index.toString()}>
          <div key={index.toString()}>
            <MECard
              href={`${this.props.links.testimonials}#sheet-content-${story.id}`}
              className="extra-story-cards me-anime-move-from-left-fast"
              style={{ fontSize: "0.9rem", textTransform: "capitalise" }}
            >
              {story.title}{" "}
              {story.is_published ? (
                ""
              ) : (
                <span style={{ color: "var(--app-theme-orange)" }}>
                  (Pending Appr.)
                </span>
              )}
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

  onSearchTextChange(text) {
    this.setState({ searchText: text || "" });
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
              <div className="all-head-area">
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
                <div className="pc-vanish" style={{ marginTop: 10 }}>
                  {this.renderTestimonialForm()}
                </div>
              </div>
              <HorizontalFilterBox
                type="testimonials"
                tagCols={this.props.tagCols}
                boxClick={this.addMeToSelected}
                search={this.handleSearch}
                searchText={this.state.searchText}
                doneProcessingURLFilter={this.state.mounted}
                onSearchTextChange={this.onSearchTextChange.bind(this)}
                filtersFromURL={this.state.checked_values}
              />
              <div className="row stories-row">
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
                  <div>{this.renderTestimonialForm()}</div>

                  <div id="testimonial-area" style={{ height: 100 }}></div>
                </div>
              </div>
              <div
                className="col-12 mob-zero-padding"
                style={{ marginTop: 80 }}
              >
                <center>
                  {!this.props.user ? (
                    <p className="text-center">
                      <MELink
                        to={this.props.links.signin}
                        onClick={this.triggerGuestDialog}
                      >
                        Sign In to submit a story
                      </MELink>
                    </p>
                  ) : null}
                </center>

                <center style={{ padding: 10 }}>
                  <p style={{ color: "black" }}>Share this page</p>
                  <ShareButtons
                    include={["facebook"]}
                    url={window.location.href}
                    pageTitle={`Stories people have about actions they have taken in ${
                      this.props?.pageData?.community?.name || "your community"
                    }`}
                  />
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
        data-tag-names={makeStringFromArrOfObjects(story?.tags, (s) => s.name)}
        style={{
          width: "100%",
          "--sheet-anime-delay": getRandomIntegerInRange(500),
          "--sheet-anime-duration": getRandomIntegerInRange(500),
        }}
        className="animate-testimonial-sheet test-story-sheet"
      >
        <StorySheet
          {...story}
          links={this.props.links}
          triggerForEdit={this.triggerFormForEdit.bind(this)}
        />
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
export default connect(mapStoreToProps, {
  toggleGuestAuthDialog: reduxToggleGuestAuthDialog,
})(StoriesPage);
