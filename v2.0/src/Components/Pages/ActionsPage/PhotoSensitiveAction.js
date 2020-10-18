import React from "react";
import { Link } from "react-router-dom";
// import Tooltip from "../../Shared/Tooltip";
import ChooseHHForm from "./ChooseHHForm";
import StoryForm from "./StoryForm";
import { connect } from "react-redux";
import Tooltip from "../Widgets/CustomTooltip";
import {
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
} from "../../../redux/actions/userActions";
import { apiCall } from "../../../api/functions";
import MEButton from "../Widgets/MEButton";
import { getRandomIntegerInRange } from "../../Utils";
import METextView from "../Widgets/METextView";
import photo from "./try.png";
/**
 * Action Component is a single action for the action page,
 * the action displays conditionally based on the filters on the page
 * @prop
 * @prop id: the actions unique id
 * @prop title: the title of the action
 * @prop description: a long description to be shown on more info page
 * @prop image: action's image
 * @prop impact: level of impact (high medium low)
 * @prop categories: categories of the action (Home Energy, Clean Transportation...)
 * @prop cost: cost (high medium low)
 * @prop tags: actions' tags (sustainable, heat ...)
 * @prop  match: match is passed from Route
 */

class PhotoSensitiveAction extends React.Component {
  constructor(props) {
    super();
    this.state = {
      status: null,
      showTestimonialForm: false,
      message: null,
      action_is_done: null,
    };
  }

  removeFromCart = (actionRel) => {
    const status = actionRel.status;
    apiCall("users.actions.remove", { user_action_id: actionRel.id }).then(
      (json) => {
        if (json.success) {
          if (status === "TODO") this.props.reduxRemoveFromTodo(actionRel);
          if (status === "DONE") {
            this.props.done.filter((item) => item.id !== actionRel.id);
            this.props.reduxRemoveFromDone(actionRel);
            //this.props.reduxLoadDone(remainder);
          }
        }
      }
    );
  };

  actionIsInTodo() {
    var action = this.props.action;
    var todo = this.props.todo ? this.props.todo : [];
    var data = todo.filter((t) => t.action.id === action.id);
    if (data.length > 0) {
      return data[0];
    }

    return null;
  }
  actionIsDone() {
    var action = this.props.action;
    var done = this.props.done ? this.props.done : [];
    var data = done.filter((t) => t.action.id === action.id);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  }
  checkTodo() {
    var action = this.props.action;
    var todo = this.props.todo ? this.props.todo : [];
    var exists =
      todo.filter((t) => t.action.id === action.id).length > 0 ? true : false;
    return exists;
  }

  checkTodoAndReturn() {
    if (!this.props.user) {
      return (
        <Tooltip text="Sign in to make a TODO list">
          <p
            className="has-tooltip thm-btn style-4 action-btns disabled z-depth-1"
            style={{ marginLeft: 10 }}
          >
            To Do
          </p>
        </Tooltip>
      );
    }
    if (this.checkDone()) {
      return (
        <Tooltip text="Cant use this feature, you have already done the action.">
          <p
            className="has-tooltip thm-btn style-4 action-btns disabled indiv-done-it z-depth-1"
            style={{ margin: 6, marginLeft: 10 }}
          >
            To Do
          </p>
        </Tooltip>
      );
    }
    if (this.checkTodo()) {
      return (
        <Tooltip text="Thank you for adding this. Click again to remove.">
          <p
            style={{
              padding: "8px 20px",
              fontSize: "small",
              margin: 6,
              marginLeft: 10,
            }}
            className="has-tooltip thm-btn style-4 action-btns disabled indiv-done-it-orange z-depth-1"
            onClick={() => {
              this.setState({ showTodoMsg: false });
              this.removeFromCart(this.actionIsInTodo());
            }}
          >
            To Do
          </p>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip text="Add this to your TODO list">
          <MEButton
            onClick={() => this.openForm("TODO")}
            style={{ padding: "8px 20px", fontSize: 13 }}
          >
            ToDo
          </MEButton>
        </Tooltip>
      );
    }
  }
  checkDone() {
    var action = this.props.action;
    var done = this.props.done ? this.props.done : [];
    var exists =
      done.filter((t) => t.action.id === action.id).length > 0 ? true : false;
    return exists;
  }
  checkDoneAndReturn() {
    if (!this.props.user) {
      return (
        <Tooltip text="Sign in to mark actions as completed">
          <p
            className="has-tooltip thm-btn style-4 action-btns disabled z-depth-1"
            style={{ margin: 6, marginLeft: 10 }}
          >
            Done
          </p>
        </Tooltip>
      );
    }
    if (this.checkDone()) {
      return (
        <Tooltip text="Thanks for adding, click again to remove.">
          <p
            className="has-tooltip thm-btn style-4 action-btns disabled indiv-done-it-orange  z-depth-1"
            onClick={() => {
              this.setState({ message: null });
              this.removeFromCart(this.actionIsDone());
            }}
            style={{ margin: 6, marginLeft: 10 }}
          >
            Done
          </p>
        </Tooltip>
      );
    } else {
      return (
        // <Tooltip text="Mark as Done, if you've done this">
          <MEButton
            style={{ padding: "8px 20px", fontSize: 13 }}
            onClick={() => {
              this.openForm("DONE");
              this.props.toggleShowTodoMsg();
            }}
          >
            {" "}
            Done
          </MEButton>
        // </Tooltip>
      );
    }
  }
  getAnimationClass() {
    const classes = ["me-open-in", "me-open-in-slower", "me-open-in-slowest"];
    const index = getRandomIntegerInRange(3);
    return classes[index];
  }

  newRender() {
    return (
      <div
        className={`col-lg-6 col-md-12 col-sm-12 col-12 ${this.getAnimationClass()}`}
        style={{ padding: 10 }}
      >
        <div
          style={{ minHeight: 160, borderRadius: 10, border:"solid 2px #8dc343" }}
          className="z-depth-float"
        >
          <div className="new-action-btns-div me-anime-move-from-left-normal">
            {this.checkDoneAndReturn()}
            <br />
            {this.checkTodoAndReturn()}
            <br />
            <MEButton
              to={this.props.links.actions + "/" + this.props.action.id}
              style={{ padding: "8px 24px", fontSize: "small"}}
            >
              Info
            </MEButton>
            <br />
          </div>
          <img
            className="action-img-correction"
            // src={photo}
            src={this.props.action.image ? this.props.action.image.url : null}
            // style={{ width: "100%", objectFit: "contain", borderRadius: 10, height:160 }}
            alt="action image"
          />
          <div className="new-action-title-container">
            <METextView
              style={{ padding: "6px 14px", marginBottom: 3, color: "black" }}
            >
              {this.props.action.title}
            </METextView>
            {this.showNotifications()}
          </div>
        </div>
      </div>
    );
  }

  showNotifications() {
    return (
      <>
        {this.props.showTestimonialLink && (
          <div className="col-12">
            <div className="col-centered">
              <br></br>
              {this.props.showTestimonialLink ? (
                <>
                  {this.state.showTestimonialForm ? (
                    <>
                      <button
                        className="as-link"
                        onClick={() =>
                          this.setState({ showTestimonialForm: false })
                        }
                        style={{ margin: "auto" }}
                      >
                        {" "}
                        Cancel
                      </button>
                      <StoryForm
                        aid={this.props.action.id}
                        noMessage={true}
                        closeForm={(message) =>
                          this.setState({
                            message: message,
                            showTestimonialForm: false,
                          })
                        }
                      ></StoryForm>
                    </>
                  ) : (
                    <>
                      {this.state.message ? (
                        <p>{this.state.message}</p>
                      ) : (
                        <p
                          style={{
                            color: "#165020",
                            fontSize: "smaller",
                            paddingBottom: 14,
                            lineHeight: "1.3",
                          }}
                        >
                          Nice job! How was your experience with this action?
                          Tell us about it in a{" "}
                          <Link
                            to={
                              this.props.links
                                ? this.props.links.testimonials
                                : "#"
                            }
                          >
                            <button
                              className="as-link"
                              style={{ display: "inline-block" }}
                            >
                              testimonial
                            </button>
                          </Link>
                          .
                        </p>
                      )}
                    </>
                  )}
                </>
              ) : null}
              <ChooseHHForm
                aid={this.props.action.id}
                status={this.state.status}
                open={this.props.HHFormOpen}
                user={this.props.user}
                addToCart={(aid, hid, status) =>
                  this.props.addToCart(aid, hid, status)
                }
                inCart={(aid, hid, cart) => this.props.inCart(aid, hid, cart)}
                moveToDone={(aid, hid) => this.props.moveToDone(aid, hid)}
                closeForm={this.closeForm}
              />
              {this.props.showTodoMsg === this.props.action.id ? (
                <p
                  style={{
                    color: "#165020",
                    fontSize: "smaller",
                    paddingBottom: 14,
                    lineHeight: "1.3",
                  }}
                >
                  Nicely done! You have now added this action to your todo list.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </>
    );
  }
  render() {
    if (!this.props.HHFormOpen && this.state.status)
      this.setState({ status: null });
    if (this.shouldRender()) {
      return this.newRender();
      //checks if the action should render or not
      return (
        <div
          className={`col-lg-6 col-md-12 col-sm-12 col-12  ${this.getAnimationClass()}`}
        >
          <div className="z-depth-float" style={{ borderRadius: 15 }}>
            <div className="new-action-btns-div me-anime-move-from-left-normal">
              {/* <CustomTooltip text="Add this if done">
              <MEButton style={{ padding: "8px 20px", fontSize: "small" }}>
                Done
              </MEButton>
            </CustomTooltip> */}
              {this.checkDoneAndReturn()}
              <br />
              {this.checkTodoAndReturn()}
              {/* <MEButton style={{ padding: "8px 20px", fontSize: "small" }}>
              ToDo
            </MEButton> */}
              <br />
              <MEButton
                to={this.props.links.actions + "/" + this.props.action.id}
                style={{ padding: "8px 20px", fontSize: "small" }}
              >
                More
              </MEButton>
              <br />
            </div>
            <div
              className={`single-shop-item m-action-item action-background-card`}
            >
              <Link
                to={this.props.links.actions + "/" + this.props.action.id}
                style={{ color: "#999999", width: "100%", height: 210 }}
              >
                <div className="img-box">
                  <img
                    className="action-img-correction"
                    src={photo}
                    // src={
                    //   this.props.action.image
                    //     ? this.props.action.image.url
                    //     : null
                    // }
                    style={{ width: "100%", objectFit: "contain" }}
                    alt=""
                  />

                  <figcaption className="overlay">
                    <div className="box">
                      <div className="content">
                        <div
                          to={
                            this.props.links.actions +
                            "/" +
                            this.props.action.id
                          }
                        >
                          <i className="fa fa-link" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </figcaption>
                </div>
                {/* <METextView
                  containerStyle={{ display: "block" }}
                  style={{
                    padding: "10px 10px",
                    color: "black",
                    fontSize: "medium",
                    textAlign: "center",
                  }}
                >
                  {this.props.action.title}
                </METextView> */}
              </Link>
              {this.props.showTestimonialLink && (
                <div className="col-12">
                  <div className="col-centered">
                    <br></br>
                    {this.props.showTestimonialLink ? (
                      <>
                        {this.state.showTestimonialForm ? (
                          <>
                            <button
                              className="as-link"
                              onClick={() =>
                                this.setState({ showTestimonialForm: false })
                              }
                              style={{ margin: "auto" }}
                            >
                              {" "}
                              Cancel
                            </button>
                            <StoryForm
                              aid={this.props.action.id}
                              noMessage={true}
                              closeForm={(message) =>
                                this.setState({
                                  message: message,
                                  showTestimonialForm: false,
                                })
                              }
                            ></StoryForm>
                          </>
                        ) : (
                          <>
                            {this.state.message ? (
                              <p>{this.state.message}</p>
                            ) : (
                              <p
                                style={{
                                  color: "#165020",
                                  fontSize: "smaller",
                                  paddingBottom: 14,
                                  lineHeight: "1.3",
                                }}
                              >
                                Nice job! How was your experience with this
                                action? Tell us about it in a{" "}
                                <Link
                                  to={
                                    this.props.links
                                      ? this.props.links.testimonials
                                      : "#"
                                  }
                                >
                                  <button
                                    className="as-link"
                                    style={{ display: "inline-block" }}
                                  >
                                    testimonial
                                  </button>
                                </Link>
                                .
                              </p>
                            )}
                          </>
                        )}
                      </>
                    ) : null}
                    <ChooseHHForm
                      aid={this.props.action.id}
                      status={this.state.status}
                      open={this.props.HHFormOpen}
                      user={this.props.user}
                      addToCart={(aid, hid, status) =>
                        this.props.addToCart(aid, hid, status)
                      }
                      inCart={(aid, hid, cart) =>
                        this.props.inCart(aid, hid, cart)
                      }
                      moveToDone={(aid, hid) => this.props.moveToDone(aid, hid)}
                      closeForm={this.closeForm}
                    />
                    {this.props.showTodoMsg === this.props.action.id ? (
                      <p
                        style={{
                          color: "#165020",
                          fontSize: "smaller",
                          paddingBottom: 14,
                          lineHeight: "1.3",
                        }}
                      >
                        Nicely done! You have now added this action to your todo
                        list.
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            {/* <div className="content-box">
                <div
                  className="inner-box "
                  style={{
                    background:
                      "linear-gradient(to right, rgb(88 152 0), rgb(255, 122, 9))",
                  }}
                >
                  <h4
                    className="cool-font"
                    style={{ fontSize: "1.1rem", color: "white" }}
                  >
                    {this.props.action.title}
                  </h4>
                </div>
   
                <div className="price-box2">
                  <div className="clearfix">
                    <div className="float_left">
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
                    <div className="float_right">
                      Cost
                      <span>
                        {" "}
                        {this.renderCost(this.getTag("cost"), "cost")}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
    
            <div className="price-box3" style={{ paddingTop: 18 }}>
              <div className="row no-gutter d-flex align-items-center">
                <div className="col-sm-4 col-md-4 col-lg-4 col-4">
                  <div className="col-centered">
                    <MEButton
                      to={this.props.links.actions + "/" + this.props.action.id}
                      style={{ padding: "8px 14px", fontSize: 13 }}
                    >
                      {" "}
                      More Info
                    </MEButton>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 col-lg-4 col-4">
                  <div className="col-centered">
                    {!this.props.user ? (
                      <Tooltip text="Sign in to make a TODO list">
                        <p className="has-tooltip thm-btn style-4 action-btns disabled">
                          To Do
                        </p>
                      </Tooltip>
                    ) : (
                      this.checkTodoAndReturn()
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 col-lg-4 col-4">
                  <div className="col-centered">
                    {!this.props.user ? (
                      <Tooltip text="Sign in to mark actions as completed">
                        <p className="has-tooltip thm-btn style-4 action-btns disabled">
                          Done It
                        </p>
                      </Tooltip>
                    ) : (
                      this.checkDoneAndReturn()
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="col-centered">
                    <br></br>
                    {this.props.showTestimonialLink ? (
                      <>
                        {this.state.showTestimonialForm ? (
                          <>
                            <button
                              className="as-link"
                              onClick={() =>
                                this.setState({ showTestimonialForm: false })
                              }
                              style={{ margin: "auto" }}
                            >
                              {" "}
                              Cancel
                            </button>
                            <StoryForm
                              aid={this.props.action.id}
                              noMessage={true}
                              closeForm={(message) =>
                                this.setState({
                                  message: message,
                                  showTestimonialForm: false,
                                })
                              }
                            ></StoryForm>
                          </>
                        ) : (
                          <>
                            {this.state.message ? (
                              <p>{this.state.message}</p>
                            ) : (
                              <p>
                                Nice job! How was your experience with this
                                action? Tell us about it in a{" "}
                                <Link
                                  to={
                                    this.props.links
                                      ? this.props.links.testimonials
                                      : "#"
                                  }
                                >
                                  <button
                                    className="as-link"
                                    style={{ display: "inline-block" }}
                                  >
                                    testimonial
                                  </button>
                                </Link>
                                .
                              </p>
                            )}
                          </>
                        )}
                      </>
                    ) : null}
                    <ChooseHHForm
                      aid={this.props.action.id}
                      status={this.state.status}
                      open={this.props.HHFormOpen}
                      user={this.props.user}
                      addToCart={(aid, hid, status) =>
                        this.props.addToCart(aid, hid, status)
                      }
                      inCart={(aid, hid, cart) =>
                        this.props.inCart(aid, hid, cart)
                      }
                      moveToDone={(aid, hid) => this.props.moveToDone(aid, hid)}
                      closeForm={this.closeForm}
                    />
                    {this.props.showTodoMsg === this.props.action.id ? (
                      <p>
                        Nicely done! You have now added this action to your todo
                        list.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              
            </div> */}
          </div>
          <METextView
            containerStyle={{ display: "block" }}
            style={{
              padding: "10px 10px",
              color: "black",
              fontSize: "medium",
              textAlign: "center",
            }}
          >
            {this.props.action.title}
          </METextView>
        </div>
      );
    } else {
      return null;
    }
  }

  openForm = (status) => {
    this.setState({
      status: status,
    });
    this.props.openHHForm(this.props.action.id);
  };
  closeForm = () => {
    this.setState({
      status: null,
    });
    this.props.closeHHForm();
  };
  //checks the filters to see if the action should render or not
  shouldRender() {
    //if the search does not fit return false
    //search fits if the exact string(lowercase) is in the title or description of an action
    //can make more advanced search later
    if (
      !(
        this.searchFits(this.props.action.title) ||
        this.searchFits(this.props.action.description)
      )
    )
      return false;

    var tagSet = new Set(); //create a set of the action's tag ids
    this.props.action.tags.forEach((tag) => {
      tagSet.add(tag.id);
    });

    for (var i in this.props.tagCols) {
      var tagCol = this.props.tagCols[i]; //if any filter does not fit, return false
      if (!this.filterFits(tagCol.tags, tagSet)) {
        return false;
      }
    }
    return true; //if they all fit return true
  }
  //checks if the value of the search bar is in the title of the action
  searchFits(string) {
    var searchbar = document.getElementById("action-searchbar");
    if (!searchbar || searchbar.value === "")
      //if cant find the search bar just render everything
      return true;
    if (!string) return false;
    if (string.toLowerCase().includes(searchbar.value.toLowerCase())) {
      return true;
    }
    return false;
  }
  //checks if any of the options are checked off in the filter
  //takes in the the filter and the actions' options for that filter
  filterFits(filtertags, tagSet) {
    var noFilter = true; //go through the filters and check if any of them fit or if none are checked
    for (var i in filtertags) {
      var checkbox = document.getElementById("filtertag" + filtertags[i].id);
      if (checkbox && checkbox.checked) {
        noFilter = false;
        if (tagSet.has(filtertags[i].id)) return true;
      }
    }
    return noFilter;
  }

  // getParticularCollection(name) {
  // 	const cols = this.props.collection;
  // 	if (cols) {
  // 		const col = cols.filter(item => {
  // 			return item.name.toLowerCase() === name.toLowerCase();
  // 		});
  // 		return col ? col[0] : null;
  // 	}
  // 	return null;
  // }

  getTag(name) {
    const tags = this.props.action.tags.filter((tag) => {
      return tag.tag_collection_name.toLowerCase() === name.toLowerCase();
    });
    return tags && tags.length > 0 ? tags[0] : null;
  }

  renderTagBar(tag, name) {
    const diff = name.toLowerCase() === "difficulty".toLowerCase();
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
}

const mapStoreToProps = (store) => {
  return {
    links: store.links,
    todo: store.user.todo,
    done: store.user.done,
    collection: store.page.collection,
  };
};
const mapDispatchToProps = {
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
};
export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(PhotoSensitiveAction);
