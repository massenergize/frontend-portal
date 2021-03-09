import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ErrorPage from "./../Errors/ErrorPage";
import LoadingCircle from "../../Shared/LoadingCircle";
import { apiCall } from "../../../api/functions";
import {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
} from "../../../redux/actions/userActions";
import {
  reduxChangeData,
  reduxTeamAddAction,
} from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
// import SideBar from "../../Menu/SideBar";
import Action from "./PhotoSensitiveAction";
// import Action from "./Action";
import Cart from "../../Shared/Cart";
import PageTitle from "../../Shared/PageTitle";
// import Funnel from "../EventsPage/Funnel";
// import MECard from "../Widgets/MECard";
import Paginator from "../Widgets/Paginator";
import { moveToPage } from "../../Utils";

import MEModal from "../Widgets/MEModal";
import ActionModal from "./ActionModal";
import HorizontalFilterBox from "../EventsPage/HorizontalFilterBox";
import ActionBoxCounter from "./ActionBoxCounter";
// import MELightDropDown from "../Widgets/MELightDropDown";

/**
 * The Actions Page renders all the actions and a sidebar with action filters
 * @props none - fetch data from api instead of getting data passed to you from props
 *
 * @todo change the columns for small sizes change button colors bars underneath difficulty and ease instead of "easy, medium, hard"
 */
const PER_PAGE = 6;
class ActionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.moveToDoneByActionId = this.moveToDoneByActionId.bind(this);
    this.state = {
      check_values: null,
      loaded: false,
      openAddForm: null,
      testimonialLink: null,
      openModalForm: null,
      modal_content: {
        //tbd
        image: null,
        title: null,
        desc: null,
        ano: null,
        user: null,
      },
      actionModal: false, //tbd
      mirror_actions: [],
      showTodoMsg: false,
      actions: [],
      pageContent: {
        currentPage: 1,
        itemsLeft: -1, // set to -1 to be able to differentiate when there is really no content, and when its just first time page load
        pageCount: 0,
      },
      perPage: PER_PAGE,
    };
    // this.doAction = this.doAction.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleBoxClick = this.handleBoxClick.bind(this);
    this.findCommon = this.findCommon.bind(this);
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
  findCommon() {
    const actions = this.props.actions;
    const values = this.state.check_values ? this.state.check_values : [];
    if (values.length === 0) return null;

    const common = [];
    if (actions) {
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const actionTags = (action && action.tags) || [];
        for (let j = 0; j < actionTags.length; j++) {
          const tag = actionTags[j];
          if (tag) {
            if (values.includes(tag.id) && !common.includes(action)) {
              common.push(action);
            }
          }
        }
      }
    }
    return common;
  }

  goToPage(pageNumber) {
    const { actions } = this.props;
    const { perPage } = this.state;
    const nextPageContent = moveToPage(actions, pageNumber, perPage);
    this.setState({
      actions: nextPageContent.data,
      pageContent: {
        currentPage: nextPageContent.currentPage,
        itemsLeft: nextPageContent.itemsLeft,
        pageCount: nextPageContent.pageCount,
      },
    });
  }

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
            content={this.state.modal_content}
            user={this.props.user}
            status={this.state.status}
            addToCart={(aid, hid, status) => this.addToCart(aid, hid, status)}
            inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
            closeModal={this.closeModal}
            moveToDone={this.moveToDoneByActionId}
          />
        </MEModal>
      );
    }
  }

  openModal(params, status) {
    this.setState({
      openModalForm: params.id,
      modal_content: {
        ...params,
      },
      status: status,
    });
  }

  closeModal() {
    this.setState({ openModalForm: null, status: null });
  }

  renderPaginator() {
    const { pageContent, check_values } = this.state;
    var { actions } = this.props;
    actions = actions ? actions : [];
    if (check_values && check_values.length > 0) return <i></i>; // dont want to show paginator when user is in search mode
    return (
      <Paginator
        currentPage={pageContent.currentPage}
        pageCount={pageContent.pageCount}
        nextFxn={() => this.goToPage(this.state.pageContent.currentPage + 1)}
        prevFxn={() => this.goToPage(this.state.pageContent.currentPage - 1)}
        showNext={pageContent.itemsLeft !== 0 && actions.length > PER_PAGE}
        showPrev={pageContent.currentPage > 1}
      />
    );
  }
  getContentToDisplay() {
    const { mirror_actions, actions } = this.state; // items from when user is typing in search box
    const propActions = this.props.actions;
    const common = this.findCommon();
    if (mirror_actions.length > 0) return mirror_actions;
    if (common) return common;
    if (actions.length === 0) {
      if (!propActions || propActions.length === 0) return null;
      // return propActions.slice(0, this.state.perPage);
      return propActions;
    }
    return actions;
  }
  render() {
    if (!this.props.actions) {
      return <LoadingCircle />;
    }

    if (!this.props.homePageData)
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Actions data"
        />
      );

    var actions = this.getContentToDisplay();

    actions = actions
      ? actions.sort((a, b) => {
          return a.rank - b.rank;
        })
      : actions;
    return (
      <>
        {this.renderModal()}
        <div
          className="boxed_wrapper"
          style={{
            height: window.screen.height - 200,
          }}
        >
          <BreadCrumbBar links={[{ name: "All Actions" }]} />
          {/* main shop section */}
          <div className="shop sec-padd">
            <div className="container override-container-width">
              <div className="row">
                {/* renders the sidebar */}
                <div className="phone-vanish col-lg-3 col-md-5 col-sm-12 col-xs-12 sidebar_styleTwo">
                  {/* <MECard
                    className=" mob-login-white-cleaner z-depth-float me-anime-open-in"
                    style={{
                      marginBottom: 10,
                      padding: "45px 14px",
                      borderRadius: 15,
                    }}
                  >
                    <h4>Filter by...</h4>
                    <Funnel
                      type="action"
                      search={this.handleSearch}
                      foundNumber={this.state.mirror_actions.length}
                      searchTextValue={this.state.searchBoxText}
                      tagCols={this.props.tagCols}
                      boxClick={this.handleBoxClick}
                    />
                  </MECard> */}
                  <div style={{ marginTop: 140 }}>
                    {this.props.user ? (
                      <div className="phone-vanish">
                        <ActionBoxCounter />
                        <ActionBoxCounter
                          type="To Do"
                          style={{ marginTop: 20 }}
                          big={2}
                          med={4000}
                        />
                        {/* {this.props.todo ? (
                          <Cart
                            title="To Do List"
                            actionRels={this.props.todo}
                            status="TODO"
                          />
                        ) : null}
                        {this.props.done ? (
                          <Cart
                            title="Completed Actions"
                            actionRels={this.props.done}
                            status="DONE"
                          />
                        ) : null} */}
                      </div>
                    ) : (
                      <div>
                        <p>
                          <Link to={`${this.props.links.signin}`}>
                            {" "}
                            Sign In{" "}
                          </Link>{" "}
                          to add actions to your todo list or to mark them as
                          complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {/* renders the actions */}
                <div className="col-lg-9 col-md-7 col-sm-12 col-xs-12">
                  <PageTitle>
                    Let us know what you have already done and pledge to do more
                    for impact
                  </PageTitle>
                  {/* {this.state.pageContent.pageCount > 0 ? (
                    <center>
                      <small>
                        When you switch pages, images take a moment to reflect,
                        please bear with us...
                      </small>
                    </center>
                  ) : null} */}
                  {/* {this.renderPaginator()} */}
                  <HorizontalFilterBox
                    type="action"
                    search={this.handleSearch}
                    foundNumber={this.state.mirror_actions.length}
                    searchTextValue={this.state.searchBoxText}
                    tagCols={this.props.tagCols}
                    boxClick={this.handleBoxClick}
                  />
                  <div
                    className="row"
                    id="actions-container mob-actions-page-padding-remove"
                    style={{ marginTop: 10 }}
                  >
                    {this.renderActions(actions)}
                    {/* {this.renderPaginator()} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  doesFieldContainWord(field, word, action) {
    const fieldValue = action[field];
    if (fieldValue && fieldValue.toLowerCase().includes(word.toLowerCase()))
      return true;
    return false;
  }
  // on change in any category or tag checkbox update the actionsPage
  handleChange() {
    this.forceUpdate();
  }
  handleSearch = (event) => {
    const value = event.target.value;
    const actions = this.props.actions;
    const common = [];
    if (value.trim() !== "") {
      for (let i = 0; i < actions.length; i++) {
        const ac = actions[i];
        if (
          this.doesFieldContainWord("title", value, ac) ||
          this.doesFieldContainWord("deep_dive", value, ac) ||
          this.doesFieldContainWord("steps_to_take", value, ac) ||
          this.doesFieldContainWord("about", value, ac)
        ) {
          common.push(ac);
        }
      }
      this.setState({ mirror_actions: [...common], searchBoxText: value });
    } else {
      this.setState({ mirror_actions: [], searchBoxText: value });
    }
  };
  // renders all the actions
  renderActions(actions) {
    if (!actions) {
      return (
        <p style={{ width: "100%", textAlign: "center" }}>
          There aren't any actions available in this community yet, come back
          later.
        </p>
      );
    }
    if (actions.length === 0) {
      return (
        <p style={{ width: "100%", textAlign: "center" }}>
          There aren't any actions in the selected categories.
        </p>
      );
    }
    //returns a list of action components
    return Object.keys(actions).map((key) => {
      var action = actions[key];
      return (
        <Action
          key={key}
          action={action}
          tagCols={this.props.tagCols}
          match={this.props.match} //passed from the Route, need to forward to the action for url matching
          user={this.props.user}
          addToCart={(aid, hid, status) => this.addToCart(aid, hid, status)}
          inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
          moveToDone={(aid, hid) => this.moveToDoneByActionId(aid, hid)}
          modalIsOpen={this.state.openModalForm === action.id}
          showTestimonialLink={this.state.testimonialLink === action.id}
          // closeHHForm={() => this.setState({ openAddForm: null })}
          // openHHForm={(aid) => this.setState({ openAddForm: aid })}
          showTodoMsg={this.state.showTodoMsg}
          toggleShowTodoMsg={() => {
            this.setState({ showTodoMsg: false });
          }}
          openModal={this.openModal}
          closeModal={() => this.setState({ openModalForm: null })}
        />
      );
    });
  }

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
      user_id: this.props.user.id,
      action_id: actionRel.action.id,
      household_id: actionRel.real_estate_unit.id,
    };
    apiCall("users.actions.completed.add", body)
      .then((json) => {
        if (json.success) {
          this.props.reduxMoveToDone(json.data);
          // this.addToImpact(json.data.action);
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
    const body = {
      user_id: this.props.user.id,
      action_id: aid,
      household_id: hid,
    };
    const path =
      status === "DONE"
        ? "users.actions.completed.add"
        : "users.actions.todo.add";
    this.setState({ testimonialLink: null });
    apiCall(path, body)
      .then((json) => {
        if (json.success) {
          //set the state here
          if (status === "TODO") {
            this.props.reduxAddToTodo(json.data);
            this.setState({ showTodoMsg: aid });
          } else if (status === "DONE") {
            this.props.reduxAddToDone(json.data);
            // this.addToImpact(json.data.action);
            this.setState({ testimonialLink: aid, showTodoMsg: false });
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
    const communityData = this.props.communityData || [];
    var data = communityData.filter((data) => {
      return data.name === name;
    })[0];

    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall("data.update", body).then((json) => {
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
        return data.tag === tagid;
      }
      return false;
    })[0];
    if (!data) {
      return;
    }
    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall("data.update", body).then((json) => {
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
    homePageData: store.page.homePage,
    auth: store.firebase.auth,
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    actions: store.page.actions,
    tagCols: store.page.tagCols,
    pageData: store.page.actionsPage,
    communityData: store.page.communityData,
    links: store.links,
  };
};

const mapDispatchToProps = {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
  reduxChangeData,
  reduxTeamAddAction,
};
export default connect(mapStoreToProps, mapDispatchToProps)(ActionsPage);
