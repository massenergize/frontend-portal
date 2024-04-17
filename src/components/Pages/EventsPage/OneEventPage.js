import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import notFound from "./not-found.jpg";
import {
  dateFormatString,
  recurringDetails,
  locationFormatJSX,
  smartString,
  parseJSON,
  fetchCopyrightData,
} from "../../Utils";
import ShareButtons from "../../Shared/ShareButtons";
import Seo from "../../Shared/Seo";
import URLS from "../../../api/urls";
import { RSVP_STATUS } from "./NewEventsCard";
import MELightDropDown from "../Widgets/MELightDropDown";
import * as moment from "moment";
import { isMobile } from "react-device-detect";
import {
  reduxLoadEvents,
  reduxLoadEventsPage,
  reduxMarkRequestAsDone,
  reduxToggleGuestAuthDialog,
  reduxToggleUniversalModal,
} from "../../../redux/actions/pageActions";
import MEButton from "../Widgets/MEButton";
import CustomTooltip from "../Widgets/CustomTooltip";
import { EVENT, PAGE_ESSENTIALS } from "../../Constants";
import StoryForm from "../ActionsPage/StoryForm";
import ICSEventCreator from "./ICSEventCreator";
import AddToGoogleCalendar from "./AddToGoogleCalendar";
import RibbonBanner from "../../Shared/RibbonBanner";
import MEImage from "../../Shared/MEImage";
// import METooltip from "../../Shared/METooltip";
class OneEventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvpError: null,
      event: null,
      loading: true,
      rsvpLoading: false,
      rsvpStatus: null,
      pastEvent: null,
    };
  }

  fetchEssentials = () => {
    const { community, pageRequests } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain };
    const { id } = this.props.match.params;

    const page = (pageRequests || {})[PAGE_ESSENTIALS.ONE_EVENT.key];
    const loaded = (page || {})[id];
    if (loaded) return this.handleJson(loaded);       

    Promise.all([
      ...PAGE_ESSENTIALS.ONE_EVENT.routes.map((route) =>
        apiCall(route, payload)
      ),
      apiCall("events.info", { event_id: id }),
    ])
      .then((response) => {
        const [pageData, events, eventItem] = response;
        this.props.loadEventsPage(pageData?.data);
        this.props.updateEventsInRedux(events?.data);
        this.handleJson(eventItem);
        this.props.reduxMarkRequestAsDone({
          ...pageRequests,
          [PAGE_ESSENTIALS.ONE_EVENT.key]: { ...(page || {}), [id]: eventItem },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleJson(json) {
    if (json.success) {
      this.setState({ event: json.data, loading: false });
    } else {
      this.setState({ error: json.error, loading: false });
    }
  }

  async fetch(id) {
    try {
      const json = await apiCall("events.info", { event_id: id });
      this.handleJson(json);
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    window.gtag("set", "user_properties", { page_title: "OneEventPage" });
    const { id } = this.props.match.params;
    // this.fetch(id);
    this.fetchEssentials();
    const rightNow = moment().format();
    const pastEvent = rightNow > this.props.start_date_and_time;
    this.setState({ pastEvent: pastEvent });
    // can be a problem if you go diretly to the event page, this.props.user can be undefined
    if (!pastEvent && this.props.user) this.getRSVPStatus(id);
  }

  static getDerivedStateFromProps(props, state) {
    let { id } = props?.match?.params;
    if (props.events && id)
      return {
        event: props.events?.filter((item) => item.id?.toString() === id)[0],
      };
    return null;
  }
  onEditButtonClick = (event) => {
    let reConstEvent = {
      ...event,
      ...(parseJSON(event?.location) || {}),
      end_date_and_time: event?.end_date_and_time?.slice(0, 16),
      start_date_and_time: event?.start_date_and_time?.slice(0, 16),
      ...fetchCopyrightData(event?.image?.info),
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
  };

  render() {
    const event = this.state.event;
    const { community } = event || {};
    const { subdomain } = community || {};
    if (this.state.loading) {
      return <LoadingCircle />;
    }
    if (!event || this.state.error) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Event"
          errorDescription={
            this.state.error ? this.state.error : "Unknown cause"
          }
        />
      );
    }
    return (
      <>
        {Seo({
          title: event.name,
          description: event.featured_summary,
          url: `${window.location.href}`,
          image: event.image && event.image.url,
          keywords: event.name && event.name.split(" "),
          updated_at: event.updated_at,
          created_at: event.updated_at,
          tags: event.name && event.name.split(" "),
          site_name: this.props.community?.name,
        })}

        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar
            links={[
              { link: this.props.links.events, name: "Events" },
              {
                name:
                  (isMobile && smartString(event?.name, 20)) ||
                  event.name ||
                  "...",
              },
            ]}
          />
          <section className="shop-single-area" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="single-products-details">
                {this.renderEvent(event)}
              </div>
              <ShareButtons
                label="Share this event!"
                pageTitle={event.name}
                pageDescription={event.featured_summary}
                url={`${URLS.SHARE}/${subdomain}/event/${event.id}`}
              />
            </div>
          </section>
        </div>
      </>
    );
  }

  // @TODO: Fxn appears in two places(here, NewEventCard)... make DRY later...
  updateRSVP(status) {
    if (status === MELightDropDown.NONE) return;
    const LINK =
      status === RSVP_STATUS.NOT_GOING
        ? "events.rsvp.remove"
        : "events.rsvp.update";
    this.setState({ rsvpLoading: true });
    apiCall(LINK, {
      event_id: this.state.event?.id,
      status: status,
    }).then((json) => {
      if (json.success) {
        this.setState({
          rsvpStatus: json.data?.status,
          rsvpLoading: false,
          rsvpError: null,
        });
      } else {
        console.log("RSVP Error::", json.error);
        this.setState({
          rsvpError: json.error?.toString(),
          rsvpLoading: false,
        });
      }
    });
  }

  // @TODO: Fxn appears in two places(here, NewEventCard)... make DRY later...
  getRSVPStatus(event_id) {
    apiCall("events.rsvp.get", { event_id }).then((json) => {
      if (json.success) {
        const rsvp_status = json.data;
        if (rsvp_status) {
          const rsvpStatus =
            rsvp_status.status === "RSVP" ? "Going" : rsvp_status.status;
          this.setState({ rsvpStatus: rsvpStatus });
        } else {
          this.setState({ rsvpStatus: null });
        }
      } else {
        console.log("failed to get event rsvp status");
      }
    });
  }
  renderRecurringDetails() {
    const { event } = this.state;
    const format = "MMMM Do YYYY, h:mm a";
    if (!event?.recurring_details) return <></>;

    const recurringDetailString = recurringDetails(event);
    const {
      upcoming_is_cancelled,
      upcoming_is_rescheduled,
      rescheduled_details,
    } = event.recurring_details || {};
    return (
      <>
        <span className="test-event-recurring-status">
          <b>{recurringDetailString}</b>
        </span>
        {upcoming_is_cancelled && (
          <>
            <span style={{ color: "maroon" }}>
              <b>The event has been cancelled</b>
            </span>
            <br />
          </>
        )}
        {upcoming_is_rescheduled && (
          <>
            <span>
              <b>The event has been rescheduled</b>
            </span>
            <br />
          </>
        )}

        {rescheduled_details && (
          <>
            <span>
              <b>Start Date</b>
            </span>
            <br />
            <span style={{ color: "black", fontSize: 14 }}>
              {moment(rescheduled_details?.rescheduled_start_datetime).format(
                format
              )}
            </span>
            <br />
          </>
        )}
        {rescheduled_details && (
          <>
            <span>
              <b>End Date</b>
            </span>
            <br />
            <span style={{ color: "black", fontSize: 14 }}>
              {moment(rescheduled_details?.rescheduled_end_datetime).format(
                format
              )}
            </span>
            <br />
          </>
        )}
      </>
    );
  }

  renderEventLocation = (event) => {
    return (
      <>
        {event?.is_published && event?.external_link && (
          <MEButton
            onClick={(e) => {
              e.preventDefault();
              window.open(event?.external_link, "_blank");
            }}
            flat
            wrapperStyle={{ width: "100%" }}
            containerStyle={{ width: "100%" }}
            style={{
              padding: "10px 30px",
              borderRadius: 5,
              width: "100%",
              marginTop: 10,
            }}
          >
            {event?.external_link_type || "Register"}
          </MEButton>
        )}
        {event?.location && (
          <li
            style={{
              listStyle: "none",
              marginTop: 10,
              color: "rgb(128 177 61)",
            }}
          >
            <i className="fa fa-map-marker" style={{ marginRight: 6 }} />
            <b>Venue</b>{" "}
            <div
              className="make-me-dark test-event-venue"
              style={{ fontSize: 14, display: "block" }}
            >
              {locationFormatJSX(event?.location)}
            </div>
          </li>
        )}
      </>
    );
  };
  renderEvent(event) {
    const { user, toggleGuestAuthDialog, pageData } = this.props;
    const isShared = pageData?.community?.id !== event?.community?.id;

    let dateString = dateFormatString(
      new Date(event.start_date_and_time),
      new Date(event.end_date_and_time)
    );

    return (
      <section
        className="event-section style-3 test-one-event-wrapper"
        data-is-recurring={event?.is_recurring}
        data-date={event?.start_date_and_time && event?.end_date_and_time}
        data-venue={event?.location}
      >
        <div className="container">
          <h3
            className="cool-font text-center solid-font test-event-title"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {event.name}

            {isShared && (
              <CustomTooltip
                text={`This event is originally from ${event?.community?.name}`}
              >
                <span className="shared-badge">SHARED</span>
              </CustomTooltip>
            )}
          </h3>
          <div className="single-event sec-padd" style={{ borderWidth: 0 }}>
            <div className="row">
              <div className="col-12 col-lg-4" style={{ marginBottom: 15 }}>
                <MEImage
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: 6,
                  }}
                  className="test-event-image"
                  src={event.image ? event.image.url : notFound}
                  image={event?.image}
                  alt=""
                />
                {!event?.is_published && <RibbonBanner />}

                <div style={{ margin: "10px 0px", borderRadius: 12 }}>
                  <ul>
                    <li
                      key="time"
                      style={{ listStyle: "none", color: "rgb(128 177 61)" }}
                    >
                      <b>Date</b>
                      <div style={{ fontSize: 14, display: "block" }}>
                        <span className="make-me-dark test-event-date">
                          {dateString}
                        </span>
                      </div>
                    </li>
                    {this.renderEventLocation(event)}
                    {event?.is_recurring && (
                      <li
                        style={{
                          listStyle: "none",
                          marginTop: 10,
                          color: "rgb(128 177 61)",
                        }}
                      >
                        {event?.recurring_details ? (
                          this.renderRecurringDetails(event)
                        ) : (
                          <></>
                        )}
                      </li>
                    )}
                  </ul>
                  {event.rsvp_enabled && !this.state.pastEvent ? (
                    <div style={{ display: "flex", marginTop: 10 }}>
                      {!event?.is_published && user && (
                        <MEButton
                          onClick={(e) => {
                            e.preventDefault();
                            this.onEditButtonClick(event);
                          }}
                          flat
                          style={{ padding: "12px 30px", marginRight: 5 }}
                        >
                          Edit
                        </MEButton>
                      )}
                      {user ? (
                        <div style={{ position: "relative", width: "100%" }}>
                          <MELightDropDown
                            style={{ width: "100%", padding: 13 }}
                            containerStyle={{ display: "block", padding: 0 }}
                            direction="down"
                            onItemSelected={(status) => this.updateRSVP(status)}
                            animate={false}
                            customAnimation="rsvp-drop-from-left-anime"
                            controlLabel={true}
                            label={
                              this.state.rsvpLoading ? (
                                <i className="fa fa-spinner fa-spin"></i>
                              ) : (
                                <span style={{ marginRight: 6 }}>
                                  {this.state.rsvpStatus ||
                                    "RSVP for this event"}
                                </span>
                              )
                            }
                            labelClassNames="me-rsvp-btn z-depth-float test-card-rsvp-toggler"
                            data={[
                              RSVP_STATUS.INTERESTED,
                              RSVP_STATUS.GOING,
                              RSVP_STATUS.NOT_GOING,
                            ]}
                          />
                          {this.state.rsvpError && (
                            <small
                              style={{ color: "red", marginTop: 4 }}
                              className="test-rsvp-error"
                            >
                              {this.state.error}
                            </small>
                          )}
                          {/* ---- Just used as a confirmation div when testing rsvp-ing  (Is not shown to the end user) ----- */}
                          {this.state.rsvpStatus && (
                            <div className="test-rsvp-status-div">
                              {/* this does show to the user this.state.rsvpStatus */}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <MEButton
                            containerStyle={{ width: "100%" }}
                            style={{ width: "100%" }}
                            wrapperStyle={{ width: "100%" }}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleGuestAuthDialog(true);
                            }}
                            flat
                          >
                            RSVP
                          </MEButton>
                        </div>
                      )}
                    </div>
                  ) : (
                    !event?.is_published &&
                    user && (
                      <MEButton
                        onClick={(e) => {
                          e.preventDefault();
                          this.onEditButtonClick(event);
                        }}
                        flat
                        style={{
                          padding: "12px 30px",
                          marginTop: 10,
                          width: "100%",
                        }}
                        wrapperStyle={{ width: "100%" }}
                        containerStyle={{ width: "100%" }}
                      >
                        Edit
                      </MEButton>
                    )
                  )}

                  {event?.is_published && (
                    <>
                      <li
                        style={{
                          listStyle: "none",
                          marginTop: 10,
                          color: "rgb(128 177 61)",
                        }}
                      >
                        <i
                          className="fa fa-download"
                          style={{ marginRight: 6 }}
                        />
                        <b>Download to your calendar</b>{" "}
                      </li>

                      <div
                        style={{
                          display: "flex",
                          // justifyContent: "space-between",
                        }}
                      >
                        <ICSEventCreator data={event} />
                        <AddToGoogleCalendar data={event} />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-12 col-lg-8">
                <div className="text">
                  <p
                    className="cool-font make-me-dark events-about-content test-event-body rich-text-container"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  ></p>
                  <br />
                  <p className="cool-font">{event.moreinfo}</p>
                </div>
              </div>
            </div>

            <div className="content">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-12"></div>
                {event.details ? (
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <div className="section-title style-2">
                      <h3>Event Details</h3>
                    </div>

                    <ul className="list2">
                      {this.renderDetails(event.details)}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  renderDetails(details) {
    return Object.keys(details).map((key) => {
      return (
        <li key={key}>
          <i className="fa fa-check-circle"></i>
          {details[key]}
        </li>
      );
    });
  }
}
const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    events: store.page.events,
    links: store.links,
    pageData: store.page.eventsPage,
    community: store.page.community,
    pageRequests: store.page.pageRequests,
  };
};
export default connect(mapStoreToProps, {
  toggleGuestAuthDialog: reduxToggleGuestAuthDialog,
  toggleModal: reduxToggleUniversalModal,
  updateEventsInRedux: reduxLoadEvents,
  loadEventsPage: reduxLoadEventsPage,
  reduxMarkRequestAsDone,
})(OneEventPage);
