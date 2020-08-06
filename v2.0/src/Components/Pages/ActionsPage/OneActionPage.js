import React from "react";
import { apiCall } from "../../../api/functions";
import LoadingCircle from "../../Shared/LoadingCircle";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ErrorPage from "./../Errors/ErrorPage";
import Cart from "../../Shared/Cart";
import StoryForm from "./StoryForm";
import ChooseHHForm from "./ChooseHHForm";
import {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
} from "../../../redux/actions/userActions";
import {
  reduxChangeData,
  reduxTeamAddAction,
} from "../../../redux/actions/pageActions";
import Tooltip from "../../Shared/Tooltip";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import * as moment from "moment";
import CustomTooltip from "../Widgets/CustomTooltip";
import ShareButtons from "../../Shared/ShareButtons";
import { Helmet } from "react-helmet";

/**
 * This page displays a single action and the cart of actions that have been added to todo and have been completed
 * @props : match.params.id: the id of the action from the url params match is from Route
 */
class OneActionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      limit: 140,
      expanded: null,
      showTestimonialLink: false,
      numberToShow: 3,
      tab: "description",
      question: null,
      action: null,
      showTodoMsg: false,
      loading: true
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.chooseFontSize);

    const { id } = this.props.match.params;
    this.fetch(id);
  }

  //componentDidUpdate() {
  //  if (
  //    !this.loading &&
  //    (!this.state.action || this.props.match.params !== this.state.action.id)
  //  ) {
  //    const { id } = this.props.match.params;
  //    this.fetch(id);
  //  }
  // }

  async fetch(id) {
    try {
      const json = await apiCall("actions.info", { action_id: id });
      if (json.success) {
        this.setState({ action: json.data });
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const action = this.getMyAction();
    if (this.state.loading) {
      return <LoadingCircle />;
    }

    if (!action || this.state.error) {
      return <ErrorPage
        errorMessage="Unable to load this Action"
        errorDescription={this.state.error ? this.state.error : "Unknown cause"}
      />;
    }
    this.chooseFontSize();
    return (
      <>
        <Helmet>
          <meta property="og:title" content={action.title} />
          <meta property="og:image" content={action.image && action.image.url} />
          <meta property="og:description" content={action.featured_summary} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.actions, name: "All Actions" },
              { name: action ? action.title : "..." }
            ]}
          />

          <section className="shop-single-area" style={{ paddingTop: 0 }}>
            <div className="container">
              <div
                className="row"
                style={{ paddingRight: "0px", marginRight: "0px" }}
              >
                <div className="col-md-9">
                  <div className="single-products-details">
                    {this.renderAction(action)}
                  </div>
                </div>
                {/* makes the todo and completed actions carts */}
                {this.props.user ? (
                  <div
                    className="col-md-3"
                    style={{ paddingRight: "0px", marginRight: "0px" }}
                  >
                    <Cart
                      title="To Do List"
                      actionRels={this.props.todo}
                      status="TODO"
                      moveToDone={this.moveToDone}
                    />
                    <Cart
                      title="Completed Actions"
                      actionRels={this.props.done}
                      status="DONE"
                      moveToDone={this.moveToDone}
                    />
                  </div>
                ) : (
                    <div
                      className="col-md-4"
                      style={{ paddingRight: "0px", marginRight: "0px" }}
                    >
                      <p>
                        <Link to={this.props.links.signin}> Sign In </Link> to add
                      actions to your todo list or to mark them as complete
                    </p>
                    </div>
                  )}
              </div>
            </div>
            <br />
            <ShareButtons label="Share this action!" pageTitle={action.title} pageDescription={action.featured_summary} url={window.location.href} />
          </section>
        </div>
      </>
    );
  }

  getMyAction() {
    return this.state.action;
  }

  /* getParticularCollection(name) {
		const cols = this.props.collection;
		if (cols) {
			const col = cols.filter(item => {
				return item.name.toLowerCase() === name.toLowerCase();
			});
			return col ? col[0] : null;
		}
	} */

  getTag(name) {
    const tags = this.getMyAction().tags.filter((tag) => {
      return tag.tag_collection_name.toLowerCase() === name.toLowerCase();
    });
    return tags && tags.length > 0 ? tags[0] : null;
  }

  renderTagBar(tag, name) {
    const diff = name.toLowerCase() === "Cost".toLowerCase() ? true : false;
    if (tag) {
      if (tag.points === 1) {
        return (
          <div>
            <div className={`tag-bar ${diff ? "d-one" : "one"}`}></div>
          </div>
        );
      }
      if (tag.points === 2) {
        return (
          <div>
            <div className={`tag-bar ${diff ? "d-one" : "one"}`} />
            <div className={`tag-bar ${diff ? "d-two" : "two"}`} />
          </div>
        );
      }
      if (tag.points === 3) {
        return (
          <div>
            <div className={`tag-bar ${diff ? "d-one" : "one"}`} />
            <div className={`tag-bar ${diff ? "d-two" : "two"}`} />
            <div className={`tag-bar ${diff ? "d-three" : "three"}`} />
          </div>
        );
      }
    }
    return null;
  }

  /* tag.points is a crude hardcoding; should just text align center and show tag name */
  renderCost(tag, name) {
    if (tag) {
      if (tag.points === 1) {
        return <div>&nbsp;&nbsp;&nbsp;&nbsp;$</div>;
      }
      if (tag.points === 2) {
        return <div>&nbsp;&nbsp;$$</div>;
      }
      if (tag.points === 3) {
        return <div>&nbsp;$$$</div>;
      }
      if (tag.name) {
        return <div>&nbsp;&nbsp;&nbsp;&nbsp;{tag.name}</div>;
      }
    }
    return null;
  }

  /**
   * renders the action on the page
   */

  sendQuestion() {
    var text = this.refs.question_body.value;
    if (text.trim() === "") {
      alert("Please type a question. Thank you!");
      return;
    }
    this.refs.question_body.value = "";
    apiCall("send-question", { question: this.state.question }).then((res) => {
      if (res.success) {
        alert("Your message has been sent. Thank you for taking the time!");
      }
    });
  }
  actionIsInTodo() {
    var action = this.getMyAction();
    var todo = this.props.todo ? this.props.todo : [];
    var data = todo.filter((t) => t.action.id === action.id);
    if (data.length > 0) {
      return data[0];
    }

    return null;
  }
  actionIsDone() {
    var action = this.getMyAction();
    var done = this.props.done ? this.props.done : [];
    var data = done.filter((t) => t.action.id === action.id);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  }
  removeFromCart = (actionRel) => {
    const status = actionRel.status;
    if(status !== 'TODO' || status !== 'DONE') return;

    apiCall('users.actions.remove', { is: actionRel.id}).then((json) => {
      if (json.success) {
        if (status === "TODO") this.props.reduxRemoveFromTodo(actionRel);
        if (status === "DONE") {
          this.props.done.filter((item) => item.id !== actionRel.id);
          this.props.reduxRemoveFromDone(actionRel);
          //this.props.reduxLoadDone(remainder);
        }
      }
    });
  };
  checkTodoAndReturn() {
    var action = this.getMyAction();
    var todo = this.props.todo ? this.props.todo : [];
    var exists =
      todo.filter((t) => t.action.id === action.id).length > 0 ? true : false;

    if (this.checkDone()) {
      return (
        <CustomTooltip text="Can't use this feature, you have already done the action">
          <p className="has-tooltip thm-btn style-4 action-btns disabled  mob-font indiv-done-it line-me ">
            To Do
          </p>
        </CustomTooltip>
      );
    }
    if (exists) {
      return (
        <CustomTooltip text="Thank you for adding this. Click again to remove.">
          <p
            className="has-tooltip thm-btn style-4 action-btns disabled  mob-font indiv-done-it-orange line-me"
            onClick={() => {
              this.setState({ showTodoMsg: false })
              this.removeFromCart(this.actionIsInTodo());
            }}
          >
            To Do
          </p>
        </CustomTooltip>
      );
    } else {
      return (
        <button
          className={
            this.state.status === "TODO"
              ? " thm-btn action-btns cool-font style-4 selected mob-font line-me "
              : "thm-btn style-4 action-btns cool-font mob-font line-me"
          }
          onClick={() => this.openForm("TODO")}
        >
          To Do
        </button>
      );
    }
  }
  checkDone() {
    var action = this.getMyAction();
    var done = this.props.done ? this.props.done : [];
    var exists =
      done.filter((t) => t.action.id === action.id).length > 0 ? true : false;
    return exists;
  }
  checkDoneAndReturn() {
    if (this.checkDone()) {
      return (

        <CustomTooltip text="Thanks for adding, click again to remove.">
          <p
            className="thm-btn style-4 action-btns disabled indiv-done-it-orange"
            onClick={() => {
              this.setState({ showTestimonialLink: false });
              this.removeFromCart(this.actionIsDone());
            }}
          >
            Done It
          </p>
        </CustomTooltip>
      );
    } else {
      return (
        <button
          className={
            this.state.status === "DONE"
              ? "thm-btn style-4 selected action-btns cool-font  mob-font line-me green-done-it-correction"
              : "thm-btn style-4 action-btns  cool-font mob-font line-me green-done-it-correction"
          }
          onClick={() => {
            this.openForm("DONE");
            this.setState({ showTodoMsg: false });
          }}
        >
          {" "}
          Done It
        </button>
      );
    }
  }
  renderAction(action) {
    if (!this.props.stories) {
      return <LoadingCircle />;
    }

    const community = this.props.communityData
      ? this.props.communityData.community
      : null;

    const login_link = community ? community.name : "";
    const stories = this.props.stories.filter((story) => {
      if (story.action) {
        return story.action.id === Number(this.props.match.params.id);
      }
      return false;
    });

    // actions are available if they aren't deleted and the action community is same as the current community (assuming we know it)
    const action_available = action.is_deleted
      ? false
      : community
        ? community.id === action.community.id
        : true;

    return (
      <div>
        <div className="product-content-box">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              {/* title */}
              <div className="content-box">
                <h2
                  className="cool-font"
                  style={{ padding: "20px 0px 0px 0px" }}
                >
                  {action.title}
                </h2>
              </div>
              {/* displays the action's info: impact, difficulty, tags and categories*/}
              <div style={{ padding: 15, position: "relative" }}>
                <div className="" style={{ display: "inline-block" }}>
                  <Tooltip
                    text="Shows the level of impact this action makes relative to the other actions."
                    dir="top"
                  >
                    <span className="has-tooltip">Impact</span>
                  </Tooltip>
                  <span>
                    {this.renderTagBar(this.getTag("impact"), "impact")}
                  </span>
                </div>
                <div className="float_right" style={{ marginRight: 50 }}>
                  Cost
                  <span> {this.renderCost(this.getTag("cost"), "cost")} </span>
                </div>
              </div>

              {
                /* displays ToDo and Done buttons if action is available in this community and not deleted*/
                action_available ? (
                  <div
                    className="clearfix"
                    style={{
                      position: "relative",
                      marginLeft: "40px",
                      marginTop: 10,
                    }}
                  >
                    {/* <p className="action-tags" style={{ fontSize: "20px" }}> Tags: <br />
									{this.renderTags(action.tags)}
								</p> */}
                    <div className="btn-envelope">
                      {!this.props.user ? (
                        <CustomTooltip text="Sign in to make a TODO list">
                          <p className=" has-tooltip thm-btn style-4 disabled action-btns line-me mob-font">
                            To Do
                        </p>
                        </CustomTooltip>
                      ) : (
                          this.checkTodoAndReturn()
                        )}
                    &nbsp;
                    {!this.props.user ? (
                        <CustomTooltip text="Sign in to mark actions as completed">
                          <p className=" has-tooltip thm-btn style-4 disabled action-btns mob-font">
                            Done It
                        </p>
                        </CustomTooltip>
                      ) : (
                          this.checkDoneAndReturn()
                        )}
                    </div>
                    {this.state.status ? (
                      <div style={{ paddingTop: "20px" }}>
                        <ChooseHHForm
                          aid={action.id}
                          status={this.state.status}
                          open={this.state.status ? true : false}
                          user={this.props.user}
                          addToCart={(aid, hid, status) =>
                            this.addToCart(aid, hid, status)
                          }
                          inCart={(aid, hid, cart) =>
                            this.inCart(aid, hid, cart)
                          }
                          moveToDone={(aid, hid) =>
                            this.moveToDoneByActionId(aid, hid)
                          }
                          closeForm={this.closeForm}
                        />{" "}
                      </div>
                    ) : null}
                    {this.state.showTestimonialLink ? (
                      <div>
                        <p style={{ marginTop: 30, fontSize: 15 }} className="phone-vanish">
                          Nice job! How was your experience with this action?
                          Tell us about it in a{" "}
                          <a
                            href="#testimonials-form"
                            className="as-link"
                            style={{ display: "inline-block" }}
                            onClick={() =>
                              this.setState({ tab: "testimonials" })
                            }
                          >
                            testimonial
                          </a>
                          .
                        </p>
                        <p className="pc-vanish" style={{ marginTop: 30, fontSize: 15 }}>
                          Nice job! How was your experience with this action?
                          Tell us about it in a Tell us about it in a{" "}
                          <a
                            href={this.props.links.testimonials}
                            className="as-link"
                            style={{ display: "inline-block" }}
                          >
                            testimonial
                          </a>
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                    <div className="cool-font">
                      This action is not available. It was from a different
                      community or was deleted.
                    </div>
                  )
              }
              {this.state.showTodoMsg ? (
                <p style={{ fontSize: 15, marginLeft: 20, marginTop: 9 }}>
                  Nicely done! You have now added this action to your todo list.
                </p>
              ) : null}
            </div>
            {/* action image */}
            <div className="col-lg-6 col-md-12">
              <div className="img-box action-pic-fix">
                <img
                  src={action.image ? action.image.url : null}
                  alt=""
                  data-imagezoom="true"
                  className="img-responsive raise"
                  style={{ marginTop: "20px", borderRadius: 9 }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* tab box holding description, steps to take, and stories about the action */}
        <div className="product-tab-box">
          <ul className="nav nav-tabs tab-menu">
            {/* tab switching system, may be a better way to do this */}
            <li
              id="desctab"
              className={this.state.tab === "description" ? "active" : ""}
            >
              <button
                className="cool-font"
                style={{ fontSize: this.state.fontSize }}
                onClick={() => {
                  this.setState({ tab: "description" });
                }}
                data-toggle="tab"
              >
                Description
              </button>
            </li>
            <li
              id="stepstab"
              className={this.state.tab === "steps" ? "active" : ""}
            >
              <button
                className="cool-font"
                style={{ fontSize: this.state.fontSize }}
                onClick={() => {
                  this.setState({ tab: "steps" });
                }}
                data-toggle="tab"
              >
                Steps To Take
              </button>
            </li>
            <li
              id="reviewtab"
              className={this.state.tab === "testimonials" ? "active" : ""}
            >
              <button
                className="cool-font"
                style={{ fontSize: this.state.fontSize }}
                onClick={() => {
                  this.setState({ tab: "testimonials" });
                }}
                data-toggle="tab"
              >
                Testimonials
              </button>
            </li>
            {false ? (
              <li
                id="reviewtab"
                className={this.state.tab === "question" ? "active" : ""}
              >
                <button
                  className="cool-font"
                  style={{ fontSize: this.state.fontSize }}
                  onClick={() => {
                    this.setState({ tab: "question" });
                  }}
                  data-toggle="tab"
                >
                  Ask A Question
                </button>
              </li>
            ) : null}
            {action.deep_dive && action.deep_dive !== "<p><br></p>" ? (
              <li
                id="deeptab"
                className={this.state.tab === "deep" ? "active" : ""}
              >
                <button
                  className="cool-font"
                  style={{ fontSize: this.state.fontSize }}
                  onClick={() => {
                    this.setState({ tab: "deep" });
                  }}
                  data-toggle="tab"
                >
                  Deep Dive
                </button>
              </li>
            ) : null}
          </ul>
          <div className="tab-content">
            {/* description */}
            <div
              className={
                this.state.tab === "description"
                  ? "tab-pane active cool-font"
                  : "tab-pane cool-font"
              }
              id="desc"
            >
              <div className="product-details-content">
                <div className="desc-content-box">
                  <p
                    className="cool-font make-me-dark"
                    dangerouslySetInnerHTML={{ __html: action.about }}
                  ></p>
                </div>
              </div>
            </div>
            {/* steps to take */}
            <div
              className={
                this.state.tab === "steps"
                  ? "tab-pane active cool-font"
                  : "tab-pane cool-font"
              }
              id="steps"
            >
              <div className="product-details-content">
                <div className="desc-content-box">
                  <p
                    className="cool-font make-me-dark"
                    dangerouslySetInnerHTML={{ __html: action.steps_to_take }}
                  ></p>
                </div>
              </div>
            </div>
            {/* if it has deep dive */}
            <div
              className={
                this.state.tab === "deep"
                  ? "tab-pane active cool-font"
                  : "tab-pane cool-font"
              }
              id="deep"
            >
              <div className="product-details-content">
                <div className="desc-content-box">
                  <p
                    className="cool-font make-me-dark"
                    dangerouslySetInnerHTML={{ __html: action.deep_dive }}
                  ></p>
                  {/* <p className="cool-font" > <center>Coming Soon...!</center></p> */}
                </div>
              </div>
            </div>
            <div
              className={
                this.state.tab === "question"
                  ? "tab-pane active cool-font"
                  : "tab-pane cool-font"
              }
              id="question"
            >
              <div className="product-details-content clearfix">
                <div className="desc-content-box clearfix">
                  {/* <p className="cool-font" dangerouslySetInnerHTML={{ __html: action.steps_to_take }}></p> */}
                  <textarea
                    className="form-control"
                    ref="question_body"
                    rows={5}
                    style={{ padding: 25 }}
                    placeholder="Please type your question here..."
                  />
                  {this.props.user ? (
                    <button
                      onClick={() => {
                        this.sendQuestion();
                      }}
                      style={{ marginTop: 10, padding: "14px 41px" }}
                      className="btn btn-success round-me pull-right"
                    >
                      Send Question
                    </button>
                  ) : (
                      <a
                        href={"/" + login_link + "/signin"}
                        style={{
                          marginTop: 10,
                          padding: "14px 41px",
                          background: "gray",
                          border: "gray",
                          color: "white",
                          textDecoration: "none",
                        }}
                        className="btn btn-success round-me pull-right"
                      >
                        Sign In To Send
                      </a>
                    )}
                </div>
              </div>
            </div>
            <div
              className={
                this.state.tab === "testimonials"
                  ? "tab-pane active cool-font"
                  : "tab-pane cool-font"
              }
              id="review"
            >
              <div className="review-box make-me-dark">
                {/* Reviews */}
                {this.renderStories(stories)}
                {this.state.numberToShow < stories.length ? (
                  <button
                    style={{ margin: "0 auto 30px auto" }}
                    className="as-link"
                    onClick={() =>
                      this.setState({ numberToShow: stories.length })
                    }
                  >
                    {" "}
                    Show all Testimonials{" "}
                  </button>
                ) : null}
              </div>
              {/* form to fill out to tell your own story */}
              {this.props.user ? (
                <div id="testimonials-form">
                  <StoryForm
                    uid={this.props.user.id}
                    aid={action.id}
                    addStory={this.addStory}
                  />
                </div>
              ) : (
                  <p className="make-me-dark">
                    <Link to={this.props.links.signin}> Sign In </Link> to submit
                  your own story about taking this Action
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  chooseFontSize = () => {
    var fontSize = "16px";
    if (window.innerWidth < 500) {
      fontSize = "12px";
    }
    if (fontSize !== this.state.fontSize) {
      this.setState({
        fontSize: fontSize,
      });
    }
  };
  openForm = (status) => {
    this.setState({
      status: status,
    });
  };
  closeForm = () => {
    this.setState({
      status: null,
    });
  };

  renderTags(tags) {
    return Object.keys(tags).map((key) => {
      var tagColName = "";
      if (tags[key].tag_collection.name !== "Category") {
        tagColName = tags[key].tag_collection.name + "-";
      }
      return (
        <span key={key}>
          {" "}
          {tagColName}
          <i>{tags[key].name}</i>{" "}
        </span>
      );
    });
  }
  renderStories = (stories) => {
    if (stories.length === 0) return <p> No stories about this action yet </p>;
    return (
      <>
        {/* <div className="tab-title-h4">
                    <h4>{stories.length} Stories about this Action</h4>
                </div> */}
        {Object.keys(stories).map((key) => {
          var creatorName = "Unknown user";
          const story = stories[key];
          if (!story.anononymous) {
            creatorName = story.preferred_name
              ? story.preferred_name
              : creatorName;
          }
          const format = "MMMM Do YYYY";
          const date = moment(story.created_at).format(format);
          if (key < this.state.numberToShow) {
            return (
              <div
                className="single-review-box"
                style={{ paddingLeft: 0, paddingBottom: 5 }}
                key={key}
              >
                <div className="img-holder">
                  <img src="" alt="" />
                </div>
                <div className="text-holder">
                  <div className="top">
                    <div className="name pull-left">
                      <h4>{story.title} </h4>
                    </div>
                  </div>
                  <div className="text">
                    <h6>
                      <small className="story-name">{creatorName}</small>
                      <small className="m-label round-me">{date}</small>
                      {this.state.expanded &&
                        this.state.expanded === story.id ? (
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
                            more...
                          </button>
                        ) : null}
                    </p>
                  </div>
                  {story.vendor ? (
                    <div className="text">
                      <p>
                        Linked Service Provider:{" "}
                        <Link
                          to={`${this.props.links.services}/${story.vendor.id}`}
                        >
                          {story.vendor.name}
                        </Link>
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          } else {
            return <div key={key}/>;
          }
        })}
      </>
    );
  };
  // on change in any category or tag checkbox update the actionsPage
  handleChange() {
    this.forceUpdate();
  }
  /**
   * These are the Cart functions
   */

  /**
   * These are the cart functions
   */
  inCart = (aid, hid, cart) => {
    if (!this.props.todo) return false;
    const checkTodo = this.props.todo.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    });
    if (cart === "TODO") {
      return checkTodo.length > 0;
    }

    if (!this.props.done) return false;
    const checkDone = this.props.done.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    });
    if (cart === "DONE") return checkDone.length > 0;

    return checkTodo.length > 0 || checkDone.length > 0;
  };
  moveToDone = (actionRel) => {
    const body = {
      action_id: actionRel.action.id,
      household_id: actionRel.real_estate_unit.id,
    };
    apiCall( 'users.actions.completed.add', body )
      .then((json) => {
        if (json.success) {
          this.setState({ showTestimonialLink: true });
          this.props.reduxMoveToDone(json.data);
          this.addToImpact(json.data.action);
        }
        //just update the state here
      })
      .catch((err) => {
        console.log(err);
      });
  };
  moveToDoneByActionId(aid, hid) {
    const actionRel = this.props.todo.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    })[0];
    if (actionRel) this.moveToDone(actionRel);
  }
  addToCart = (aid, hid, status) => {
    if(status !== 'TODO' || status !== 'DONE') return;

    const route = status === "TODO" ? 'users.actions.todo.add' : 'users.actions.completed.add'
    const body = {
      action_id: aid,
      household_id: hid,
    };
    apiCall(route, body)
      .then((json) => {
        if (json.success) {
          //set the state here
          if (status === "TODO") {
            this.props.reduxAddToTodo(json.data);
            this.setState({ showTodoMsg: aid });
          } else if (status === "DONE") {
            this.setState({ showTestimonialLink: true });
            this.props.reduxAddToDone(json.data);
            this.addToImpact(json.data.action);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addToImpact(action) {
    this.changeDataByName("ActionsCompletedData", 1);
    action.tags.forEach((tag) => {
      if (tag.tag_collection && tag.tag_collection.name === "Category") {
        this.changeData(tag.id, 1);
      }
    });
    Object.keys(this.props.user.teams).forEach((key) => {
      this.props.reduxTeamAddAction(this.props.user.teams[key]);
    });
  }
  changeDataByName(name, number) {
    if (!this.props.communityData) return null;
    var data = this.props.communityData.filter((data) => {
      return data.name === name;
    })[0];

    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall('data.update', body).then((json) => {
      console.log(json);
      if (json.success) {
        data = {
          ...data,
          value: data.value + number > 0 ? data.value + number : 0,
        };
        this.props.reduxChangeData(data);
      }
    });
  }
  changeData(tagid, number) {
    var data = this.props.communityData.filter((data) => {
      if (data.tag) {
        console.log(data.tag);
        return data.tag === tagid;
      }
      return false;
    })[0];
    if (!data) {
      console.log("no data stored for tag " + tagid);
      return;
    }
    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };

    apiCall('data.update', body).then((json) => {
      console.log(json);
      if (json.success) {
        data = {
          ...data,
          value: data.value + number > 0 ? data.value + number : 0,
        };
        this.props.reduxChangeData(data);
      }
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    auth: store.firebase.auth,
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    actions: store.page.actions,
    stories: store.page.testimonials,
    communityData: store.page.communityData,
    links: store.links,
    collection: store.page.collection,
  };
};
const mapDispatchToProps = {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
  reduxChangeData,
  reduxTeamAddAction,
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
};

export default connect(mapStoreToProps, mapDispatchToProps)(OneActionPage);
