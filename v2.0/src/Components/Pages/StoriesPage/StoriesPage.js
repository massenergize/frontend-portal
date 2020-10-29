import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ErrorPage from "./../Errors/ErrorPage";
import StoryForm from "../ActionsPage/StoryForm";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import PageTitle from "../../Shared/PageTitle";
import Funnel from "./../EventsPage/Funnel";
import leafy from "./leafy.png";
import StoryModal from "./StoryModal";
import * as moment from "moment";
import METestimonialCard from "./METestimonialCard";
import MECard from "../Widgets/MECard";
import MEButton from "../Widgets/MEButton";
import MEModal from "../Widgets/MEModal";
import MELink from "../Widgets/MELink";
import { getRandomIntegerInRange, moveToPage } from "../../Utils";
import Paginator from "../Widgets/Paginator";
import MEFileSelector from "../Widgets/MEFileSelector";

const PER_PAGE = 6;
class StoriesPage extends React.Component {
  constructor(props) {
    super(props);
    const stories = props.stories ? props.stories : [];
    this.closeModal = this.closeModal.bind(this);
    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.state = {
      limit: 140, //size of a tweet
      expanded: null,
      check_values: null,
      modal_content: {
        image: null,
        title: null,
        desc: null,
        ano: null,
        user: null,
      },
      testimonialModal: false,
      stories: [],
      pageContent: {
        currentPage: 1,
        itemsLeft: -1, // set to -1 to be able to differentiate when there is really no content, and when its just first time page load
        pageCount: 0,
      },
      perPage: PER_PAGE,
    };

    this.readMore = this.readMore.bind(this);
    this.renderStories = this.renderStories.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }
  findCommon() {
    const stories = this.props.stories;
    const values = this.state.check_values ? this.state.check_values : [];

    if (values.length === 0)
      return null;

    const common = [];
    if (stories) {
      for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        const ev = stories[i].action;
        if (ev) {
          for (let j = 0; j < ev.tags.length; j++) {
            const tag = ev.tags[j];
            //only push events if they arent there already
            if (values.includes(tag.id) && !common.includes(story)) {
              common.push(story);
            }
          }
        }
      }
    }
    return common;
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
  renderModal() {
    if (this.state.expanded) {
      return (
        <MEModal
          closeModal={this.closeModal}
          contentStyle={{ minWidth: "100%" }}
        >
          <StoryModal content={this.state.modal_content} />
        </MEModal>
      );
    }
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

  readMore(params) {
    this.setState({ expanded: params.id, modal_content: params.content });
  }
  renderTestimonialForm() {
    if (this.props.user) {
      return <StoryForm uid={this.props.user.id} />;
    }
  }
  scrollToForm() {
    document.getElementById("testimonial-area").scrollIntoView({
      behavior: "smooth",
      alignToTop: true,
      block: "start",
    });
  }

  goToPage(pageNumber) {
    const { stories } = this.props;
    const { perPage } = this.state;
    const nextPageContent = moveToPage(stories, pageNumber, perPage);
    this.setState({
      stories: nextPageContent.data,
      pageContent: {
        currentPage: nextPageContent.currentPage,
        itemsLeft: nextPageContent.itemsLeft,
        pageCount: nextPageContent.pageCount,
      },
    });
  }
  renderPaginator() {
    const { pageContent, check_values } = this.state;
    var { stories } = this.props;
    stories = stories ? stories : [];
    if (check_values && check_values.length > 0) return <i></i>; // dont want to show paginator when user is in search mode
    return (
      <Paginator
        currentPage={pageContent.currentPage}
        pageCount={pageContent.pageCount}
        nextFxn={() => this.goToPage(this.state.pageContent.currentPage + 1)}
        prevFxn={() => this.goToPage(this.state.pageContent.currentPage - 1)}
        showNext={pageContent.itemsLeft !== 0 && stories.length > PER_PAGE}
        showPrev={pageContent.currentPage > 1}
      />
    );
  }
  getContentToDisplay() {
    const { stories } = this.props;
    const stateStories = this.state.stories;
    const common = this.findCommon();

    if (common) return common;
    if (stateStories.length === 0) {
      if (!stories || stories.length === 0) return null;
      // return stories.slice(0, this.state.perPage);
      return stories;
    }

    return stateStories;
  }
  render() {
    if (!this.props.pageData)
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Testimonials data"
        />
      );

    const stories = this.getContentToDisplay();

    //const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

    return (
      <>
        {/* <MEModal ><h1>Semeeee</h1></MEModal> */}
        {this.renderModal()}
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Testimonials" }]} />
          <section className="testimonial2">
            <div className="container override-container-width">
              <div className="row">
                <div className="col-md-3 phone-vanish">
                  <MECard
                    className=" mob-login-white-cleaner z-depth-float me-anime-open-in"
                    style={{
                      marginBottom: 10,
                      marginTop: 48,
                      padding: "45px 14px",
                      borderRadius: 15,
                    }}
                  >
                    <h4>Filter by...</h4>
                    <Funnel
                      type="testimonial"
                      boxClick={this.handleBoxClick}
                      search={() => {}}
                      foundNumber={0}
                    />
                  </MECard>
                  {this.renderAddTestmonialBtn()}
                </div>
                <div className="col-md-9 col-lg-9 col-sm-12 ">
                  {/* --- SHOW FLOATING BTN IN PHONE VIEW WHEN USER IS SIGNED IN ------------ */}
                  {this.props.user && (
                    <MEButton
                      onClick={this.scrollToForm}
                      className="float-testimonial-btn pc-vanish"
                    >
                      Add Testimonial
                    </MEButton>
                  )}
                  <PageTitle>Testimonials</PageTitle>
                  {this.state.pageContent.pageCount > 0 ? (
                    <center>
                      <small>
                        When you switch pages, images take a moment to reflect,
                        please bear with us...
                      </small>
                    </center>
                  ) : null}
                  {/* {this.renderPaginator()} */}
                  <div
                    className="row"
                    style={{
                      // maxHeight: 700,
                      // overflowY: "scroll",
                      position: "relative",
                      paddingBottom: 50,
                    }}
                  >
                    {this.renderStories(stories)}
                    {/* {this.renderPaginator()} */}
                  </div>
                  <div id="testimonial-area" style={{ height: 100 }}></div>
                  <div>{this.renderTestimonialForm()}</div>
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

  closeModal() {
    this.setState({ expanded: null });
  }

  renderStories(stories) {
    if (!stories) {
      return (
        <p>
          There aren't any not any testimonials yet. If you have a story to
          tell, let us know in the form below.
        </p>
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
    return stories.map((story, index) => {
      var cn = "col-md-6 col-lg-6 col-sm-6 col-xs-12 mob-testy-card-fix";

      return (
        <div key={index} className={cn} style={{ marginBottom: 10 }}>
          <METestimonialCard
            {...story}
            links={this.props.links}
            readMore={this.readMore}
          />
        </div>
      );
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    pageData: store.page.homePage,
    stories: store.page.testimonials,
    user: store.user.info,
    links: store.links,
  };
};
export default connect(mapStoreToProps, null)(StoriesPage);
