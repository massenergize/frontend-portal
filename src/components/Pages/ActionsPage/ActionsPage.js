import React from "react";
import { connect } from "react-redux";
import ErrorPage from "./../Errors/ErrorPage";
import LoadingCircle from "../../Shared/LoadingCircle";
import { apiCall } from "../../../api/functions";
import {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
  reduxSetPreferredEquivalence,
} from "../../../redux/actions/userActions";
import {
  reduxChangeData,
  reduxTeamAddAction,
} from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ActionCard from "./ActionCard";

import PageTitle from "../../Shared/PageTitle";
import {
  applyTagsAndGetContent,
  collectSearchTextValueFromURL,
  filterTagCollections,
  makeFilterDescription,
  processFiltersAndUpdateURL,
  recreateFiltersForState,
  searchIsActiveFindContent,
  sumOfCarbonScores,
} from "../../Utils";
import MEModal from "../Widgets/MEModal";
import ActionModal from "./ActionModal";
import HorizontalFilterBox from "../EventsPage/HorizontalFilterBox";
import ActionBoxCounter from "./ActionBoxCounter";
import { NONE } from "../Widgets/MELightDropDown";
import Tooltip from "../Widgets/CustomTooltip";
import EquivalenceModal from "./EquivalenceModal";
import ProductTour from "react-joyride";
import { handleTourCallback } from "../../Utils";
import { withRouter } from "react-router-dom";
import ShareButtons from "../../Shared/ShareButtons";

const INIT_STATE = {
  checked_values: null, // an arr of jsons that contain current selected collection Name, and tag name
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
  status: null,
  showEqModal: false,
  mounted: false,
};

/**
 * The Actions Page renders all the actions and a sidebar with action filters
 * @props none - fetch data from api instead of getting data passed to you from props
 *
 * @todo change the columns for small sizes change button colors bars underneath difficulty and ease instead of "easy, medium, hard"
 */

class ActionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.moveToDoneByActionId = this.moveToDoneByActionId.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = { ...INIT_STATE };
    this.addMeToSelected = this.addMeToSelected.bind(this);
    this.toggleEQModal = this.toggleEQModal.bind(this);
  }

  renderEQModal() {
    const { showEqModal } = this.state;
    if (showEqModal)
      return (
        <EquivalenceModal
          eqs={this.props.eq}
          pref_eq={this.props.pref_eq}
          toggleModal={this.toggleEQModal}
          carbonScore={sumOfCarbonScores(this.props.done || [])}
          reduxSetPreference={this.props.reduxSetPreferredEquivalence}
        />
      );
  }

  toggleEQModal(value) {
    this.setState({ showEqModal: value });
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

  onSearchTextChange(text) {
    this.setState({ searchText: text || "" });
  }
  renderModal() {
    if (this.state.openModalForm) {
      return (
        <MEModal
          className="parent-act-modal-whole"
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

  handleSearch(e) {
    e.preventDefault();
    this.setState({ searchText: e.target.value });
  }

  searchIsActiveSoFindContentThatMatch() {
    return searchIsActiveFindContent(
      this.props.actions,
      this.state.checked_values,
      this.state.searchText,
      (action, word) =>
        action.title.toLowerCase().includes(word) ||
        action.about.toLowerCase().includes(word) ||
        action.featured_summary.toLowerCase().includes(word) ||
        action.deep_dive.toLowerCase().includes(word)
    );
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

  render() {
    const pageData = this.props.pageData;
    const filterDescription = makeFilterDescription(this.state.checked_values);
    if (pageData == null) return <LoadingCircle />;

    if (!this.props.actions) {
      return <LoadingCircle />;
    }

    const title = pageData && pageData.title ? pageData.title : "Actions";
    //const sub_title = pageData && pageData.sub_title ? pageData.sub_title : 'Let us know what you have already done, and pledge to do more for impact'
    const description =
      pageData && pageData.description ? pageData.description : null;

    if (!this.props.homePageData)
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Actions data"
        />
      );

    var actions =
      this.searchIsActiveSoFindContentThatMatch() ||
      applyTagsAndGetContent(this.props.actions, this.state.checked_values);

    const steps = [
      {
        target: ".test-action-card-item",
        title: (
          <strong style={{ fontSize: 16 }}>
            All these actions were chosen by your neighbors!
          </strong>
        ),
        content:
          "You can filter these actions by category, impact or cost. Click on the card to continue.",
        placement: "right",
        spotlightPadding: 10,
        spotlightClicks: true,
        disableBeacon: true,
        hideFooter: true,
        disableOverlayClose: true,
      },
    ];

    return (
      <>
        {this.props.showTour && (
          <ProductTour
            steps={steps}
            showSkipButton
            disableScrolling={true}
            callback={handleTourCallback}
            spotlightPadding={-12}
            styles={{
              options: {
                arrowColor: "#eee",
                backgroundColor: "#eee",
                primaryColor: "#8CC43C",
                textColor: "black",
                width: 400,
                zIndex: 1000,
              },
            }}
          />
        )}
        {this.renderEQModal()}
        {this.renderModal()}
        <div
          className="boxed_wrapper"
          style={{
            minHeight: window.screen.height - 200,
          }}
        >
          <BreadCrumbBar links={[{ name: "All Actions" }]} />
          {/* main shop section */}
          <div className="shop sec-padd">
            <div className="container override-container-width">
              <div style={{ marginBottom: 30, marginTop: -20 }}>
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
                <center>
                  {pageData.sub_title ? (
                    <small>{pageData.sub_title}</small>
                  ) : null}
                </center>
              </div>
              <HorizontalFilterBox
                foundNumber={this.state.mirror_actions}
                tagCols={this.props.tagCols}
                boxClick={this.addMeToSelected}
                search={this.handleSearch}
                searchText={this.state.searchText}
                filtersFromURL={this.state.checked_values}
                doneProcessingURLFilter={this.state.mounted}
                onSearchTextChange={this.onSearchTextChange.bind(this)}
              />
              <div className="row phone-marg-top">
                {/* renders the sidebar */}
                <div className="phone-vanish col-lg-3 col-md-5 col-sm-12 col-xs-12 sidebar_styleTwo">
                  <div style={{ marginTop: 20 }}>
                    {/* {this.props.user ? ( */}
                    <div className="phone-vanish">
                      <ActionBoxCounter
                        type="DONE"
                        done={this.props.done}
                        link={this.props.links ? this.props.links.profile : "#"}
                        user={this.props.user}
                        pref_eq={this.props.pref_eq}
                        eq={this.props.eq}
                        toggleEQModal={this.toggleEQModal}
                      />
                      <ActionBoxCounter
                        type="TODO"
                        style={{ marginTop: 20 }}
                        todo={this.props.todo}
                        link={this.props.links ? this.props.links.profile : "#"}
                        user={this.props.user}
                        pref_eq={this.props.pref_eq}
                        eq={this.props.eq}
                        toggleEQModal={this.toggleEQModal}
                      />
                    </div>
                    <center style={{ padding: 10 }}>
                      <p style={{ color: "black" }}>Share this page</p>
                      <ShareButtons
                        include={["facebook"]}
                        url={window.location.href}
                        pageTitle={`Actions to take in ${
                          this.props?.communityData?.community?.name ||
                          "your community"
                        }`}
                        pageDescription={
                          (filterDescription &&
                            `Take a look at actions under the following categories: ${filterDescription} 
                        `) ||
                          ""
                        }
                      />
                    </center>
                  </div>
                </div>
                {/* renders the actions */}
                <div className="col-lg-9 col-md-7 col-sm-12 col-xs-12">
                  <div
                    id="test-action-cards-wrapper"
                    data-number-of-actions-for-test={actions?.length}
                    className="row scroll-fix"
                    style={{ marginTop: 20, paddingTop: 30 }}
                  >
                    {this.renderActions(actions)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
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
        <ActionCard
          className="test-action-card-item"
          key={key}
          action={action}
          tagCols={this.props.tagCols}
          match={this.props.match} //passed from the Route, need to forward to the action for url matching
          user={this.props.user}
          addToCart={(aid, hid, status, date_completed) =>
            this.addToCart(aid, hid, status, date_completed)
          }
          //inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
          moveToDone={(aid, hid) => this.moveToDoneByActionId(aid, hid)}
          modalIsOpen={this.state.openModalForm === action.id}
          showTestimonialLink={this.state.testimonialLink === action.id}
          dontShowTestimonialLinkFxn={() =>
            this.setState({ testimonialLink: false })
          }
          showTodoMsg={this.state.showTodoMsg}
          clearNotificationMsgs={() =>
            this.setState({ showTodoMsg: false, testimonialLink: false })
          }
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
          this.props.reduxMoveToDone(json.data);
          this.setState({
            testimonialLink: actionRel.action.id,
            showTodoMsg: false,
          });
        } else {
          console.log(json.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // NOTE: Routine currently duplicated in ActionsPage, OneActionPage, Cart - preserve same functionality in each
  moveToDoneByActionId(aid, hid, date) {
    const actionRel = this.props.todo.filter((actionRel) => {
      return (
        Number(actionRel.action.id) === Number(aid) &&
        Number(actionRel.real_estate_unit.id) === Number(hid)
      );
    })[0];
    if (actionRel) this.moveToDone(actionRel, date);
  }

  // NOTE: Routine currently duplicated in ActionsPage and OneActionPage - preserve same functionality in each
  addToCart = (aid, hid, status, date_completed) => {
    const body = {
      action_id: aid,
      household_id: hid,
    };
    // only include if user specified this
    if (date_completed) {
      body.date_completed = date_completed;
    }
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
            this.setState({ testimonialLink: aid, showTodoMsg: false });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

const mapStoreToProps = (store) => {
  return {
    homePageData: store.page.homePage,
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    actions: store.page.actions,
    tagCols: filterTagCollections(store.page.actions, store.page.tagCols),
    rawTagCols: store.page.tagCols,
    pageData: store.page.actionsPage,
    communityData: store.page.communityData,
    links: store.links,
    pref_eq: store.user.pref_equivalence,
    eq: store.page.equivalences,
    showTour: store.page.showTour,
  };
};

const mapDispatchToProps = {
  reduxAddToDone,
  reduxAddToTodo,
  reduxMoveToDone,
  reduxChangeData,
  reduxTeamAddAction,
  reduxSetPreferredEquivalence,
};
export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(withRouter(ActionsPage));
