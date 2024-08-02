import React from "react";
import "./PhotosensitiveCard.css";
import { Link, withRouter } from "react-router-dom";
import StoryForm from "./StoryForm";
import { connect } from "react-redux";
import {
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
} from "../../../redux/actions/userActions";
import { apiCall } from "../../../api/functions";
import MEButton from "../Widgets/MEButton";
import {
  DEFAULT_STATE,
  DONE,
  IS_DONE,
  IS_IN_TODO,
  NO_AUTH,
  TODO,
} from "./ActionStateConstants";
import MEChameleonButton from "./MEChameleonButton";
import MEAnimation from "../../Shared/Classes/MEAnimation";
import { makeStringFromArrOfObjects } from "../../Utils";
import {
  reduxLoadActions,
  reduxToggleGuestAuthDialog,
  reduxToggleUniversalModal,
} from "../../../redux/actions/pageActions";
import METooltip from "../../Shared/METooltip";
import RibbonBanner from "../../Shared/RibbonBanner";
import fallback from "./../../../assets/images/fb.svg";
export const ACTION_TO_AUTO_START = "AUTO_START-";

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

// was called PhotSensitiveAction
class ActionCard extends React.Component {
  constructor(props) {
    super();
    this.state = {
      status: null,
      showTestimonialForm: false,
      message: null,
      action_is_done: null,
    };
  }

  // NOTE: This routine currently duplicated in ActionCard, ChooseHHForm, OneActionPage, Cart
  // any changes need to be same in all 4 locations
  removeFromCart = (actionRel) => {
    const status = actionRel.status;
    apiCall("users.actions.remove", { user_action_id: actionRel.id }).then(
      (json) => {
        if (json.success) {
          if (status === "TODO") this.props.reduxRemoveFromTodo(actionRel);
          if (status === "DONE") {
            this.props.done.filter((item) => item.id !== actionRel.id);
            this.props.reduxRemoveFromDone(actionRel);
          }
        }
      }
    );
  };

  actionIsInTodo() {
    var action = this.props.action;
    var todo = this.props.todo ? this.props.todo : [];
    return todo.find((t) => t.action.id === action.id);
  }
  actionIsDone() {
    var action = this.props.action;
    var done = this.props.done ? this.props.done : [];
    return done.find((t) => t.action.id === action.id);
  }

  getActionStateCase() {
    const { user } = this.props;
    if (!user) return NO_AUTH;
    if (this.actionIsDone()) return IS_DONE;
    if (this.actionIsInTodo()) return IS_IN_TODO;

    return DEFAULT_STATE;
  }

  getNoAuthParams() {
    const { user, links } = this.props;
    if (!user) return { to: links ? links.signin : "#" };
    return {};
  }

  userHasManyHouseHolds() {
    //return this.props.user.households.length > 1;
    // so that users can change the date
    return this.props.user?.households.length > 0;
  }

  componentDidMount() {
    this.checkIfActionShouldStartAutomatically();
  }
  checkIfActionShouldStartAutomatically() {
    const { action } = this.props;
    const actionToStart = localStorage.getItem(
      ACTION_TO_AUTO_START + action?.id
    );
    if (!actionToStart) return;
    const obj = JSON.parse(actionToStart);
    if (action.id === obj.id) {
      this.runActionFunction(obj.for);
      localStorage.removeItem(ACTION_TO_AUTO_START + action?.id);
    }
  }

  trackGuestAuthenticationStatus(isSuccessful, _for) {
    if (!isSuccessful) return;
    // if successful, take not of the just-clicked action
    const { action } = this.props;
    const obj = { for: _for, id: action?.id };
    localStorage.setItem(
      ACTION_TO_AUTO_START + action?.id,
      JSON.stringify(obj)
    );
  }

  runGuestAuthentication(_for) {
    this.props.toggleGuestAuthDialog(true, {
      callback: (isSuccessful) =>
        this.trackGuestAuthenticationStatus(isSuccessful, _for),
    });
  }

  runActionFunction(_for) {
    const { user } = this.props;
    if (!user) return this.runGuestAuthentication(_for);
    if (_for === "DONE") {
      const isDone = this.actionIsDone();
      if (isDone) {
        //--- user has already marked it as DONE, and wants to undo
        if (!this.userHasManyHouseHolds()) {
          //-- Check and see if user has more than one household. More? Open modal, else just do your magic
          this.removeFromCart(isDone);
          this.props.clearNotificationMsgs();
          return;
        }
      }
    } else if (_for === "TODO") {
      const inTodo = this.actionIsInTodo();
      if (inTodo) {
        //---- user has already marked Action as TODO, and wants to undo it
        if (!this.userHasManyHouseHolds()) {
          //-- Check and see if user has more than one household. More? Open modal, else just do your magic
          this.removeFromCart(inTodo);
          this.props.clearNotificationMsgs();
          return;
        }
      }
    }
    this.openForm(_for);
  }

  getTodoPopoverInfo() {
    if (this.checkDone() && this.userHasManyHouseHolds()) {
      // overwrite default popover text of TODO button with below text if action is done, and use has many households
      return { popoverText: "Add to your To Do list in another household" };
    }
    if (this.checkDone()) {
      return { className: "cam-gray-btn" };
    }
    return {};
  }

  checkDone() {
    var action = this.props.action;
    var done = this.props.done ? this.props.done : [];
    var exists =
      done.filter((t) => t.action.id === action.id).length > 0 ? true : false;
    return exists;
  }

  newFlexRender() {
    const actionStateCase = this.getActionStateCase();
    const { action } = this.props;
    const tagNames = makeStringFromArrOfObjects(action?.tags, (t) => t.name);
    const tooltipText =
      "You alone are seeing this action that you submitted. You can edit it until a Community admin approves it. To edit,click on the card";
    return (
      <div
        data-tag-names={tagNames}
        className={`col-lg-6 col-md-6 col-sm-12 col-12 ${MEAnimation.getAnimationClass()} test-action-card-item`}
        key={this.props.key?.toString()}
        data-action-state={actionStateCase}
        data-action-auth-state={this.props.user && "authenticated"}
        style={{ paddingRight: 0 }}
      >
        {!action?.is_published && <RibbonBanner />}
        <div
          className="every-day-flex z-depth-1"
          style={{
            flexDirection: "column",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <div className="img-and-btns-container every-day-flex" style={{}}>
            <div style={{ width: "100%" }}>
              {action?.is_published ? (
                <img
                  onClick={() =>
                    this.props.history.push(
                      this.props.links.actions + "/" + this.props.action.id
                    )
                  }
                  className="sensitive-photo"
                  src={
                    this.props.action.image
                      ? this.props.action.image.url
                      : fallback
                  }
                  alt="action"
                  style={{ flex: "9" }}
                />
              ) : (
                <METooltip text={tooltipText}>
                  <img
                    onClick={() =>
                      this.props.history.push(
                        this.props.links.actions + "/" + this.props.action.id
                      )
                    }
                    className="sensitive-photo"
                    src={
                      this.props.action.image
                        ? this.props.action.image.url
                        : fallback
                    }
                    alt="action"
                    style={{ flex: "9" }}
                  />
                </METooltip>
              )}
            </div>
            <div
              className="btn-sidebar-container every-day-flex"
              style={{ flex: "3" }}
            >
              <div
                className="every-day-flex"
                style={{ flexDirection: "column", flex: "12" }}
              >
                {action?.is_published && (
                  <>
                    <MEChameleonButton
                      style={{ flex: "3" }}
                      className={`cameleon-correct test-btn-for-todo`}
                      _case={actionStateCase}
                      type={TODO}
                      // {...this.getNoAuthParams()}
                      onClick={() => this.runActionFunction("TODO")}
                      {...this.getTodoPopoverInfo()}
                    />
                    <MEChameleonButton
                      style={{ flex: "3" }}
                      className={`cameleon-correct test-btn-for-done`}
                      _case={actionStateCase}
                      type={DONE}
                      // {...this.getNoAuthParams()}
                      onClick={() => this.runActionFunction("DONE")}
                    />
                  </>
                )}
                {/* ----- Show this button in phone mode --------- */}
                <MEButton
                  to={this.props.links.actions + "/" + this.props.action.id}
                  style={{
                    padding: "4px 17px ",
                    fontSize: "0.8rem",
                    minWidth: 60,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                  containerClassName="pc-vanish"
                >
                  Info
                </MEButton>
                <MEButton
                  to={this.props.links.actions + "/" + this.props.action.id}
                  style={{
                    padding: "5px 18px ",
                    fontSize: "14px",
                    minWidth: 76,
                    textAlign: "center",
                    fontWeight: "bold",
                    marginLeft: 5,
                  }}
                  containerClassName="phone-vanish test-action-info-btn"
                >
                  Info
                </MEButton>
                {/* {!action?.is_published && (
                  <MEButton
                    onClick={() =>
                      onEditButtonClick && onEditButtonClick(action)
                    }
                    style={{
                      padding: "5px 18px ",
                      fontSize: "14px",
                      minWidth: 76,
                      textAlign: "center",
                      fontWeight: "bold",
                      marginLeft: 5,
                    }}
                    containerClassName="test-action-info-btn"
                  >
                    Edit
                  </MEButton>
                )} */}
              </div>
            </div>
          </div>
          <div className="text-footer">
            <span className="test-action-title">
              {this.props.action.title}{" "}
            </span>
            <br />
            {this.showNotifications()}
          </div>
        </div>
      </div>
    );
  }

  showNotifications() {
    return (
      <>
        <div className="col-12">
          <div className="col-centered">
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
                        Nice job! How was your experience with this action? Tell
                        us about it in a{" "}
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
            {this.props.showTodoMsg === this.props.action.id && (
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
            )}
          </div>
        </div>
      </>
    );
  }

  render() {
    if (!this.props.HHFormOpen && this.state.status)
      this.setState({ status: null });
    if (this.shouldRender()) return this.newFlexRender();
    return <></>;
  }

  openForm = (status) => {
    this.setState({
      status: status,
    });
    this.props.openModal(this.props.action, status);
    // this.props.openHHForm(this.props.action.id);
  };

  closeForm = () => {
    this.setState({
      status: null,
    });
    this.props.closeModal();
    // this.props.closeHHForm();
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
    actions: store.page.actions,
    user: store.user.info,
  };
};
const mapDispatchToProps = {
  reduxRemoveFromDone,
  reduxRemoveFromTodo,
  toggleGuestAuthDialog: reduxToggleGuestAuthDialog,
  toggleModal: reduxToggleUniversalModal,
  updateActionsInRedux: reduxLoadActions,
};
export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(withRouter(ActionCard));
