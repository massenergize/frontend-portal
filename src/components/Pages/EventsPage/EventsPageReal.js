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
} from "../../Utils";
import NewEventsCard from "./NewEventsCard";
import HorizontalFilterBox from "./HorizontalFilterBox";
import { NONE } from "../Widgets/MELightDropDown";
import Tooltip from "../Widgets/CustomTooltip";
import EventCalendarView from "./calendar/EventCalendarView";
import MEAnimation from "../../Shared/Classes/MEAnimation";
import CalendarModal from "./calendar/CalendarModal";

const EVENT_VIEW_MODE = "event-view-mode";
const VIEW_MODES = {
  NORMAL: { name: "Normal View", icon: "fa-bars", key: "normal" },
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
      view_mode: savedView || VIEW_MODES.CALENDAR.key,
      showModal: false,
    };
    this.addMeToSelected = this.addMeToSelected.bind(this);
  }
  addMeToSelected(param, reset = false) {
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

  render() {
    const pageData = this.props.pageData;
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

    return (
      <>
        <div
          className="boxed_wrapper test-events-page-wrapper"
          data-number-of-events={this.props.events?.length || 0}
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <CalendarModal
            event={this.state.showModal}
            close={() => this.setState({ showModal: null })}
            toFullView={(e) =>
              this.props.history.push(this.props.links.events + "/" + e?.id)
            }
          />
          {/* renders the sidebar and events columns */}
          <div className="boxed-wrapper">
            <BreadCrumbBar links={[{ name: "Events" }]} />
            {/* <PageTitle>Events</PageTitle> */}
            <section className="eventlist">
              <div className="container override-container-width">
                <div className="row">
                  <div className="col-lg-10 col-md-10 col-12 offset-md-1">
                    <div style={{ marginBottom: 30 }}>
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
                          <PageTitle style={{ fontSize: 24 }}>
                            {title}
                          </PageTitle>
                        )}
                      </div>
                      <center>{sub_title ? <p>{sub_title}</p> : null}</center>
                    </div>
                    <HorizontalFilterBox
                      type="events"
                      tagCols={this.props.tagCols}
                      boxClick={this.addMeToSelected}
                      search={this.handleSearch}
                    />
                    <div className="event-view-togglers">
                      {Object.keys(VIEW_MODES).map((key, index) => {
                        const mode = VIEW_MODES[key];
                        const isActive = this.state.view_mode === mode?.key;
                        return (
                          <div
                            onClick={() => {
                              this.setState({ view_mode: mode?.key });
                              localStorage.setItem(EVENT_VIEW_MODE, mode?.key);
                            }}
                            className={`${
                              isActive &&
                              "event-view-toggler-active z-depth-float"
                            }`}
                            key={index}
                          >
                            <i className={`fa ${mode?.icon}`}></i> {mode?.name}
                          </div>
                        );
                      })}
                    </div>

                    {this.state.view_mode === VIEW_MODES.NORMAL?.key && (
                      <div
                        className="mob-event-cards-fix outer-box sec-padd event-style2 phone-marg-top-90"
                        style={{
                          paddingTop: 0,
                          marginTop: 9,
                          paddingRight: 40,
                        }}
                      >
                        <div className="row">{this.renderEvents(found)}</div>
                      </div>
                    )}

                    {this.state.view_mode === VIEW_MODES.CALENDAR.key && (
                      <div
                        style={{ marginTop: 40 }}
                        className={MEAnimation.getScaleInAnimation()}
                      >
                        <EventCalendarView
                          events={found}
                          openModal={(event) =>
                            this.setState({ showModal: event })
                          }
                        />
                      </div>
                    )}
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
      const page = events.map((event) => {
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
    homePageData: store.page.homePage,
    collection: store.page.collection,
    // auth: store.firebase.auth,
    user: store.user.info,
    pageData: store.page.eventsPage,
    eventExceptions: store.page.eventExceptions,
    events: store.page.events,
    eventRSVPs: store.page.rsvps,
    links: store.links,
    tagCols: filterTagCollections(store.page.events, store.page.tagCols),
  };
};
export default connect(mapStoreToProps, null)(EventsPage);
