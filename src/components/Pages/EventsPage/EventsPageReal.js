import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import PageTitle from "../../Shared/PageTitle";
import LoadingCircle from "../../Shared/LoadingCircle";
import ErrorPage from "./../Errors/ErrorPage";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import {
  dateFormatString,
  recurringDetails,
  filterTagCollections,
  applyTagsAndGetContent,
  searchIsActiveFindContent,
  recreateFiltersForState,
  collectSearchTextValueFromURL,
  processFiltersAndUpdateURL,
  makeFilterDescription,
  parseJSON,
} from "../../Utils";
import NewEventsCard from "./NewEventsCard";
import HorizontalFilterBox from "./HorizontalFilterBox";
import { NONE } from "../Widgets/MELightDropDown";
import Tooltip from "../Widgets/CustomTooltip";
import EventCalendarView from "./calendar/EventCalendarView";
import MEAnimation from "../../Shared/Classes/MEAnimation";
import { withRouter } from "react-router-dom";
import ShareButtons from "../../Shared/ShareButtons";
import {
  reduxLoadEventExceptions,
  reduxLoadEvents,
  reduxLoadEventsPage,
  reduxLoadTagCols,
  reduxToggleGuestAuthDialog,
  reduxToggleUniversalModal,
} from "../../../redux/actions/pageActions";
import Subtitle from "../Widgets/Subtitle";
import StoryForm from "../ActionsPage/StoryForm";
import { EVENT, PAGE_ESSENTIALS } from "../../Constants";
import StoryFormButtonModal from "../StoriesPage/StoryFormButtonModal";
import AddButton from "../../Shared/AddButton";
import Feature from "../FeatureFlags/Feature";
import { FLAGS } from "../FeatureFlags/flags";
import Seo from "../../Shared/Seo";
import { apiCall } from "../../../api/functions";

const EVENT_VIEW_MODE = "event-view-mode";
const VIEW_MODES = {
  UPCOMING: { name: "Upcoming events", icon: "fa-bars", key: "upcoming" },
  PAST: { name: "Past events", icon: "fa-bars", key: "past" },
  CAMPAIGNS: { name: "Campaigns", icon: "fa-bars", key: "campaigns" },
  CALENDAR: { name: "Calendar View", icon: "fa-calendar", key: "calendar" },
};
/**
 * Renders the event page
 */
class EventsPage extends React.Component {
  constructor(props) {
    const savedView = localStorage.getItem(EVENT_VIEW_MODE);
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      events_search_toggled: false,
      userData: null,
      checked_values: null,
      mirror_events: [],
      searchText: null,
      view_mode: savedView || VIEW_MODES.UPCOMING.key,
      showModal: false,
      mounted: false,
    };
    this.addMeToSelected = this.addMeToSelected.bind(this);
  }

  fetchEssentials = () => {
    const { community } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain: subdomain };
    Promise.all(
      PAGE_ESSENTIALS.EVENTS.routes.map((route) => apiCall(route, payload))
    )
      .then((response) => {
        const [pageData, tagCols, events, exceptions] = response;
        this.props.loadEventsPage(pageData.data);
        this.props.loadTagCollections(tagCols.data);
        this.props.loadEvents(events.data);
        this.props.loadExceptions(exceptions.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    window.gtag("set", "user_properties", { page_title: "EventsPage" });
    this.fetchEssentials();
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
  addMeToSelected(param, reset = false) {
    processFiltersAndUpdateURL(param, this.props);
    if (reset) return this.setState({ checked_values: null });
    var arr = this.state.checked_values ? this.state.checked_values : [];
    // remove previously selected tag of selected category and put the new one
    arr = arr.filter((item) => item.collectionName !== param.collectionName);
    if (!param || param.value !== NONE) arr.push(param);
    this.setState({ checked_values: arr });
  }

  handleSearch(e) {
    e.preventDefault();
    this.setState({ searchText: e.target.value });
  }

  searchIsActiveSoFindContentThatMatch() {
    return searchIsActiveFindContent(
      this.props.events,
      this.state.checked_values,
      this.state.searchText,
      (event, word) =>
        event.name.toLowerCase().includes(word) ||
        event.description.toLowerCase().includes(word) ||
        event.featured_summary.toLowerCase().includes(word)
    );
  }
  onSearchTextChange(text) {
    this.setState({ searchText: text || "" });
  }
  triggerGuestDialog(e) {
    e && e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.toggleGuestAuthDialog(true);
  }
  renderAddForm = () => {
    const { user, events, updateEventsInRedux, communityData } = this.props;
    let _props = {};
    if (!user) {
      _props = {
        ..._props,
        overrideOpen: () =>
          this.triggerGuestDialog && this.triggerGuestDialog(),
      };
    }
    return (
      <StoryFormButtonModal
        ModalType={EVENT}
        reduxProps={{
          reduxItems: events,
          updateItemInRedux: updateEventsInRedux,
        }}
        {..._props}
      >
        <AddButton type={EVENT} community={communityData?.community?.name} />
      </StoryFormButtonModal>
    );
  };
  render() {
    const pageData = this.props.pageData;
    const { history, links } = this.props;
    const filterDescription = makeFilterDescription(this.state.checked_values);
    if (pageData == null) return <LoadingCircle />;

    if (!this.props.events || !this.props.tagCols) {
      return <LoadingCircle />;
    }

    const title =
      pageData && pageData.title ? pageData.title : "Events and Campaigns";
    const sub_title =
      pageData && pageData.sub_title ? pageData.sub_title : null;
    const description = pageData.description ? pageData.description : null;

    if (!this.props.homePageData)
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Events data"
        />
      );

    const found =
      this.searchIsActiveSoFindContentThatMatch() ||
      applyTagsAndGetContent(this.props.events, this.state.checked_values);

    const duration = (event) => {
      return (
        new Date(event.end_date_and_time) - new Date(event.start_date_and_time)
      );
    };
    const oneWeek =
      new Date("January 8, 2000 00:00:00") -
      new Date("January 1, 2000 00:00:00");

    const today = new Date(Date.now()).toISOString();
    const upcomingEvents = found
      .filter(
        (event) => event.end_date_and_time >= today && duration(event) < oneWeek
      )
      .sort((a, b) => {
        if (a === b) {
          return 0;
        }
        return a.start_date_and_time < b.start_date_and_time ? -1 : 1;
      });
    const pastEvents = found
      .filter(
        (event) => event.end_date_and_time < today && duration(event) < oneWeek
      )
      .sort((a, b) => {
        if (a === b) {
          return 0;
        }
        return a.start_date_and_time > b.start_date_and_time ? -1 : 1;
      });

    const campaigns = found
      .filter((event) => duration(event) >= oneWeek)
      .sort((a, b) => {
        if (a === b) {
          return 0;
        }
        return a.start_date_and_time < b.start_date_and_time ? -1 : 1;
      });

    const getEventLength = () => {
      const { view_mode } = this.state;
      if (view_mode === VIEW_MODES.UPCOMING.key)
        return upcomingEvents?.length || 0;
      else if (view_mode === VIEW_MODES.CAMPAIGNS.key)
        return campaigns?.length || 0;
      else if (view_mode === VIEW_MODES.PAST.key)
        return pastEvents?.length || 0;
      return 0;
    };

    const { communityData } = this.props;
    return (
      <>
        {Seo({
          title: "Events",
          description: "",
          url: `${window.location.pathname}`,
          site_name: communityData?.community?.name,
        })}
        <div
          className="boxed_wrapper test-events-page-wrapper"
          data-number-of-events={getEventLength()}
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          {/* renders the sidebar and events columns */}
          <div className="boxed-wrapper">
            <BreadCrumbBar links={[{ name: "Events" }]} />
            {/* <PageTitle>Events</PageTitle> */}
            <section className="eventlist">
              <div className="container override-container-width">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-12 offset-md-1">
                    <div className="all-head-area position-btn-and-title">
                      <div className="text-center page-title-container">
                        {description ? (
                          <PageTitle
                            className="solid-font"
                            style={{ fontSize: 24 }}
                          >
                            {title}
                            <Tooltip text={description}>
                              <span
                                className="fa fa-info-circle"
                                style={{ color: "#428a36", padding: "5px" }}
                              ></span>
                            </Tooltip>
                          </PageTitle>
                        ) : (
                          <PageTitle
                            className="solid-font"
                            style={{ fontSize: 24 }}
                          >
                            {title}
                          </PageTitle>
                        )}
                        <center>
                          <Subtitle>{sub_title}</Subtitle>
                        </center>
                      </div>
                      <div className="phone-vanish submitted-content-btn-wrapper">
                        <Feature
                          name={FLAGS.USER_SUBMITTED_EVENTS}
                          children={this.renderAddForm()}
                        />
                      </div>
                    </div>
                    <HorizontalFilterBox
                      type={EVENT}
                      tagCols={this.props.tagCols}
                      boxClick={this.addMeToSelected}
                      search={this.handleSearch}
                      searchText={this.state.searchText}
                      filtersFromURL={this.state.checked_values}
                      doneProcessingURLFilter={this.state.mounted}
                      onSearchTextChange={this.onSearchTextChange.bind(this)}
                      updateItemInRedux={this.props.updateEventsInRedux}
                      reduxItems={this.props.events}
                      customStyles={{ width: "100%" }}
                      renderAddButton={() => (
                        <Feature
                          name={FLAGS.USER_SUBMITTED_EVENTS}
                          children={this.renderAddForm()}
                        />
                      )}
                    />
                    <div>
                      <div
                        className="event-view-togglers"
                        style={{ marginTop: 90 }}
                      >
                        {Object.keys(VIEW_MODES).map((key, index) => {
                          const mode = VIEW_MODES[key];
                          const isActive = this.state.view_mode === mode?.key;
                          return (
                            <div
                              onClick={() => {
                                this.setState({ view_mode: mode?.key });
                                localStorage.setItem(
                                  EVENT_VIEW_MODE,
                                  mode?.key
                                );
                              }}
                              className={`${
                                isActive &&
                                "event-view-toggler-active z-depth-float"
                              }`}
                              key={index}
                              id={`test-event-view-toggler-${mode?.key}`}
                            >
                              <i className={`fa ${mode?.icon}`}></i>{" "}
                              {mode?.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {this.state.view_mode === VIEW_MODES.UPCOMING?.key && (
                      <div
                        className="mob-event-cards-fix outer-box sec-padd event-style2 phone-marg-top-90"
                        style={{
                          paddingTop: 0,
                          marginTop: 9,
                          paddingRight: 40,
                        }}
                      >
                        <div className="row">
                          {this.renderEvents(upcomingEvents)}
                        </div>
                      </div>
                    )}

                    {this.state.view_mode === VIEW_MODES.PAST?.key && (
                      <div
                        className="mob-event-cards-fix outer-box sec-padd event-style2 phone-marg-top-90"
                        style={{
                          paddingTop: 0,
                          marginTop: 9,
                          paddingRight: 40,
                        }}
                      >
                        <div className="row">
                          {this.renderEvents(pastEvents)}
                        </div>
                      </div>
                    )}

                    {this.state.view_mode === VIEW_MODES.CAMPAIGNS?.key && (
                      <div
                        className="mob-event-cards-fix outer-box sec-padd event-style2 phone-marg-top-90"
                        style={{
                          paddingTop: 0,
                          marginTop: 9,
                          paddingRight: 40,
                        }}
                      >
                        <div className="row">
                          {this.renderEvents(campaigns)}
                        </div>
                      </div>
                    )}

                    {this.state.view_mode === VIEW_MODES.CALENDAR.key && (
                      <div
                        style={{ marginTop: 40 }}
                        className={MEAnimation.getScaleInAnimation()}
                      >
                        <EventCalendarView
                          events={found}
                          onEventClick={(obj) =>
                            history?.push(links?.events + "/" + obj?.id)
                          }
                          thisCommunity={this.props.pageData?.community}
                        />
                      </div>
                    )}

                    <center style={{ padding: 10 }}>
                      <p style={{ color: "black" }}>Share this page</p>
                      <ShareButtons
                        include={["facebook"]}
                        url={window.location.href}
                        pageTitle={`Events happening in ${
                          this.props?.pageData?.community?.name ||
                          "your community"
                        }`}
                        pageDescription={
                          (filterDescription &&
                            `Take a look at events under the following categories: ${filterDescription} 
                        `) ||
                          ""
                        }
                      />
                    </center>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  /**
   * @param events - json list of events
   */
  renderEvents(events) {
    //when mirror_events.length ===0, it means no one is searching,so go on to check if
    //someone if user is using check_values
    //if check_values ===null, then it means it is probably the first time the user
    //is loading the page, so show everything from props

    // when a user clicks view more events from the user nudge email,
    // we show upcoming events that were not included in the email whose ids have been
    // attached to the link: {domain}/events?ids=24-3-4
    let ids = window.location.href.split("?ids=")[1];
    if (ids) {
      let idsArr = ids.split("-");
      events = events.filter((event) => idsArr.includes(event.id.toString()));
    }

    const thisCommunity = this.props?.pageData?.community;
    if (this.state.mirror_events.length === 0) {
      events = this.state.check_values === null ? this.props.events : events;
    }
    if (this.props.events.length === 0) {
      return (
        <div
          className="text-center"
          id="test-no-events-div"
          style={{ width: "100%" }}
        >
          <p className="cool-font">
            {" "}
            Sorry, looks like there are no upcoming events in your community{" "}
          </p>
        </div>
      );
    }

    if (events) {
      let exceptions = [];
      if (this.props.eventExceptions) {
        exceptions = this.props.eventExceptions.data;
      }
      let sorted_events = events.sort((a, b) =>
        a.is_published === b.is_published ? 0 : a.is_published ? 1 : -1
      );
      const page = sorted_events.map((event) => {
        const dateString = dateFormatString(
          new Date(event.start_date_and_time),
          new Date(event.end_date_and_time)
        );
        const recurringDetailString = recurringDetails(event);

        return (
          // can we format the cancelled message to be an overlay instead of going above?
          <div
            style={{
              opacity:
                (event.recurring_details &&
                  event.recurring_details.is_cancelled) ||
                (exceptions.includes(event.id) ? 0.3 : 1),
              position: "relative",
            }}
            key={event.id.toString()}
            className="col-md-6 col-lg-6 col-sm-6"
          >
            <p style={{ color: "red" }}>
              {event.recurring_details && event.recurring_details.is_cancelled
                ? "This event has been cancelled temporarily."
                : ""}
            </p>
            <p style={{ color: "red" }}>
              {exceptions.includes(event.id)
                ? "This event has been rescheduled temporarily. See the rescheduled event."
                : ""}{" "}
            </p>
            <NewEventsCard
              {...event}
              recurringDetailString={recurringDetailString}
              dateString={dateString}
              links={this.props.links}
              user={this.props.user}
              dropDirection="up"
              toggleGuestAuthDialog={this.props.toggleGuestAuthDialog}
              isShared={thisCommunity?.id !== event?.community?.id}
              onEditButtonClicked={() => {
                let reConstEvent = {
                  ...event,
                  ...(parseJSON(event?.location) || {}),
                  end_date_and_time: event?.end_date_and_time?.slice(0, 16),
                  start_date_and_time: event?.start_date_and_time?.slice(0, 16),
                };
                this.props.toggleModal({
                  show: true,
                  title: "Edit Event Form",
                  size: "md",
                  component: (
                    <StoryForm
                      ModalType={EVENT}
                      close={() => this.props.toggleModal({ show: false })}
                      draftData={reConstEvent}
                      TriggerSuccessNotification={(bool) => ({})}
                      updateItemInRedux={this.props.updateEventsInRedux}
                      reduxItems={this.props.events}
                    />
                  ),
                });
              }}
            />
          </div>
        );
      });

      return page;
    }
  }

  userRSVP(event_id) {
    if (!this.props.user || !this.props.eventRSVPs) return null;
    const RSVPs = this.props.eventRSVPs.filter((rsvp) => {
      return (
        rsvp.attendee.id === this.props.user.id && rsvp.event.id === event_id
      );
    });
    if (RSVPs.length < 1) return null;
    return RSVPs[0];
  }
}

const mapStoreToProps = (store) => {
  return {
    community: store.page.community,
    homePageData: store.page.homePage,
    collection: store.page.collection,
    user: store.user.info,
    pageData: store.page.eventsPage,
    eventExceptions: store.page.eventExceptions,
    events: store.page.events,
    eventRSVPs: store.page.rsvps,
    links: store.links,
    tagCols: filterTagCollections(store.page.events, store.page.tagCols),
    communityData: store.page.communityData,
  };
};
export default connect(mapStoreToProps, {
  toggleGuestAuthDialog: reduxToggleGuestAuthDialog,
  toggleModal: reduxToggleUniversalModal,
  updateEventsInRedux: reduxLoadEvents,
  loadEventsPage: reduxLoadEventsPage,
  loadEvents: reduxLoadEvents,
  loadTagCollections: reduxLoadTagCols,
  loadExceptions: reduxLoadEventExceptions,
})(withRouter(EventsPage));
