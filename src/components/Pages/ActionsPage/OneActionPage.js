import React from "react";
import { apiCall } from "../../../api/functions";
import LoadingCircle from "../../Shared/LoadingCircle";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ErrorPage from "./../Errors/ErrorPage";
import Cart from "../../Shared/Cart";
import StoryForm from "./StoryForm";
import MEModal from "./../Widgets/MEModal";
import ActionModal from "./ActionModal";
import URLS from "../../../api/urls";
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
  reduxSetTourInformation,
  SECOND_SET,
  reduxToggleGuestAuthDialog,
  celebrateWithConfetti,
  reduxToggleUniversalModal,
  reduxLoadActions,
  reduxLoadTestimonials,
  reduxLoadCommunityData,
  reduxMarkRequestAsDone,
  reduxLoadServiceProviders,
} from "../../../redux/actions/pageActions";
import Tooltip from "../../Shared/Tooltip";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ShareButtons from "../../Shared/ShareButtons";
import { getHTMLContent } from "../HTML/HTMLShop";
import MiniTestimonial from "../StoriesPage/MiniTestimonial";
import MELink from "../Widgets/MELink";
import MECameleonButton from "./MEChameleonButton";
import {
  DEFAULT_STATE,
  DONE,
  IS_DONE,
  IS_IN_TODO,
  NO_AUTH,
  TODO,
} from "./ActionStateConstants";
import Seo from "../../Shared/Seo";
import ProductTour, { ACTIONS, STATUS } from "react-joyride";
import {
  handleTourCallback,
  smartString,
  fetchCopyrightData,
} from "../../Utils";
import { isMobile } from "react-device-detect";
import { ACTION_TO_AUTO_START } from "./ActionCard";
import MEButton from "../Widgets/MEButton";
import RibbonBanner from "../../Shared/RibbonBanner";
import { ACTION, PAGE_ESSENTIALS, TESTIMONIAL } from "../../Constants";
import MEImage from "../../Shared/MEImage";

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
      loading: true,
      openModalForm: false,
      // about_html:null,
      // deep_dive_html:null,
      // steps_to_take_html:null
    };
    this.handleChange = this.handleChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.moveToDoneByActionId = this.moveToDoneByActionId.bind(this);
    this.runActionFunction = this.runActionFunction.bind(this);
  }

  fetchEssentials = () => {
    const { community, pageRequests } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain };
    const { id } = this.props.match.params;

    const page = (pageRequests || {})[PAGE_ESSENTIALS.ONE_ACTION.key];
    const loaded = (page || {})[id];
    if (loaded) return this.handleActionJson(loaded);

    Promise.all([
      ...PAGE_ESSENTIALS.ONE_ACTION.routes.map((route) =>
        apiCall(route, payload)
      ),
      apiCall("actions.info", { action_id: id }),
    ])
      .then((response) => {
        const [communityData, actions, stories, vendors, actionItem] = response;
        this.props.loadCommunityData(communityData?.data);
        this.props.loadTestimonials(stories?.data);
        this.props.updateActionsInRedux(actions?.data);
        this.handleActionJson(actionItem);
        this.props.loadVendors(vendors?.data);
        this.props.reduxMarkRequestAsDone({
          ...pageRequests,
          [PAGE_ESSENTIALS.ONE_ACTION.key]: {
            ...(page || {}),
            [id]: actionItem,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    window.gtag("set", "user_properties", { page_title: "OneActionPage" });
    window.addEventListener("resize", this.chooseFontSize);
    // const { id } = this.props.match.params;
    this.fetchEssentials();
    // this.fetch(id);
    this.chooseFontSize();
  }
  static getDerivedStateFromProps(props, state) {
    let { id } = props?.match?.params;
    if (props.actions && id)
      return {
        action: props.actions?.filter((item) => item?.id?.toString() === id)[0],
      };
    return null;
  }

  handleActionJson(json) {
    if (json.success) {
      this.setState({ action: json.data, loading: false });
      this.checkIfActionShouldStartAutomatically(json.data);
    } else {
      this.setState({ error: json.error });
    }
  }

  async fetch(id) {
    try {
      const json = await apiCall("actions.info", { action_id: id });
      this.handleActionJson(json);
      // if (json.success) {
      //   this.setState({ action: json.data });
      //   this.checkIfActionShouldStartAutomatically(json.data);
      // } else {
      //   this.setState({ error: json.error });
      // }
    } catch (err) {
      this.setState({ error: err.toString() });
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
      return (
        <ErrorPage
          errorMessage="Unable to load this Action"
          errorDescription={
            this.state.error ? this.state.error : "Unknown cause"
          }
        />
      );
    }
    const { tags } = action;
    const { community } = action || {};
    const { subdomain } = community || {};
    return (
      <>
        {this.renderModal()}
        {Seo({
          title: action.title,
          description: action.featured_summary,
          site_name: action.community && action.community.name,
          url: `${window.location.pathname}`,
          image: action.image && action.image.url,
          keywords: action.title && action.title.split(" "),
          updated_at: action.updated_at,
          created_at: action.updated_at,
          tags: (tags || []).map(({ name }) => name) || [],
        })}

        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.actions, name: "All Actions" },
              {
                name:
                  (isMobile && smartString(action?.title, 15)) ||
                  action?.title ||
                  "...",
              },
            ]}
          />

          <section className="shop-single-area" style={{ paddingTop: 0 }}>
            <div className="container">
              <div
                className="row"
                style={{ paddingRight: "0px", marginRight: "0px" }}
              >
                <div
                  className="col-md-9 mob-padding-zero"
                  style={{ marginBottom: 15 }}
                >
                  <div className="single-products-details">
                    {this.renderAction(action)}
                  </div>
                  <br />
                  <ShareButtons
                    label="Share this action!"
                    pageTitle={action.title}
                    pageDescription={action.featured_summary}
                    url={`${URLS.SHARE}/${subdomain}/action/${action.id}`}
                  />
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
          </section>
        </div>
      </>
    );
  }

  getMyAction() {
    return this.state.action;
  }

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

  checkDone() {
    var action = this.getMyAction();
    var done = this.props.done ? this.props.done : [];
    var exists =
      done.filter((t) => t.action.id === action.id).length > 0 ? true : false;
    return exists;
  }

  userHasManyHouseHolds() {
    return this.props.user.households.length > 1;
  }

  checkIfActionShouldStartAutomatically(action) {
    const { user } = this.props;
    const actionToStart = localStorage.getItem(
      ACTION_TO_AUTO_START + action?.id
    );
    if (!actionToStart || !action || !user) return;
    const obj = JSON.parse(actionToStart);
    if (action.id?.toString() === obj.id?.toString()) {
      this.runActionFunction(obj.for);
      localStorage.removeItem(ACTION_TO_AUTO_START + action?.id);
    }
  }

  trackGuestAuthenticationStatus(isSuccessful, _for) {
    if (!isSuccessful) return;
    // if successful, take not of the just-clicked action
    const action = this.getMyAction();
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
          this.setState({ showTodoMsg: false, showTestimonialLink: false });
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
          this.setState({ showTodoMsg: false, showTestimonialLink: false });
          return;
        }
      }
    }
    this.openModal(_for);
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

  /**
   * Modal Functions
   */
  renderModal() {
    if (this.state.openModalForm) {
      return (
        <MEModal
          showCloseBtn={false}
          closeModal={this.closeModal}
          size="sm"
          contentStyle={{ minWidth: "100%" }}
          style={{ padding: 0 }}
        >
          <ActionModal
            content={this.getMyAction()}
            user={this.props.user}
            status={this.state.status}
            addToCart={(aid, hid, status, date_completed) =>
              this.addToCart(aid, hid, status, date_completed)
            }
            inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
            closeModal={this.closeModal}
            moveToDone={this.moveToDoneByActionId}
          />
        </MEModal>
      );
    }
  }

  openModal(status) {
    this.setState({
      openModalForm: true,
      status: status,
    });
  }

  closeModal() {
    this.setState({ openModalForm: null, status: null });
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

  continueTour() {
    const { history, links, reduxSetTourInformation } = this.props;
    reduxSetTourInformation({ stage: SECOND_SET });
    history.push(links?.home || "");
  }
  tourCallback = (data) => {
    handleTourCallback(data, ({ action, index, status }) => {
      if (ACTIONS.NEXT === action && index === 1 && STATUS.FINISHED === status)
        return this.continueTour(); // This is triggered when user presses enter on "got it" instead of clicking
    });
  };

  onEditButtonClick = (toEdit) => {
    this.props.toggleModal({
      show: true,
      title: "Edit Action Form",
      size: "md",
      component: (
        <StoryForm
          ModalType={ACTION}
          close={() => this.props.toggleModal({ show: false })}
          draftData={{
            ...(toEdit || {}),
            ...fetchCopyrightData(toEdit?.image?.info),
          }}
          TriggerSuccessNotification={() => ({})}
          updateItemInRedux={this.props.updateActionsInRedux}
          reduxItems={this.props.actions}
        />
      ),
    });
  };

  renderAction(action) {
    if (!this.props.stories) {
      return <LoadingCircle />;
    }

    const community = this.props.communityData
      ? this.props.communityData.community
      : null;

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
    const actionStateCase = this.getActionStateCase();

    const steps = [
      {
        target: "#test-actions-tabs",
        title: (
          <strong style={{ fontSize: 16 }}>Find out about this action</strong>
        ),
        content:
          "Click these buttons to find practical steps to take, neighbors’ testimonials, and in some cases a deep dive for more details.",
        locale: {
          next: <span>Got it!</span>,
          skip: <span>Skip Tour</span>,
        },
        placement: "left",
        spotlightClicks: true,
        disableBeacon: true,
        disableOverlayClose: true,
      },
      {
        target: "#todo-btns",
        content: (
          <>
            Perhaps you’ve already done this action? If so, click the DONE
            button to add it to your community’s impact. Or click TO DO to put
            it on your to do list.
          </>
        ),
        locale: {
          last: <span style={{ color: "white" }}>Got it!</span>,
        },
        placement: "top",
        spotlightClicks: false,
        disableBeacon: true,
        disableOverlayClose: true,
        hideFooter: false,
        disableScrolling: true,
      },
      // ...
    ];

    return (
      <>
        {this.props.showTour && (
          <ProductTour
            steps={steps}
            continuous
            showSkipButton
            disableScrolling={true}
            callback={this.tourCallback}
            styles={{
              options: {
                arrowColor: "#eee",
                backgroundColor: "#eee",
                primaryColor: "#8CC43C",
                textColor: "black",
                width: 400,
                zIndex: 1000,
                beaconSize: 36,
              },
            }}
          />
        )}
        <div>
          <div className="product-content-box">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                {/* title */}
                <div className="content-box">
                  <h2
                    id="test-action-title"
                    className="cool-font solid-font "
                    style={{ padding: "20px 0px 0px 0px", textAlign: "center" }}
                  >
                    {action.title}
                  </h2>
                </div>
                {/* displays the action's info: impact, difficulty, tags and categories*/}
                <div
                  style={{
                    padding: 15,
                    position: "relative",
                    width: "80%",
                    margin: "auto",
                  }}
                >
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
                  <div className="float_right">
                    Cost
                    <span>
                      {" "}
                      {this.renderCost(this.getTag("cost"), "cost")}{" "}
                    </span>
                  </div>
                </div>

                {
                  /* displays ToDo and Done buttons if action is available in this community and not deleted*/
                  action_available ? (
                    <div
                      className="clearfix"
                      style={{
                        position: "relative",
                        // marginLeft: "40px",
                        marginTop: 10,
                      }}
                    >
                      {action?.is_published && (
                        <div
                          className="btn-envelope"
                          id="todo-btns"
                          data-page-state={this.props.user && "authenticated"}
                          data-action-state={actionStateCase}
                        >
                          <>
                            <MECameleonButton
                              id="test-todo-btn"
                              _case={actionStateCase}
                              type={TODO}
                              onClick={() => this.runActionFunction("TODO")}
                              {...this.getTodoPopoverInfo()}
                            />

                            <MECameleonButton
                              id="test-done-btn"
                              _case={actionStateCase}
                              type={DONE}
                              onClick={() => this.runActionFunction("DONE")}
                            />
                          </>
                        </div>
                      )}

                      {!action?.is_published && this.props?.user && (
                        <center>
                          <MEButton
                            onClick={(e) => {
                              e.preventDefault();
                              this.onEditButtonClick(action);
                            }}
                            flat
                            wrapperStyle={{ width: "100%" }}
                            containerStyle={{ width: "100%" }}
                            style={{
                              padding: "10px 30px",
                              borderRadius: 5,
                              width: "80%",
                              marginTop: 10,
                            }}
                          >
                            Edit Action
                          </MEButton>
                        </center>
                      )}

                      {this.state.showTestimonialLink ? (
                        <div>
                          <p
                            style={{ marginTop: 30, fontSize: 15 }}
                            className="phone-vanish"
                          >
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
                          <p
                            className="pc-vanish"
                            style={{ marginTop: 30, fontSize: 15 }}
                          >
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
                {this.state.showTodoMsg && !this.state.showTestimonialLink ? (
                  <p style={{ fontSize: 15, marginLeft: 20, marginTop: 9 }}>
                    Nicely done! You have now added this action to your todo
                    list.
                  </p>
                ) : null}
              </div>
              {/* action image */}
              <div className="col-lg-6 col-md-12 mob-reset-padding">
                <div className="img-box action-pic-fix">
                  <MEImage
                    src={action.image ? action.image.url : null}
                    image={action?.image}
                    alt=""
                    data-imagezoom="true"
                    className="img-responsive  me-anime-open-in"
                    style={{ marginTop: "20px", borderRadius: 9 }}
                  />
                </div>
                {!action?.is_published && <RibbonBanner />}
              </div>
            </div>
          </div>

          {/*  ------ @TODO: Remember to remake tabs into one component to remove repititions!!!!! */}
          {/* tab box holding description, steps to take, and stories about the action */}
          <div className="product-tab-box ">
            <ul
              className="nav nav-tabs tab-menu mob-tab-box-fix"
              id="test-actions-tabs"
            >
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
              {action.deep_dive && action.deep_dive.length > 12 ? (
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
                    <div
                      className="cool-font make-me-dark rich-text-container"
                      dangerouslySetInnerHTML={{
                        __html: getHTMLContent(action.about),
                      }}
                    ></div>
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
                    <div
                      className="cool-font make-me-dark rich-text-container"
                      dangerouslySetInnerHTML={{
                        __html: getHTMLContent(action.steps_to_take),
                      }}
                    ></div>
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
                    <div
                      className="cool-font make-me-dark rich-text-container"
                      dangerouslySetInnerHTML={{
                        __html: getHTMLContent(action.deep_dive),
                      }}
                    ></div>
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
                <MELink to={this.props.links.testimonials}>
                  See Testimonials
                </MELink>
                <div className="phone-vanish">
                  <div className="review-box make-me-dark word-wrap">
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
                        ModalType={TESTIMONIAL}
                        uid={this.props.user.id}
                        aid={action.id}
                        addStory={this.addStory}
                      />
                    </div>
                  ) : (
                    <p className="make-me-dark">
                      <Link to={this.props.links.signin}> Sign In </Link> to
                      submit your own story about taking this Action
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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
          const story = stories[key];
          return (
            <div key={key}>
              <MiniTestimonial story={story} links={this.props.links} />
            </div>
          );
        })}
      </>
    );
  };
  // on change in any category or tag checkbox update the actionsPage
  handleChange() {
    this.forceUpdate();
  }

  performCelebration() {
    const { celebrate } = this.props;
    celebrate({ show: true, duration: 8000 });
  }
  /**
   * These are the Cart functions
   * NOTE: The routines inCart, moveToDone, addToCart and removeFromCart are currently duplicated in Cart.js, OneActionPage.js and ActionsPage.js;
   * The functionality needs to be the same in each so if you change it in on, change it in all three.
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

  // NOTE: Routine currently duplicated in ActionsPage, OneActionPage, Cart - preserve same functionality in each
  moveToDone = (actionRel, date_completed) => {
    const body = {
      action_id: actionRel.action.id,
      household_id: actionRel.real_estate_unit.id,
    };
    // only include if user specified this
    if (date_completed) {
      body.date_completed = date_completed;
    }
    apiCall("users.actions.completed.add", body)
      .then((json) => {
        if (json.success) {
          this.performCelebration();
          this.props.reduxMoveToDone(json.data);
          this.setState({ testimonialLink: actionRel.action.id });
        } else {
          console.log(json.error);
        }
        //just update the state here
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // NOTE: Routine currently duplicated in ActionsPage, OneActionPage, Cart - preserve same functionality in each
  moveToDoneByActionId(aid, hid, date_completed) {
    const actionRel = this.props.todo.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    })[0];
    if (actionRel) this.moveToDone(actionRel, date_completed);
  }

  // NOTE: Routine currently duplicated in ActionsPage and OneActionPage - preserve same functionality in each
  addToCart = (aid, hid, status, date_completed) => {
    if (status !== "TODO" && status !== "DONE") return;
    const route =
      status === "TODO"
        ? "users.actions.todo.add"
        : "users.actions.completed.add";
    const body = {
      action_id: aid,
      household_id: hid,
    };
    // only include if user specified this
    if (date_completed) {
      body.date_completed = date_completed;
    }
    apiCall(route, body)
      .then((json) => {
        if (json.success) {
          //set the state here
          if (status === "TODO") {
            this.props.reduxAddToTodo(json.data);
            this.setState({ showTodoMsg: aid });
          } else if (status === "DONE") {
            this.performCelebration();
            this.setState({ showTestimonialLink: true });
            this.props.reduxAddToDone(json.data);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // NOTE: This routine currently duplicated in ActionCard, ChooseHHForm, OneActionPage, Cart
  // any changes need to be same in all 4 locations
  removeFromCart = (actionRel) => {
    const status = actionRel.status;
    if (status !== "TODO" && status !== "DONE") return;
    apiCall("users.actions.remove", { id: actionRel.id }).then((json) => {
      if (json.success) {
        if (status === "TODO") this.props.reduxRemoveFromTodo(actionRel);
        if (status === "DONE") {
          this.props.done.filter((item) => item.id !== actionRel.id);
          this.props.reduxRemoveFromDone(actionRel);
        }
      }
    });
  };
}
const mapStoreToProps = (store) => {
  return {
    community: store.page.community,
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    actions: store.page.actions,
    stories: store.page.testimonials,
    communityData: store.page.communityData,
    links: store.links,
    collection: store.page.collection,
    showTour: store.page.showTour,
    pageRequests: store.page.pageRequests,
    vendors: store.page.vendors,
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
  reduxSetTourInformation,
  toggleGuestAuthDialog: reduxToggleGuestAuthDialog,
  celebrate: celebrateWithConfetti,
  toggleModal: reduxToggleUniversalModal,
  updateActionsInRedux: reduxLoadActions,
  loadTestimonials: reduxLoadTestimonials,
  loadCommunityData: reduxLoadCommunityData,
  reduxMarkRequestAsDone,
  loadVendors: reduxLoadServiceProviders,
};

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(withRouter(OneActionPage));
