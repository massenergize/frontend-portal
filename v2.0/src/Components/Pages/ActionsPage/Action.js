import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "../../Shared/Tooltip";
import ChooseHHForm from "./ChooseHHForm";
import StoryForm from "./StoryForm";
import { connect } from "react-redux";
import {
  reduxRemoveFromDone,
  reduxRemoveFromTodo
} from "../../../redux/actions/userActions";
import URLS from "../../../api/urls";
import { deleteJson } from "../../../api/functions";
/**
 * Action Component is a single action for the action page, 
 * the action displays conditionally based on the filters on the page
 * @props : 
    "id": the actions unique id
    "title": the title of the action
    "description": a long description to be shown on more info page
    "image": action's image
    "impact": level of impact (high medium low)
    "categories": categories of the action (Home Energy, Clean Transportation...)
    "cost": cost (high medium low)
    "tags": actions' tags (sustainable, heat ...)
    "match": match is passed from Route
 */

class Action extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      showTestimonialForm: false,
      message: null,
      action_is_done: null
    };
  }
  gotoAction() {
    window.location = `${this.props.links.actions +
      "/" +
      this.props.action.id}`;
  }

  removeFromCart = actionRel => {
    const status = actionRel.status;
    deleteJson(
      `${URLS.USER}/${this.props.user.id}/action/${actionRel.id}`
    ).then(json => {
      if (json.success) {
        if (status === "TODO") this.props.reduxRemoveFromTodo(actionRel);
        if (status === "DONE") {
          const remainder = this.props.done.filter(
            item => item.id !== actionRel.id
          );
          this.props.reduxRemoveFromDone(actionRel);
          //this.props.reduxLoadDone(remainder);
        }
      }
    });
  };

  actionIsInTodo() {
    var action = this.props.action;
    var todo = this.props.todo ? this.props.todo : [];
    var data = todo.filter(t => t.action.id === action.id);
    if (data.length > 0) {
      return data[0];
    } 

    return null;
  }
  actionIsDone() {
    var action = this.props.action;
    var done = this.props.done ? this.props.done : [];
    var data = done.filter(t => t.action.id === action.id);
    if (data.length > 0) {
      return data[0];
    }
    return null;
  }

  checkTodoAndReturn() {
    var action = this.props.action;
    var todo = this.props.todo ? this.props.todo : [];
    var exists =
      todo.filter(t => t.action.id === action.id).length > 0 ? true : false;
    if (exists) {
      return (
        <Tooltip text="You have already added this">
          <p className="has-tooltip thm-btn style-4 action-btns disabled indiv-done-it" 
          onClick={() => {
            this.removeFromCart(this.actionIsInTodo());
          }}
          >
            Add to Do
          </p>
        </Tooltip>
      );
    } else {
      return (
        <button
          className={
            this.state.status === "TODO"
              ? "thm-btn style-4 selected cool-font action-btns"
              : "thm-btn style-4 cool-font action-btns"
          }
          onClick={() => this.openForm("TODO")}
        >
          {" "}
          Add to Do{" "}
        </button>
      );
    }
  }
  checkDoneAndReturn() {
    var action = this.props.action;
    var done = this.props.done ? this.props.done : [];
    var exists =
      done.filter(t => t.action.id === action.id).length > 0 ? true : false;
    if (exists) {
      return (
        <Tooltip text="You have already done this. Check your profile to see your whole list.">
          <p
            className="has-tooltip thm-btn style-4 action-btns disabled indiv-done-it"
            onClick={() => {
              this.removeFromCart(this.actionIsDone());
            }}
          >
            Done It
          </p>
        </Tooltip>
      );
    } else {
      return (
        <button
          className={
            this.state.status === "DONE"
              ? "thm-btn style-4 selected cool-font action-btns"
              : "thm-btn style-4 cool-font action-btns"
          }
          onClick={() => this.openForm("DONE")}
        >
          {" "}
          Done It{" "}
        </button>
      );
    }
  }
  render() {
    if (!this.props.HHFormOpen && this.state.status)
      this.setState({ status: null });
    if (this.shouldRender()) {
      //checks if the action should render or not
      return (
        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
          <div className="single-shop-item m-action-item">
            <div
              className="img-box"
              onClick={() => {
                this.gotoAction();
              }}
            >
              {" "}
              {/* plug in the image here */}
              <Link to={this.props.links.actions + "/" + this.props.action.id}>
                <img
                  src={
                    this.props.action.image ? this.props.action.image.url : null
                  }
                  alt=""
                />
              </Link>
              {/* animated section on top of the image */}
              <figcaption className="overlay">
                <div className="box">
                  <div className="content">
                    {/* link is thisurl/id (links to the OneActionPage) */}
                    <Link
                      to={this.props.links.actions + "/" + this.props.action.id}
                    >
                      <i className="fa fa-link" aria-hidden="true"></i>
                    </Link>
                  </div>
                </div>
              </figcaption>
            </div>
            <div className="content-box">
              <div
                className="inner-box"
                onClick={() => {
                  this.gotoAction();
                }}
              >
                <h4>
                  <Link
                    className="cool-font"
                    to={this.props.links.actions + "/" + this.props.action.id}
                  >
                    {" "}
                    {this.props.action.title}{" "}
                  </Link>
                </h4>
              </div>
              {/* Impact and cost tags*/}
              <div
                className="price-box2"
                onClick={() => {
                  this.gotoAction();
                }}
              >
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
              {/* buttons for adding todo, marking as complete and getting more info */}
              <div className="price-box3" style={{ paddingTop: 18 }}>
                <div className="row no-gutter d-flex align-items-center">
                  <div className="col-sm-4 col-md-4 col-lg-4 col-4">
                    <div className="col-centered">
                      <Link
                        to={
                          this.props.links.actions + "/" + this.props.action.id
                        }
                        className="thm-btn style-4 action-btns cool-font"
                      >
                        {" "}
                        More Info
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-4 col-lg-4 col-4">
                    <div className="col-centered">
                      {!this.props.user ? (
                        <Tooltip text="Sign in to make a TODO list">
                          <p className="has-tooltip thm-btn style-4 action-btns disabled">
                            Add Todo
                          </p>
                        </Tooltip>
                      ) : 
                        this.checkTodoAndReturn()
                      
                      }
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
                      )
                     
                      }
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
                                closeForm={message =>
                                  this.setState({
                                    message: message,
                                    showTestimonialForm: false
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
                                  <button
                                    className="as-link"
                                    style={{ display: "inline-block" }}
                                    onClick={() =>
                                      this.setState({
                                        showTestimonialForm: true
                                      })
                                    }
                                  >
                                    testimonial
                                  </button>
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
                        moveToDone={(aid, hid) =>
                          this.props.moveToDone(aid, hid)
                        }
                        closeForm={this.closeForm}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  openForm = status => {
    this.setState({
      status: status
    });
    this.props.openHHForm(this.props.action.id);
  };
  closeForm = () => {
    this.setState({
      status: null
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
    this.props.action.tags.forEach(tag => {
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
    const tags = this.props.action.tags.filter(tag => {
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
    }
    return null;
  }
}

const mapStoreToProps = store => {
  return {
    links: store.links,
    todo: store.user.todo,
    done: store.user.done,
    collection: store.page.collection
  };
};
const mapDispatchToProps = {
  reduxRemoveFromDone,
  reduxRemoveFromTodo
};
export default connect(mapStoreToProps, mapDispatchToProps)(Action);
