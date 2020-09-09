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
    const common = [];
    if (stories) {
      for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        const ev = stories[i].action;
        if (ev) {
          for (let i = 0; i < ev.tags.length; i++) {
            const tag = ev.tags[i];
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
        <MEModal closeModal={this.closeModal}>
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
    if (this.findCommon().length > 0) {
      // filtered content if a user is using the filter. If not
      return this.findCommon(0);
    }
    if (stateStories.length === 0) {
      if (!stories) return;
      return stories.slice(0, this.state.perPage);
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
    if (stories == null) return <LoadingCircle />;

    //const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;

    return (
      <>
        {/* <MEModal ><h1>Semeeee</h1></MEModal> */}
        {this.renderModal()}
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Testimonials" }]} />
          <section className="testimonial2">
            <div className="container override-container-width">
              <div className="row masonary-layout" style={{marginLeft:0}}>
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
                  <PageTitle>Testimonials</PageTitle>
                  {this.state.pageContent.pageCount > 0 ? (
                    <center>
                      <small>
                        When you switch pages, images take a moment to reflect,
                        please bear with us...
                      </small>
                    </center>
                  ) : null}
                  {this.renderPaginator()}
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
                    {this.renderPaginator()}
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
  // renderImage(img) {
  //   if (img && !this.state.expanded) {
  //     return (
  //       <div>
  //         <center>
  //           <img className="testi-img" src={img.url} alt="IMG" />
  //         </center>
  //       </div>
  //     );
  //   } else if (!img && !this.state.expanded) {
  //     return (
  //       <div>
  //         <center>
  //           <img
  //             className="testi-img"
  //             src={leafy}
  //             style={{ objectFit: "contain" }}
  //             alt="IMG"
  //           />
  //         </center>
  //       </div>
  //     );
  //   }
  // }
  // renderMoreBtn(body, id, title, imageObj, ano, user, date) {
  //   var content = {
  //     image: imageObj,
  //     title: title,
  //     desc: body,
  //     ano: ano,
  //     user: user,
  //     date: date,
  //   };
  //   if (body.length > 100 && !this.state.expanded) {
  //     return (
  //       <button
  //         className="testi-more"
  //         onClick={() => {
  //           this.setState({ expanded: id, modal_content: content });
  //         }}
  //       >
  //         More...
  //       </button>
  //     );
  //   }
  // }
  // showMoreForCard(body, id, title, imageObj, ano, user, date) {
  //   var content = {
  //     image: imageObj,
  //     title: title,
  //     desc: body,
  //     ano: ano,
  //     user: user,
  //     date: date,
  //   };
  //   if (body.length > 100 && !this.state.expanded) {
  //     this.setState({ expanded: id, modal_content: content });
  //   }
  // }

  renderStories(stories) {
    if (stories.length === 0) {
      return (
        <div className="col-12 text-center">
          <p className="cool-font">
            {" "}
            There are not any testimonials yet. If you have a story to tell, let
            us know in the form below
          </p>
        </div>
      );
    }
    return stories.map((story, index) => {
      // const format = "MMM, Do YYYY";
      // const date = moment(story.created_at).format(format);
      // var creatorName = "Anonymous";
      // if (!story.anonymous) {
      //   creatorName = story.preferred_name ? story.preferred_name : creatorName; // This is to cover for all testimonials that were created before the anonymous feature
      //   if (story.preferred_name) {
      //     // Remember to remove this block when sam deletes the "from {community}" from the backend....
      //     creatorName = creatorName.split("from")[0];
      //   }
      // }
      // var body = "";
      // if (story.body.length > 0) {
      //   body =
      //     story.body.length > 80
      //       ? story.body.substring(0, 80) + "..."
      //       : story.body;
      // }
      var cn = "col-md-6 col-lg-6 col-sm-6 col-xs-12 mob-testy-card-fix";

      return (
        <div key={index} className={cn} style={{ marginBottom: 25 }}>
          <METestimonialCard
            {...story}
            links={this.props.links}
            readMore={this.readMore}
          />
          {/* <div className="">
            <div className="testi-card">
              <div>
                {this.renderImage(story.file)}
                <div
                  className="testi-para z-depth-1"
                  onClick={() => {
                    this.showMoreForCard(
                      story.body,
                      story.id,
                      story.title,
                      story.file,
                      story.anonymous,
                      story.preferred_name,
                      story.created_at
                    );
                  }}
                >
                  <p
                    style={{ marginBottom: 6, textTransform: "capitalize" }}
                    className="make-me-dark"
                  >
                    <b>
                      {story.title.length > 30
                        ? story.title.substring(0, 25) + "..."
                        : story.title}
                    </b>
                  </p>
                  <small className="story-name" style={{ fontSize: "69%" }}>
                    {creatorName}
                  </small>
                  <small
                    className="m-label round-me"
                    style={{ fontSize: "69%" }}
                  >
                    {date}
                  </small>
                  <p style={{ fontSize: "medium" }} className="make-me-dark">
                    {body}
                  </p>

                  {story.action ? (
                    <div>
                      <small style={{ color: "lightgray" }}>
                        This testimonial is about
                      </small>
                      <br />
                      <Link
                        to={`${this.props.links.actions}/${story.action.id}`}
                        className="testi-anchor"
                      >
                        {story.action.title > 70
                          ? story.action.title.substring(0, 70) + "..."
                          : story.action.title}
                      </Link>
                    </div>
                  ) : null}
                  {this.renderMoreBtn(
                    story.body,
                    story.id,
                    story.title,
                    story.file,
                    story.anonymous,
                    story.preferred_name,
                    story.created_at
                  )}
                </div>
              </div>
            </div>
          </div> */}
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
