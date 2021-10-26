import React from "react";
import LoadingCircle from "../../Shared/LoadingCircle";
import { connect } from "react-redux";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import notFound from "./not-found.jpg";
import { dateFormatString, locationFormatJSX } from "../../Utils";
import ShareButtons from "../../Shared/ShareButtons";
import Seo from "../../Shared/Seo";
import URLS from "../../../api/urls";
import { RSVP_STATUS } from "./NewEventsCard";
import MELightDropDown from "../Widgets/MELightDropDown";

class OneEventPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: null,
      loading: true,
      rsvpLoading: false,
      rsvpStatus: null,
    };
  }

  async fetch(id) {
    try {
      const json = await apiCall("events.info", { event_id: id });
      if (json.success) {
        this.setState({ event: json.data });
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
    this.getRSVPStatus(id);
  }

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

    console.log("I am teh event you know ", event);
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
        })}

        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar
            links={[
              { link: this.props.links.events, name: "Events" },
              { name: event ? event.name : "..." },
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
          error: null,
        });
      } else {
        console.log("RSVP Error::", json.error);
        this.setState({ error: json.error?.toString(), rsvpLoading: false });
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
  renderEvent(event) {
    const { user } = this.props;
    let dateString = dateFormatString(
      new Date(event.start_date_and_time),
      new Date(event.end_date_and_time)
    );
    const location = event.location;

    return (
      <section className="event-section style-3">
        <div className="container">
          <h3 className="cool-font text-center">{event.name}</h3>
          <div className="single-event sec-padd" style={{ borderWidth: 0 }}>
            <div className="row">
              <div className="col-12 col-lg-4" style={{marginBottom:15}}>
                <img
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: 6,
                  }}
                  src={event.image ? event.image.url : notFound}
                  alt=""
                />

                <div
                  // className="event-timeline "

                  style={{ margin: "10px 0px", borderRadius: 12 }}
                >
                  <ul>
                    <li
                      key="time"
                      style={{ listStyle: "none", color: "rgb(128 177 61)" }}
                    >
                      <b>Date</b>
                      <div style={{ fontSize: 14, display: "block" }}>
                        <span className="make-me-dark">{dateString}</span>
                      </div>
                    </li>
                    {location ? (
                      <li
                        style={{
                          listStyle: "none",
                          marginTop: 10,
                          color: "rgb(128 177 61)",
                        }}
                      >
                        {/* House Number, Street Name, Town, State */}
                        <i
                          className="fa fa-map-marker"
                          style={{ marginRight: 6 }}
                        />
                        <b>Venue</b>{" "}
                        <div
                          className="make-me-dark"
                          style={{ fontSize: 14, display: "block" }}
                        >
                          {locationFormatJSX(location)}
                        </div>
                      </li>
                    ) : null}

                    {event?.is_recurring && (
                      <li
                        style={{
                          listStyle: "none",
                          marginTop: 10,
                          color: "rgb(128 177 61)",
                        }}
                      >
                        {event?.recurring_details ? (
                          <></>
                        ) : (
                          <span>Event recurring details not specified</span>
                        )}
                      </li>
                    )}
                  </ul>
                  {user && (
                    <div style={{ position: "relative" }}>
                      <MELightDropDown
                        style={{ width: "100%", padding: 11 }}
                        containerStyle={{ display: "block", padding: 0 }}
                        direction="bottom"
                        onItemSelected={(status) => this.updateRSVP(status)}
                        animate={false}
                        customAnimation="rsvp-drop-from-left-anime"
                        controlLabel={true}
                        label={
                          this.state.rsvpLoading ? (
                            <i className="fa fa-spinner fa-spin"></i>
                          ) : (
                            <span style={{ marginRight: 6 }}>
                              {this.state.rsvpStatus || "RSVP for this event"}
                            </span>
                          )
                        }
                        labelClassNames="me-rsvp-btn z-depth-float"
                        data={[
                          RSVP_STATUS.INTERESTED,
                          RSVP_STATUS.GOING,
                          RSVP_STATUS.NOT_GOING,
                        ]}
                      />
                      {this.state.error && (
                        <small style={{ color: "red", marginTop: 4 }}>
                          {this.state.error}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-lg-8">
                <div className="text">
                  <p
                    className="cool-font make-me-dark events-about-content"
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
    auth: store.firebase.auth,
    user: store.user.info,
    events: store.page.events,
    links: store.links,
  };
};
export default connect(mapStoreToProps, null)(OneEventPage);
